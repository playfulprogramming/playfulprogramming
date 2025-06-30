// Format date for display
export function formatDate(dateString) {
	const date = new Date(dateString);
	const now = new Date();
	const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

	if (diffInHours < 1) return "just now";
	if (diffInHours < 24) return `${diffInHours}h ago`;

	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays < 7) return `${diffInDays}d ago`;

	return date.toLocaleDateString();
}
