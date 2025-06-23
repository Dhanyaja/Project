import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    deckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deck",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    easeFactor: { type: Number, default: 2.5 },
    interval: { type: Number, default: 1 },
    repetitions: { type: Number, default: 0 },
    dueDate: { type: Date, default: Date.now },
    lastReviewed: { type: Date },
    lastQuality: { type: Number, min: 0, max: 5 },

    isSuspended: { type: Boolean, default: false },
    isNewFlag: { type: Boolean, default: true },
    // optional
    // manualDifficultyTag: { type: String, enum: ["easy", "medium", "hard"] },
  },
  { timestamps: true }
);

const cardModel = mongoose.models.Card || mongoose.model("Card", cardSchema);

export default cardModel;
