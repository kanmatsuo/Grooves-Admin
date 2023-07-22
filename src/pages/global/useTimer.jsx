import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export default function useTimer(deadline, interval = SECOND) {

    const [timespan, setTimespan] = useState(new Date(deadline) - Date.now());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimespan((_timespan) => _timespan - interval);
        }, interval);

        return () => {
            clearInterval(intervalId);
        };
    }, [interval]);

    /* If the initial deadline value changes */
    useEffect(() => {
        setTimespan(new Date(deadline) - Date.now());
    }, [deadline]);

    return {
        days: Math.floor(timespan / DAY),
        hours: Math.floor((timespan / HOUR) % 24) < 10 ? `0${Math.floor((timespan / HOUR) % 24)}` : Math.floor((timespan / HOUR) % 24),
        minutes: Math.floor((timespan / MINUTE) % 60) < 10 ? `0${Math.floor((timespan / MINUTE) % 60)}` : Math.floor((timespan / MINUTE) % 60),
        seconds: Math.floor((timespan / SECOND) % 60) < 10 ? `0${Math.floor((timespan / SECOND) % 60)}` : Math.floor((timespan / SECOND) % 60),
        isend: timespan < 0
    };
}