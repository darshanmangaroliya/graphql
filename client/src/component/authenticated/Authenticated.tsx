import { Route, Routes } from 'react-router-dom'
import { useIsAuth } from '../../Hooks/useIsAuth'
import DashboardHome from './DashboardHome/DashboardHome'

const Authenticated = () => {
    useIsAuth()
  return (
    <div>
        <Routes>
            <Route path='/' element={<DashboardHome/>}/>
        </Routes>
    </div>
  )
}

export default Authenticated