// in ActionProvider.jsx
import React from "react";
import { db } from "../firebase";
import { collection, query, onSnapshot } from "firebase/firestore";

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleHello = () => {
    const botMessage = createChatBotMessage("Hello. Nice to meet you.");

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const callAPI = async (message) => {
    const q = query(collection(db, "Restaurants"));
   const jsonData =  onSnapshot(q, (querySnapshot) => {
      return querySnapshot.docs.map((doc) => ({
        email: doc.data()?.email,
        rating: doc.data()?.rating,
        name: doc.data()?.name,
        address: doc.data()?.address,
      }));
     
    });
    console.log("🚀 ~ jsonData ~ jsonData:", jsonData)
    const url = "http://127.0.0.1:5000/greet";
    const payload = { name: message };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("🚀 ~ callAPI ~ data:", data);
    const botMessage = createChatBotMessage(data?.message);

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
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
