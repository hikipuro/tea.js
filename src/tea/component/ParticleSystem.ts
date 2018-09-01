import * as Tea from "../Tea";
import { Component } from "../object/Component";

class Particle {
	position: Tea.Vector3;
	velocity: Tea.Vector3;
	color: Tea.Color;
	size: number;
	lifetime: number;

	constructor() {
		this.position = new Tea.Vector3();
		this.velocity = new Tea.Vector3(
			(Math.random() - 0.5) / 4,
			Math.random() / 2,
			(Math.random() - 0.5) / 4
		);
		this.color = new Tea.Color(
			Math.random(), Math.random(), Math.random(), 1
		);
		this.size = Math.random() * 5 + 5;
		this.lifetime = Math.random() * 120;
	}

	update(): boolean {
		if (this.lifetime <= 0) {
			return true;
		}
		this.lifetime--;
		this.position.add$(this.velocity);
		this.velocity.y -= 0.01;
	}
}

export class ParticleSystem extends Component {
	particles: Array<Particle>;
	//pointSize: number;
	main: ParticleSystem.MainModule;

	constructor(app: Tea.App) {
		super(app);
		this.particles = [];
		//this.pointSize = 10;
		this.main = new ParticleSystem.MainModule();
	}

	get particleCount(): number {
		return this.particles.length;
	}

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

	update(): void {
		var particles = this.particles;
		var length = particles.length;
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
		var particles = this.particles;
		var maxParticles = this.main.maxParticles;
		if (particles.length + count > maxParticles) {
			count = maxParticles - particles.length;
		}
		for (var i = 0; i < count; i++) {
			this.particles.push(new Particle());
		}
	}
}

export module ParticleSystem {
	export class MainModule {
		maxParticles: number;

		constructor() {
			this.maxParticles = 1000;
		}
	}
}
