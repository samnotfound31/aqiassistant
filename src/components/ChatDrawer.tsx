import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot } from 'lucide-react';
import { useStore } from '../store/useStore';
import { askGemini } from '../api/gemini';

export function ChatDrawer() {
  const { isChatOpen, toggleChat, chatMessages, addChatMessage, currentAQI, currentWeather } = useStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = async () => {
    if (!input.trim() || !currentAQI || !currentWeather) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input,
      timestamp: new Date(),
    };

    addChatMessage(userMessage);
    setInput('');
    setIsTyping(true);

    try {
      const response = await askGemini({
        aqi: currentAQI,
        weather: currentWeather,
        query: input,
      });

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: response,
        timestamp: new Date(),
      };

      setTimeout(() => {
        addChatMessage(aiMessage);
        setIsTyping(false);
      }, 500);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsTyping(false);
    }
  };

  const quickQuestions = [
    'Is it safe to run?',
    'Best time to commute?',
    'Do I need a mask?',
    'Indoor or outdoor workout?',
  ];

  if (!isChatOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={toggleChat}
      />
      <div className="fixed inset-x-0 bottom-0 bg-white dark:bg-dark-bg rounded-t-3xl shadow-2xl z-50 max-w-mobile mx-auto transition-transform max-h-[80vh] flex flex-col border-t-4 border-aqi-good">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-aqi-good rounded-2xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">AI Concierge</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Ask me anything about air quality</p>
            </div>
          </div>
          <button
            onClick={toggleChat}
            className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chatMessages.length === 0 && (
            <div className="text-center py-8">
              <Bot className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Ask me anything about air quality, health recommendations, or best times to go outside
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-aqi-good rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-3xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-aqi-good text-white rounded-br-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-lg'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-aqi-good rounded-2xl flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-3xl rounded-bl-lg px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  />
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about air quality..."
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl focus:ring-2 focus:ring-aqi-good focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="w-12 h-12 bg-aqi-good text-white rounded-2xl flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
