export enum ParticleSystemMeshShapeType {
	Vertex,
	Edge,
	Triangle
}

export module ParticleSystemMeshShapeType {
	export function toString(value: number): string {
		return ParticleSystemMeshShapeType[value];
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in ParticleSystemMeshShapeType) {
			if (typeof ParticleSystemMeshShapeType[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
