import React, { useState } from "react";

// PUBLIC_INTERFACE
/**
 * OpenAIChat is a simple chat dialog for interacting with the OpenAI assistant.
 * This uses the OpenAI Chat Completion API and expects the API key to be set in the environment
 * as REACT_APP_OPENAI_API_KEY.
 * Shows a floating dialog with chat history and input.
 */
function OpenAIChat({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm the Tic Tac Toe assistant. Ask me anything about the game, gameplay tips, or get help!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // PUBLIC_INTERFACE
  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY || window.REACT_APP_OPENAI_API_KEY;
      if (!apiKey) {
        setError("OpenAI API key not set. Please check configuration.");
        setLoading(false);
        return;
      }
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            ...messages,
            userMessage,
          ],
          max_tokens: 120,
        }),
      });
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      const data = await response.json();
      const assistantText =
        data.choices?.[0]?.message?.content ||
        "Sorry, I couldn't understand the request.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantText },
      ]);
    } catch (e) {
      setError(
        "There was an error connecting to OpenAI. Make sure you have a valid API key."
      );
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm unable to respond at the moment. Please try again later.",
        },
      ]);
    }
    setLoading(false);
  };

  // PUBLIC_INTERFACE
  const handleInputKey = (e) => {
    if (e.key === "Enter" && !loading) sendMessage();
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.chatWindow}>
        <button style={styles.closeBtn} onClick={onClose} title="Close chat">
          ×
        </button>
        <div style={styles.header}>Tic Tac Toe Assistant 💬</div>
        <div style={styles.chatHistory} id="openai-chat-history">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={
                msg.role === "assistant" ? styles.assistantMsg : styles.userMsg
              }
            >
              <b>{msg.role === "assistant" ? "Assistant:" : "You:"} </b>
              <span>{msg.content}</span>
            </div>
          ))}
          {loading && (
            <div style={styles.assistantMsg}>
              <b>Assistant:</b> <span>Thinking...</span>
            </div>
          )}
        </div>
        {error && (
          <div style={styles.errorMsg}>{error}</div>
        )}
        <div style={styles.inputArea}>
          <input
            type="text"
            placeholder="Ask a question..."
            style={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKey}
            disabled={loading}
            autoFocus
          />
          <button style={styles.sendBtn} onClick={sendMessage} disabled={loading || !input.trim()}>
            Send
          </button>
        </div>
        <div style={styles.footerNote}>
          <span style={{ fontSize: "0.79em", color: "#888" }}>
            Powered by OpenAI | Tips: "How do I play?", "How to win?", "Explain game rules"
          </span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    right: 28,
    bottom: 24,
    zIndex: 9999,
    background: "rgba(28,28,32,0.07)",
    minWidth: 280,
  },
  chatWindow: {
    width: 320,
    maxWidth: "92vw",
    background: "var(--bg-secondary,#fff)",
    borderRadius: 10,
    boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
    padding: "10px 10px 4px 10px",
    border: "1.5px solid var(--border-color,#e9ecef)",
    display: "flex",
    flexDirection: "column",
    fontFamily: "inherit",
  },
  closeBtn: {
    alignSelf: "flex-end",
    background: "none",
    border: "none",
    fontSize: 24,
    color: "#888",
    marginTop: 4,
    cursor: "pointer",
  },
  header: {
    fontWeight: 800,
    fontSize: 18,
    color: "var(--text-primary,#222)",
    marginBottom: 6,
    marginTop: -12,
    textAlign: "center"
  },
  chatHistory: {
    minHeight: 90,
    maxHeight: 180,
    overflowY: "auto",
    marginBottom: 7,
    fontSize: 14,
    padding: "4px 2px",
  },
  assistantMsg: {
    background: "rgba(212,232,255,0.23)",
    borderRadius: 5,
    padding: "6px 8px",
    marginBottom: 2,
    color: "#245",
    wordBreak: "break-word",
  },
  userMsg: {
    alignSelf: "flex-end",
    background: "rgba(246,234,219,0.21)",
    borderRadius: 5,
    padding: "6px 8px",
    marginBottom: 2,
    color: "#183",
    textAlign: "right",
    wordBreak: "break-word",
  },
  inputArea: {
    display: "flex",
    marginBottom: 4,
    gap: 5,
  },
  input: {
    flex: 1,
    padding: "7px 8px",
    borderRadius: 5,
    border: "1px solid #ddd",
    marginRight: 4,
    fontSize: 15,
  },
  sendBtn: {
    background: "var(--button-bg, #007bff)",
    color: "var(--button-text,#fff)",
    padding: "7px 18px",
    border: "none",
    borderRadius: 6,
    fontWeight: 650,
    cursor: "pointer",
    fontSize: 15,
    transition: "background-color 0.2s",
  },
  errorMsg: {
    color: "#d40",
    marginBottom: 4,
    fontSize: 13,
  },
  footerNote: {
    marginTop: 0,
    paddingTop: 3,
    textAlign: "center"
  },
};

export default OpenAIChat;
