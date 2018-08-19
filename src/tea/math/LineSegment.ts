import * as Tea from "../Tea";
import { Line } from "./Line";

export class LineSegment extends Line {
	constructor() {
		super();
	}

	get point2(): Tea.Vector3 {
		return this.point.add(this.direction);
	}
	set point2(value: Tea.Vector3) {
		this.direction = value.sub(this.point);
	}

	containsPoint(point: Tea.Vector3): boolean {
		if (super.containsPoint(point) === false) {
			return false;
		}
		var v = this.direction;
		var v1 = point.sub(this.point);
		if (v.dot(v1) < 0) {
			return false;
		}
		return v1.magnitude <= v.magnitude;
	}

	closestPoint(point: Tea.Vector3): Tea.Vector3 {
		var v = this.direction;
		var vp = point.sub(this.point);
		var t = v.normalized.dot(vp) / v.magnitude;
		if (t < 0) {
			return this.point.clone();
		}
		if (t > 1) {
			return this.point2;
		}
		var h = v.mul(t).sub(vp);
		return point.add(h);
	}
}
