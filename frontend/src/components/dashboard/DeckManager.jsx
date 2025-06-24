import React, { useContext, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { StoreContext } from "../../context/StoreContext";
import { Button } from "../ui/Button";
import { Badgeui } from "../ui/Badge";
import {
  ArrowLeft,
  Badge,
  BookOpen,
  Eye,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import Input from "../ui/Input";
import axios from "axios";

const DeckManager = () => {
  const [newDeckData, setNewDeckData] = useState({
    name: "",
    description: "",
  });

  

  const { url, decks, setDecks, fetchDecks, cardsCountFunc } = useContext(StoreContext);
  const token = localStorage.getItem("token");
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deckCards, setDeckCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  // const [numberOfCardsInDeck, setNumberOfCardsInDeck] = useState(0);
  const DESCRIPTION_WORD_LIMIT = 6;

  useEffect(() => {
    fetchDecks();
  }, []);

  const handleCreateDeck = async () => {
    if (!newDeckData.name.trim()) {
      return;
    }

    const newUrl = `${url}/api/deck/adddeck`;

    try {
      const response = await axios.post(newUrl, newDeckData, {
        headers: { token },
      });
      setNewDeckData({ ...newDeckData, name: "", description: "" });
      await fetchDecks();
    } catch (error) {
      console.log(error);
    }
  };

  // const fetchDecks = async () => {
  //   const newUrl = `${url}/api/deck/decklist`;
  //   try {
  //     const response = await axios.get(newUrl, {
  //       headers: { token },
  //     });
  //     const sortedDecks = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  //     setDecks(sortedDecks);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleDeleteDeck = async (id, name) => {
    if (
      !window.confirm(`Are you sure you want to delete the deck "${name}"?`)
    ) {
      return;
    }
    const deleteUrl = `${url}/api/deck/deletedeck`;
    try {
      await axios.delete(deleteUrl, {
        headers: { token },
        data: { id: id },
      });
      console.log(`Deck "${name}" deleted`);
      await fetchDecks();
    } catch (error) {
      console.log(error);
    }
  };

  const displayCardsOfDeck = async (deck) => {
    setSelectedDeck(deck);
    setIsLoading(true);

    const deckId = deck._id;

    const newUrl = `${url}/api/card/cardlist/${deckId}`;

    try {
      const response = await axios.get(newUrl, { headers: { token } });

      if (response.data.success) {
        setDeckCards(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch cards:", error);
      setDeckCards([]);
    } finally {
      setIsLoading(false);
    }
  };



  const deleteCardFromDeck = async () => {};

  const handleBackToDecks = () => {
    setSelectedDeck(null);
    setDeckCards([]);
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm("Are you sure you want to delete this card?")) return;
    try {
      const deleteUrl = `${url}/api/card/deletecard`;
      await axios.delete(deleteUrl, {
        headers: { token },
        data: { id: cardId },
      });
      console.log(`Card ${cardId} deleted`);
      // refresh cards
      displayCardsOfDeck(selectedDeck);
      await cardsCountFun();
    } catch (error) {
      console.error("Failed to delete card:", error);
    }
  };

  const handleUpdateCard = (card) => {
    alert(`Implement update flow for card: ${card._id}`);
    // You can open a modal / navigate to edit page etc.
  };

  const handleOpenFullCard = (card) => {
    setSelectedCard(card);
  };

  // const getNumberOfCardsByDeck = async () => {
    
  // }

  if(newDeckData.description.trim().split(/\s+/).length > DESCRIPTION_WORD_LIMIT){
    alert(`Description should not exceed ${DESCRIPTION_WORD_LIMIT} words.`)
  }

  if (selectedDeck) {
    return (
      <div className="space-y-6">
        {/* header with back button */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBackToDecks} className="cursor-pointer">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Decks
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{selectedDeck.name}</h2>
            <p className="text-gray-600">{deckCards.length}</p>
          </div>
        </div>

        {/* cards display */}
        {isLoading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">Loading cards...</p>
            </CardContent>
          </Card>
        ) : deckCards.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">
                No cards found in this deck
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deckCards.map((card) => (
              <Card
                key={card._id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleOpenFullCard(card)} // Replace alert with actual handler
                style={{ height: "220px" }} // fixed height for uniform cards
              >
                <CardHeader className="pb-3 flex justify-between items-center">
                  <div className="flex space-x-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCard(card._id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateCard(card);
                      }}
                    >
                      <Settings className="h-4 w-4 text-blue-500" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 overflow-hidden">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Question:</p>
                    <p className="text-base truncate whitespace-pre-wrap max-h-[50px] overflow-hidden">
                      {card.question}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Answer:</p>
                    <p className="text-base truncate whitespace-pre-wrap max-h-[50px] overflow-hidden">
                      {card.answer}
                    </p>
                  </div>
                  {card.difficulty && (
                    <Badgeui variant="secondary" className="text-xs">
                      {card.difficulty}
                    </Badgeui>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Card Detail Modal */}
            {selectedCard && (
              <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-[1px]">
                <div className="bg-white rounded-lg p-8 max-w-lg w-full relative">
                  <button
                    onClick={() => setSelectedCard(null)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer"
                  >
                    ✕
                  </button>
                  <h3 className="text-xl font-bold mb-4">Card Details</h3>
                  <p className="mb-2">
                    <strong>Question:</strong> {selectedCard.question}
                  </p>
                  <p className="mb-2">
                    <strong>Answer:</strong> {selectedCard.answer}
                  </p>
                  {selectedCard.difficulty && (
                    <Badgeui variant="secondary">
                      {selectedCard.difficulty}
                    </Badgeui>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Deck</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <div className="flex flex-col w-full">
              <Input
                placeholder="Enter deck name..."
                value={newDeckData.name}
                onChange={(e) =>
                  setNewDeckData({ ...newDeckData, name: e.target.value })
                }
                onKeyDown={(e) => e.key === "Enter" && handleCreateDeck()}
              />
              <Input
                placeholder="Enter deck description(optional)"
                className="mt-4"
                value={newDeckData.description}
                onChange={(e) => {
                  const input = e.target.value;
                  const wordCount = input.trim().split(/\s+/).length;
                  setNewDeckData({
                    ...newDeckData,
                    description: input,
                  })
                }
              }
                onKeyDown={(e) => e.key === "Enter" && handleCreateDeck()}
              />
              <p className="text-xs text-gray-500 mt-1">
                {
                  newDeckData.description.trim().split(/\s+/).filter(Boolean)
                    .length
                }{" "}
                / {DESCRIPTION_WORD_LIMIT} words
              </p>
            </div>
            <Button onClick={handleCreateDeck}>
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* display list of decks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <Card key={deck._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-indigo-600 mr-2" />
                  <CardTitle className="text-lg">{deck.name}</CardTitle>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => handleDeleteDeck(deck._id, deck.name)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Total Cards</p>
                  <p className="font-semibold text-lg">{deck.cardCount || 0}</p>
                </div>
                <div>
                  <p className="text-gray-600">Created</p>
                  <p className="font-semibold text-lg">
                    {new Date(deck.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {deck.tags && deck.tags.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Tags:</p>
                  <div className="flex flex-wrap gap-1">
                    {deck.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {deck.description && (
                <p className="text-sm text-gray-600">{deck.description}</p>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => displayCardsOfDeck(deck)}
                >
                  View Cards
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Add Card
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DeckManager;
