export enum ParticleSystemSimulationSpace {
	Local,
	World,
	Custom
}

export module ParticleSystemSimulationSpace {
	export function toString(value: number): string {
		return ParticleSystemSimulationSpace[value];
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in ParticleSystemSimulationSpace) {
			if (typeof ParticleSystemSimulationSpace[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
