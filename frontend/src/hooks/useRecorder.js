import { useState, useRef, useEffect, useCallback } from 'react';

export const useRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isStopped, setIsStopped] = useState(false);
    const [duration, setDuration] = useState(0);
    const [recordings, setRecordings] = useState([]);
    const intervalRef = useRef(null);
    const startTimeRef = useRef(null);
    const pausedDurationRef = useRef(0);

    const startTimer = useCallback(() => {
        startTimeRef.current = Date.now() - pausedDurationRef.current * 1000;
        intervalRef.current = setInterval(() => {
            const elapsed = (Date.now() - startTimeRef.current) / 1000;
            setDuration(elapsed);
        }, 100);
    }, []);

    const stopTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const start = useCallback(() => {
        setIsRecording(true);
        setIsPaused(false);
        setIsStopped(false);
        setDuration(0);
        pausedDurationRef.current = 0;
        startTimer();
    }, [startTimer]);

    const pause = useCallback(() => {
        setIsPaused(true);
        pausedDurationRef.current = duration;
        stopTimer();
    }, [duration, stopTimer]);

    const resume = useCallback(() => {
        setIsPaused(false);
        startTimer();
    }, [startTimer]);

    const stop = useCallback(() => {
        setIsRecording(false);
        setIsPaused(false);
        setIsStopped(true);
        stopTimer();
        const finalDuration = duration;
        const newRecording = {
            id: Date.now(),
            duration: finalDuration,
            timestamp: new Date().toLocaleTimeString(),
        };
        setRecordings(prev => [...prev, newRecording]);
        return newRecording;
    }, [duration, stopTimer]);

    const deleteRecording = useCallback((id) => {
        setRecordings(prev => prev.filter(r => r.id !== id));
    }, []);

    useEffect(() => {
        return () => stopTimer();
    }, [stopTimer]);

    return {
        isRecording,
        isPaused,
        isStopped,
        duration,
        recordings,
        start,
        pause,
        resume,
        stop,
        deleteRecording,
    };
};

export const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    const ms = Math.floor((seconds % 1) * 10);
    return `${m}:${s}.${ms}`;
};
