let isMuted = true;

export const playSound = () => {
  if (isMuted) return;
  const audio = new Audio("/sounds/mech-keyboard-02-102918.mp3");
  audio.volume = 0.1;
  audio.play().catch(() => {});
};

export const toggleMute = () => {
  isMuted = !isMuted;
  return isMuted;
};

export const getMuteState = () => isMuted;
