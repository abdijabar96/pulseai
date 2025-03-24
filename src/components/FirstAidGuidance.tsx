import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, Send, Loader2, Heart } from 'lucide-react';
import { getFirstAidGuidance } from '../lib/gemini';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isEmergency?: boolean;
}

export function FirstAidGuidance() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getFirstAidGuidance(userMessage.content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        isEmergency: true
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I encountered an error providing first aid guidance. Please try again or, if this is an emergency, contact your veterinarian immediately.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="flex h-[600px] flex-col rounded-lg bg-white shadow-lg">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900">Pet First Aid Guide</h2>
        <p className="text-sm text-gray-500">
          Get immediate guidance for pet emergencies
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              <div className="mb-2 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5" />
                <span className="font-semibold">Emergency First Aid Guide</span>
              </div>
              <p className="mb-2">
                Describe the emergency situation for immediate first aid guidance. Include:
              </p>
              <ul className="ml-5 list-disc space-y-1">
                <li>What happened?</li>
                <li>When did it start?</li>
                <li>What symptoms are you seeing?</li>
                <li>Your pet's age and any health conditions</li>
              </ul>
              <div className="mt-4 rounded-lg bg-yellow-50 p-3 text-yellow-800">
                <p className="font-medium">⚠️ Important:</p>
                <p>This is first aid guidance only. For emergencies, contact your veterinarian immediately.</p>
              </div>
            </div>
          ) : (
            messages.map(message => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : message.isEmergency
                      ? 'bg-red-50 text-gray-900'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.type === 'assistant' && message.isEmergency && (
                    <div className="mb-2 flex items-center text-red-600">
                      <Heart className="mr-2 h-5 w-5" />
                      <span className="font-semibold">First Aid Guidance</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div
                    className={`mt-1 text-right text-xs ${
                      message.type === 'user'
                        ? 'text-blue-100'
                        : message.isEmergency
                        ? 'text-red-500'
                        : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] items-center space-x-2 rounded-lg bg-red-50 p-4 text-red-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Preparing first aid guidance...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="font-medium">Emergency Warning:</span>
          </div>
          <p className="mt-1">
            This is first aid guidance only. For serious emergencies, contact your
            veterinarian or emergency animal hospital immediately.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe the emergency situation..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex items-center space-x-2 rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 disabled:bg-gray-300"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}