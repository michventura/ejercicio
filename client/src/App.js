import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";
import { addMessage, highlightMessage, deleteMessage } from "./services";
import { useLocalStorage } from "./hooks";

const socket = io("http://localhost:4000");

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

  const addMessageListener = React.useCallback(
    (message) => {
      dispatch(addMessage(message));
      const newMessage = { id: Date.now(), body: message, highlighted: false };
      setStoredMessages((prevMessages) => [...prevMessages, newMessage]);
    },
    [dispatch, setStoredMessages]
  );

  const highlightMessageListener = React.useCallback(
    (id) => {
      dispatch(highlightMessage(id));
      setStoredMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === id
            ? { ...message, highlighted: !message.highlighted }
            : message
        )
      );
    },
    [dispatch, setStoredMessages]
  );

  const deleteMessageListener = React.useCallback(
    (id) => {
      dispatch(deleteMessage(id));
      setStoredMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== id)
      );
    },
    [dispatch, setStoredMessages]
  );

  React.useEffect(() => {
    socket.on("addMessage", addMessageListener);
    socket.on("highlightMessage", highlightMessageListener);
    socket.on("deleteMessage", deleteMessageListener);

    return () => {
      socket.off("addMessage", addMessageListener);
      socket.off("highlightMessage", highlightMessageListener);
      socket.off("deleteMessage", deleteMessageListener);
    };
  }, [
    // dispatch,
    // setStoredMessages,
    addMessageListener,
    highlightMessageListener,
    deleteMessageListener,
  ]);

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
