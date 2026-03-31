import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Practice } from './pages/Practice'
import { Login } from './pages/auth/login/Login'
import { Register } from './pages/auth/register/Register'

function App() {


  return (
    <>
    <Routes>
      <Route path='/practice' Component={Practice}/>
      <Route path='/auth/login' Component={Login}/>
      <Route path='/auth/register' Component={Register}/>
    </Routes>
    </>
  )
}

export default App
