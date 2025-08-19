export default function ItemCard({ title, subtitle, meta, children, onEdit, onDelete }) {
	return (
		<div className="card p-4 flex flex-col gap-3">
			<div>
				<h3 className="font-semibold text-gray-900">{title}</h3>
				{subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
			</div>
			{meta && (
				<div className="text-xs text-gray-500 flex flex-wrap gap-2">
					{Array.isArray(meta) ? meta.map((m, idx) => (
						<span key={idx} className="px-2 py-1 bg-gray-100 rounded-md">{m}</span>
					)) : <span className="px-2 py-1 bg-gray-100 rounded-md">{meta}</span>}
				</div>
			)}
			{children}
			{(onEdit || onDelete) && (
				<div className="mt-auto flex items-center gap-2">
					{onEdit && <button className="btn btn-secondary" onClick={onEdit}>Edit</button>}
					{onDelete && <button className="btn btn-danger" onClick={onDelete}>Delete</button>}
				</div>
			)}
		</div>
	);
}


