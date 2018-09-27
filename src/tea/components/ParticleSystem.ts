import * as Tea from "../Tea";
import { Component } from "./Component";
import { PSMinMaxCurve } from "../particles/MinMaxCurve";
import { PSMainModule } from "../particles/MainModule";
import { PSEmissionModule } from "../particles/EmissionModule";
import { PSVelocityOverLifetimeModule } from "../particles/VelocityOverLifetimeModule";
import { PSLimitVelocityOverLifetimeModule } from "../particles/LimitVelocityOverLifetimeModule";

export class ParticleSystem extends Component {
	particles: Array<Tea.Particle>;
	main: ParticleSystem.MainModule;
	emission: ParticleSystem.EmissionModule;
	velocityOverLifetime: ParticleSystem.VelocityOverLifetimeModule;
	//limitVelocityOverLifetime: ParticleSystem.LimitVelocityOverLifetimeModule;
	isPlaying: boolean;
	protected _startTime: number;

	constructor(app: Tea.App) {
		super(app);
		this.particles = [];
		this.main = new ParticleSystem.MainModule();
		this.velocityOverLifetime = new ParticleSystem.VelocityOverLifetimeModule();
		//this.limitVelocityOverLifetime = 
		//	new ParticleSystem.LimitVelocityOverLifetimeModule();
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
	export var MinMaxCurve = PSMinMaxCurve;
	export type MainModule = PSMainModule;
	export var MainModule = PSMainModule;
	export type EmissionModule = PSEmissionModule;
	export var EmissionModule = PSEmissionModule;
	export type VelocityOverLifetimeModule = PSVelocityOverLifetimeModule;
	export var VelocityOverLifetimeModule = PSVelocityOverLifetimeModule;
	export type LimitVelocityOverLifetimeModule = PSLimitVelocityOverLifetimeModule;
	export var LimitVelocityOverLifetimeModule = PSLimitVelocityOverLifetimeModule;
}
