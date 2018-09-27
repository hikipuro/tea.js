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
		this.lifetime = 60;
	}

	update(): boolean {
		if (this.lifetime <= 0) {
			return true;
		}
		this.lifetime--;
		this.position.add$(this.velocity);
		this.velocity.add$(this.gravity);
	}
}
