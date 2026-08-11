export function isSocketError(e: unknown): boolean {
	return (
		e instanceof TypeError &&
		"cause" in e &&
		e.cause instanceof Error &&
		e.cause.message == "other side closed"
	);
}
