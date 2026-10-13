import { Navigate, Route, Routes } from 'react-router-dom'
import TripsPage from './pages/TripsPage'
import TripDetailsPage from './pages/TripDetailsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<TripsPage />} />
      <Route path="/trips/:tripId" element={<TripDetailsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App