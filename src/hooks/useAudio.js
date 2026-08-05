import { useCallback } from "react";

const SOUNDS = {
  success: new Audio("/sounds/success.mp3"),
  error: new Audio("/sounds/error.mp3"),
  notification: new Audio("/sounds/notification.mp3"),
  click: new Audio("/sounds/click.mp3"),
};

Object.values(SOUNDS).forEach((a) => { a.volume = 0.25; a.preload = "auto"; });

export function useAudio() {
  const play = useCallback((name) => {
    const snd = SOUNDS[name];
    if (!snd) return;
    snd.currentTime = 0;
    snd.play().catch(() => {});
  }, []);
  return { play };
}