import { Room, Client } from "@colyseus/core";
import { Category as SchemaCategory, Player, WordCardGameState, Question as SchemaQuestion } from "./schema/WordCardGameState";
import { generateRoomCode } from "../utils";
import { WordCardRoomOptions } from "../types/room";
import { getCategoryById, getRandomQuestions } from "../db";
import { Category } from "../types/Category";
import { Question } from "../types/Question";

export class WordCardRoom extends Room<WordCardGameState> {
  public maxClients = 2;
  private maxQuestions = 10;

  private category: Category;
  private questions: Question[] = [];

  async onCreate(options: WordCardRoomOptions) {
    this.roomId = generateRoomCode();
    
    this.state = new WordCardGameState();

    await this.safeInit(options);

    this.addQuestions(this.questions);
    this.setGameCategories(this.category);

    this.onMessage("answer", (client) => {
      this.handleAnswer(client);
    });

    this.onMessage("card-flip", (_, message) => {
      this.state.isCardFlipped = message.isCardFlipped;
    });
  }

  private async safeInit(options: WordCardRoomOptions) {
    const category = await getCategoryById(options.categoryId);
    if (!category) {
      throw new Error("Invalid category");
    }
    this.category = category;

    this.questions = await getRandomQuestions(this.category.id, this.maxQuestions);
  }

  onJoin (client: Client, options: WordCardRoomOptions) {
    console.log(client.sessionId, "joined!");

    const player = new Player();
    player.id = client.sessionId;
    player.name = options.name || `User-${client.sessionId}`;
    player.score = 0;
    player.isReady = false;

    this.state.players.push(player);
    
    if (this.state.players.length === this.maxClients) {
      this.startGame();
    }
  }

  onLeave (client: Client) {
    console.log(client.sessionId, "left!");

    const index = this.state.players.findIndex(player => player.id === client.sessionId);
    if (index !== -1) {
      this.state.players.splice(index, 1);
    }

    if (this.state.isGameStarted && this.state.players.length === 0) {
      this.endGame();
    }
  }

  addQuestions(questions: Question[]) {
    questions.forEach(question => {
      question.category = this.category.name
      this.state.questions.push(new SchemaQuestion(question));
    });
  }

  setGameCategories(category: Category) {
    this.state.category = new SchemaCategory();
    this.state.category.id = category.id;
    this.state.category.name = category.name;
  }

  startGame() {
    console.log("Game started")
    this.state.isGameStarted = true;

    this.state.currentQuestionId = this.getNextQuestionId();

    // Mulai timer dan atur giliran pemain pertama
    this.state.timer = 60;  // misalnya, timer dimulai dari 60 detik
    this.setNextTurn();
  }

  setNextTurn() {
    const nextTurn = this.state.turnPlayerId + 1;
    this.state.turnPlayerId = nextTurn > this.state.players.length - 1 ? 0 : nextTurn;  // Rotasi giliran
    
    if (this.allQuestionsAsked()) {
      this.endGame();
      return;
    }

    console.log(`Turn: Player ${this.state.players[this.state.turnPlayerId].name}`);

    this.state.currentQuestionId = this.getNextQuestionId();
  }

  allQuestionsAsked() {
    const filteredQuestions = this.state.questions.filter(q => q.category === this.state.category.name);
    return filteredQuestions.every(q => q.asked);
  }

  getNextQuestionId() {
    // Filter pertanyaan berdasarkan kategori yang sedang aktif
    const filteredQuestions = this.state.questions.filter(question => question.category === this.state.category.name);
  
    // Urutkan pertanyaan berdasarkan urutan yang diinginkan, misalnya berdasarkan ID
    filteredQuestions.sort((a, b) => a.id - b.id);
  
    // Cari indeks pertanyaan yang sedang ditanyakan
    const currentIndex = filteredQuestions.findIndex(question => question.id === this.state.currentQuestionId);
  
    // Tentukan pertanyaan berikutnya
    const nextIndex = (currentIndex + 1) % filteredQuestions.length;
  
    // Kembalikan ID pertanyaan berikutnya
    return filteredQuestions[nextIndex]?.id || 0;
  }
  

  handleAnswer(client: Client) {
    const player = this.state.players.find(p => p.id === client.sessionId);
    const playerIndex = this.state.players.findIndex(p => p.id === client.sessionId);

    if (!player) return;

    if (playerIndex != this.state.turnPlayerId) return;
    if (!this.state.isGameStarted) return

    const currentQuestion = this.state.questions.find(q => q.id === this.state.currentQuestionId);
    if (currentQuestion) {
      player.score += 10;
      currentQuestion.asked = true; // Tandai pertanyaan sudah digunakan
    }

    this.setNextTurn();
  }

  endGame() {
    this.state.isGameEnded = true;
    console.log("Game Over!");

    this.broadcast("gameEnded", { players: this.state.players });

    // Bersihkan data & dispose room setelah delay
    setTimeout(() => {
      this.disconnect(); // Tutup room game
    }, 5_000); // Tunggu 5 detik sebelum dispose
  }

  onUncaughtException(err: Error, methodName: string) {
    console.error(`❌ Exception in ${methodName}:`, err);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
