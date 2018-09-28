import * as Tea from "../Tea";

export class Particle {
	position: Tea.Vector3;
	velocity: Tea.Vector3;
	color: Tea.Color;
	size: number;
	lifetime: number;
	gravity: Tea.Vector3;

	constructor() {
		this.position = new Tea.Vector3();
		this.velocity = new Tea.Vector3();
		this.color = Tea.Color.white.clone();
		this.size = 1.0;
		this.lifetime = 0.0;
	}

	update(particleSystem: Tea.ParticleSystem): boolean {
		if (this.lifetime <= 0) {
			return true;
		}
		this.lifetime--;
		if (particleSystem.colorOverLifetime.enabled) {
			var colorOverLifetime = particleSystem.colorOverLifetime;
			this.color = colorOverLifetime.color.evaluate(1.0 - this.lifetime / 60.0);
		}
		this.position.add$(this.velocity);
		this.velocity.add$(this.gravity);
		return false;
	}
}
