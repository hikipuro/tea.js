export enum ParticleSystemStopAction {
	None,
	Disable,
	Destroy,
	Callback
}

export module ParticleSystemStopAction {
	export function toString(value: number): string {
		return ParticleSystemStopAction[value];
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in ParticleSystemStopAction) {
			if (typeof ParticleSystemStopAction[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
