export enum ParticleSystemInheritVelocityMode {
	Initial,
	Current
}

export module ParticleSystemInheritVelocityMode {
	export function toString(value: number): string {
		return ParticleSystemInheritVelocityMode[value];
	}

	export function fromString(key: string): ParticleSystemInheritVelocityMode {
		var value = ParticleSystemInheritVelocityMode[key];
		if (value == null) {
			return ParticleSystemInheritVelocityMode.Initial;
		}
		return value;
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in ParticleSystemInheritVelocityMode) {
			if (typeof ParticleSystemInheritVelocityMode[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
