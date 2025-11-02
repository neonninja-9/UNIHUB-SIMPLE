"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/Input";
import { mockCourses, mockAssignments, mockTeacher } from "@/lib/mock-data";
import { mockStudentCourses, mockRecentGrades } from "@/lib/student-mock-data";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatbotProps {
  userType: "student" | "teacher";
  userData?: any;
}

export function Chatbot({ userType, userData }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hello! I'm your AI assistant. I can help you with information about courses, assignments, grades, and more. What would you like to know?`,
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (query: string): Promise<string> => {
    const lowerQuery = query.toLowerCase();

    // Course-related queries
    if (lowerQuery.includes("course") || lowerQuery.includes("class")) {
      if (userType === "student") {
        const courses = mockStudentCourses;
        if (lowerQuery.includes("next") || lowerQuery.includes("upcoming")) {
          return `Your next class is "${courses[0].title}" (${courses[0].code}) with ${courses[0].teacher} at ${courses[0].nextAssignmentDue}.`;
        }
        if (lowerQuery.includes("all") || lowerQuery.includes("list")) {
          return `You are enrolled in: ${courses.map((c) => `${c.title} (${c.code})`).join(", ")}.`;
        }
        return `You have ${courses.length} courses this semester. Your main courses are ${courses
          .slice(0, 2)
          .map((c) => c.title)
          .join(" and ")}.`;
      } else {
        const courses = mockCourses;
        return `You are teaching ${courses.length} courses: ${courses.map((c) => `${c.title} (${c.code})`).join(", ")}.`;
      }
    }

    // Assignment-related queries
    if (lowerQuery.includes("assignment") || lowerQuery.includes("homework")) {
      if (userType === "student") {
        const courses = mockStudentCourses;
        if (lowerQuery.includes("due") || lowerQuery.includes("deadline")) {
          return `Your next assignment is "${courses[0].nextAssignment}" for ${courses[0].title}, due ${courses[0].nextAssignmentDue}.`;
        }
        return `You have assignments in: ${courses.map((c) => `${c.title}: ${c.nextAssignment}`).join("; ")}.`;
      } else {
        const assignments = mockAssignments;
        return `You have ${assignments.length} assignments to review. Next due: "${assignments[0].title}" for ${assignments[0].course} (${assignments[0].due}).`;
      }
    }

    // Grade-related queries
    if (lowerQuery.includes("grade") || lowerQuery.includes("score")) {
      if (userType === "student") {
        const grades = mockRecentGrades;
        return `Your recent grades: ${grades.map((g) => `${g.course}: ${g.grade}`).join(", ")}.`;
      } else {
        return "As a teacher, you can view student grades in the assignments section. Would you like help with grading?";
      }
    }

    // Attendance queries
    if (lowerQuery.includes("attendance")) {
      if (userType === "student") {
        return "Your current attendance is 85%. You've missed 2 classes this semester.";
      } else {
        return "You can mark attendance for your classes using the attendance widget. Today's classes start at their scheduled times.";
      }
    }

    // Schedule queries
    if (lowerQuery.includes("schedule") || lowerQuery.includes("timetable")) {
      if (userType === "student") {
        return "Your classes are: Monday/Wednesday - Physics 9:15 AM, Tuesday/Thursday - Calculus 10:15 AM, and Literature on Friday.";
      } else {
        return `Your teaching schedule: ${mockCourses.map((c) => `${c.title} - ${c.nextClass}`).join("; ")}.`;
      }
    }

    // General help
    if (lowerQuery.includes("help") || lowerQuery.includes("what can you")) {
      return `I can help with: course information, assignments, grades, attendance, schedule, and general university queries. Just ask!`;
    }

    // For other queries, use Gemini API via Python script
    try {
      const response = await fetch("http://localhost:3002/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: query,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          return data.response;
        } else {
          return `Error: ${data.error}`;
        }
      }
    } catch (error) {
      console.error("Chat API error:", error);
      return "Sorry, I am unable to respond right now.";
    }

    // Fallback responses if API fails
    const defaultResponses = [
      "I'm here to help with your university-related questions. Try asking about courses, assignments, or grades.",
      "I can provide information about your classes, upcoming assignments, and grades. What specific information do you need?",
      "Feel free to ask me about your schedule, attendance, or any course-related questions!",
    ];

    return defaultResponses[
      Math.floor(Math.random() * defaultResponses.length)
    ];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");
    setIsTyping(true);

    // Generate response asynchronously
    try {
      const botResponse = await generateResponse(currentInput);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble responding right now. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-blue-600" />
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                UniHub Assistant
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "bot" && (
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot size={16} className="text-blue-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {message.sender === "user" && (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User size={16} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-blue-600" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="sm"
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
