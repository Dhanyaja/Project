import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import Label from "../ui/Label";
import Input from "../ui/Input";
import { Button } from "../ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { Badge, Pause, Plus, X } from "lucide-react";
import { useState } from "react";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const CreateContent = () => {
  const [newCardData, setNewCardData] = useState({
    question: "",
    answer: "",
  });
  const { decks, url, token, cardsCountFunc } = useContext(StoreContext);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState("");
  // const [selectedDeckName, setSelectedDeckName] = useState("")

  const handleCreateCard = async () => {
    if (
      !selectedDeck ||
      !newCardData.question.trim() ||
      !newCardData.answer.trim()
    ) {
      console.log("Please fill all required fields");
      return;
    }
    setIsCreating(true);
    const newUrl = `${url}/api/card/addcard`;
    const userId = localStorage.getItem("userId");
    const payload = {
      ...newCardData,
      deckId: selectedDeck.value,
      userId: userId,
    };
    try {
      const res = await axios.post(newUrl, payload, {
        headers: { token: token },
      });
      console.log("card added");
      setNewCardData({ question: "", answer: "" });
      setSelectedDeck("");
      await cardsCountFunc();
    } catch (error) {
      console.log(error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Study Card</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Deck Selection */}

          <div>
            <Label htmlFor="deck">Deck *</Label>
            <Select
              value={selectedDeck}
              onValueChange={(value) => setSelectedDeck({ value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a deck" />
              </SelectTrigger>
              <SelectContent>
                {decks.map((deck) => (
                  <SelectItem key={deck._id} value={deck._id}>
                    {deck.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* <div>
            <Label htmlFor="deck">Deck *</Label>
            <Select value={selectedDeck} onValueChange={(value) => setSelectedDeck({value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select a deck" />
              </SelectTrigger>
              <SelectContent>
                {decks.map((deck) => (
                  <SelectItem key={deck._id} value={deck._id}>
                    {deck.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

          {/* question */}
          <div>
            <Label htmlFor="question">Question *</Label>
            <Textarea
              id="question"
              placeholder="Enter your question here..."
              value={newCardData.question}
              onChange={(e) =>
                setNewCardData({ ...newCardData, question: e.target.value })
              }
              className="min-h-[100px]"
            />
          </div>

          {/* answer */}
          <div>
            <Label htmlFor="answer">Answer *</Label>
            <Textarea
              id="answer"
              placeholder="Enter the answer here..."
              value={newCardData.answer}
              onChange={(e) =>
                setNewCardData({ ...newCardData, answer: e.target.value })
              }
              className="min-h-[100px]"
            />
          </div>

          {/* create button */}
          <Button
            onClick={handleCreateCard}
            className="w-full"
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create Card"}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Tips for Better Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Keep questions clear and specific</li>
            <li>• Use your own words in answers</li>
            {/* <li>• Add relevant tags for better organization</li> */}
            <li>• Include context when needed</li>
            <li>• Break complex topics into smaller cards</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateContent;

// create functionality for displaying all the cards in the selected deck.
// display a select field to select decks. when a specific deck is clicked, display all the cards in that deck.
