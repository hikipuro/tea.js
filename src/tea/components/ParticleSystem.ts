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
		this.colorOverLifetime = new ParticleSystem.ColorOverLifetimeModule();
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
			if (particles[i].update(this)) {
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
		var colorOverLifetime = this.colorOverLifetime;
		var velocityOverLifetime = this.velocityOverLifetime;

		var gravity = this.object3d.scene.physics.gravity.clone();
		gravity.div$(60.0);
		gravity.mul$(this.main.gravityModifier.evaluate(0.0));
		gravity.mul$(this.main.gravityModifierMultiplier);

		var lifetime = main.startLifetime.evaluate(0.0);
		lifetime *= main.startLifetimeMultiplier * 60.0;

		var startSize = main.startSize.evaluate(0.0);
		startSize *= main.startSizeMultiplier;

		var startSpeed = main.startSpeed.evaluate(0.0);
		startSpeed *= main.startSpeedMultiplier;

		var startColor = main.startColor.evaluate(0.0);

		for (var i = 0; i < count; i++) {
			var particle = new Tea.Particle();
			particle.size = startSize;
			if (velocityOverLifetime.enabled) {
				particle.velocity.set(
					velocityOverLifetime.x.constant,
					velocityOverLifetime.y.constant,
					velocityOverLifetime.z.constant
				);
			}
			particle.velocity.mul$(startSpeed);
			particle.color = startColor;
			if (colorOverLifetime.enabled) {
				particle.color = colorOverLifetime.color.evaluate(0.0);
			}
			particle.gravity = gravity;
			particle.lifetime = lifetime;
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
