// in ActionProvider.jsx
import React from "react";
import { db } from "../firebase";
import { collection, query, onSnapshot ,where} from "firebase/firestore";
import { average } from "average-rating";

const getRateCount = (array) => {
  return array.map((i) => Number(i));
};

const ActionProvider = ({ createChatBotMessage, setState, children,menuId }) => {
  const handleHello = () => {
    const botMessage = createChatBotMessage("Hello. Nice to meet you.");

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const callAPI = async (message) => {
    if(menuId){
        const citiesRef = collection(db, "Menu");
        const q = query(citiesRef, where("rId", "==", menuId));
        onSnapshot(q, async (querySnapshot) => {
          const menuData = querySnapshot.docs.map((doc) => ({
            menuItemName: doc.data()?.name,
            restaruntName:doc.data()?.rName,
            manuRating:average(getRateCount(doc.data()?.ratingCount || [])),
          }));
          console.log('Data',menuData)
          const url = "http://127.0.0.1:5000/chatbot";
        const payload = {
          name: message,
          resData: {
            restaruntData: menuData,
          },
        };
  
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
  
        const data = await response.json();
        const botMessage = createChatBotMessage(data?.message);
  
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, botMessage],
        }));
        });
      
    }else{
      const q = query(collection(db, "Restaurants"));
      onSnapshot(q, async (querySnapshot) => {
        const resData = querySnapshot.docs.map((doc) => ({
          rating: average(getRateCount(doc.data()?.ratingCount || [])),
          restaruntName: doc.data()?.name,
          address: doc.data()?.address,
        }));
        const url = "http://127.0.0.1:5000/chatbot";
        const payload = {
          name: message,
          resData: {
            restaruntData: [resData[0],resData[1],resData[2],resData[3],resData[4],resData[5],resData[6]],
          },
        };

        console.log('Payload',payload)
  
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
  
        const data = await response.json();
        const botMessage = createChatBotMessage(data?.message);
  
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, botMessage],
        }));
      });
    }
  };

  // Put the handleHello function in the actions object to pass to the MessageParser
  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleHello,
            callAPI,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;
