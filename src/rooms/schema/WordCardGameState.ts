import { Schema, type, ArraySchema } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") id: string;
  @type("string") name: string;
  @type("number") score: number = 0;
  @type("boolean") isReady: boolean = false;
}

export class Question extends Schema {
  @type("string") id: string;
  @type("string") text: string;
  @type("string") category: string;
}

export class WordCardGameState extends Schema {
  @type("string") roomId: string;
  @type("string") currentCategory: string;
  @type("boolean") isGameStarted: boolean = false;
  @type("boolean") isGameEnded: boolean = false;
  @type("number") currentTurn: number = 0;
  @type("number") timer: number = 60;
  @type({ array: Player }) players = new ArraySchema<Player>();
  @type({ array: Question }) questions = new ArraySchema<Question>();
  @type("string") currentQuestionId: string;
}