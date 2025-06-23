import React, { useContext, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Progress } from "../ui/Progress";
import { Button } from "../ui/Button";
import { Eye } from "lucide-react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";

const StudyQueue = () => {
  const [dueCards, setDueCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalTodayCount, setTotalTodayCount] = useState(0);
  const [reviewedTodayCount, setReviewedTodayCount] = useState(0);

  const token = localStorage.getItem("token");
  const { url, dueCardsFunc } = useContext(StoreContext);

  useEffect(() => {
    fetchDueCards();
    dueCardsFunc();
  }, []);

  // const fetchDueCards = async () => {
  //   try {
  //     const response = await axios.get(`${url}/api/card/due`, {
  //       headers: { token },
  //     });
  //     if (response.data.success) {
  //       const cards = response.data.data;
  //       const total = response.data.totalTodayCount;

  //       setDueCards(cards);
  //       setTotalTodayCount(total);

  //       const done = total - cards.length;
  //       const progressVal = total > 0 ? (done / total) * 100 : 100;
  //       setProgress(progressVal);

  //       setCurrentIndex(0);
  //       setShowAnswer(false);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching due cards", error);
  //   }
  // };

  // const fetchDueCards = async () => {
  //   try {
  //     const response = await axios.get(`${url}/api/card/due`, {
  //       headers: { token },
  //     });
  //     if (response.data.success) {
  //       setDueCards(response.data.data);

  //       const total = response.data.totalTodayCount;
  //       const reviewed = response.data.reviewedTodayCount;
  //       const progressVal = total > 0 ? (reviewed / total) * 100 : 100;

  //       setProgress(progressVal);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching due cards", error);
  //   }
  // };

  const fetchDueCards = async () => {
    try {
      const response = await axios.get(`${url}/api/card/due`, {
        headers: { token },
      });

      if (response.data.success) {
        const cards = response.data.data;
        const total = response.data.totalTodayCount;
        const reviewed = response.data.reviewedTodayCount;

        setDueCards(cards);
        setTotalTodayCount(total);
        setReviewedTodayCount(reviewed);

        const progressVal = total > 0 ? (reviewed / total) * 100 : 100;
        setProgress(progressVal);

        setCurrentIndex(0);
        setShowAnswer(false);
      }
    } catch (error) {
      console.error("Error fetching due cards", error);
    }
  };

  // const handleAnswer = async (rating) => {
  //   if (!currentCard) return;
  //   try {
  //     await axios.post(
  //       `${url}/api/card/review`,
  //       {
  //         cardId: currentCard._id,
  //         quality: rating, // 0-5
  //       },
  //       {
  //         headers: { token },
  //       }
  //     );

  //     const nextIndex = currentIndex + 1;
  //     if (nextIndex >= dueCards.length) {
  //       // All cards for this batch done, refresh
  //       await fetchDueCards();
  //     } else {
  //       setCurrentIndex(nextIndex);

  //       // Update progress
  //       const done = totalTodayCount - (dueCards.length - nextIndex);
  //       const progressVal =
  //         totalTodayCount > 0 ? (done / totalTodayCount) * 100 : 100;
  //       setProgress(progressVal);
  //       setShowAnswer(false);
  //       dueCardsFunc();
  //     }
  //   } catch (error) {
  //     console.error("Error submitting review", error);
  //   }
  // };

  const handleAnswer = async (rating) => {
    if (!currentCard) return;

    try {
      await axios.post(
        `${url}/api/card/review`,
        { cardId: currentCard._id, quality: rating },
        { headers: { token } }
      );

      const nextIndex = currentIndex + 1;
      if (nextIndex >= dueCards.length) {
        await fetchDueCards(); // Will reset progress + reviewedTodayCount
      } else {
        setCurrentIndex(nextIndex);
        setReviewedTodayCount((prev) => prev + 1);

        const progressVal =
          totalTodayCount > 0
            ? ((reviewedTodayCount + 1) / totalTodayCount) * 100
            : 100;
        setProgress(progressVal);
        setShowAnswer(false);
      }

      dueCardsFunc();
    } catch (error) {
      console.error("Error submitting review", error);
    }
  };

  const currentCard = dueCards[currentIndex];

  if (!currentCard) {
    return (
      <Card className="p-6 text-center">
        <p className="text-lg">🎉 All due cards reviewed for today!</p>
        <Button onClick={fetchDueCards} className="mt-4">
          Refresh
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm text-gray-600">
              {reviewedTodayCount} / {totalTodayCount} cards reviewed
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </CardContent>
      </Card>

      {/* study card */}
      <Card className="min-h-[400px]">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Study Card</CardTitle>
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Deck Card
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-8">
            <h3 className="text-xl font-medium mb-4">Question:</h3>
            <p className="text-lg text-gray-800">{currentCard.question}</p>
          </div>

          {!showAnswer ? (
            <div className="text-center">
              <Button onClick={() => setShowAnswer(true)}>
                <Eye className="h-4 w-4 mr-2" />
                Show Answer
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center py-4 bg-green-50 rounded-lg">
                <h3 className="text-xl font-medium mb-4 text-green-800">
                  Answer:
                </h3>
                <p className="text-lg text-green-700">{currentCard.answer}</p>
              </div>

              <div>
                <h4 className="text-lg font-medium mb-4 text-center">
                  How well did you remember this?
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleAnswer(0)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Forgot
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleAnswer(2)}
                    className="text-orange-600 border-orange-200 hover:bg-orange-50"
                  >
                    Hard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleAnswer(3)}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    Good
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleAnswer(5)}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    Easy
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyQueue;
