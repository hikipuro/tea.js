import * as Tea from "../Tea";
import { Component } from "./Component";
import * as Modules from "../particles/ParticleSystemModules";

export class ParticleSystem extends Component {
	static readonly className: string = "ParticleSystem";
	//automaticCullingEnabled: boolean;
	//collision: Modules.CollisionModule;
	//colorBySpeed: Modules.ColorBySpeedModule;
	colorOverLifetime: Modules.ColorOverLifetimeModule;
	//customData: Modules.CustomDataModule;
	emission: Modules.EmissionModule;
	//externalForces: Modules.ExternalForcesModule;
	//forceOverLifetime: Modules.ForceOverLifetimeModule;
	//inheritVelocity: Modules.InheritVelocityModule;
	isEmitting: boolean;
	isPaused: boolean;
	isPlaying: boolean;
	isStopped: boolean;
	//lights: Modules.LightsModule;
	//limitVelocityOverLifetime: Modules.LimitVelocityOverLifetimeModule;
	main: Modules.MainModule;
	//noise: Modules.NoiseModule;
	//randomSeed: number;
	//rotationBySpeed: Modules.RotationBySpeedModule;
	//rotationOverLifetime: Modules.RotationOverLifetimeModule;
	shape: Modules.ShapeModule;
	//sizeBySpeed: Modules.SizeBySpeedModule;
	//sizeOverLifetime: Modules.SizeOverLifetimeModule;
	//subEmitters: Modules.SubEmittersModule;
	//textureSheetAnimation: Modules.TextureSheetAnimationModule;
	time: number;
	//trails: Modules.TrailModule;
	//trigger: Modules.TriggerModule;
	//useAutoRandomSeed: boolean;
	velocityOverLifetime: Modules.VelocityOverLifetimeModule;
	particles: Array<Tea.Particle>;
	protected _startTime: number;
	protected _data: Float32Array;
	protected _maxParticles: number;
	protected _dataElements: number = 8;

	constructor(app: Tea.App) {
		super(app);
		this.particles = [];
		this.colorOverLifetime = new Modules.ColorOverLifetimeModule();
		this.emission = new Modules.EmissionModule();
		this.emission.enabled = true;
		this.main = new Modules.MainModule();
		this.shape = new Modules.ShapeModule();
		this.shape.enabled = true;
		this.time = 0.0;
		this.velocityOverLifetime = new Modules.VelocityOverLifetimeModule();
		this.isPlaying = false;
		this._startTime = 0.0;
		this._maxParticles = this.main.maxParticles;
		this.createDataBuffer();
	}

	get particleCount(): number {
		return this.particles.length;
	}

	/*
	get bufferData(): Array<number> {
		var list = [];
		var particles = this.particles;
		var length = particles.length;
		for (var i = 0; i < length; i++) {
			var particle = particles[i];
			list.push.apply(list, particle.position);
			list.push.apply(list, particle.color);
			list.push(particle.size);
		}
		return list;
	}
	*/

	destroy(): void {
		this.particles = undefined;
		this.colorOverLifetime = undefined;
		this.emission = undefined;
		this.main = undefined;
		this.shape = undefined;
		this.velocityOverLifetime = undefined;
		super.destroy();
	}

	start(): void {
		if (this.isPlaying) {
			return;
		}
		this.isPlaying = true;
		this._startTime = Tea.now();
	}

	stop(): void {
		if (this.isPlaying === false) {
			return;
		}
		this.isPlaying = false;
	}

	//play(): void {
	//}

	//pause(): void {
	//}

	update(): void {
		if (this.isPlaying === false) {
			this.start();
			return;
		}
		if (this._maxParticles !== this.main.maxParticles) {
			this._maxParticles = this.main.maxParticles;
			this.particles.splice(this._maxParticles, this.particles.length);
			this.createDataBuffer();
		}
		var particles = this.particles;
		var length = particles.length;
		if (length <= 0 && this.isTimeOver) {
			this.stop();
			return;
		}
		for (var i = length - 1; i >= 0; i--) {
			var p = particles[i];
			if (p.lifetime <= 0) {
				particles.splice(i, 1);
				continue;
			}
			var t = 1.0 - p.lifetime / p.maxLifetime; 
			p.lifetime--;
			p.color.copy(p.startColor);
			p.color.scaleSelf(p.lifetimeColor.evaluate(t));
			p.position.addSelf(p.velocity);
			p.velocity.addSelf(p.gravity);
			//if (particles[i].update()) {
			//	particles.splice(i, 1);
			//}
		}
		if (this.emission.enabled) {
			var count = this.emission.evaluate(
				this.time, this.main.duration
			);
			this.emit(count);
		}
		this.time += 1.0 / 60.0;
		if (this.time >= this.main.duration) {
			this.time -= this.main.duration;
		}
	}

	clear(): void {
		this.particles = [];
	}

	emit(count: number): void {
		if (this.isTimeOver) {
			return;
		}
		var particles = this.particles;
		var maxParticles = this.main.maxParticles;
		if (particles.length + count > maxParticles) {
			count = maxParticles - particles.length;
		}
		if (count <= 0) {
			return;
		}

		var main = this.main;
		var colorOverLifetime = this.colorOverLifetime;
		var velocityOverLifetime = this.velocityOverLifetime;
		var time = this.time, duration = main.duration;
		var t = time / duration;

		var gravity = this.getGravity(t);
		var lifetime = main.startLifetime.evaluate(t);
		lifetime *= 60.0;

		var startSize = main.startSize.evaluate(t);
		var startSpeed = main.startSpeed.evaluate(t);
		var startColor = main.startColor.evaluate(t);

		var position = this.object3d.position;
		var rotation = this.object3d.rotation;

		for (var i = 0; i < count; i++) {
			var particle = new Tea.Particle();
			if (this.shape.enabled) {
				this.shape.apply(this.time, particle);
			}
			particle.size = startSize;
			particle.velocity.mulSelf(startSpeed);
			if (velocityOverLifetime.enabled) {
				particle.velocity.addSelf(new Tea.Vector3(
					velocityOverLifetime.x.evaluate(0) / (60.0),
					velocityOverLifetime.y.constant,
					velocityOverLifetime.z.constant
				));
			}
			particle.startColor = startColor;
			if (colorOverLifetime.enabled) {
				switch (colorOverLifetime.color.mode) {
					case Tea.ParticleSystemGradientMode.Gradient:
						particle.lifetimeColor = colorOverLifetime.color.gradient;
						break;
					case Tea.ParticleSystemGradientMode.TwoGradients:
						switch (Tea.Random.rangeInt(0, 2)) {
							case 0:
								particle.lifetimeColor = colorOverLifetime.color.gradientMin;
								break;
							case 1:
								particle.lifetimeColor = colorOverLifetime.color.gradientMax;
								break;
						}
				}
			}
			particle.gravity = gravity;
			particle.lifetime = lifetime;
			particle.maxLifetime = lifetime;

			particle.position.applyQuaternion(rotation);
			particle.position.addSelf(position);
			particle.velocity.applyQuaternion(rotation);
			this.particles.push(particle);
		}
	}

	createData(): Float32Array {
		var particles = this.particles;
		var count = particles.length;
		var elements = this._dataElements;
		var data = this._data;
		count = Math.min(count, this.main.maxParticles);
		//var data = new Float32Array(count * elements);
		for (var i = 0; i < count; i++) {
			var particle = particles[i];
			var index = i * elements;
			var position = particle.position;
			var color = particle.color;
			var size = particle.size;
			data[index    ] = position[0];
			data[index + 1] = position[1];
			data[index + 2] = position[2];
			data[index + 3] = color[0];
			data[index + 4] = color[1];
			data[index + 5] = color[2];
			data[index + 6] = color[3];
			data[index + 7] = size;
		}
		return data.subarray(0, count * elements);
	}

	//simulate(): void {
	//}

	//getCustomParticleData(): void {
	//}

	//setCustomParticleData(): void {
	//}

	//getParticles(): void {
	//}

	//setParticles(): void {
	//}

	//isAlive(): void {
	//}

	//triggerSubEmitter(): void {
	//}

	static fromJSON(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, ParticleSystem.className) === false) {
			callback(null);
			return;
		}
		//app.enableInstancedArrays();
		var particleSystem = new ParticleSystem(app);
		particleSystem.enabled = json.enabled;
		particleSystem.colorOverLifetime = Modules.ColorOverLifetimeModule.fromJSON(app, json.colorOverLifetime);
		particleSystem.emission = Modules.EmissionModule.fromJSON(app, json.emission);
		particleSystem.shape = Modules.ShapeModule.fromJSON(app, json.shape);
		particleSystem.main = Modules.MainModule.fromJSON(app, json.main);
		callback(particleSystem);
	}
	
	toJSON(): Object {
		var json: any = super.toJSON();
		json[Tea.JSONUtil.TypeName] = ParticleSystem.className;
		json.colorOverLifetime = this.colorOverLifetime.toJSON();
		json.emission = this.emission.toJSON();
		json.shape = this.shape.toJSON();
		json.main = this.main.toJSON();
		return json;
	}

	protected get isTimeOver(): boolean {
		var main = this.main;
		if (main.loop === true) {
			return false;
		}
		var time = Tea.now() - this._startTime;
		if (time > main.duration * 1000.0) {
			return true;
		}
		return false;
	}

	protected createDataBuffer(): void {
		if (this.app.status.ANGLE_instanced_arrays == null) {
			return;
		}
		var count = this.main.maxParticles;
		var elements = this._dataElements;
		this._data = new Float32Array(count * elements);
	}

	protected getGravity(t: number): Tea.Vector3 {
		if (this.object3d == null || this.object3d.scene == null) {
			return Tea.Vector3.zero.clone();
		}
		var gravity = this.object3d.scene.physics.gravity.clone();
		gravity.divSelf(60.0 * 60.0);
		gravity.mulSelf(this.main.gravityModifier.evaluate(t));
		return gravity;
	}
}

export module ParticleSystem {
	export type Burst = Modules.Burst;
	export var  Burst = Modules.Burst;
	export type MinMaxCurve = Modules.MinMaxCurve;
	export var  MinMaxCurve = Modules.MinMaxCurve;
	export type MinMaxGradient = Modules.MinMaxGradient;
	export var  MinMaxGradient = Modules.MinMaxGradient;
	export type CollisionModule = Modules.CollisionModule;
	export var  CollisionModule = Modules.CollisionModule;
	export type ColorBySpeedModule = Modules.ColorBySpeedModule;
	export var  ColorBySpeedModule = Modules.ColorBySpeedModule;
	export type ColorOverLifetimeModule = Modules.ColorOverLifetimeModule;
	export var  ColorOverLifetimeModule = Modules.ColorOverLifetimeModule;
	export type CustomDataModule = Modules.CustomDataModule;
	export var  CustomDataModule = Modules.CustomDataModule;
	export type EmissionModule = Modules.EmissionModule;
	export var  EmissionModule = Modules.EmissionModule;
	export type ExternalForcesModule = Modules.ExternalForcesModule;
	export var  ExternalForcesModule = Modules.ExternalForcesModule;
	export type ForceOverLifetimeModule = Modules.ForceOverLifetimeModule;
	export var  ForceOverLifetimeModule = Modules.ForceOverLifetimeModule;
	export type InheritVelocityModule = Modules.InheritVelocityModule;
	export var  InheritVelocityModule = Modules.InheritVelocityModule;
	export type LightsModule = Modules.LightsModule;
	export var  LightsModule = Modules.LightsModule;
	export type LimitVelocityOverLifetimeModule = Modules.LimitVelocityOverLifetimeModule;
	export var  LimitVelocityOverLifetimeModule = Modules.LimitVelocityOverLifetimeModule;
	export type MainModule = Modules.MainModule;
	export var  MainModule = Modules.MainModule;
	export type NoiseModule = Modules.NoiseModule;
	export var  NoiseModule = Modules.NoiseModule;
	export type RotationBySpeedModule = Modules.RotationBySpeedModule;
	export var  RotationBySpeedModule = Modules.RotationBySpeedModule;
	export type RotationOverLifetimeModule = Modules.RotationOverLifetimeModule;
	export var  RotationOverLifetimeModule = Modules.RotationOverLifetimeModule;
	export type ShapeModule = Modules.ShapeModule;
	export var  ShapeModule = Modules.ShapeModule;
	export type SizeBySpeedModule = Modules.SizeBySpeedModule;
	export var  SizeBySpeedModule = Modules.SizeBySpeedModule;
	export type SizeOverLifetimeModule = Modules.SizeOverLifetimeModule;
	export var  SizeOverLifetimeModule = Modules.SizeOverLifetimeModule;
	export type SubEmittersModule = Modules.SubEmittersModule;
	export var  SubEmittersModule = Modules.SubEmittersModule;
	export type TextureSheetAnimationModule = Modules.TextureSheetAnimationModule;
	export var  TextureSheetAnimationModule = Modules.TextureSheetAnimationModule;
	export type TrailModule = Modules.TrailModule;
	export var  TrailModule = Modules.TrailModule;
	export type TriggerModule = Modules.TriggerModule;
	export var  TriggerModule = Modules.TriggerModule;
	export type VelocityOverLifetimeModule = Modules.VelocityOverLifetimeModule;
	export var  VelocityOverLifetimeModule = Modules.VelocityOverLifetimeModule;
}
