import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import FlightList from '@/pages/FlightList'
import MapView from '@/pages/MapView'
import Booking from '@/pages/Booking'
import Confirmation from '@/pages/Confirmation'
import RoleSelect from '@/pages/RoleSelect'
import BuyerProducts from '@/pages/BuyerProducts'
import BuyerConfirm from '@/pages/BuyerConfirm'

function Layout() {
  const { pathname } = useLocation()
  const showBottomNav = pathname !== '/' && !pathname.startsWith('/buyer')

  return (
    <div className="relative max-w-lg mx-auto min-h-screen bg-white shadow-xl">
      <Routes>
        <Route path="/" element={<RoleSelect />} />
        <Route path="/flights" element={<FlightList />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/confirm" element={<Confirmation />} />
        <Route path="/buyer/products" element={<BuyerProducts />} />
        <Route path="/buyer/confirm" element={<BuyerConfirm />} />
      </Routes>
      {showBottomNav && <BottomNav />}
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Layout />
    </HashRouter>
  )
}
