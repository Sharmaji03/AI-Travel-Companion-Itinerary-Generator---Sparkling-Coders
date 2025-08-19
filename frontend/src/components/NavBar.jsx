import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const tabs = [
	{ to: '/restaurants', label: 'Restaurants' },
	{ to: '/hotels', label: 'Hotels' },
	{ to: '/transport', label: 'Transport' },
	{ to: '/itineraries', label: 'Itineraries' },
];

export default function NavBar() {
	const [open, setOpen] = useState(false);
	return (
		<header className="bg-white border-b border-gray-200">
			<div className="container-max py-4 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white font-bold">AI</span>
					<span className="text-lg font-semibold">Travel Companion</span>
				</div>
				<nav className="hidden md:flex items-center gap-1">
					{tabs.map(t => (
						<NavLink
							key={t.to}
							to={t.to}
							className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}
						>
							{t.label}
						</NavLink>
					))}
				</nav>
				<button className="md:hidden btn btn-secondary" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">Menu</button>
			</div>
			{open && (
				<nav className="md:hidden border-t border-gray-200 bg-white">
					<div className="container-max py-3 flex flex-col gap-2">
						{tabs.map(t => (
							<NavLink key={t.to} to={t.to} className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`} onClick={() => setOpen(false)}>
								{t.label}
							</NavLink>
						))}
					</div>
				</nav>
			)}
		</header>
	);
}


