'use client';

import { useState, useEffect, useRef } from 'react';
import { Timer, RefreshCw, Mail, Smartphone } from 'lucide-react';

interface OTPVerificationProps {
  method: 'email' | 'sms';
  value: string;
  onVerify: (code: string) => void;
  onSend: () => void;
  isSending?: boolean;
  isVerifying?: boolean;
}

export function OTPVerification({ method, value, onVerify, onSend, isSending, isVerifying }: OTPVerificationProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every(c => c !== '') && newCode.join('').length === 6) {
      onVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);
    
    if (pastedData.length === 6) {
      onVerify(pastedData);
    }
  };

  const handleResend = () => {
    setCode(['', '', '', '', '', '']);
    setTimeLeft(60);
    setResendDisabled(true);
    setError('');
    onSend();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {method === 'email' ? <Mail className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
        <span>Verification code sent to: {method === 'email' ? value : value.replace(/(\+?\d{2})\d{4}(\d{4})/, '$1****$2')}</span>
      </div>

      <div className="flex justify-center gap-2" onPaste={handlePaste}>
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-14 text-center text-xl font-bold rounded-xl bg-secondary border border-border focus:border-[var(--pricex-yellow)] outline-none"
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Timer className="w-4 h-4" />
          <span>Code expires in: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
        </div>
        <button
          type="button"
          onClick={handleResend}
          disabled={resendDisabled || isSending}
          className="flex items-center gap-1 text-[var(--pricex-yellow)] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${isSending ? 'animate-spin' : ''}`} />
          Resend code
        </button>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    </div>
  );
}
