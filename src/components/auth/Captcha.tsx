'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface CaptchaProps {
  onVerify: (verified: boolean) => void;
}

export function Captcha({ onVerify }: CaptchaProps) {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(false);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setUserInput('');
    setIsVerified(false);
    setError(false);
    onVerify(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setUserInput(value);

    if (value === captchaText) {
      setIsVerified(true);
      setError(false);
      onVerify(true);
    } else if (value.length >= captchaText.length) {
      setError(true);
      setIsVerified(false);
      onVerify(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <div 
          className="flex-1 h-12 bg-gradient-to-r from-blue-100 to-green-100 rounded-xl flex items-center justify-center font-mono text-xl tracking-wider select-none"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)' }}
        >
          {captchaText.split('').map((char, i) => (
            <span 
              key={i} 
              className="transform inline-block"
              style={{ 
                transform: `rotate(${Math.random() * 30 - 15}deg)`,
                color: ['#2563eb', '#16a34a', '#dc2626', '#9333ea'][Math.floor(Math.random() * 4)]
              }}
            >
              {char}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={generateCaptcha}
          className="p-2 rounded-lg hover:bg-secondary transition-colors"
          title="Refresh CAPTCHA"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Enter the characters above"
        maxLength={6}
        className={`w-full h-12 px-4 rounded-xl bg-secondary border ${
          error ? 'border-red-500' : isVerified ? 'border-green-500' : 'border-border'
        } focus:border-[var(--pricex-yellow)] outline-none`}
      />
      {error && (
        <p className="text-red-500 text-sm">Incorrect CAPTCHA. Please try again.</p>
      )}
      {isVerified && (
        <p className="text-green-500 text-sm">CAPTCHA verified!</p>
      )}
    </div>
  );
}
