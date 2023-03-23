import * as React from "react";
import { useDispatch } from "react-redux";
import io from "socket.io-client";
import { addMessage, highlightMessage, deleteMessage } from "./services";
import { useLocalStorage } from "./hooks";

const socket = io("http://localhost:4000");

function App() {
  const dispatch = useDispatch();
  const [storedMessages, setStoredMessages] = useLocalStorage("messages", []);
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    const handleStorageChange = (event) => {
      if (
        event.storageArea === window.localStorage &&
        event.key === "messages"
      ) {
        const newValue = event.newValue ? JSON.parse(event.newValue) : [];
        setStoredMessages(newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [setStoredMessages]);

  const handleAddMessage = (e) => {
    e.preventDefault();
    if (!message) {
      return;
    }
    socket.emit("addMessage", message);
    dispatch(addMessage(message));
    setStoredMessages([
      ...storedMessages,
      { id: Date.now(), body: message, highlighted: false },
    ]);
    setMessage("");
  };

  const handleHighlightMessage = (id) => {
    dispatch(highlightMessage(id));
    setStoredMessages(
      storedMessages.map((message) =>
        message.id === id
          ? { ...message, highlighted: !message.highlighted }
          : message
      )
    );
  };

  const handleDeleteMessage = (id) => {
    dispatch(deleteMessage(id));
    setStoredMessages(storedMessages.filter((message) => message.id !== id));
  };

  return (
    <div className="container">
      <h1>📝 Notas</h1>
      <form onSubmit={handleAddMessage}>
        <input
          type="text"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          required
        />
        <button type="submit" disabled={!message}>
          ️💾
        </button>
      </form>
      {storedMessages.length === 0 && <p className="empty">No hay notas...</p>}
      <ul>
        {[...storedMessages].reverse().map((message) => (
          <li key={message.id}>
            <input
              className="highlight-checkbox"
              type="checkbox"
              checked={message.highlighted}
              onChange={() => handleHighlightMessage(message.id)}
            />
            <span className={message.highlighted ? "highlight" : ""}>
              {message.body}
            </span>
            <button
              className="delete-button"
              onClick={() => handleDeleteMessage(message.id)}
            >
              🗑️️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
