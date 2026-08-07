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
import { Followers } from './pages/amigos/Followers'
import { Following } from './pages/amigos/Following'
import { PostModal } from './components/postagem/PostModal'
import Home from './pages/home/Home'
import MainLayout from './pages/MainLayout'

function App() {


  return (
    <>
      <Routes>
        <Route Component={MainLayout}>
          <Route path='/user/:idUsuario' Component={Usuario} />
          <Route path='/followers/:idUsuario' Component={Followers} />
          <Route path='/following/:idUsuario' Component={Following} />
          <Route path='/practice' Component={Practice} />
          <Route path='/' Component={Home} />
          <Route path='/amigos' Component={Amigos} />
          <Route path='/sobre' Component={Sobre} />
        </Route>
        <Route path='/chat/:idConversa' Component={Conversa} />
        <Route path='/video/:roomId' Component={Video} />
        <Route path='/auth/login' Component={Login} />
        <Route path='/auth/register' Component={Register} />
      </Routes>
    </>
  )
}

export default App
