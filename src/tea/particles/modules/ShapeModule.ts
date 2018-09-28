import * as Tea from "../../Tea";

export class PSShapeModule {
	enabled: boolean;
	alignToDirection: boolean;
	angle: number;
	arc: number;
	arcMode: Tea.ParticleSystemShapeMultiModeValue;
	arcSpeed: Tea.ParticleSystem.MinMaxCurve;
	arcSpeedMultiplier: number;
	arcSpread: number;
	boxThickness: Tea.Vector3;
	donutRadius: number;
	length: number;
	mesh: Tea.Mesh;
	meshMaterialIndex: number;
	meshRenderer: Tea.MeshRenderer;
	meshShapeType: Tea.ParticleSystemMeshShapeType;
	normalOffset: number;
	position: Tea.Vector3;
	radius: number;
	radiusMode: Tea.ParticleSystemShapeMultiModeValue;
	radiusSpeed: Tea.ParticleSystem.MinMaxCurve;
	radiusSpeedMultiplier: number;
	radiusSpread: number;
	radiusThickness: number;
	randomDirectionAmount: number;
	randomPositionAmount: number;
	rotation: Tea.Vector3;
	scale: Tea.Vector3;
	shapeType: Tea.ParticleSystemShapeType;
	//skinnedMeshRenderer:
	sphericalDirectionAmount: number;
	texture: Tea.Texture;
	textureAlphaAffectsParticles: boolean;
	textureBilinearFiltering: boolean;
	textureClipChannel: Tea.ParticleSystemShapeTextureChannel;
	textureClipThreshold: number;
	textureColorAffectsParticles: boolean;
	textureUVChannel: number;
	useMeshColors: boolean;
	useMeshMaterialIndex: boolean;

	constructor() {
		this.enabled = false;
	}
}
