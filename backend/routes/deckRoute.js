import express from "express";
import { adddeck, decklist, deletedeck, getdeckcount, updatedeck } from "../controllers/deckController.js";
import authMiddleware from "../middleware/auth.js";

const deckRouter = express.Router();

deckRouter.post('/adddeck', authMiddleware, adddeck);
deckRouter.get('/decklist', authMiddleware, decklist);
deckRouter.put('/updatedeck', authMiddleware, updatedeck);
deckRouter.delete('/deletedeck', authMiddleware, deletedeck);
deckRouter.get('/deckcount', authMiddleware, getdeckcount);



export default deckRouter;
