import * as Tea from "../Tea";

export class Ray {
	origin: Tea.Vector3;
	protected _direction: Tea.Vector3;

	constructor(origin: Tea.Vector3, direction: Tea.Vector3) {
		this.origin = origin;
		this.direction = direction;
	}

	get direction(): Tea.Vector3 {
		return this._direction;
	}
	set direction(value: Tea.Vector3) {
		this._direction = value.normalized;
	}

	getPoint(distance: number): Tea.Vector3 {
		var point = this.origin.clone();
		point = point.add(this._direction.mul(distance));
		return point;
	}

	toString(): string {
		return JSON.stringify(this);
	}
}
