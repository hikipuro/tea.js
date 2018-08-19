import * as Tea from "../Tea";

export class Plane {
	point: Tea.Vector3;
	normal: Tea.Vector3;

	constructor() {
		this.point = new Tea.Vector3();
		this.normal = new Tea.Vector3();
	}

	distance(point: Tea.Vector3): number {
		var v1 = point.sub(this.point);
		var n = this.normal;
		return Math.abs(n.dot(v1) / n.magnitude);
	}

	collideLine(line: Tea.Line): boolean {
		var v1 = line.point.sub(this.point);
		var d1 = v1.dot(this.normal);
		if (Tea.Mathf.approximately(d1, 0)) {
			return true;
		}
		var d2 = line.direction.dot(this.normal);
		return !Tea.Mathf.approximately(d2, 0);
	}

	collideLineSegment(line: Tea.LineSegment): boolean {
		var v1 = line.point.sub(this.point);
		var v2 = line.point2.sub(this.point);
		var d1 = v1.dot(this.normal);
		var d2 = v2.dot(this.normal);
		return d1 * d2 <= 0;
	}
}
