export const playSound = {
    playTone: (freq: number, type: OscillatorType, duration: number, delay = 0, volume = 0.1) => {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

        gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration);
    },

    levelUp: () => {
        // Fanfare: C4 E4 G4 C5 (Grand)
        const notes = [261.63, 329.63, 392.00, 523.25];
        let delay = 0;
        notes.forEach((note, i) => {
            const duration = i === 3 ? 0.8 : 0.2;
            playSound.playTone(note, 'square', duration, delay, 0.1);
            delay += 0.15;
        });
    },

    complete: () => {
        // Simple Success Chime: High C -> High E
        playSound.playTone(523.25, 'sine', 0.1, 0, 0.05);
        playSound.playTone(659.25, 'sine', 0.3, 0.1, 0.05);
    }
};
