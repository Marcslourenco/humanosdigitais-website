import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface SofiaAvatarProps {
  onResponse?: (response: string) => void;
}

export const SofiaAvatar: React.FC<SofiaAvatarProps> = ({ onResponse }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setLoading(true);

    try {
      const response = await axios.post('/api/sofia/chat', {
        message: input,
        context: messages,
      });

      const { text, video_url } = response.data;
      setMessages(prev => [...prev, { role: 'sofia', content: text }]);
      setVideoUrl(video_url);
      onResponse?.(text);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'sofia', content: 'Desculpe, ocorreu um erro.' }]);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div className="sofia-avatar-container">
      <div className="sofia-video">
        {videoUrl ? (
          <video src={videoUrl} autoPlay controls />
        ) : (
          <div className="sofia-placeholder">Sofia Avatar</div>
        )}
      </div>

      <div className="sofia-chat">
        <div className="messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              {msg.content}
            </div>
          ))}
        </div>

        <div className="input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Converse com Sofia..."
            disabled={loading}
          />
          <button onClick={handleSendMessage} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
};
