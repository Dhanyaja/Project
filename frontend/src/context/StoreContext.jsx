import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "http://localhost:4000";
  const token = localStorage.getItem("token")
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [cardsCount, setCardsCount] = useState("");
  const [dueCardsLength, setDueCardsLength] = useState(0);
  
  //for decks
  const [decks, setDecks] = useState([]);
  const [cards, setCards] = useState([]);


  useEffect(() => {
      fetchDecks();
      cardsCountFunc();
      dueCardsFunc();
    }, [])


  const fetchDecks = async () => {
      const newUrl = `${url}/api/deck/decklist`;
      try {
        const response = await axios.get(newUrl, {
          headers: { token },
        });
        const sortedDecks = response.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setDecks(sortedDecks);
      } catch (error) {
        console.log(error);
      }
    };

    const cardsCountFunc = async() => {
      const newUrl = `${url}/api/card/cardsCount`;
      try{
        const response = await axios.get(newUrl, {headers: {token: token}});
        setCardsCount(() => response.data.data);

      } catch(error){
        console.log(error);
      }
    }

    // due cards logic

    const dueCardsFunc = async () => {
        const newUrl = `${url}/api/card/due`;
        try {
          const response = await axios.get(newUrl, {headers: {token: token}});
          setDueCardsLength(response.data.data.length);
        } catch (error) {
          console.log(error)
        }
      };

    
  const contextValue = {
    url,
    token,
    isLoading,
    setIsLoading,
    isAuthenticated,
    setIsAuthenticated,
    userName,
    setUserName,
    userId,
    setUserId,
    decks,
    setDecks,
    cards,
    setCards,
    fetchDecks,
    cardsCountFunc,
    cardsCount,
    dueCardsLength,
    dueCardsFunc,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
