export enum RigidbodyConstraints {
	None = 0,
	FreezePositionX = 0x02,
	FreezePositionY = 0x04,
	FreezePositionZ = 0x08,
	FreezePosition = 0x0E,
	FreezeRotationX = 0x10,
	FreezeRotationY = 0x20,
	FreezeRotationZ = 0x40,
	FreezeRotation = 0x70,
	FreezeAll = 0x7E
}

export module RigidbodyConstraints {
	export function toString(value: number): string {
		return RigidbodyConstraints[value];
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in RigidbodyConstraints) {
			if (typeof RigidbodyConstraints[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
