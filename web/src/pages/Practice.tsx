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

const KEY_TO_MOVE: Record<string, string> = {
  u: 'U', U: "U'",
  d: 'D', D: "D'",
  l: 'L', L: "L'",
  r: 'R', R: "R'",
  f: 'F', F: "F'",
  b: 'B', B: "B'",
  m: 'M', M: "M'",
  e: 'E', E: "E'",
  s: 'S', S: "S'",
  x: 'x', X: "x'",
  y: 'y', Y: "y'",
  z: 'z', Z: "z'",
};

export const segundos = (milis: number): string => {

  const seconds = Math.floor((milis / 1000) % 60);
  const milisecs = Math.floor(milis % 1000 / 10);
  const finalTime = `${seconds}.${milisecs}`;
  return finalTime;
}
export const puzzles = ['2x2x2', '3x3x3', '4x4x4', '5x5x5', '6x6x6', '7x7x7', 'square1', 'megaminx', 'clock', 'skewb', 'pyraminx'];

export function Practice() {
  const [puzzle, setPuzzle] = useState(puzzles[1]);

  const { refetch } = useScramble(`${puzzle}`);
  const [scramble, setScramble] = useState("");
  const postSolve = useSolveMutate();
  const { data: usuarioLogado } = useUsuarioLogado();
  const { data: solves } = useSolveDataUser(usuarioLogado?.id);
  const [seconds, setSeconds] = useState("00.00");
  const [isTutor, setIsTutor] = useState(false);
  const [isController, setIsController] = useState(false);
  const twistyRef = useRef<any>(null);
  const activeScrambleRef = useRef("");

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
      activeScrambleRef.current = scramble;

      if (isController && twistyRef.current) {
        twistyRef.current.alg = '';
      }

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
    if (!isController || !isRunning) return;

    const handleMoveKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.ctrlKey || e.altKey || e.metaKey) return;

      const move = KEY_TO_MOVE[e.key];
      if (!move) return;

      e.preventDefault();
      twistyRef.current?.experimentalAddMove(move, { cancel: true });
    };

    window.addEventListener("keydown", handleMoveKey);
    return () => window.removeEventListener("keydown", handleMoveKey);
  }, [isController, isRunning]);

  useEffect(() => {

    const keyHandlerUp = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;

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
    if (isController) {
      return (
        <div className="container">
          <p>{activeScrambleRef.current}</p>
          <div className="info-cube">
            <TwistyPlayer
              ref={twistyRef}
              puzzle={puzzle}
              control-panel='none'
              viewer-link='none'
              experimental-setup-alg={activeScrambleRef.current}
              background='none'
              visualization={dimension}
            ></TwistyPlayer>
            <h1
              className="practice-timer controller-timer"
              style={isRunning ? { color: 'green' } : { color: 'red' }}
            >
              {seconds}
            </h1>
          </div>
        </div>
      )
    }

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
          {!isTutor ?
            <TwistyPlayer
              puzzle={puzzle}
              control-panel='none'
              viewer-link='none'
              experimental-setup-alg={scramble}
              background='none'
              visualization={dimension}
            ></TwistyPlayer>
            :

            <TwistyPlayer
              puzzle={puzzle}
              control-panel='bottom-row'
              viewer-link='none'
              experimental-setup-alg=""
              alg={scramble}
              background='none'
              visualization={dimension}
            ></TwistyPlayer>
          }
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
          <div className="tutor-toggle-container">
            <div className="tutor-info">
              <span className="tutor-info-icon">i</span>

              <div className="tutor-tooltip">
                O modo tutor permite visualizar e acompanhar os movimentos
                do scramble antes da resolução.
              </div>

              <span className="tutor-toggle-label">Modo tutor</span>
            </div>

            <label className="tutor-switch">
              <input
                type="checkbox"
                checked={isTutor}
                onChange={(e) => setIsTutor(e.target.checked)}
              />

              <span className="tutor-slider"></span>
            </label>
          </div>
          <div className="tutor-toggle-container">
            <div className="tutor-info">
              <span className="tutor-info-icon">i</span>

              <div className="tutor-tooltip controller-tooltip">
                Resolva o cubo pelo teclado: cada letra gira a face no sentido
                horário, e Shift + letra gira no sentido anti-horário
                (U, R, F, D, L, B, M, E, S, x, y, z). Para giro duplo, pressione
                a mesma tecla duas vezes.
                <br /><br />
                Não conhece a notação? <a href="https://jperm.net/3x3/moves" target="_blank" rel="noreferrer">Veja o tutorial do J Perm</a>.
              </div>

              <span className="tutor-toggle-label">Modo controlador</span>
            </div>

            <label className="tutor-switch">
              <input
                type="checkbox"
                checked={isController}
                onChange={(e) => setIsController(e.target.checked)}
              />
              <span className="tutor-slider"></span>
            </label>
          </div>
          <div>
          </div>
        </div>
      </div>
    )
  }
}