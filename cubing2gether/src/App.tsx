import React, { useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { TwistyPlayer } from 'cubing/twisty'
import { randomScrambleForEvent } from 'cubing/scramble'
import { useScramble } from './hooks/useScramble'
import { useSolveMutate } from './hooks/solves/useSolveMutate'
import type { SolveRequest } from './interface/SolveRequest'
import { useSolveData } from './hooks/solves/useSolveData'

function App() {
  const TwistyPlayer = "twisty-player" as any;

  const puzzle = '2x2x2';

  const [scramble, setScramble] = useState("");
  const [moves, setMoves] = useState('');
  const {refetch} = useScramble(`${puzzle}`);
  const postSolve = useSolveMutate();
  const {data : solves} = useSolveData();

  const submit = () => {
    const request : SolveRequest = {
        tempo: tempoCorrido.current,
        scramble,
        penalty,
        userId
    }
    console.log(request);
    
    postSolve.mutate(request);
  }

  const gerarScramble = async () => {
    const response = await refetch();

    if(response.data) {
      setScramble(response.data);
    }
  }

  const userId = "9795c371-fbe2-406c-b4d5-053d67c49e04";

  const resolver = () => {
    setScramble("");
    setMoves("");
  }

  let penalty : any = null;
  let [isRunning, setIsRunning] = useState(false);
  let startTime = useRef(0);
  let timer = useRef<number | null>(null);
  let tempoCorrido = useRef(0);

  function start() {
    if(!isRunning) {
        startTime.current = Date.now();
        timer.current = setInterval(Update, 5);
        setIsRunning(true);
    }
    else {
      stop();
    }
  }

  console.log(solves);
  

  function stop() {
    submit();
    if(timer.current) clearInterval(timer.current);
    gerarScramble();
    setIsRunning(false);
  }

  function Update() {
    const currentTime = Date.now();
    tempoCorrido.current = currentTime - startTime.current;

    const seconds = Math.floor((tempoCorrido.current / 1000) % 60);
    const milis = Math.floor(tempoCorrido.current % 1000 / 10);
    console.log(seconds);
    console.log(milis);
    
    const timer = document.getElementById('timer');
    if(timer) timer.textContent = `${seconds}:${milis}`
  }

  const segundos = (milis : number): string => {
    
    const seconds = Math.floor((milis / 1000) % 60);
    const milisecs = Math.floor(milis % 1000 / 10);
    return `${seconds}.${milisecs}`
  }


  return (
    <>
    <button onClick={resolver}>Resolver</button>
        <p>{scramble}</p>
      <div>
        <TwistyPlayer
        puzzle={puzzle}
        alg={`${scramble} ${moves}`}
        control-panel='none'
        background='none'
        ></TwistyPlayer>
        <button onClick={gerarScramble}>Gerar embaralhamento</button>
        <input onChange={(e) => setMoves(e.target.value)} placeholder='Resolva!' type="text" name="" id="" />
        <div>
          <button onClick={start}>comacarTimer</button>
          <h3 id='timer'>00:00</h3>
        </div>
        <div>
          <table>
            <thead>
            <tr>
              <td>solve</td>
              <td>tempo</td>
            </tr>
            </thead>
            <tbody>
            {solves?.data.map((solve) => (
              <tr key={solve.id}>
                <td>{solve.id}</td>
                <td>{segundos(solve.tempo)}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default App
