export default function DataList({ items, renderItem, emptyLabel = 'No items found.' }) {
	if (!items || items.length === 0) {
		return (
			<div className="text-center text-gray-500 py-16">{emptyLabel}</div>
		);
	}
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{items.map(renderItem)}
		</div>
	);
}


