import * as Tea from "../Tea";

export class Particle {
	position: Tea.Vector3;
	velocity: Tea.Vector3;
	color: Tea.Color;
	startColor: Tea.Color;
	lifetimeColor: Tea.Gradient;
	size: number;
	lifetime: number;
	maxLifetime: number;
	gravity: Tea.Vector3;

	constructor() {
		this.position = new Tea.Vector3();
		this.velocity = new Tea.Vector3();
		this.color = new Tea.Color();
		this.startColor = Tea.Color.white.clone();
		this.lifetimeColor = new Tea.Gradient();
		this.lifetimeColor.setKeys([
			new Tea.GradientColorKey(Tea.Color.white, 0.0),
			new Tea.GradientColorKey(Tea.Color.white, 1.0)
		], [
			new Tea.GradientAlphaKey(1.0, 0.0),
			new Tea.GradientAlphaKey(1.0, 1.0)
		]);
		this.size = 1.0;
		this.lifetime = 0.0;
		this.maxLifetime = 0.0;
	}

	update(): boolean {
		if (this.lifetime <= 0) {
			return true;
		}
		var t = 1.0 - this.lifetime / this.maxLifetime;
		this.lifetime--;
		this.color.copy(this.startColor);
		this.color.scale$(this.lifetimeColor.evaluate(t));
		this.position.add$(this.velocity);
		this.velocity.add$(this.gravity);
		return false;
	}
}
