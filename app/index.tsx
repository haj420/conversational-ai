import React, { useState } from "react";
import { StyleSheet, Text, TextInput, Button, View, ScrollView } from "react-native";
import axios from "axios";
import { API_KEY } from "@env"; // Ensure you create a .env file with the key `API_KEY=your-api-key`

export default function App() {
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState([]);

  const askAI = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setConversation((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: input }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      const botMessage = {
        sender: "bot",
        text: response.data.choices[0].message.content,
      };
      setConversation((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage = { sender: "bot", text: "Error: Unable to fetch response from AI." };
      setConversation((prev) => [...prev, errorMessage]);
    }

    setInput("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>AI Conversation App</Text>
      <ScrollView style={styles.conversation} contentContainerStyle={styles.conversationContent}>
        {conversation.map((msg, index) => (
          <Text
            key={index}
            style={msg.sender === "user" ? styles.userMessage : styles.botMessage}
          >
            {msg.sender === "user" ? "You: " : "AI: "}
            {msg.text}
          </Text>
        ))}
      </ScrollView>
      <TextInput
        style={styles.input}
        placeholder="Type your question here..."
        value={input}
        onChangeText={setInput}
      />
      <Button title="Ask AI" onPress={askAI} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  conversation: {
    flex: 1,
    marginBottom: 10,
  },
  conversationContent: {
    paddingBottom: 20,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#d1e7dd",
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
    maxWidth: "80%",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f8d7da",
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
    maxWidth: "80%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

