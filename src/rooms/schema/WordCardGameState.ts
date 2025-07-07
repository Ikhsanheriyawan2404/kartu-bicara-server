import { Schema, type, ArraySchema } from "@colyseus/schema";

export class Player extends Schema {
  @type("string") id: string;
  @type("string") name: string;
  @type("number") score: number = 0;
  @type("boolean") isReady: boolean = false;
}

export class Category extends Schema {
  @type("number") id: number;
  @type("string") name: string;
}

export class Question extends Schema {
  @type("number") id: number;
  @type("string") text: string;
  @type("string") category: string;
  @type("boolean") asked: boolean = false;
}

export class WordCardGameState extends Schema {
  @type("string") roomId: string;
  @type("boolean") isGameStarted: boolean = false;
  @type("boolean") isGameEnded: boolean = false;
  @type("number") turnPlayerId: number = 1;
  @type("number") timer: number = 60;
  @type("number") currentQuestionId: number;

  @type(Category) category: Category;

  @type({ array: Player }) players = new ArraySchema<Player>();
  @type({ array: Question }) questions = new ArraySchema<Question>();
}