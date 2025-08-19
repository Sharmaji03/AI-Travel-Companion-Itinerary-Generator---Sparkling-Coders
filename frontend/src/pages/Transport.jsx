import { useEffect, useMemo, useState } from 'react';
import DataList from '../components/DataList.jsx';
import ItemCard from '../components/ItemCard.jsx';
import { getAll, createItem, updateItem, deleteItem } from '../services/api.js';

export default function Transport() {
	const [items, setItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [formOpen, setFormOpen] = useState(false);
	const [editItem, setEditItem] = useState(null);

	async function load() {
		setLoading(true);
		setError(null);
		try {
			const data = await getAll('transport');
			setItems(Array.isArray(data) ? data : []);
		} catch (e) {
			setError(e?.error || 'Failed to load transport');
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
			await deleteItem('transport', id);
			await load();
		} catch (e) {
			alert(e?.error || 'Delete failed');
		}
	}

	return (
		<section className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="section-title">Transport</h2>
				<button className="btn btn-primary" onClick={() => { setEditItem(null); setFormOpen(true); }}>Add Transport</button>
			</div>
			{loading && <div className="text-gray-500">Loading...</div>}
			{error && <div className="text-red-600">{String(error)}</div>}
			{!loading && !error && (
				<DataList
					items={items}
					renderItem={(t) => (
						<ItemCard
							key={t.id}
							title={`${t.name} (${t.type})`}
							subtitle={t.availability ? 'Available' : 'Unavailable'}
							meta={[`Price: ${t.price}`]}
							onEdit={() => startEdit(t)}
							onDelete={() => handleDelete(t.id)}
						/>
					)}
				/>
			)}

			{formOpen && (
				<TransportForm
					initial={editItem}
					onClose={() => setFormOpen(false)}
					onSaved={async () => { setFormOpen(false); await load(); }}
				/>
			)}
		</section>
	);
}

function TransportForm({ initial, onClose, onSaved }) {
	const [type, setType] = useState(initial?.type || 'taxi');
	const [name, setName] = useState(initial?.name || '');
	const [price, setPrice] = useState(initial?.price ?? '');
	const [availability, setAvailability] = useState(Boolean(initial?.availability));
	const [saving, setSaving] = useState(false);
	const [err, setErr] = useState(null);

	const isEdit = useMemo(() => Boolean(initial?.id), [initial]);

	async function onSubmit(e) {
		e.preventDefault();
		setSaving(true);
		setErr(null);
		try {
			const payload = { type, name, price: Number(price), availability: Boolean(availability) };
			if (isEdit) {
				await updateItem('transport', initial.id, payload);
			} else {
				await createItem('transport', payload);
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
				<h3 className="text-lg font-semibold">{isEdit ? 'Edit' : 'Add'} Transport</h3>
				{err && <div className="text-red-600 text-sm">{String(err)}</div>}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label className="label">Type</label>
						<select className="input" value={type} onChange={e => setType(e.target.value)}>
							<option value="taxi">Taxi</option>
							<option value="rental">Rental</option>
							<option value="public">Public</option>
						</select>
					</div>
					<div>
						<label className="label">Name</label>
						<input className="input" value={name} onChange={e => setName(e.target.value)} required />
					</div>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label className="label">Price</label>
						<input type="number" className="input" value={price} onChange={e => setPrice(e.target.value)} required />
					</div>
					<div className="flex items-center gap-2 mt-6">
						<input id="availability" type="checkbox" className="h-4 w-4" checked={availability} onChange={e => setAvailability(e.target.checked)} />
						<label htmlFor="availability" className="text-sm">Available</label>
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


