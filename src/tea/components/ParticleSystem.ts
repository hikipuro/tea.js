import * as Tea from "../Tea";
import { Component } from "./Component";
import { PSMinMaxCurve } from "../particles/MinMaxCurve";
import { PSBurst } from "../particles/Burst";
import { PSCollisionModule } from "../particles/CollisionModule";
import { PSColorBySpeedModule } from "../particles/ColorBySpeedModule";
import { PSColorOverLifetimeModule } from "../particles/ColorOverLifetimeModule";
import { PSCustomDataModule } from "../particles/CustomDataModule";
import { PSEmissionModule } from "../particles/EmissionModule";
import { PSExternalForcesModule } from "../particles/ExternalForcesModule";
import { PSForceOverLifetimeModule } from "../particles/ForceOverLifetimeModule";
import { PSInheritVelocityModule } from "../particles/InheritVelocityModule";
import { PSLightsModule } from "../particles/LightsModule";
import { PSLimitVelocityOverLifetimeModule } from "../particles/LimitVelocityOverLifetimeModule";
import { PSMainModule } from "../particles/MainModule";
import { PSNoiseModule } from "../particles/NoiseModule";
import { PSRotationBySpeedModule } from "../particles/RotationBySpeedModule";
import { PSRotationOverLifetimeModule } from "../particles/RotationOverLifetimeModule";
import { PSShapeModule } from "../particles/ShapeModule";
import { PSSizeBySpeedModule } from "../particles/SizeBySpeedModule";
import { PSSizeOverLifetimeModule } from "../particles/SizeOverLifetimeModule";
import { PSSubEmittersModule } from "../particles/SubEmittersModule";
import { PSTextureSheetAnimationModule } from "../particles/TextureSheetAnimationModule";
import { PSTrailModule } from "../particles/TrailModule";
import { PSTriggerModule } from "../particles/TriggerModule";
import { PSVelocityOverLifetimeModule } from "../particles/VelocityOverLifetimeModule";

export class ParticleSystem extends Component {
	//automaticCullingEnabled: boolean;
	//collision: ParticleSystem.CollisionModule;
	//colorBySpeed: ParticleSystem.ColorBySpeedModule;
	//colorOverLifetime: ParticleSystem.ColorOverLifetimeModule;
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
	//shape: ParticleSystem.ShapeModule;
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

	constructor(app: Tea.App) {
		super(app);
		this.particles = [];
		//this.limitVelocityOverLifetime = 
		//	new ParticleSystem.LimitVelocityOverLifetimeModule();
		this.main = new ParticleSystem.MainModule();
		this.velocityOverLifetime = new ParticleSystem.VelocityOverLifetimeModule();
		this.isPlaying = false;
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
			return;
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
		this.emit(2);
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

		var main = this.main;
		var velocityOverLifetime = this.velocityOverLifetime;
		var gravity = this.object3d.scene.physics.gravity.clone();
		gravity.div$(60.0);
		gravity.mul$(this.main.gravityModifier);
		for (var i = 0; i < count; i++) {
			var particle = new Tea.Particle();
			particle.size = main.startSize;
			if (velocityOverLifetime.enabled) {
				particle.velocity.set(
					velocityOverLifetime.x,
					velocityOverLifetime.y,
					velocityOverLifetime.z
				);
			}
			particle.velocity.mul$(main.startSpeed);
			particle.color = main.startColor;
			particle.gravity = gravity;
			particle.lifetime = main.startLifetime * 60;
			this.particles.push(particle);
		}
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
}

export module ParticleSystem {
	export type MinMaxCurve = PSMinMaxCurve;
	export var  MinMaxCurve = PSMinMaxCurve;
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
