import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
};

export const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const newMessage = {
        id: Date.now(),
        body: action.payload,
      };
      state.messages.push(newMessage);
    },
    highlightMessage: (state, action) => {
      const message = state.messages.find(
        (message) => message.id === action.payload
      );
      if (message) {
        message.highlighted = !message.highlighted;
      }
    },
    deleteMessage: (state, action) => {
      state.messages = state.messages.filter(
        (message) => message.id !== action.payload
      );
    },
  },
});

export const { addMessage, highlightMessage, deleteMessage } =
  messageSlice.actions;

export default messageSlice.reducer;
