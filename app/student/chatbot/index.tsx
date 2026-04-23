import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StudentShell } from "@/components/layout/StudentShell";
import { Card } from "@/components/ui/Card";
import { Colors } from "@/constants/colors";

interface ChatMessage {
  id: string;
  role: "bot" | "user";
  text: string;
}

const QUICK_SUGGESTIONS = [
  "Show my pending fees",
  "How to request room change?",
  "Any latest important notices?",
  "Track my complaint status",
];

export default function StudentChatbotScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "bot",
      text: "Hi! I am Hostelify Assistant. I can help with fees, complaints, notices, and room support.",
    },
  ]);
  const [input, setInput] = useState("");

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      text: trimmed,
    };

    const botMessage: ChatMessage = {
      id: `${Date.now()}-bot`,
      role: "bot",
      text: getBotResponse(trimmed),
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  };

  return (
    <StudentShell title="AI Chatbot" subtitle="Smart assistant for hostel support" showBottomNav={false}>
      <View style={styles.wrapper}>
        <Card style={styles.quickCard}>
          <Text style={styles.quickTitle}>Quick Suggestions</Text>
          <View style={styles.quickWrap}>
            {QUICK_SUGGESTIONS.map((item) => (
              <Pressable key={item} style={styles.quickBtn} onPress={() => send(item)}>
                <Text style={styles.quickText}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </Card>

        <ScrollView style={styles.chatBox} contentContainerStyle={styles.chatContent}>
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageRow,
                message.role === "user" ? styles.messageRowUser : styles.messageRowBot,
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  message.role === "user" ? styles.userBubble : styles.botBubble,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    message.role === "user" ? styles.userText : styles.botText,
                  ]}
                >
                  {message.text}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask anything..."
            placeholderTextColor={Colors.subtext}
            style={styles.input}
          />
          <Pressable style={styles.sendBtn} onPress={() => send(input)}>
            <Ionicons name="send" size={18} color="#fff" />
          </Pressable>
        </View>
      </View>
    </StudentShell>
  );
}

function getBotResponse(text: string) {
  const normalized = text.toLowerCase();
  if (normalized.includes("fee")) {
    return "You can open Fee Management and tap 'Pay Pending Fee' to clear dues instantly.";
  }
  if (normalized.includes("room")) {
    return "Go to Room Details and use the 'Request Room Change' button. Warden approval is required.";
  }
  if (normalized.includes("notice")) {
    return "Open Notices and switch to Important filter for urgent announcements.";
  }
  if (normalized.includes("complaint")) {
    return "Visit Complaints to raise a new issue and track status as Pending, In Progress, or Resolved.";
  }
  return "I can help with fees, room details, complaints, notices, mess, and profile settings.";
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    gap: 12,
    paddingBottom: 16,
  },
  quickCard: {
    gap: 10,
    padding: 14,
  },
  quickTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  quickWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickBtn: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: Colors.surface,
  },
  quickText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: "600",
  },
  chatBox: {
    flex: 1,
  },
  chatContent: {
    gap: 10,
    paddingBottom: 8,
  },
  messageRow: {
    flexDirection: "row",
  },
  messageRowUser: {
    justifyContent: "flex-end",
  },
  messageRowBot: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "82%",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: "#fff",
  },
  botText: {
    color: Colors.text,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.card,
    padding: 8,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  sendBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  sendText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
});
