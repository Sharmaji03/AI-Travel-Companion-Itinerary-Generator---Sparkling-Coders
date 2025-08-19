export default function ErrorBanner({ message }) {
	if (!message) return null;
	return (
		<div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">
			{typeof message === 'string' ? message : JSON.stringify(message)}
		</div>
	);
}


