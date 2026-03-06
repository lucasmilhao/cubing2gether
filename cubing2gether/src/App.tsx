import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { TwistyPlayer } from 'cubing/twisty'
import { randomScrambleForEvent } from 'cubing/scramble'

function App() {
  const TwistyPlayer = "twisty-player" as any;

  const [scramble, setScramble] = useState("");
  const [moves, setMoves] = useState('');

  const gerarScramble = async () => {
    const response = await randomScrambleForEvent("333");

    setScramble(response.toString());
  }

  const resolver = () => {
    setScramble("");
    setMoves("");
  }

  return (
    <>
    <button onClick={resolver}>Resolver</button>
        <p>{scramble}</p>
      <div>
        <TwistyPlayer
        puzzle='3x3x3'
        alg={`${scramble} ${moves}`}
        control-panel='none'
        ></TwistyPlayer>
        <button onClick={gerarScramble}>Gerar embaralhamento</button>
        <input onChange={(e) => setMoves(e.target.value)} placeholder='Resolva!' type="text" name="" id="" />
      </div>
    </>
  )
}

export default App
