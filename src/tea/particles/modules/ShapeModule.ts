import * as Tea from "../../Tea";
import { MinMaxCurve } from "../MinMaxCurve";

export class ShapeModule {
	static readonly className: string = "ShapeModule";
	enabled: boolean;
	alignToDirection: boolean;
	angle: number;
	arc: number;
	arcMode: Tea.ParticleSystemShapeMultiModeValue;
	arcSpeed: MinMaxCurve;
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
	radiusSpeed: MinMaxCurve;
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
		this.arcMode = Tea.ParticleSystemShapeMultiModeValue.Random;
		this.arcSpeed = new MinMaxCurve(1.0);
		this.arcSpread = 0.0;
		this.boxThickness = new Tea.Vector3();
		this.donutRadius = 0.0;
		this.length = 5.0;
		this.mesh = null;
		this.meshMaterialIndex = 0;
		this.meshRenderer = null;
		this.meshShapeType = Tea.ParticleSystemMeshShapeType.Triangle;
		this.normalOffset = 0.0;
		this.position = new Tea.Vector3();
		this.radius = 1.0;
		this.radiusMode = Tea.ParticleSystemShapeMultiModeValue.Loop;
		this.radiusSpeed = new MinMaxCurve(1.0);
		this.radiusSpread = 0.0;
		this.radiusThickness = 1.0;
		this.randomDirectionAmount = 0.0;
		this.randomPositionAmount = 0.0;
		this.rotation = new Tea.Vector3();
		this.scale = Tea.Vector3.one.clone();
		this.shapeType = Tea.ParticleSystemShapeType.Cone;
		//this.skinnedMeshRenderer = new Tea.SkinnedMeshRenderer();
		this.sphericalDirectionAmount = 0.0;
		this.texture = null;
		this.textureAlphaAffectsParticles = false;
		this.textureBilinearFiltering = false;
		this.textureClipChannel = Tea.ParticleSystemShapeTextureChannel.Alpha;
		this.textureClipThreshold = 0.0;
		this.textureColorAffectsParticles = false;
		this.textureUVChannel = 0;
		this.useMeshColors = false;
		this.useMeshMaterialIndex = false;
	}

	get arcSpeedMultiplier(): number {
		return this.arcSpeed.curveMultiplier;
	}
	set arcSpeedMultiplier(value: number) {
		this.arcSpeed.curveMultiplier = value;
	}

	get radiusSpeedMultiplier(): number {
		return this.radiusSpeed.curveMultiplier;
	}
	set radiusSpeedMultiplier(value: number) {
		this.radiusSpeed.curveMultiplier = value;
	}

	apply(time: number, particle: Tea.Particle): void {
		switch (this.shapeType) {
			case Tea.ParticleSystemShapeType.Sphere:
				this.sphere(time, particle);
				break;
			case Tea.ParticleSystemShapeType.Hemisphere:
				this.hemisphere(time, particle);
				break;
			case Tea.ParticleSystemShapeType.Cone:
				this.cone(time, particle);
				break;
			case Tea.ParticleSystemShapeType.Box:
				this.box(time, particle);
				break;
			case Tea.ParticleSystemShapeType.Mesh:
				console.warn("ShapeModule.shapeType = Mesh is not supported");
				break;
			case Tea.ParticleSystemShapeType.ConeVolume:
				this.coneVolume(time, particle);
				break;
			case Tea.ParticleSystemShapeType.Circle:
				this.circle(time, particle);
				break;
			case Tea.ParticleSystemShapeType.SingleSidedEdge:
				this.singleSidedEdge(time, particle);
				break;
			case Tea.ParticleSystemShapeType.MeshRenderer:
				console.warn("ShapeModule.shapeType = MeshRenderer is not supported");
				break;
			case Tea.ParticleSystemShapeType.SkinnedMeshRenderer:
				console.warn("ShapeModule.shapeType = SkinnedMeshRenderer is not supported");
				break;
			case Tea.ParticleSystemShapeType.BoxShell:
				this.boxShell(time, particle);
				break;
			case Tea.ParticleSystemShapeType.BoxEdge:
				this.boxEdge(time, particle);
				break;
			case Tea.ParticleSystemShapeType.Donut:
				console.warn("ShapeModule.shapeType = Donut is not supported");
				break;
			case Tea.ParticleSystemShapeType.Rectangle:
				this.rectangle(time, particle);
				break;
		}
	}

	static fromJSON(app: Tea.App, json: any): ShapeModule {
		if (Tea.JSONUtil.isValidSceneJSON(json, ShapeModule.className) === false) {
			return null;
		}
		var module = new ShapeModule();
		module.enabled = json.enabled;
		module.alignToDirection = json.alignToDirection;
		module.angle = json.angle;
		module.arc = json.arc;
		module.arcMode = Tea.ParticleSystemShapeMultiModeValue[json.arcMode as string];
		module.arcSpeed = MinMaxCurve.fromJSON(app, json.arcSpeed);
		module.arcSpread = json.arcSpread;
		module.boxThickness = Tea.Vector3.fromArray(json.boxThickness);
		module.donutRadius = json.donutRadius;
		module.length = json.length;
		//module.mesh = Tea.Mesh.fromJSON(app, json.mesh);
		module.meshMaterialIndex = json.meshMaterialIndex;
		//module.meshRenderer = Tea.MeshRenderer.fromJSON(app, json.meshRenderer);
		module.meshShapeType = Tea.ParticleSystemMeshShapeType[json.meshShapeType as string];
		module.normalOffset = json.normalOffset;
		module.position = Tea.Vector3.fromArray(json.position);
		module.radius = json.radius;
		module.radiusMode = Tea.ParticleSystemShapeMultiModeValue[json.radiusMode as string];
		module.radiusSpeed = MinMaxCurve.fromJSON(app, json.radiusSpeed);
		module.radiusThickness = json.radiusThickness;
		module.randomDirectionAmount = json.randomDirectionAmount;
		module.randomPositionAmount = json.randomPositionAmount;
		module.rotation = Tea.Vector3.fromArray(json.rotation);
		module.scale = Tea.Vector3.fromArray(json.scale);
		module.shapeType = Tea.ParticleSystemShapeType[json.shapeType as string];
		//module.skinnedMeshRenderer = Tea.SkinnedMeshRenderer.fromJSON(app, json.skinnedMeshRenderer);
		module.sphericalDirectionAmount = json.sphericalDirectionAmount;
		module.texture = Tea.Texture.fromJSON(app, json.texture);
		module.textureAlphaAffectsParticles = json.textureAlphaAffectsParticles;
		module.textureBilinearFiltering = json.textureBilinearFiltering;
		module.textureClipChannel = Tea.ParticleSystemShapeTextureChannel[json.textureClipChannel as string];
		module.textureClipThreshold = json.textureClipThreshold;
		module.textureColorAffectsParticles = json.textureColorAffectsParticles;
		module.textureUVChannel = json.textureUVChannel;
		module.useMeshColors = json.useMeshColors;
		module.useMeshMaterialIndex = json.useMeshMaterialIndex;
		return module;
	}

	toJSON(): Object {
		var json = Tea.JSONUtil.createSceneJSON(ShapeModule.className);
		json.enabled = this.enabled;
		json.alignToDirection = this.alignToDirection;
		json.angle = this.angle;
		json.arc = this.arc;
		json.arcMode = Tea.ParticleSystemShapeMultiModeValue.toString(this.arcMode);
		json.arcSpeed = this.arcSpeed.toJSON();
		json.arcSpread = this.arcSpread;
		json.boxThickness = this.boxThickness;
		json.donutRadius = this.donutRadius;
		json.length = this.length;
		//json.mesh = this.mesh.toJSON();
		json.meshMaterialIndex = this.meshMaterialIndex;
		//json.meshRenderer = this.meshRenderer.toJSON();
		json.meshShapeType = Tea.ParticleSystemMeshShapeType.toString(this.meshShapeType);
		json.normalOffset = this.normalOffset;
		json.position = this.position;
		json.radius = this.radius;
		json.radiusMode = Tea.ParticleSystemShapeMultiModeValue.toString(this.radiusMode);
		json.radiusSpeed = this.radiusSpeed.toJSON();
		json.radiusSpread = this.radiusSpread;
		json.radiusThickness = this.radiusThickness;
		json.randomDirectionAmount = this.randomDirectionAmount;
		json.randomPositionAmount = this.randomPositionAmount;
		json.rotation = this.rotation;
		json.scale = this.scale;
		json.shapeType = Tea.ParticleSystemShapeType.toString(this.shapeType);
		//json.skinnedMeshRenderer = this.skinnedMeshRenderer.toJSON();
		json.sphericalDirectionAmount = this.sphericalDirectionAmount;
		//json.texture = this.texture.toJSON();
		json.textureAlphaAffectsParticles = this.textureAlphaAffectsParticles;
		json.textureBilinearFiltering = this.textureBilinearFiltering;
		json.textureClipChannel = Tea.ParticleSystemShapeTextureChannel.toString(this.textureClipChannel);
		json.textureClipThreshold = this.textureClipThreshold;
		json.textureColorAffectsParticles = this.textureColorAffectsParticles;
		json.textureUVChannel = this.textureUVChannel;
		json.useMeshColors = this.useMeshColors;
		json.useMeshMaterialIndex = this.useMeshMaterialIndex;
		return json;
	}

	protected getSpeed(): number {
		return 1.0 / 60.0;
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

	protected sphere(time: number, particle: Tea.Particle): void {
		var rand = Math.random;
		var speed = this.getSpeed();
		var position = this.position;
		var scale = this.scale;
		var radius = this.radius;
		var vec3 = new Tea.Vector3(0.0, 0.0, 1.0);
		var q = Tea.Quaternion.euler(rand() * 360, rand() * 360, rand() * 360);
		vec3.applyQuaternion(q);
		particle.position.set(
			position[0] + vec3[0] * radius * scale[0],
			position[1] + vec3[1] * radius * scale[1],
			position[2] + vec3[2] * radius * scale[2]
		);
		vec3.mul$(speed);
		vec3.scale$(scale);
		particle.velocity.copy(vec3);
	}

	protected hemisphere(time: number, particle: Tea.Particle): void {
		var rand = Math.random;
		var speed = this.getSpeed();
		var position = this.position;
		var scale = this.scale;
		var radius = this.radius;
		var vec3 = new Tea.Vector3(0.0, 0.0, 1.0);
		var q = Tea.Quaternion.euler(
			rand() * 180 - 90.0,
			rand() * 180 - 90.0,
			rand() * 360
		);
		vec3.applyQuaternion(q);
		particle.position.set(
			position[0] + vec3[0] * radius * scale[0],
			position[1] + vec3[1] * radius * scale[1],
			position[2] + vec3[2] * radius * scale[2]
		);
		vec3.mul$(speed);
		vec3.scale$(scale);
		particle.velocity.copy(vec3);
	}

	protected cone(time: number, particle: Tea.Particle): void {
		var speed = this.getSpeed();
		var position = this.position;
		var scale = this.scale;
		var radius = this.radius;
		var a = this.getArc(time);
		var r = /* Math.random() * */radius;
		var x = Math.cos(a) * r;
		var y = Math.sin(a) * r;
		particle.position.set(
			position[0] + x * scale[0],
			position[1] + y * scale[1],
			position[2]
		);
		//particle.position.scale(scale);
		a = Tea.Mathf.clamp(this.angle, 0.0, 90.0);
		a = a * Math.PI / 180.0;
		x = Math.sin(a * x / radius) * speed * scale[0];
		y = Math.sin(a * y / radius) * speed * scale[1];
		var z = Math.cos(a * r / radius) * speed * scale[2];
		particle.velocity.set(x, y, z);
		if (this.rotation.equals(Tea.Vector3.zero) === false) {
			var q = Tea.Quaternion.euler(this.rotation);
			particle.position.applyQuaternion(q);
			particle.velocity.applyQuaternion(q);
		}
	}

	protected box(time: number, particle: Tea.Particle): void {
		var rand = Math.random;
		var speed = this.getSpeed();
		var position = this.position;
		var s = this.scale;
		var scaleX = s[0], scaleY = s[1], scaleZ = s[2];
		var x = rand() * scaleX - (scaleX * 0.5);
		var y = rand() * scaleY - (scaleY * 0.5);
		var z = rand() * scaleZ - (scaleZ * 0.5);
		particle.position.set(
			position[0] + x,
			position[1] + y,
			position[2] + z
		);
		particle.velocity[2] = speed;
	}

	protected coneVolume(time: number, particle: Tea.Particle): void {
		var speed = this.getSpeed();
		var position = this.position;
		var scale = this.scale;
		var radius = this.radius;
		var a = this.getArc(time);
		var az = 90.0 - Tea.Mathf.clamp(this.angle, 0.0, 90.0);
		az = az * Math.PI / 180.0;
		var r = /* Math.random() * */radius;
		var x = Math.cos(a) * r;
		var y = Math.sin(a) * r;
		var length = this.length * Math.random();
		var offset = Math.cos(az) * length;
		var z = Math.sin(az) * length;
		particle.position.set(
			position[0] + (x + Math.cos(a) * offset) * scale[0],
			position[1] + (y + Math.sin(a) * offset) * scale[1],
			position[2] + z * scale[2]
		);
		//particle.position.scale(scale);
		a = Tea.Mathf.clamp(this.angle, 0.0, 90.0);
		a = a * Math.PI / 180.0;
		x = Math.sin(a * x / radius) * speed * scale[0];
		y = Math.sin(a * y / radius) * speed * scale[1];
		var z = Math.cos(a * r / radius) * speed * scale[2];
		particle.velocity.set(x, y, z);
		if (this.rotation.equals(Tea.Vector3.zero) === false) {
			var q = Tea.Quaternion.euler(this.rotation);
			particle.position.applyQuaternion(q);
			particle.velocity.applyQuaternion(q);
		}
	}

	protected circle(time: number, particle: Tea.Particle): void {
		var speed = this.getSpeed();
		var position = this.position;
		var scale = this.scale;
		var radius = this.radius;
		var a = this.getArc(time);
		var x = Math.cos(a) * radius;
		var y = Math.sin(a) * radius;
		particle.position.set(
			position[0] + x * scale[0],
			position[1] + y * scale[1],
			position[2]
		);
		x *= speed * scale[0];
		y *= speed * scale[1];
		particle.velocity.set(x, y, 0.0);
	}

	protected singleSidedEdge(time: number, particle: Tea.Particle): void {
		var speed = this.getSpeed();
		var position = this.position;
		var scale = this.scale;
		var radius = this.radius;
		var a = this.getArc(time);
		var x = Math.cos(a) * radius;
		particle.position.set(
			position[0] + x * scale[0],
			position[1],
			position[2]
		);
		particle.velocity.set(
			0.0, speed * scale[0], 0.0
		);
	}

	protected boxShell(time: number, particle: Tea.Particle): void {
		var rand = Math.random;
		var speed = this.getSpeed();
		var position = this.position;
		var s = this.scale;
		var scaleX = s[0], scaleY = s[1], scaleZ = s[2];
		var x = 0.0, y = 0.0, z = 0.0;
		var d = Tea.Random.rangeInt(0, 2);
		switch (d) {
			case 0:
				x = Math.round(rand()) * scaleX - (scaleX * 0.5);
				y = rand() * scaleY - (scaleY * 0.5);
				z = rand() * scaleZ - (scaleZ * 0.5);
				break;
			case 1:
				x = rand() * scaleX - (scaleX * 0.5);
				y = Math.round(rand()) * scaleY - (scaleY * 0.5);
				z = rand() * scaleZ - (scaleZ * 0.5);
				break;
		}
		particle.position.set(
			position[0] + x,
			position[1] + y,
			position[2] + z
		);
		particle.velocity[2] = speed;
	}

	protected boxEdge(time: number, particle: Tea.Particle): void {
		var rand = Math.random;
		var speed = this.getSpeed();
		var position = this.position;
		var s = this.scale;
		var scaleX = s[0], scaleY = s[1], scaleZ = s[2];
		var x = 0.0, y = 0.0, z = 0.0;
		var d = Tea.Random.rangeInt(0, 3);
		switch (d) {
			case 0:
				x = Math.round(rand()) * scaleX - (scaleX * 0.5);
				y = Math.round(rand()) * scaleY - (scaleY * 0.5);
				z = rand() * scaleZ - (scaleZ * 0.5);
				break;
			case 1:
				x = Math.round(rand()) * scaleX - (scaleX * 0.5);
				y = rand() * scaleY - (scaleY * 0.5);
				z = Math.round(rand()) * scaleZ - (scaleZ * 0.5);
				break;
			case 2:
				x = rand() * scaleX - (scaleX * 0.5);
				y = Math.round(rand()) * scaleY - (scaleY * 0.5);
				z = Math.round(rand()) * scaleZ - (scaleZ * 0.5);
				break;
		}
		particle.position.set(
			position[0] + x,
			position[1] + y,
			position[2] + z
		);
		particle.velocity[2] = speed;
	}

	protected rectangle(time: number, particle: Tea.Particle): void {
		var rand = Math.random;
		var speed = this.getSpeed();
		var position = this.position;
		var s = this.scale;
		var scaleX = s[0], scaleY = s[1];
		var x = rand() * scaleX - (scaleX * 0.5);
		var y = rand() * scaleY - (scaleY * 0.5);
		particle.position.set(
			position[0] + x,
			position[1] + y,
			position[2]
		);
		particle.velocity[2] = speed;
	}
}
