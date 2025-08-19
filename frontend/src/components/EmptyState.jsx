export default function EmptyState({ title = 'Nothing here yet', description = 'Create your first item to get started.' }) {
	return (
		<div className="card p-8 text-center">
			<h3 className="text-lg font-semibold mb-1">{title}</h3>
			<p className="text-gray-600 text-sm">{description}</p>
		</div>
	);
}


