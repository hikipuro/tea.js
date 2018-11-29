import * as Tea from "../Tea";

export class Plane {
	distance: number;
	normal: Tea.Vector3;

	protected _tmpVec3: Tea.Vector3 = new Tea.Vector3();

	constructor(normal: Tea.Vector3, distance: number);
	constructor(normal: Tea.Vector3, point: Tea.Vector3);
	constructor(a: Tea.Vector3, b: Tea.Vector3, c: Tea.Vector3);
	constructor(a: Tea.Vector3, b: number | Tea.Vector3, c?: Tea.Vector3) {
		if (b instanceof Tea.Vector3) {
			if (c instanceof Tea.Vector3) {
				this.set3Points(a, b, c);
				return;
			}
			this.setNormalAndPosition(a, b);
			return;
		}
		this.distance = b;
		this.normal = a.normalized;
	}

	get point(): Tea.Vector3 {
		return this.normal.mul(-this.distance);
	}

	get flipped(): Plane {
		return new Plane(
			this.normal.mul(-1),
			-this.distance
		);
	}

	static translate(plane: Plane, translation: Tea.Vector3): Plane {
		var p = plane.clone();
		p.translate(translation);
		return p;
	}

	clone(): Plane {
		return new Plane(
			this.normal,
			this.distance
		);
	}

	equals(plane: Plane): boolean {
		if (plane == null) {
			return false;
		}
		return this.normal.equals(plane.normal)
			&& this.distance == plane.distance;
	}

	toString(): string {
		var normal = this.normal;
		return Tea.StringUtil.format(
			"{ normal: [{0}, {1}, {2}], distance: {3} }",
			normal.x.toFixed(2),
			normal.y.toFixed(2),
			normal.z.toFixed(2),
			this.distance.toFixed(2)
		);
	}

	closestPointOnPlane(point: Tea.Vector3): Tea.Vector3 {
		var d = this.getDistanceToPoint(point);
		var n = this._tmpVec3;
		n.copy(this.normal);
		n.mul$(d);
		return point.sub(n);
	}

	flip(): void {
		this.normal = this.normal.mul(-1);
		this.distance = -this.distance;
	}

	getDistanceToPoint(point: Tea.Vector3): number {
		var p = this._tmpVec3;
		p.copy(this.normal);
		p.mul$(this.distance);
		p.add$(point);
		return p.dot(this.normal);
	}

	getSide(point: Tea.Vector3): boolean {
		var v1 = point.sub(this.point);
		var n = this.normal;
		return v1.dot(n) > 0;
	}

	//raycast(ray: Tea.Ray, enter: number): void {
	//}

	sameSide(point0: Tea.Vector3, point1: Tea.Vector3): boolean {
		return this.getSide(point0) === this.getSide(point1);
	}

	set3Points(a: Tea.Vector3, b: Tea.Vector3, c: Tea.Vector3): void {
		var v0 = b.sub(a);
		var v1 = c.sub(a);
		this.normal = v0.cross(v1).normalized;
		this.distance = -a.dot(this.normal);
	}

	setNormalAndPosition(normal: Tea.Vector3, point: Tea.Vector3): void {
		this.normal = normal.normalized;
		this.distance = -normal.dot(point);
	}

	translate(translation: Tea.Vector3): void {
		var d = this.normal.scale(translation);
		this.distance += d.magnitude;
	}

	isParallel(plane: Plane): boolean {
		if (plane == null) {
			return false;
		}
		return this.normal.isParallel(plane.normal);
	}

	intersectLine(line: Tea.Line): Tea.Vector3 {
		if (line == null) {
			return null;
		}
		var n = this.normal;
		var d = n.dot(line.direction);
		if (Tea.Mathf.approximately(d, 0.0)) {
			return null;
		}
		var t = (-this.distance - n.dot(line.point)) / d;
		return line.point.add(line.direction.mul(t));
	}

	intersectPlane(plane: Plane): Tea.Line {
		if (plane == null) {
			return null;
		}
		var u = this._tmpVec3;
		u.copy(this.normal);
		u.cross$(plane.normal);
		
		var ax = u[0] >= 0 ? u[0] : -u[0];
		var ay = u[1] >= 0 ? u[1] : -u[1];
		var az = u[2] >= 0 ? u[2] : -u[2];
		if (ax + ay + az < Tea.Mathf.Epsilon) {
			// parallel
			return null;
		}

		// max coordinate
		var maxc = 3;
		if (ax > ay) {
			if (ax > az) {
				maxc =  1;
			}
		} else {
			if (ay > az) {
				maxc =  2;
			}
		}
	
		var d1 = this.distance;
		var d2 = plane.distance;
		var n1 = this.normal;
		var n2 = plane.normal;
		var point = new Tea.Vector3();
		
		switch (maxc) {
			case 1:
				point[0] = 0.0;
				point[1] = (d2 * n1[2] - d1 * n2[2]) / u[0];
				point[2] = (d1 * n2[1] - d2 * n1[1]) / u[0];
				break;
			case 2:
				point[0] = (d1 * n2[2] - d2 * n1[2]) / u[1];
				point[1] = 0.0;
				point[2] = (d2 * n1[0] - d1 * n2[0]) / u[1];
				break;
			case 3:
				point[0] = (d2 * n1[1] - d1 * n2[1]) / u[2];
				point[1] = (d1 * n2[0] - d2 * n1[0]) / u[2];
				point[2] = 0.0;
				break;
		}
		var line = new Tea.Line();
		line.direction.copy(u.normalized);
		line.point.copy(point);
		return line;
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
