import { useCallback } from 'react';

const hasSpeechSynthesis = typeof window !== 'undefined' && 'speechSynthesis' in window;

/** 浏览器原生 TTS 播报 */
export function useSpeech() {
  const speak = useCallback((text: string, lang = 'zh-CN') => {
    if (!hasSpeechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak };
}
