import { useEffect, useRef, useState } from 'react'
import './practice.css'
import { useScramble } from '../hooks/useScramble'
import { useSolveMutate } from '../hooks/solves/useSolveMutate'
import type { SolveRequest } from '../interface/SolveRequest'
import 'cubing/twisty';
import { useSolveDelete } from '../hooks/solves/useSolveDelete'
import Swal from 'sweetalert2'
import { useUsuarioLogado } from '../hooks/usuario/useUsuarioLogado'
import { useSolveDataUser } from '../hooks/solves/useSolveDataUser'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext';


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
  const { theme, toggleTheme } = useTheme();

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
        <div className="user-profile-practice" onClick={() => navigate(`/user/${usuarioLogado?.id}`)}>
          <img src={usuarioLogado?.picture} alt="" />
          <h1>{usuarioLogado?.nome}</h1>
        </div>
        <button className="theme-toggle" onClick={toggleTheme} title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}>
          {theme === 'light' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
            </svg>
          )}
        </button>
      </div>
    )
  }
}