import deckModel from "../models/deckModel.js";
import cardModel from "../models/cardModel.js";


export const decklist = async (req, res) => {
  try {
    // const {userId} = req.body; 
    const decks = await deckModel.find({userId: req.userId});
    const decksWithCardCount = await Promise.all(
      decks.map(async (deck) => {
        const count = await cardModel.countDocuments({deckId: deck._id});
        return {
          ...deck.toObject(),
          cardCount: count
        }
      })
    )

    res.json({ success: true, data: decksWithCardCount });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};


export const adddeck = async (req, res) => {
  const deck = new deckModel({
    name: req.body.name,
    description: req.body.description,
    userId: req.userId,
    isPublic: req.body.isPublic,
    cardCount: req.body.cardCount,
  });
  try {
    await deck.save();
    res.json({ success: true, message: "Deck added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export const updatedeck = async (req, res) => {
  try {
    const { id } = req.body.id;
    const updates = req.body;

    const deck = await deckModel.findOne({ id });
    if (!deck) {
      return res.json({ success: false, message: "Deck not found" });
    }
    Object.assign(deck, updates);
    await deck.save();

    res.json({ success: true, deck });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export const deletedeck = async (req, res) => {
  try{
    const deckId = req.body.id;

    // check if deck exists
    const deck = await deckModel.findById(deckId);
    if(!deck){
      return res.json({success: false, message: "Deck does not exist"});
    }
    // delete deck
    await deckModel.findByIdAndDelete(deckId);

    // delete cards in that deck
    await cardModel.deleteMany({deckId: deckId});
    res.json({success: true, message: "Deck and its cards removed"});
  } catch(error){
    console.log("Error deleting deck and its crads: ", error);
    res.json({success: false, message: "Error deleting deck and its crads"});
  }
}

export const getdeckcount = async (req, res) => {
  try {
    const userId = req.userId;  // assuming authMiddleware attaches userId
    const count = await deckModel.countDocuments({ userId });
    res.json({ success: true, count });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching deck count" });
  }
};

