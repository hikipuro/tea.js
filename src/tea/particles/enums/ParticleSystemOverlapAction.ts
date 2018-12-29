export enum ParticleSystemOverlapAction {
	Ignore,
	Kill,
	Callback
}

export module ParticleSystemOverlapAction {
	export function toString(value: number): string {
		return ParticleSystemOverlapAction[value];
	}

	export function fromString(key: string): ParticleSystemOverlapAction {
		var value = ParticleSystemOverlapAction[key];
		if (value == null) {
			return ParticleSystemOverlapAction.Ignore;
		}
		return value;
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in ParticleSystemOverlapAction) {
			if (typeof ParticleSystemOverlapAction[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
