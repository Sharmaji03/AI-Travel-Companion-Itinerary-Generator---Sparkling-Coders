import { useEffect, useMemo, useState } from 'react';
import DataList from '../components/DataList.jsx';
import ItemCard from '../components/ItemCard.jsx';
import { getAll, createItem, updateItem, deleteItem } from '../services/api.js';

export default function Restaurants() {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [formOpen, setFormOpen] = useState(false);
	const [editItem, setEditItem] = useState(null);

	async function load() {
		setLoading(true);
		setError(null);
		try {
			const data = await getAll('restaurants');
			setItems(Array.isArray(data) ? data : []);
		} catch (e) {
			setError(e?.error || 'Failed to load restaurants');
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
			await deleteItem('restaurants', id);
			await load();
		} catch (e) {
			alert(e?.error || 'Delete failed');
		}
	}

	return (
		<section className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="section-title">Restaurants</h2>
				<button className="btn btn-primary" onClick={() => { setEditItem(null); setFormOpen(true); }}>Add Restaurant</button>
			</div>
			{loading && <div className="text-gray-500">Loading...</div>}
			{error && <div className="text-red-600">{String(error)}</div>}
			{!loading && !error && (
				<DataList
					items={items}
					renderItem={(r) => (
						<ItemCard
							key={r.id}
							title={r.name}
							subtitle={r.address}
							meta={[`Rating: ${r.rating}`, `Price: ${r.price_range}`, `Source: ${r.source}`]}
							onEdit={() => startEdit(r)}
							onDelete={() => handleDelete(r.id)}
						/>
					)}
				/>
			)}

			{formOpen && (
				<RestaurantForm
					initial={editItem}
					onClose={() => setFormOpen(false)}
					onSaved={async () => { setFormOpen(false); await load(); }}
				/>
			)}
		</section>
	);
}

function RestaurantForm({ initial, onClose, onSaved }) {
	const [name, setName] = useState(initial?.name || '');
	const [rating, setRating] = useState(initial?.rating ?? '');
	const [priceRange, setPriceRange] = useState(initial?.price_range || '');
	const [address, setAddress] = useState(initial?.address || '');
	const [source, setSource] = useState(initial?.source || '');
	const [saving, setSaving] = useState(false);
	const [err, setErr] = useState(null);

	const isEdit = useMemo(() => Boolean(initial?.id), [initial]);

	async function onSubmit(e) {
		e.preventDefault();
		setSaving(true);
		setErr(null);
		try {
			const payload = { name, rating: Number(rating), price_range: priceRange, address, source };
			if (isEdit) {
				await updateItem('restaurants', initial.id, payload);
			} else {
				await createItem('restaurants', payload);
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
				<h3 className="text-lg font-semibold">{isEdit ? 'Edit' : 'Add'} Restaurant</h3>
				{err && <div className="text-red-600 text-sm">{String(err)}</div>}
				<div>
					<label className="label">Name</label>
					<input className="input" value={name} onChange={e => setName(e.target.value)} required />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label className="label">Rating</label>
						<input type="number" step="0.1" className="input" value={rating} onChange={e => setRating(e.target.value)} required />
					</div>
					<div>
						<label className="label">Price Range</label>
						<input className="input" value={priceRange} onChange={e => setPriceRange(e.target.value)} required />
					</div>
				</div>
				<div>
					<label className="label">Address</label>
					<input className="input" value={address} onChange={e => setAddress(e.target.value)} required />
				</div>
				<div>
					<label className="label">Source</label>
					<input className="input" value={source} onChange={e => setSource(e.target.value)} required />
				</div>
				<div className="flex items-center justify-end gap-2">
					<button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
					<button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
				</div>
			</form>
		</div>
	);
}


