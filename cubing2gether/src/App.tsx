import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Practice } from './pages/Practice'

function App() {


  return (
    <>
    <Routes>
      <Route path='/practice' Component={Practice}/>
    </Routes>
    </>
  )
}

export default App
