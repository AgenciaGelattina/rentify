/** 1.0.0 | www.phoxer.com */
import { useCallback, useEffect, useRef, useState } from "react";
import { format, intervalToDuration, Duration, isFuture, isValid } from 'date-fns';
import { es } from 'date-fns/locale';
import { isNil, isNotNil } from "ramda";


export interface ICountDownData {
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalTime: number;
};

const countDownDataDefault: ICountDownData = {
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalTime: 0
};

interface IUseDateCountDown {
    countDownData: ICountDownData;
    startCountDown: (date?: Date | string) => void;
    stopCountDown: () => void;
};

const useDateCountDown = (date: Date | string, timeZone?: string): IUseDateCountDown => {
    const idCountDown = useRef<number | undefined>(undefined);
    const [dateToProcess, setDateToProcess] = useState<Date | null>(null);
    const [countDownData, setCountDownData] = useState<ICountDownData>(countDownDataDefault);

    const processDateToCountDown  = () => {
        if (isNotNil(dateToProcess)) {
            if (isFuture(dateToProcess)) {  
                intervalToDuration({
                    start: dateToProcess,
                    end: new Date()
                });
            }
        }
    };

    const startCountDown = (date?: Date | string) => {
        if(isNotNil(date) && isValid(date)) {
            setDateToProcess(typeof(date) === 'string' ? new Date(date) : date);
        };
        if (isNil(idCountDown.current)) {
            idCountDown.current = window.setInterval(() => {
                processDateToCountDown();
            }, 1000);
        }
    }

    const stopCountDown = () => {
        clearTimeout(idCountDown.current);
        idCountDown.current = undefined;
    };

    useEffect(() => {
        if (isNotNil(date) && isValid(date)) {
            startCountDown();
            return () => {
                stopCountDown();
            }
        }
    }, [dateToProcess]);

    return { countDownData, startCountDown, stopCountDown };
}

export default useDateCountDown;