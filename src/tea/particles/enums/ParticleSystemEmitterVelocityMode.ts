export enum ParticleSystemEmitterVelocityMode {
	Transform,
	Rigidbody
}

export module ParticleSystemEmitterVelocityMode {
	export function toString(value: number): string {
		return ParticleSystemEmitterVelocityMode[value];
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
