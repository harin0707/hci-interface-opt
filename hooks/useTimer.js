import { useState, useEffect } from "react";

    export const useTimer = () => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    useEffect(() => {
        let timer;
        if (isTimerRunning) {
        timer = setInterval(() => {
            setElapsedTime((prev) => prev + 1);
        }, 1000);
        }
        return () => clearInterval(timer);
    }, [isTimerRunning]);

    const startTimer = () => {
        setIsTimerRunning(true);
        setElapsedTime(0);
    };

    const stopTimer = () => {
        setIsTimerRunning(false);
    };

    return { elapsedTime, isTimerRunning, startTimer, stopTimer };
};
