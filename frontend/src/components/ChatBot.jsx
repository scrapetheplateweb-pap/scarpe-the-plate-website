import React, { useState, useEffect, useRef } from 'react';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      text: 'Hello! I\'m your Scrape the Plate assistant. I can help you navigate the site, answer questions about our Comedy, Car Wrapping, and Modeling services, or assist with booking. What can I help you with today?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: 'I\'m having trouble connecting right now. Please try again in a moment or contact us directly!' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #9300c5, #f50505)',
            border: 'none',
            color: 'white',
            fontSize: '28px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(147, 0, 197, 0.4)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '350px',
          height: '500px',
          background: '#2a262b',
          border: '2px solid #9300c5',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #9300c5, #f50505)',
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ 
                margin: 0, 
                color: 'white',
                fontFamily: 'Teko, sans-serif',
                fontSize: '1.4rem'
              }}>
                Scrape the Plate Assistant
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#fff', opacity: 0.9 }}>
                Here to help!
              </p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '0',
                width: '30px',
                height: '30px'
              }}
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem'
          }}>
            {messages.map((msg, i) => (
              <div 
                key={i} 
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '80%',
                  padding: '0.8rem',
                  borderRadius: '12px',
                  background: msg.role === 'user' 
                    ? 'linear-gradient(135deg, #9300c5, #f50505)'
                    : '#3a363b',
                  color: 'white',
                  fontSize: '0.9rem',
                  lineHeight: '1.4'
                }}>
                  {msg.role === 'bot' && (
                    <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '4px' }}>
                      Assistant
                    </div>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{
                padding: '0.8rem',
                background: '#3a363b',
                borderRadius: '12px',
                maxWidth: '80%',
                color: '#aaa9ad',
                fontSize: '0.9rem'
              }}>
                <span className="typing-dots">Typing</span>...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '1rem',
            borderTop: '1px solid #444',
            display: 'flex',
            gap: '0.5rem'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
              placeholder="Ask me anything..."
              disabled={loading}
              style={{
                flex: 1,
                padding: '0.7rem',
                border: '2px solid #9300c5',
                borderRadius: '8px',
                background: '#1a1a1a',
                color: '#aaa9ad',
                fontSize: '0.9rem'
              }}
            />
            <button 
              onClick={sendMessage} 
              disabled={loading || !input.trim()}
              style={{
                background: input.trim() && !loading 
                  ? 'linear-gradient(135deg, #9300c5, #f50505)'
                  : '#666',
                border: 'none',
                color: 'white',
                padding: '0.7rem 1.2rem',
                borderRadius: '8px',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                fontFamily: 'Teko, sans-serif',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
