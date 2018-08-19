import * as Tea from "../Tea";

export class Line {
	point: Tea.Vector3;
	direction: Tea.Vector3;

	constructor() {
		this.point = new Tea.Vector3();
		this.direction = new Tea.Vector3();
	}

	distance(line: Line): number {
		var n = this.direction.cross(line.direction).normalized;
		if (Tea.Mathf.approximately(n.magnitude, 0)) {
			return line.point.distance(this.point);
		}
		return Math.abs(n.dot(line.point.sub(this.point)));
	}

	containsPoint(point: Tea.Vector3): boolean {
		var d = point.sub(this.point);
		var n = d.cross(this.direction);
		return n.approxEquals(Tea.Vector3.zero);
	}

	collideLine(line: Line): boolean {
		var v1 = this.direction;
		var v2 = line.direction;
		var v3 = line.point.sub(this.point);
		var n2 = v1.cross(v3);
		if (Tea.Mathf.approximately(n2.magnitude, 0)) {
			return true;
		}
		var n1 = v1.cross(v2);
		if (Tea.Mathf.approximately(n1.magnitude, 0)) {
			return false;
		}
		var n = n1.cross(n2);
		return Tea.Mathf.approximately(n.magnitude, 0);
	}
}
