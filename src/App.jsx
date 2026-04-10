import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import BottomNav from '@/components/BottomNav'
import FlightList from '@/pages/FlightList'
import MapView from '@/pages/MapView'
import Booking from '@/pages/Booking'
import Confirmation from '@/pages/Confirmation'

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative max-w-lg mx-auto min-h-screen bg-white shadow-xl">
        <Routes>
          <Route path="/" element={<Navigate to="/flights" replace />} />
          <Route path="/flights" element={<FlightList />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/confirm" element={<Confirmation />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
