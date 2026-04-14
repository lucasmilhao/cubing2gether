import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Practice } from './pages/Practice'
import { Login } from './pages/auth/login/Login'
import { Register } from './pages/auth/register/Register'
import { Usuario } from './pages/user/Usuario'

function App() {


  return (
    <>
    <Routes>
      <Route path='/user/:idUsuario' Component={Usuario}></Route>
      <Route path='/practice' Component={Practice}/>
      <Route path='/auth/login' Component={Login}/>
      <Route path='/auth/register' Component={Register}/>
    </Routes>
    </>
  )
}

export default App
