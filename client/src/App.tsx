

import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './component/Home/Home'
import Register from './component/auth/Register'
import Navbar from './component/Navbar'
import Login from './component/auth/Login'
import Authenticated from './component/authenticated/Authenticated'
import ForgotPassword from './component/auth/forgotpass'
import ChangePassword from './component/auth/ChangePassword'


function App() {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
        <Route path='/register' element={<Register/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/forgot-password' element={<ForgotPassword/>}/>
        <Route path='/change-password/:token' element={<ChangePassword/>}/>
        <Route path='/dashboard' element={<Authenticated/>}/>
        <Route path='/' element={<Home/>}/>
      </Routes>
    </div>
  )
}

export default App
