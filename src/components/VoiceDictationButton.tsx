import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';

interface VoiceDictationButtonProps {
  onTranscript: (text: string) => void;
  currentText?: string;
  fieldLabel?: string;
  className?: string;
}

export const VoiceDictationButton: React.FC<VoiceDictationButtonProps> = ({
  onTranscript,
  currentText = '',
  fieldLabel = 'Description',
  className = '',
}) => {
  const { language, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      stopRecognition();
    };
  }, []);

  const stopRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => track.stop());
      } catch (e) {
        // ignore
      }
      streamRef.current = null;
    }
    setIsListening(false);
    setInterimText('');
  };

  const toggleListening = async () => {
    setErrorMessage(null);

    // If already listening, stop
    if (isListening) {
      stopRecognition();
      return;
    }

    // Check browser support for SpeechRecognition API
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      (window as any).mozSpeechRecognition ||
      (window as any).msSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setErrorMessage(t.micNotSupported);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognitionRef.current = recognition;

      // Set recognition language: Hindi or Indian English
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false; // continuous = false is more reliable across browser frames
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let finalTrans = '';
        let interimTrans = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript;
          } else {
            interimTrans += event.results[i][0].transcript;
          }
        }

        if (interimTrans) {
          setInterimText(interimTrans);
        }

        if (finalTrans) {
          setInterimText('');
          const updated = currentText ? `${currentText.trim()} ${finalTrans.trim()}` : finalTrans.trim();
          onTranscript(updated);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setErrorMessage(t.micPermissionError);
        } else if (event.error === 'no-speech') {
          // No speech detected within timeout window - silently stop without scary red alert
        } else {
          setErrorMessage(`${t.speechNoticeLabel} ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText('');
      };

      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition instance:', err);
      setErrorMessage(t.micInitError);
      setIsListening(false);
    }
  };

  // Quick voice sample dictation helper (guarantees seamless testing if mic is hardware restricted)
  const handleSimulateVoice = (sampleText?: string) => {
    setErrorMessage(null);
    const textToInsert = sampleText || t.sampleVoiceText;

    setIsListening(true);
    setInterimText(t.transcribingVoice);

    setTimeout(() => {
      setInterimText('');
      setIsListening(false);
      const updated = currentText ? `${currentText.trim()} ${textToInsert}` : textToInsert;
      onTranscript(updated);
    }, 600);
  };

  return (
    <div className={`inline-flex flex-col items-start ${className}`}>
      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
        <button
          type="button"
          id="voice-dictation-btn"
          onClick={toggleListening}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-xs ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-300'
              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 hover:border-emerald-400'
          }`}
          title={isListening ? t.stopListening : t.speakComplaint}
        >
          {isListening ? (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <MicOff className="w-3.5 h-3.5" />
              <span>{t.stopListening}</span>
            </>
          ) : (
            <>
              <Mic className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.speakComplaint}</span>
              <span className="text-[10px] uppercase font-mono px-1 py-0.2 bg-emerald-200/60 rounded text-emerald-900 font-bold">
                {t.switchLang}
              </span>
            </>
          )}
        </button>

        {/* Instant Voice Test Button */}
        <button
          type="button"
          onClick={() => handleSimulateVoice()}
          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-medium border border-slate-200 transition-colors cursor-pointer inline-flex items-center space-x-1"
          title="Auto-dictate sample voice report (Test Speech-to-Text)"
        >
          <Sparkles className="w-3 h-3 text-indigo-600" />
          <span>{t.testVoiceBtn}</span>
        </button>

        {isListening && (
          <span className="text-xs font-semibold text-rose-600 flex items-center space-x-1">
            <Volume2 className="w-3.5 h-3.5 animate-bounce" />
            <span>{t.listening}</span>
          </span>
        )}
      </div>

      {/* Real-time Interim Live Voice Feedback */}
      {interimText && (
        <div className="mt-1 text-[11px] text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-1 rounded-md max-w-md animate-fade-in">
          <span className="font-bold mr-1">🎙️ {t.liveSpeechLabel}</span>
          <span>{interimText}</span>
        </div>
      )}

      {/* Error / Permission Guidance message */}
      {errorMessage && (
        <div className="mt-1.5 text-[11px] text-amber-800 bg-amber-50 border border-amber-300 px-2.5 py-1.5 rounded-lg flex items-start space-x-1.5 max-w-md">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <p>{errorMessage}</p>
            <button
              type="button"
              onClick={() => handleSimulateVoice()}
              className="mt-1 underline text-indigo-700 font-semibold cursor-pointer block"
            >
              {t.fillSampleVoice}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
