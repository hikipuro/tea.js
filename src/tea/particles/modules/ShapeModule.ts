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
	//skinnedMeshRenderer: SkinnedMeshRenderer;
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
		this.alignToDirection = false;
		this.angle = 25;
		this.arc = 360.0;
		this.arcMode = Tea.ParticleSystemShapeMultiModeValue.Loop;
		this.arcSpeed = new Tea.ParticleSystem.MinMaxCurve(1.0);
		this.arcSpeedMultiplier = 1.0;
		this.arcSpread = 0.0;
		this.length = 5.0;
		this.shapeType = Tea.ParticleSystemShapeType.Cone;
		this.position = new Tea.Vector3();
		this.radius = 1.0;
		this.radiusMode = Tea.ParticleSystemShapeMultiModeValue.Loop;
		this.radiusThickness = 1.0;
		this.rotation = new Tea.Vector3();
	}

	apply(time: number, particle: Tea.Particle): void {
		switch (this.shapeType) {
			case Tea.ParticleSystemShapeType.Sphere:
				break;
			case Tea.ParticleSystemShapeType.Hemisphere:
				break;
			case Tea.ParticleSystemShapeType.Cone:
				this.cone(time, particle);
				break;
			case Tea.ParticleSystemShapeType.Box:
				break;
			case Tea.ParticleSystemShapeType.Mesh:
				break;
			case Tea.ParticleSystemShapeType.ConeVolume:
				break;
			case Tea.ParticleSystemShapeType.Circle:
				break;
			case Tea.ParticleSystemShapeType.SingleSidedEdge:
				break;
			case Tea.ParticleSystemShapeType.MeshRenderer:
				break;
			case Tea.ParticleSystemShapeType.SkinnedMeshRenderer:
				break;
			case Tea.ParticleSystemShapeType.BoxShell:
				break;
			case Tea.ParticleSystemShapeType.BoxEdge:
				break;
			case Tea.ParticleSystemShapeType.Donut:
				break;
			case Tea.ParticleSystemShapeType.Rectangle:
				break;
		}
	}

	protected getArc(time: number): number {
		var arc = this.arc / 360.0;
		var spread = this.arcSpread;
		var speed = 0.0;
		var amount = 0.0;
		switch (this.arcMode) {
			case Tea.ParticleSystemShapeMultiModeValue.Loop:
				speed = this.arcSpeed.evaluate(0);
				speed *= this.arcSpeedMultiplier;
				amount = (time / arc * speed) % 1.0;
				break;
			case Tea.ParticleSystemShapeMultiModeValue.Random:
				amount = Math.random();
				break;
			case Tea.ParticleSystemShapeMultiModeValue.PingPong:
				break;
			case Tea.ParticleSystemShapeMultiModeValue.BurstSpread:
				break;
		}
		if (spread != 0.0) {
			amount = Math.floor(amount / spread) * spread;
		}
		arc = amount * (2.0 * Math.PI * arc);
		return arc;
	}

	protected cone(time: number, particle: Tea.Particle): void {
		var speed = 1.0 / 60.0;
		var position = this.position;
		var radius = this.radius;
		var a = this.getArc(time);
		var r = /* Math.random() * */radius;
		var x = Math.cos(a) * r;
		var z = Math.sin(a) * r;
		particle.position.set(
			position[0] + x,
			position[1],
			position[2] + z
		);
		a = Tea.Mathf.clamp(this.angle, 0.0, 90.0);
		a = a * Math.PI / 180.0;
		x = Math.sin(a * x / radius) * speed;
		z = Math.sin(a * z / radius) * speed;
		var y = Math.cos(a * r / radius) * speed;
		particle.velocity.set(x, y, z);
		if (this.rotation.equals(Tea.Vector3.zero) === false) {
			var q = Tea.Quaternion.euler(this.rotation);
			particle.position.applyQuaternion(q);
			particle.velocity.applyQuaternion(q);
		}
	}
}
