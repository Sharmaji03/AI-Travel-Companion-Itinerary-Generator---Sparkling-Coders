import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import Restaurants from './pages/Restaurants.jsx';
import Hotels from './pages/Hotels.jsx';
import Transport from './pages/Transport.jsx';
import Itineraries from './pages/Itineraries.jsx';

export default function App() {
	return (
		<div className="min-h-screen flex flex-col">
			<NavBar />
			<main className="flex-1 container-max py-6">
				<Routes>
					<Route path="/" element={<Navigate to="/restaurants" replace />} />
					<Route path="/restaurants" element={<Restaurants />} />
					<Route path="/hotels" element={<Hotels />} />
					<Route path="/transport" element={<Transport />} />
					<Route path="/itineraries" element={<Itineraries />} />
					<Route path="*" element={<Navigate to="/restaurants" replace />} />
				</Routes>
			</main>
		</div>
	);
}


