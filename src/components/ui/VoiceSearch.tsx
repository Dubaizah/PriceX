/**
 * PriceX - Voice Search Component
 * AI-powered voice search for hands-free shopping
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Search, Loader2 } from 'lucide-react';

interface VoiceSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function VoiceSearch({ onSearch, placeholder = 'Search products...', className = '' }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);

        if (event.results[current].isFinal) {
          setIsProcessing(true);
          // Simulate AI processing
          setTimeout(() => {
            onSearch(transcriptText);
            setIsProcessing(false);
            setIsListening(false);
          }, 1000);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Voice recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onSearch]);

  const toggleListening = () => {
    if (!isSupported) {
      alert('Voice search is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={isListening ? 'Listening...' : placeholder}
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary border border-border focus:border-[var(--pricex-yellow)] outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && transcript) {
                onSearch(transcript);
              }
            }}
          />
          {isProcessing && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Loader2 className="w-5 h-5 animate-spin text-[var(--pricex-yellow)]" />
            </div>
          )}
        </div>
        
        <button
          onClick={toggleListening}
          disabled={!isSupported}
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-[var(--pricex-yellow)] text-black hover:bg-[var(--pricex-yellow-dark)]'
          } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={isSupported ? 'Voice Search' : 'Voice search not supported'}
        >
          {isListening ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Voice Status Indicator */}
      {isListening && (
        <div className="absolute top-full mt-2 left-0 right-0 p-4 bg-card border border-border rounded-xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium">Listening...</span>
          </div>
          <p className="mt-2 text-muted-foreground">{transcript || 'Say something...'}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Try: &quot;Find iPhone 15 deals under $1000&quot; or &quot;Show me the best laptops&quot;
          </p>
        </div>
      )}

      {/* Voice Commands Help */}
      {!isListening && (
        <div className="mt-2 text-xs text-muted-foreground">
          <span className="text-[var(--pricex-yellow)]">Tip:</span> Say &quot;Hey PriceX&quot; followed by your search
        </div>
      )}
    </div>
  );
}

// Hook for wake word detection
export function useWakeWord() {
  const [isWakeWordDetected, setIsWakeWordDetected] = useState(false);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      
      if (transcript.includes('hey pricex') || transcript.includes('ok pricex')) {
        setIsWakeWordDetected(true);
        // Play acknowledgment sound
        const audio = new Audio('/sounds/activation.mp3');
        audio.play().catch(() => {});
      }
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, []);

  return { isWakeWordDetected, setIsWakeWordDetected };
}
