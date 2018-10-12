export enum ParticleSystemGradientMode {
	Color,
	Gradient,
	TwoColors,
	TwoGradients,
	RandomColor
}

export module ParticleSystemGradientMode {
	export function toString(value: number): string {
		return ParticleSystemGradientMode[value];
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in ParticleSystemGradientMode) {
			if (typeof ParticleSystemGradientMode[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
