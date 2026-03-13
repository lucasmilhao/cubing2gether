import { useEffect, useRef, useState } from 'react'
import './practice.css'
import { useScramble } from '../hooks/useScramble'
import { useSolveMutate } from '../hooks/solves/useSolveMutate'
import type { SolveRequest } from '../interface/SolveRequest'
import { useSolveData } from '../hooks/solves/useSolveData'
import 'cubing/twisty';
import { useSolveDelete } from '../hooks/solves/useSolveDelete'



export function Practice() {
  
  
  const puzzles = ['2x2x2', '3x3x3', '4x4x4', '5x5x5', '6x6x6', '7x7x7', 'square1', 'megaminx', 'clock', 'skewb', 'pyraminx', 'FM'];
  const [puzzle, setPuzzle] = useState(puzzles[1]);
  
  const {refetch} = useScramble(`${puzzle}`);
  const [scramble, setScramble] = useState("");
  const postSolve = useSolveMutate();
  const {data : solves} = useSolveData();
  const [seconds, setSeconds] = useState("00.00")
  
  useEffect(() => {

    gerarScramble();
  }, [puzzle])
  
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

  const userId = "25613626-dfa4-454d-9be5-94ac531f2e17";


  let penalty : any = null;
  let [isPronto, setIsPronto] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const startTime = useRef(0);
  const timer = useRef<number | null>(null);
  const tempoCorrido = useRef(0);

  function start() {
    if(!isRunning) {
      startTime.current = Date.now();
        timer.current = setInterval(Update, 16);
        setIsRunning(true);
    }
    else {
      stop();
    }
  }

  useEffect(() => {

    const keyHandlerUp = (e: KeyboardEvent) => {
      if(e.code !== "Space") return;

      e.preventDefault();

      
      if(isPronto) {
        start();
      }
    };
      
    const keyHandlerDown = (e: KeyboardEvent) => {
      if(e.code !== "Space") return;
        if(isRunning) {
          stop();
        } else {
          setIsPronto(true);
        }
        
      e.preventDefault();

    };
    window.addEventListener("keydown", keyHandlerDown);
    window.addEventListener("keyup", keyHandlerUp);

  return () => {
    window.removeEventListener("keydown", keyHandlerDown);
    window.removeEventListener("keyup", keyHandlerUp);
  };
}, [isPronto, isRunning])



function stop() {
  submit();
    if(timer.current) clearInterval(timer.current);
    gerarScramble();
    setIsRunning(false);
    setIsPronto(false);
  }

  function Update() {
    const currentTime = Date.now();
    tempoCorrido.current = currentTime - startTime.current;

    const seconds = Math.floor((tempoCorrido.current / 1000) % 60);
    const milis = Math.floor(tempoCorrido.current % 1000 / 10);
    console.log(seconds);
    console.log(milis);
    setSeconds(`${seconds}.${milis}`); 
    
  }

  const segundos = (milis : number) : string => {
    
    const seconds = Math.floor((milis / 1000) % 60);
    const milisecs = Math.floor(milis % 1000 / 10);
    const finalTime = `${seconds}.${milisecs}`;
    return finalTime;
  }

  const TwistyPlayer = 'twisty-player' as any;

  const mudarPuzzle = (puzzle : string) => {
    setPuzzle(puzzle);
  }

  const solveDelete = useSolveDelete();

  const deletarSolve = (id : number) => {
    solveDelete.mutate(id);
  }

  if(isPronto) {
    return (
      <div className="container">
      <div>
          <h1 className='timer' style={isRunning ? {color:'green'} : {color:'red'}} >{seconds}</h1>
        </div>
      </div>
        )
      }else{
        
    
    return (
      <div className='container'>
        <p>{scramble}</p>
        <div>
        <TwistyPlayer
        puzzle={puzzle}
        alg={`${scramble}`}
        control-panel='none'
        background='none'
        visualization='3D'
        ></TwistyPlayer>
          <h1 className='timer'>{seconds}</h1>
        </div>
      <div className='sidebar'>
        
    <label title='select the puzzle'>
       <select value={puzzle} onChange={(e) => {mudarPuzzle(e.target.value)}}>
        {puzzles.map(puzzle => (
          <option key={puzzle} value={puzzle}>{puzzle}</option>
        ))}
       </select>
    </label>
        <div className="solves">

          <table>
            <thead>
            <tr>
              <td>solve</td>
              <td>tempo</td>
            </tr>
            </thead>
            <tbody>
            {solves?.data.map((solve) => (
              <tr  key={solve.id}>
                <td>{solve.id}</td>
                <td onClick={() => deletarSolve(solve.id)}>{segundos(solve.tempo)}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
          <div>
        </div>
      </div>
    </div>
  )
  }
}