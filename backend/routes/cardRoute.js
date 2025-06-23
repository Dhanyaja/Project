import express from "express";
import {
  addcard,
  deletecard,
  getCardsByDeck,
  getDueCards,
  updateCardReview,
  userCardsCount,
} from "../controllers/cardController.js";
import authMiddleware from "../middleware/auth.js";

const cardRouter = express.Router();

cardRouter.post("/addcard", addcard);
cardRouter.get("/cardlist/:deckId", authMiddleware, getCardsByDeck);
cardRouter.get("/deletecard/:cardId", authMiddleware, deletecard);
cardRouter.get("/cardsCount", authMiddleware, userCardsCount);
cardRouter.post("/review", authMiddleware, updateCardReview);
cardRouter.get("/due", authMiddleware, getDueCards);

export default cardRouter;
