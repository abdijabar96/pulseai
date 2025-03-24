import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Send, Loader2, Lightbulb } from 'lucide-react';
import { analyzeBehavior } from '../lib/gemini';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTraining?: boolean;
}

export function BehaviorTraining() {
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
      const response = await analyzeBehavior(userMessage.content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        isTraining: true
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I encountered an error analyzing the behavior. Please try again or consult with a professional trainer for complex issues.',
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
        <h2 className="text-lg font-semibold text-gray-900">Behavioral Training Guide</h2>
        <p className="text-sm text-gray-500">
          Get personalized training tips and behavioral insights
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="rounded-lg bg-purple-50 p-4 text-sm text-purple-700">
              <div className="mb-2 flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                <span className="font-semibold">Training Assistant</span>
              </div>
              <p className="mb-2">
                Describe your pet's behavioral issue for personalized training guidance. Include:
              </p>
              <ul className="ml-5 list-disc space-y-1">
                <li>What is the specific behavior?</li>
                <li>When does it typically occur?</li>
                <li>How long has it been happening?</li>
                <li>What triggers the behavior?</li>
                <li>What have you tried so far?</li>
              </ul>
              <div className="mt-4 rounded-lg bg-blue-50 p-3 text-blue-800">
                <p className="font-medium">💡 Pro Tip:</p>
                <p>The more details you provide, the more specific and effective the training guidance will be.</p>
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
                      ? 'bg-purple-500 text-white'
                      : message.isTraining
                      ? 'bg-purple-50 text-gray-900'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.type === 'assistant' && message.isTraining && (
                    <div className="mb-2 flex items-center text-purple-600">
                      <Lightbulb className="mr-2 h-5 w-5" />
                      <span className="font-semibold">Training Guidance</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div
                    className={`mt-1 text-right text-xs ${
                      message.type === 'user'
                        ? 'text-purple-100'
                        : message.isTraining
                        ? 'text-purple-500'
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
              <div className="flex max-w-[80%] items-center space-x-2 rounded-lg bg-purple-50 p-4 text-purple-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Analyzing behavior and preparing guidance...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="rounded-lg bg-purple-50 p-3 text-sm text-purple-800">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-purple-600" />
            <span className="font-medium">Training Note:</span>
          </div>
          <p className="mt-1">
            For complex behavioral issues or if you're not seeing improvement,
            consider consulting with a professional pet trainer or behaviorist.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe the behavioral issue..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex items-center space-x-2 rounded-lg bg-purple-500 px-4 py-2 text-white transition-colors hover:bg-purple-600 disabled:bg-gray-300"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}