import { useEffect, useRef, useState } from 'react'
import './practice.css'
import { useScramble } from '../hooks/scramble/useScramble'
import { useSolveMutate } from '../hooks/solves/useSolveMutate'
import type { SolveRequest } from '../interface/SolveRequest'
import 'cubing/twisty';
import { useSolveDelete } from '../hooks/solves/useSolveDelete'
import Swal from 'sweetalert2'
import { useUsuarioLogado } from '../hooks/usuario/useUsuarioLogado'
import { useSolveDataUser } from '../hooks/solves/useSolveDataUser'
import { useNavigate } from 'react-router-dom'


export const segundos = (milis: number): string => {

  const seconds = Math.floor((milis / 1000) % 60);
  const milisecs = Math.floor(milis % 1000 / 10);
  const finalTime = `${seconds}.${milisecs}`;
  return finalTime;
}
export const puzzles = ['2x2x2', '3x3x3', '4x4x4', '5x5x5', '6x6x6', '7x7x7', 'square1', 'megaminx', 'clock', 'skewb', 'pyraminx', 'FM'];

export function Practice() {
  const [puzzle, setPuzzle] = useState(puzzles[1]);

  const { refetch } = useScramble(`${puzzle}`);
  const [scramble, setScramble] = useState("");
  const postSolve = useSolveMutate();
  const { data: usuarioLogado, isError } = useUsuarioLogado();
  const { data: solves } = useSolveDataUser(usuarioLogado?.id);
  const [seconds, setSeconds] = useState("00.00");

  useEffect(() => {
    if(isError) navigate("/auth/login")
  }, [isError])

  const navigate = useNavigate();

  useEffect(() => {
    gerarScramble();
  }, [puzzle])

  const submit = () => {
    const request: SolveRequest = {
      tempo: tempoCorrido.current,
      scramble,
      penalty,
      userId: usuarioLogado?.id
    }

    postSolve.mutate(request);
  }

  const gerarScramble = async () => {
    const response = await refetch();

    if (response.data) {
      setScramble(response.data.scramble);
    }
  }


  let penalty: any = null;
  let [isPronto, setIsPronto] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const startTime = useRef(0);
  const timer = useRef<number | null>(null);
  const tempoCorrido = useRef(0);

  function start() {
    if (!isRunning) {
      startTime.current = Date.now();
      timer.current = setInterval(Update, 16);
      gerarScramble();
      setIsRunning(true);
    }
    else {
      stop();
    }
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

  useEffect(() => {

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

    const handleTouchEnter = (e: TouchEvent) => {
      console.log(e);
      
      handleStart();
    }

    const handleTouchEnd = (e: TouchEvent) => {
      console.log(e);
      handleEnd();
    }

    window.addEventListener("keydown", keyHandlerDown);
    window.addEventListener("keyup", keyHandlerUp);
    window.addEventListener("touchstart", handleTouchEnter);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("keydown", keyHandlerDown);
      window.removeEventListener("keyup", keyHandlerUp);
      window.removeEventListener("touchstart", handleTouchEnter);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isPronto, isRunning])



  function stop() {
    submit();
    if (timer.current) clearInterval(timer.current);
    setIsRunning(false);
    setIsPronto(false);
  }

  function Update() {
    const currentTime = Date.now();
    tempoCorrido.current = currentTime - startTime.current;

    const seconds = Math.floor((tempoCorrido.current / 1000) % 60);
    const milis = Math.floor(tempoCorrido.current % 1000 / 10);
    setSeconds(`${seconds}.${milis}`);

  }


  const TwistyPlayer = 'twisty-player' as any;

  const mudarPuzzle = (puzzle: string) => {
    setPuzzle(puzzle);
  }

  const solveDelete = useSolveDelete();

  const deletarSolve = (id: number) => {
    solveDelete.mutate(id);
    setSeconds(prev => prev)
  }

  const [dimension, setDimension] = useState("3D");

  console.log(Array.isArray(solves?.data));
  console.log(solves?.data);

  if (isPronto) {
    return (
      <div className="container">
        <div>
          <h1 className='practice-timer' style={isRunning ? { color: 'green' } : { color: 'red' }} >{seconds}</h1>
        </div>
      </div>
    )
  } else {


    return (
      <div className='container'>
        <p>{scramble}</p>
        <div className='info-cube'>
          <TwistyPlayer
            puzzle={puzzle}
            control-panel='none'
            viewer-link='none'
            experimental-setup-alg={scramble}
            background='none'
            visualization={dimension}
          ></TwistyPlayer>
          <h1 className='practice-timer'>{seconds}</h1>
        </div>
        <div className='sidebar'>

          <label title='select the puzzle'>
            <p>Selecione o puzzle</p>
            <select className='pipipopo' name='super' value={puzzle} onChange={(e) => { mudarPuzzle(e.target.value) }}>
              {puzzles.map(puzzle => (
                <option key={puzzle} value={puzzle}>{puzzle}</option>
              ))}
            </select>
          </label>
          <label htmlFor="" title='selecione como o cubo aparecerá'>
            <p>Formato cubo</p>
            <select name="cubeShow" id="3dor2d" onChange={e => setDimension(e.target.value)} value={dimension}>
              <option value="3D">3D</option>
              <option value="2D">2D</option>
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
                {solves?.data?.slice().reverse().map((solve, index) => (
                  <tr key={solve.id}>
                    <td>{solves.data.length - index}</td>
                    <td onClick={() => Swal.fire({
                      draggable: true,
                      title: `Deletar solve ${solves.data.length - index}?`,
                      text: "Essa solve será deletada!",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonText: "Sim",
                      cancelButtonText: "Cancelar"
                    }).then((result) => {
                      if (result.isConfirmed) deletarSolve(solve.id);
                    })}>{segundos(solve.tempo)}</td>
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