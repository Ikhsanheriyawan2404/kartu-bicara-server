import { Room, Client } from "@colyseus/core";
import { ArraySchema } from "@colyseus/schema";
import { Player, Question, WordCardGameState } from "./schema/WordCardGameState";

export class WordCardRoom extends Room<WordCardGameState> {
  maxClients = 2;

  onCreate (options: any) {
    this.setState(new WordCardGameState());
    
    this.addDummyQuestions();

    this.onMessage("type", (client, message) => {
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

    this.state.players = this.state.players.filter(player => player.id !== client.sessionId);

    if (this.state.isGameStarted && this.state.players.length === 0) {
      this.endGame();
    }
  }

  addDummyQuestions() {
    const dummyQuestions = [
      new Question({ id: "q1", text: "What is your favorite family activity?", category: "family" }),
      new Question({ id: "q2", text: "What do you like most about your partner?", category: "partner" }),
      new Question({ id: "q3", text: "How would you describe your relationship with your siblings?", category: "siblings" }),
      new Question({ id: "q4", text: "What is your favorite childhood memory with friends?", category: "friends" }),
      new Question({ id: "q5", text: "What is something you admire about your parents?", category: "family" })
    ];

    // Menambahkan daftar pertanyaan ke state
    this.state.questions = new ArraySchema(...dummyQuestions);
  }

  startGame() {
    console.log("started")
    this.state.isGameStarted = true;

    this.state.currentCategory = this.getRandomCategory();

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

  getRandomCategory() {
    const categories = ["family", "friends", "couple"];
    return categories[Math.floor(Math.random() * categories.length)];
  }

  getNextQuestionId() {
    const filteredQuestions = this.state.questions.filter(question => question.category === this.state.currentCategory);
    if (filteredQuestions.length > 0) {
      return filteredQuestions[0].id;
    }
    return "default-question-id";
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
