import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMessage, highlightMessage, deleteMessage } from "./services";
import { useLocalStorage } from "./hooks";

function App() {
  const dispatch = useDispatch();
  const [storedMessages, setStoredMessages] = useLocalStorage("messages", []);
  const { messages } = useSelector((state) => ({
    messages: storedMessages,
  }));
  const [message, setMessage] = React.useState("");

  const handleAddMessage = (e) => {
    e.preventDefault();
    if (!message) {
      return;
    }
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
      {messages.length === 0 && <p className="empty">No hay notas...</p>}
      <ul>
        {[...messages].reverse().map((message) => (
          <li key={message.id}>
            <input
              className="highlight-checkbox"
              type="checkbox"
              checked={message.highlighted}
              onChange={() => handleHighlightMessage(message.id)}
            />
            {message.highlighted ? (
              <span className="highlight">{message.body}</span>
            ) : (
              message.body
            )}
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
