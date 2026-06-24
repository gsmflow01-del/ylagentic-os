export const isMobile = () => {
  return window.innerWidth <= 768 || (window as any).Capacitor?.isNative;
};

export const nativeVibrate = async () => {
  if ((window as any).Capacitor?.Plugins?.Haptics) {
    await (window as any).Capacitor.Plugins.Haptics.vibrate();
  }
};
