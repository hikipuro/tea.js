export enum Space {
	World,
	Self
}

export module Space {
	export function toString(value: number): string {
		return Space[value];
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in Space) {
			if (typeof Space[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
