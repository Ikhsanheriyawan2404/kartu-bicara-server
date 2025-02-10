import { Room, Client } from "@colyseus/core";
import { ArraySchema } from "@colyseus/schema";
import { Player, Question, WordCardGameState } from "./schema/WordCardGameState";
import { categories, questions } from "./../data";

export class WordCardRoom extends Room<WordCardGameState> {
  public maxClients = 2;
  private maxQuestions = 10;

  onCreate (options: {
    name: string,
    categoryId: number,
  }) {
    this.setState(new WordCardGameState());
    
    this.addQuestions(options.categoryId);
    this.setGameCategories(categories.find(category => category.id === options.categoryId)?.name);

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

  addQuestions(categoryId: number) {
    const tempData: {id: number, text: string, category: string}[] = [];
    
    questions.forEach(question => {
      const questionCategory = categories.find(category => category.id === question.category_id)?.name;
  
      if (question.category_id === categoryId) {
        const data = {
          id: question.id,
          text: question.text,
          category: questionCategory
        };
        tempData.push(data);
      }
    });
  
    const randomData = this.getRandomQuestions(tempData, this.maxQuestions);
    randomData.forEach(data => {
      this.state.questions.push(new Question(data));
    });
  }
  
  getRandomQuestions(data: any[], n: number): any[] {
    const shuffled = [...data].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }

  setGameCategories(categoryName: string) {
    this.state.currentCategory = categoryName
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
    const nextTurn = this.state.currentTurn + 1;
    this.state.currentTurn = nextTurn > this.state.players.length - 1 ? 0 : nextTurn;  // Rotasi giliran
    console.log(`Turn: Player ${this.state.players[this.state.currentTurn].name}`);
    
    this.state.currentQuestionId = this.getNextQuestionId();
  }

  getNextQuestionId() {
    // Filter pertanyaan berdasarkan kategori yang sedang aktif
    const filteredQuestions = this.state.questions.filter(question => question.category === this.state.currentCategory);
  
    // Urutkan pertanyaan berdasarkan urutan yang diinginkan, misalnya berdasarkan ID
    filteredQuestions.sort((a, b) => a.id - b.id);
  
    // Cari indeks pertanyaan yang sedang ditanyakan
    const currentIndex = filteredQuestions.findIndex(question => question.id === this.state.currentQuestionId);
  
    // Tentukan pertanyaan berikutnya
    const nextIndex = (currentIndex + 1) % filteredQuestions.length;
  
    // Kembalikan ID pertanyaan berikutnya
    return filteredQuestions[nextIndex]?.id || 0;
  }
  

  handleAnswer(client: Client, message: any) {
    const player = this.state.players.find(p => p.id === client.sessionId);
    if (!player) return;

    const currentQuestion = this.state.questions.find(q => q.id === this.state.currentQuestionId);
    if (currentQuestion) {
      player.score += 10;
    }

    this.setNextTurn();
  }

  endGame() {
    this.state.isGameEnded = true;
    console.log("Game Over!");

    this.broadcast("gameEnded", { players: this.state.players });
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
