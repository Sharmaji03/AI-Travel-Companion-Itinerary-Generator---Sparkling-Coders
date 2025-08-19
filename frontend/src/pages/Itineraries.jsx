import { useEffect, useMemo, useState } from 'react';
import DataList from '../components/DataList.jsx';
import ItemCard from '../components/ItemCard.jsx';
import { getAll, createItem, updateItem, deleteItem } from '../services/api.js';

export default function Itineraries() {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [formOpen, setFormOpen] = useState(false);
	const [editItem, setEditItem] = useState(null);

	async function load() {
		setLoading(true);
		setError(null);
		try {
			const data = await getAll('itinerary');
			setItems(Array.isArray(data) ? data : []);
		} catch (e) {
			setError(e?.error || 'Failed to load itineraries');
			setItems([]);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		load();
	}, []);

	function startEdit(item) {
		setEditItem(item);
		setFormOpen(true);
	}

	async function handleDelete(id) {
		try {
			await deleteItem('itinerary', id);
			await load();
		} catch (e) {
			alert(e?.error || 'Delete failed');
		}
	}

	return (
		<section className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="section-title">Itineraries</h2>
				<button className="btn btn-primary" onClick={() => { setEditItem(null); setFormOpen(true); }}>Create Itinerary</button>
			</div>
			{loading && <div className="text-gray-500">Loading...</div>}
			{error && <div className="text-red-600">{String(error)}</div>}
			{!loading && !error && (
				<DataList
					items={items}
					renderItem={(t) => (
						<ItemCard
							key={t.trip_id}
							title={`${t.destination} (${t.start_date} → ${t.end_date})`}
							subtitle={t.transport_mode ? `Mode: ${t.transport_mode}` : null}
							meta={[`Budget: ${t.budget ?? 'N/A'}`, `Food: ${t.food_choice ?? 'N/A'}`]}
							onEdit={() => startEdit(t)}
							onDelete={() => handleDelete(t.trip_id)}
						>
							<div className="text-sm text-gray-600">
								{Array.isArray(t.itinerary) && t.itinerary.length > 0 ? (
									<ul className="list-disc list-inside">
										{t.itinerary[0].activities?.map((a, idx) => (
											<li key={idx}>{a.name} — {a.type} — ${a.price}</li>
										))}
									</ul>
								) : 'No activities'}
							</div>
						</ItemCard>
					)}
				/>
			)}

			{formOpen && (
				<ItineraryForm
					initial={editItem}
					onClose={() => setFormOpen(false)}
					onSaved={async () => { setFormOpen(false); await load(); }}
				/>
			)}
		</section>
	);
}

function ItineraryForm({ initial, onClose, onSaved }) {
	const [destination, setDestination] = useState(initial?.destination || '');
	const [startDate, setStartDate] = useState(initial?.start_date || '');
	const [endDate, setEndDate] = useState(initial?.end_date || '');
	const [budget, setBudget] = useState(initial?.budget ?? '');
	const [foodChoice, setFoodChoice] = useState(initial?.food_choice || '');
	const [transportMode, setTransportMode] = useState(initial?.transport_mode || '');
	const [saving, setSaving] = useState(false);
	const [err, setErr] = useState(null);

	const isEdit = useMemo(() => Boolean(initial?.trip_id), [initial]);

	async function onSubmit(e) {
		e.preventDefault();
		setSaving(true);
		setErr(null);
		try {
			const payload = {
				start_date: startDate,
				end_date: endDate,
				destination,
				budget: budget === '' ? undefined : Number(budget),
				food_choice: foodChoice || undefined,
				transport_mode: transportMode || undefined,
			};
			if (isEdit) {
				await updateItem('itinerary', initial.trip_id, payload);
			} else {
				await createItem('itinerary', payload);
			}
			onSaved();
		} catch (e2) {
			setErr(e2?.error || 'Save failed');
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
			<form onSubmit={onSubmit} className="card w-full max-w-lg p-5 space-y-4 bg-white">
				<h3 className="text-lg font-semibold">{isEdit ? 'Edit' : 'Create'} Itinerary</h3>
				{err && <div className="text-red-600 text-sm">{String(err)}</div>}
				<div>
					<label className="label">Destination</label>
					<input className="input" value={destination} onChange={e => setDestination(e.target.value)} required />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label className="label">Start Date</label>
						<input type="date" className="input" value={startDate} onChange={e => setStartDate(e.target.value)} required />
					</div>
					<div>
						<label className="label">End Date</label>
						<input type="date" className="input" value={endDate} onChange={e => setEndDate(e.target.value)} required />
					</div>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
					<div>
						<label className="label">Budget (optional)</label>
						<input type="number" className="input" value={budget} onChange={e => setBudget(e.target.value)} />
					</div>
					<div>
						<label className="label">Food Choice</label>
						<input className="input" value={foodChoice} onChange={e => setFoodChoice(e.target.value)} />
					</div>
					<div>
						<label className="label">Transport Mode</label>
						<input className="input" value={transportMode} onChange={e => setTransportMode(e.target.value)} />
					</div>
				</div>
				<div className="flex items-center justify-end gap-2">
					<button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
					<button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
				</div>
			</form>
		</div>
	);
}


