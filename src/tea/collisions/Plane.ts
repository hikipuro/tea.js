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
		var n = this.normal;
		return point.sub(n.mul(d));
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
