export enum ParticleSystemShapeTextureChannel {
	Red,
	Green,
	Blue,
	Alpha
}

export module ParticleSystemShapeTextureChannel {
	export function toString(value: number): string {
		return ParticleSystemShapeTextureChannel[value];
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in ParticleSystemShapeTextureChannel) {
			if (typeof ParticleSystemShapeTextureChannel[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
