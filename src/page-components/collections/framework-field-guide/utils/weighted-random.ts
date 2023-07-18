export function weightedRandom<T>(options: T[], weights: number[]): () => T {
	const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
	const weightedOptions = options.map((option, index) => ({
		option,
		weight: weights[index],
	}));

	return function () {
		const randomWeight = Math.random() * totalWeight;
		let weightSum = 0;

		for (const { option, weight } of weightedOptions) {
			weightSum += weight;
			if (randomWeight <= weightSum) {
				return option;
			}
		}

		// Default return statement
		return options[0];
	};
}
