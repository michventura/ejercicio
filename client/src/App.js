import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io("http://localhost:4000");

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", message);
    const newMessage = {
      body: message,
    };
    setMessages([newMessage, ...messages]);
    setMessage("");
  };

  useEffect(() => {
    const receivedMessage = (message) => {
      setMessages([message, ...messages]);
    };
    socket.on("message", receivedMessage);

    return () => {
      socket.off("message", receivedMessage);
    };
  }, [messages]);

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button>➡️</button>
      </form>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>
              {message.body}
            </li>
          ))}
        </ul>
    </div>
  );
}

export default App;
