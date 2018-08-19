import * as Tea from "../Tea";

export class Sphere {
	center: Tea.Vector3;
	r: number;

	constructor() {
		this.center = new Tea.Vector3();
		this.r = 0;
	}

	collideSphere(sphere: Sphere): boolean {
		var d = this.center.distance(sphere.center);
		return d <= (this.r + sphere.r);
	}
}