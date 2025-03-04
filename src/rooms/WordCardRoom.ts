import { Room, Client } from "@colyseus/core";
import { Category as SchemaCategory, Player, Question, WordCardGameState } from "./schema/WordCardGameState";
import { categories, questions } from "./../data";
import { Category } from "../types/Category";

export class WordCardRoom extends Room<WordCardGameState> {
  public maxClients = 2;
  private maxQuestions = 10;
  private categories = categories;
  private questions = questions;

  onCreate (options: {
    name: string,
    categoryId: number,
  }) {

    const category: Category = this.categories.find(c => c.id === options.categoryId);
    if (!category) {
      throw new Error("Invalid category: You cannot join this room.");
    }

    this.setState(new WordCardGameState());
    
    this.addQuestions(category);
    this.setGameCategories(category);

    this.onMessage("answer", (client, message) => {
      this.handleAnswer(client, message);
    });
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    const player = new Player();
    player.id = client.sessionId;
    player.name = options.name || `Player-${client.sessionId}`;
    player.score = 0;
    player.isReady = false;

    this.state.players.push(player);
    
    if (this.state.players.length === this.maxClients) {
      this.startGame();
    }
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");

    const index = this.state.players.findIndex(player => player.id === client.sessionId);
    if (index !== -1) {
      this.state.players.splice(index, 1);
    }

    if (this.state.isGameStarted && this.state.players.length === 0) {
      this.endGame();
    }
  }

  addQuestions(category: Category) {
    const questions = this.questions
      .filter(question => question.category_id === category.id)
      .map((question, index) => ({
        id: index,
        text: question.text,
        category: category.name
      }));

    const randomData = this.getRandomQuestions(questions, this.maxQuestions);
    randomData.forEach(data => {
      this.state.questions.push(new Question(data));
    });
  }
  
  getRandomQuestions(data: any[], n: number): any[] {
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
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
  

  handleAnswer(client: Client, _: any) {
    const player = this.state.players.find(p => p.id === client.sessionId);
    const playerIndex = this.state.players.findIndex(p => p.id === client.sessionId);

    if (!player) return;

    if (playerIndex != this.state.turnPlayerId) return;

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

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
