import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hello! I'm LabBot. I can help you with your 2nd-year lab experiments, debug code, or explain concepts like Normalization or Process Scheduling. What are you working on today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(userMsg.text);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      // Error handling is managed in the service, but safety net here
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-white rounded-tl-3xl shadow-inner overflow-hidden relative">
       {/* Header */}
       <div className="p-6 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between absolute top-0 w-full z-10">
          <div className="flex items-center">
             <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 mr-3">
                <Bot size={24} />
             </div>
             <div>
               <h2 className="font-bold text-slate-800">Lab Assistant AI</h2>
               <div className="flex items-center">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                 <span className="text-xs text-slate-500">Online • Gemini 2.5 Flash</span>
               </div>
             </div>
          </div>
          <div className="hidden md:block">
             <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full flex items-center">
                <Sparkles size={12} className="mr-1" /> Powered by Google GenAI
             </span>
          </div>
       </div>

       {/* Chat Area */}
       <div className="flex-1 overflow-y-auto p-6 pt-24 pb-24 space-y-6 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${
                    msg.role === 'user' ? 'bg-slate-200 text-slate-600 ml-3' : 'bg-indigo-100 text-indigo-600 mr-3'
                }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                
                <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.text}
                  <div className={`text-[10px] mt-2 text-right opacity-70 ${msg.role === 'user' ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
             <div className="flex justify-start">
                 <div className="flex items-center ml-11 space-x-2 bg-white border border-slate-100 px-4 py-3 rounded-xl rounded-tl-none shadow-sm">
                    <Loader2 size={16} className="animate-spin text-indigo-600" />
                    <span className="text-xs text-slate-500">LabBot is thinking...</span>
                 </div>
             </div>
          )}
          <div ref={messagesEndRef} />
       </div>

       {/* Input Area */}
       <div className="absolute bottom-0 w-full p-4 bg-white border-t border-slate-100">
         <div className="max-w-4xl mx-auto relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about your experiment, code error, or theory..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none text-sm"
              rows={1}
              style={{ minHeight: '50px' }}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
            >
              <Send size={18} />
            </button>
         </div>
         <div className="text-center mt-2">
            <p className="text-[10px] text-slate-400">AI can make mistakes. Verify important lab info with your instructor.</p>
         </div>
       </div>
    </div>
  );
};

export default Assistant;
