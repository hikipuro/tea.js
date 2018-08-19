import * as Tea from "../Tea";

export class Polygon {
	points: Array<Tea.Vector3>;

	constructor() {
		this.points = [];
	}

	addPoint(value: Tea.Vector3): void;
	addPoint(x: number, y: number, z: number): void;
	addPoint(x: number | Tea.Vector3, y: number = 0, z: number = 0): void {
		if (x instanceof Tea.Vector3) {
			this.points.push(x);
			return;
		}
		var v = new Tea.Vector3(x, y, z);
		this.points.push(v);
	}

	containsPoint(point: Tea.Vector3): boolean;
	containsPoint(x: number, y: number, z: number): boolean;
	containsPoint(x: number | Tea.Vector3, y: number = 0, z: number = 0): boolean {
		var points = this.points;
		var length = points.length;
		if (length < 3) {
			return false;
		}
		var point: Tea.Vector3;
		if (x instanceof Tea.Vector3) {
			point = x;
		} else {
			point = new Tea.Vector3(x, y, z);
		}
		var p0 = points[0];
		var pn = points[length - 1];
		var n0 = p0.sub(pn).cross(point.sub(p0)).normalized;
		for (var i = 0; i < length - 1; i++) {
			var p1 = points[i];
			var p2 = points[i + 1];
			var n1 = p2.sub(p1).cross(point.sub(p2)).normalized;
			if (n0.approxEquals(n1) === false) {
				return false;
			}
		}
		return true;
	}
}