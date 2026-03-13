import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Practice } from './pages/Practice'
import { Tsadajd } from './pages/Sla'

function App() {


  return (
    <>
    <Routes>
      <Route path='/practice' Component={Practice}/>
      <Route path='/sla' Component={Tsadajd}/>
    </Routes>
    </>
  )
}

export default App
