import React, { useState } from "react";
import "./ChatBot.css";
import axiosInstance from "../apis/config"; // ✅ استيراد axios instance

const suggestions = [
  { label: "عدد الموظفين", endpoint: "/chatbot/total-employees" },
  { label: "الحاضرين اليوم", endpoint: "/chatbot/attended-today" },
  { label: "الغائبين اليوم", endpoint: "/chatbot/absent-today" },
  { label: "إجمالي المرتبات", endpoint: "/chatbot/monthly-salaries" },
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const toggleChat = () => setIsOpen((prev) => !prev);

  const askChatbot = async (endpoint, label) => {
    addMessage(label, "user");
    addMessage("جارٍ التحميل...", "bot");

    try {
      let response = "";

      if (label === "إجمالي المرتبات") {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;

        const res = await axiosInstance.get(
          `/dynamicSalary?year=${year}&month=${month}`
        );

        response = `إجمالي المرتبات لهذا الشهر: ${res.data.totalNetSalary} جنيه`;
      } else {
        const res = await axiosInstance.get(endpoint);
        const data = res.data;

        if (label === "عدد الموظفين") {
          response = `عدد الموظفين هو: ${data.totalEmployees}`;
        } else if (label === "الحاضرين اليوم") {
          response = `عدد الحاضرين اليوم: ${data.attendedToday}`;
        } else if (label === "الغائبين اليوم") {
          response = `عدد الغائبين اليوم: ${data.absentToday}`;
        } else {
          response = JSON.stringify(data);
        }
      }

      updateLastBotMessage(response);
    } catch (err) {
      console.error("❌ chatbot error:", err);
      updateLastBotMessage("حدث خطأ أثناء جلب البيانات");
    }
  };

  const addMessage = (text, sender) => {
    setMessages((prev) => [...prev, { text, sender }]);
  };

  const updateLastBotMessage = (text) => {
    setMessages((prev) => {
      const updated = [...prev];
      updated[updated.length - 1] = { text, sender: "bot" };
      return updated;
    });
  };

  return (
    <>
      <div className="chat-icon" onClick={toggleChat}>
        💬
      </div>
      {isOpen && (
        <div className="chat-box">
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-options">
            {suggestions.map((s, i) => (
              <button
                key={i}
                className="chat-option"
                onClick={() => askChatbot(s.endpoint, s.label)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
