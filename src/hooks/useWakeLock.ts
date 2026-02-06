import { useEffect, useRef, useState, useCallback } from 'react';

export function useWakeLock() {
    const wakeLock = useRef<WakeLockSentinel | null>(null);
    const [isLocked, setIsLocked] = useState(false);

    const requestWakeLock = useCallback(async () => {
        try {
            if ('wakeLock' in navigator) {
                wakeLock.current = await navigator.wakeLock.request('screen');
                setIsLocked(true);
                wakeLock.current.addEventListener('release', () => {
                    setIsLocked(false);
                    console.log('Wake Lock released');
                });
                console.log('Wake Lock active');
            }
        } catch (err) {
            console.error('Wake Lock error:', err);
        }
    }, []);

    const releaseWakeLock = useCallback(async () => {
        if (wakeLock.current) {
            await wakeLock.current.release();
            wakeLock.current = null;
        }
    }, []);

    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'visible' && wakeLock.current === null && isLocked) {
                // Attempt to restore if it was supposed to be locked
                // But logic is cleaner if we just let consumer re-request.
                // For now simpler:
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            releaseWakeLock();
        }
    }, [releaseWakeLock, isLocked]);

    return { requestWakeLock, releaseWakeLock, isLocked };
}
