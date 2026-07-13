import { useRef, useState } from "react";

let penalty: any = null;
let [isPronto, setIsPronto] = useState(false);
const [isRunning, setIsRunning] = useState(false);
const startTime = useRef(0);
const timer = useRef<number | null>(null);
const tempoCorrido = useRef(0);
const [seconds, setSeconds] = useState("00.00");

function Update() {
    const currentTime = Date.now();
    tempoCorrido.current = currentTime - startTime.current;

    const seconds = Math.floor((tempoCorrido.current / 1000) % 60);
    const milis = Math.floor(tempoCorrido.current % 1000 / 10);
    setSeconds(`${seconds}.${milis}`);
}

export function start() {
    if (!isRunning) {
        startTime.current = Date.now();
        timer.current = setInterval(Update, 16);
        setIsRunning(true);
    }
    else {
        stop();
    }
}


function stop(submit : void) {
    submit;
    if (timer.current) clearInterval(timer.current);
    setIsRunning(false);
    setIsPronto(false);
}


const handleStart = () => {
    if (isRunning) {
        stop();
    } else {
        setIsPronto(true);
    }
}

const handleEnd = () => {
    if (isPronto) {
        start();
    }
}

const keyHandlerUp = (e: KeyboardEvent) => {
    if (e.code !== "Space" && !isRunning) return;

    e.preventDefault();

    handleEnd();
};

const keyHandlerDown = (e: KeyboardEvent) => {
    if (e.code !== "Space") return;
    e.preventDefault();

    handleStart();

};