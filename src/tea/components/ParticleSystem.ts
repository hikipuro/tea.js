import * as Tea from "../Tea";
import { Component } from "./Component";
import { PSMinMaxCurve } from "../particles/MinMaxCurve";
import { PSMinMaxGradient } from "../particles/MinMaxGradient";
import { PSBurst } from "../particles/Burst";
import { PSCollisionModule } from "../particles/modules/CollisionModule";
import { PSColorBySpeedModule } from "../particles/modules/ColorBySpeedModule";
import { PSColorOverLifetimeModule } from "../particles/modules/ColorOverLifetimeModule";
import { PSCustomDataModule } from "../particles/modules/CustomDataModule";
import { PSEmissionModule } from "../particles/modules/EmissionModule";
import { PSExternalForcesModule } from "../particles/modules/ExternalForcesModule";
import { PSForceOverLifetimeModule } from "../particles/modules/ForceOverLifetimeModule";
import { PSInheritVelocityModule } from "../particles/modules/InheritVelocityModule";
import { PSLightsModule } from "../particles/modules/LightsModule";
import { PSLimitVelocityOverLifetimeModule } from "../particles/modules/LimitVelocityOverLifetimeModule";
import { PSMainModule } from "../particles/modules/MainModule";
import { PSNoiseModule } from "../particles/modules/NoiseModule";
import { PSRotationBySpeedModule } from "../particles/modules/RotationBySpeedModule";
import { PSRotationOverLifetimeModule } from "../particles/modules/RotationOverLifetimeModule";
import { PSShapeModule } from "../particles/modules/ShapeModule";
import { PSSizeBySpeedModule } from "../particles/modules/SizeBySpeedModule";
import { PSSizeOverLifetimeModule } from "../particles/modules/SizeOverLifetimeModule";
import { PSSubEmittersModule } from "../particles/modules/SubEmittersModule";
import { PSTextureSheetAnimationModule } from "../particles/modules/TextureSheetAnimationModule";
import { PSTrailModule } from "../particles/modules/TrailModule";
import { PSTriggerModule } from "../particles/modules/TriggerModule";
import { PSVelocityOverLifetimeModule } from "../particles/modules/VelocityOverLifetimeModule";

export class ParticleSystem extends Component {
	static editorView = Tea.Editor.ParticleSystem;
	//automaticCullingEnabled: boolean;
	//collision: ParticleSystem.CollisionModule;
	//colorBySpeed: ParticleSystem.ColorBySpeedModule;
	colorOverLifetime: ParticleSystem.ColorOverLifetimeModule;
	//customData: ParticleSystem.CustomDataModule;
	emission: ParticleSystem.EmissionModule;
	//externalForces: ParticleSystem.ExternalForcesModule;
	//forceOverLifetime: ParticleSystem.ForceOverLifetimeModule;
	//inheritVelocity: ParticleSystem.InheritVelocityModule;
	isEmitting: boolean;
	isPaused: boolean;
	isPlaying: boolean;
	isStopped: boolean;
	//lights: ParticleSystem.LightsModule;
	//limitVelocityOverLifetime: ParticleSystem.LimitVelocityOverLifetimeModule;
	main: ParticleSystem.MainModule;
	//noise: ParticleSystem.NoiseModule;
	//randomSeed: number;
	//rotationBySpeed: ParticleSystem.RotationBySpeedModule;
	//rotationOverLifetime: ParticleSystem.RotationOverLifetimeModule;
	shape: ParticleSystem.ShapeModule;
	//sizeBySpeed: ParticleSystem.SizeBySpeedModule;
	//sizeOverLifetime: ParticleSystem.SizeOverLifetimeModule;
	//subEmitters: ParticleSystem.SubEmittersModule;
	//textureSheetAnimation: ParticleSystem.TextureSheetAnimationModule;
	time: number;
	//trails: ParticleSystem.TrailModule;
	//trigger: ParticleSystem.TriggerModule;
	//useAutoRandomSeed: boolean;
	velocityOverLifetime: ParticleSystem.VelocityOverLifetimeModule;
	particles: Array<Tea.Particle>;
	protected _startTime: number;
	protected _data: Float32Array;
	protected _maxParticles: number;
	protected _dataElements: number = 8;

	constructor(app: Tea.App) {
		super(app);
		this.particles = [];
		this.colorOverLifetime = new ParticleSystem.ColorOverLifetimeModule();
		this.emission = new ParticleSystem.EmissionModule();
		this.emission.enabled = true;
		this.main = new ParticleSystem.MainModule();
		this.shape = new ParticleSystem.ShapeModule();
		this.shape.enabled = true;
		this.time = 0.0;
		this.velocityOverLifetime = new ParticleSystem.VelocityOverLifetimeModule();
		this.isPlaying = false;
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
		this.main = undefined;
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
			if (particles[i].update()) {
				particles.splice(i, 1);
			}
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

		for (var i = 0; i < count; i++) {
			var particle = new Tea.Particle();
			if (this.shape.enabled) {
				this.shape.apply(this.time, particle);
			}
			particle.size = startSize;
			if (velocityOverLifetime.enabled) {
				particle.velocity.scale$(new Tea.Vector3(
					velocityOverLifetime.x.constant,
					velocityOverLifetime.y.constant,
					velocityOverLifetime.z.constant
				));
			}
			particle.velocity.mul$(startSpeed);
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

			particle.position.applyQuaternion(this.object3d.rotation);
			particle.velocity.applyQuaternion(this.object3d.rotation);
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
			data[index + 0] = position[0];
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

	toJSON(): Object {
		var json = super.toJSON();
		Object.assign(json, {
			_type: "ParticleSystem"
		});
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
		gravity.div$(60.0 * 60.0);
		gravity.mul$(this.main.gravityModifier.evaluate(t));
		return gravity;
	}
}

export module ParticleSystem {
	export type MinMaxCurve = PSMinMaxCurve;
	export var  MinMaxCurve = PSMinMaxCurve;
	export type MinMaxGradient = PSMinMaxGradient;
	export var  MinMaxGradient = PSMinMaxGradient;
	export type Burst = PSBurst;
	export var  Burst = PSBurst;
	export type CollisionModule = PSCollisionModule;
	export var  CollisionModule = PSCollisionModule;
	export type ColorBySpeedModule = PSColorBySpeedModule;
	export var  ColorBySpeedModule = PSColorBySpeedModule;
	export type ColorOverLifetimeModule = PSColorOverLifetimeModule;
	export var  ColorOverLifetimeModule = PSColorOverLifetimeModule;
	export type CustomDataModule = PSCustomDataModule;
	export var  CustomDataModule = PSCustomDataModule;
	export type EmissionModule = PSEmissionModule;
	export var  EmissionModule = PSEmissionModule;
	export type ExternalForcesModule = PSExternalForcesModule;
	export var  ExternalForcesModule = PSExternalForcesModule;
	export type ForceOverLifetimeModule = PSForceOverLifetimeModule;
	export var  ForceOverLifetimeModule = PSForceOverLifetimeModule;
	export type InheritVelocityModule = PSInheritVelocityModule;
	export var  InheritVelocityModule = PSInheritVelocityModule;
	export type LightsModule = PSLightsModule;
	export var  LightsModule = PSLightsModule;
	export type LimitVelocityOverLifetimeModule = PSLimitVelocityOverLifetimeModule;
	export var  LimitVelocityOverLifetimeModule = PSLimitVelocityOverLifetimeModule;
	export type MainModule = PSMainModule;
	export var  MainModule = PSMainModule;
	export type NoiseModule = PSNoiseModule;
	export var  NoiseModule = PSNoiseModule;
	export type RotationBySpeedModule = PSRotationBySpeedModule;
	export var  RotationBySpeedModule = PSRotationBySpeedModule;
	export type RotationOverLifetimeModule = PSRotationOverLifetimeModule;
	export var  RotationOverLifetimeModule = PSRotationOverLifetimeModule;
	export type ShapeModule = PSShapeModule;
	export var  ShapeModule = PSShapeModule;
	export type SizeBySpeedModule = PSSizeBySpeedModule;
	export var  SizeBySpeedModule = PSSizeBySpeedModule;
	export type SizeOverLifetimeModule = PSSizeOverLifetimeModule;
	export var  SizeOverLifetimeModule = PSSizeOverLifetimeModule;
	export type SubEmittersModule = PSSubEmittersModule;
	export var  SubEmittersModule = PSSubEmittersModule;
	export type TextureSheetAnimationModule = PSTextureSheetAnimationModule;
	export var  TextureSheetAnimationModule = PSTextureSheetAnimationModule;
	export type TrailModule = PSTrailModule;
	export var  TrailModule = PSTrailModule;
	export type TriggerModule = PSTriggerModule;
	export var  TriggerModule = PSTriggerModule;
	export type VelocityOverLifetimeModule = PSVelocityOverLifetimeModule;
	export var  VelocityOverLifetimeModule = PSVelocityOverLifetimeModule;
}
