export const isMobile = () => {
  // Enhanced detection for Capacitor/Native environment
  return window.innerWidth <= 768 || (window as any).Capacitor !== undefined;
};

export const hapticFeedback = async () => {
  if ((window as any).Capacitor?.Plugins?.Haptics) {
    await (window as any).Capacitor.Plugins.Haptics.impact({ style: 'LIGHT' });
  }
};
