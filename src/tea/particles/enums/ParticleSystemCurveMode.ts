export enum ParticleSystemCurveMode {
	Constant,
	Curve,
	TwoConstants,
	TwoCurves
}

export module ParticleSystemCurveMode {
	export function toString(value: number): string {
		return ParticleSystemCurveMode[value];
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in ParticleSystemCurveMode) {
			if (typeof ParticleSystemCurveMode[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
