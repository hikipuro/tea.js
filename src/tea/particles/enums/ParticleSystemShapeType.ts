export enum ParticleSystemShapeType {
	Sphere,
	Hemisphere,
	Cone,
	Box,
	Mesh,
	ConeVolume,
	Circle,
	SingleSidedEdge,
	MeshRenderer,
	SkinnedMeshRenderer,
	BoxShell,
	BoxEdge,
	Donut,
	Rectangle
}

export module ParticleSystemShapeType {
	export function toString(value: number): string {
		return ParticleSystemShapeType[value];
	}

	export function getKeys(): Array<string> {
		var keys = [];
		for (var n in ParticleSystemShapeType) {
			if (typeof ParticleSystemShapeType[n] === "number") {
				keys.push(n);
			}
		}
		return keys;
	}
}
