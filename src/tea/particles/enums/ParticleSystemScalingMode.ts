export enum ParticleSystemScalingMode {
	Hierarchy,
	Local,
	Shape
}

export module ParticleSystemScalingMode {
	export function toString(value: number): string {
		return ParticleSystemScalingMode[value];
	}

	export function fromString(key: string): ParticleSystemScalingMode {
		var value = ParticleSystemScalingMode[key];
		if (value == null) {
			return ParticleSystemScalingMode.Hierarchy;
		}
		return value;
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in ParticleSystemScalingMode) {
			if (typeof ParticleSystemScalingMode[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
