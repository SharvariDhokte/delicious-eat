// in ActionProvider.jsx
import React from 'react';

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleHello = () => {

    const botMessage = createChatBotMessage('Hello. Nice to meet you.');

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const callAPI =async (message) => {
    const response = await fetch(`https://yp5ovi7335o-496ff2e9c6d22116-8888-colab.googleusercontent.com/process_query?query=${encodeURIComponent(message)}`);
    const data = await response.json();
    const botMessage = createChatBotMessage(data);

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  }

  // Put the handleHello function in the actions object to pass to the MessageParser
  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleHello,
            callAPI
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;