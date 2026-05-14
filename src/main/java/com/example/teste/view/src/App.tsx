import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Practice } from './pages/Practice'
import { Login } from './pages/auth/login/Login'
import { Register } from './pages/auth/register/Register'
import { Usuario } from './pages/user/Usuario'
import { Amigos } from './pages/amigos/Amigos'
import { Conversa } from './pages/chat/Conversa'
import { Sobre } from './pages/sobre/Sobre'
import Video from './pages/video/Video'

function App() {


  return (
    <>
    <Routes>
      <Route path='/user/:idUsuario' Component={Usuario}></Route>
      <Route path='/practice' Component={Practice}/>
      <Route path='/auth/login' Component={Login}/>
      <Route path='/auth/register' Component={Register}/>
      <Route path='/amigos' Component={Amigos}/>
      <Route path='/chat/:idConversa' Component={Conversa}/>
      <Route path='/sobre' Component={Sobre}/>
      <Route path='/video/:roomId' Component={Video}/>
    </Routes>
    </>
  )
}

export default App
