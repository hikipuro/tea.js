export enum ParticleSystemCustomData {
	Custom1,
	Custom2
}

export module ParticleSystemCustomData {
	export function toString(value: number): string {
		return ParticleSystemCustomData[value];
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in ParticleSystemCustomData) {
			if (typeof ParticleSystemCustomData[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
