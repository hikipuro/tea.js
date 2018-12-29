export enum ParticleSystemEmitterVelocityMode {
	Transform,
	Rigidbody
}

export module ParticleSystemEmitterVelocityMode {
	export function toString(value: number): string {
		return ParticleSystemEmitterVelocityMode[value];
	}

	export function fromString(key: string): ParticleSystemEmitterVelocityMode {
		var value = ParticleSystemEmitterVelocityMode[key];
		if (value == null) {
			return ParticleSystemEmitterVelocityMode.Transform;
		}
		return value;
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in ParticleSystemEmitterVelocityMode) {
			if (typeof ParticleSystemEmitterVelocityMode[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
