export enum ParticleSystemShapeMultiModeValue {
	Random,
	Loop,
	PingPong,
	BurstSpread
}

export module ParticleSystemShapeMultiModeValue {
	export function toString(value: number): string {
		return ParticleSystemShapeMultiModeValue[value];
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in ParticleSystemShapeMultiModeValue) {
			if (typeof ParticleSystemShapeMultiModeValue[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
