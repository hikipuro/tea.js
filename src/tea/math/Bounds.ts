import * as Tea from "../Tea";

export class Bounds {
	center: Tea.Vector3;
	extents: Tea.Vector3;

	constructor(center?: Tea.Vector3, size?: Tea.Vector3) {
		if (center == null) {
			center = new Tea.Vector3();
		}
		if (size == null) {
			size = new Tea.Vector3();
		}
		this.center = center;
		this.extents = size.mul(0.5);
	}

	get min(): Tea.Vector3 {
		return this.center.sub(this.extents);
	}

	get max(): Tea.Vector3 {
		return this.center.add(this.extents);
	}
	
	get size(): Tea.Vector3 {
		return this.extents.mul(2.0);
	}

	get isEmpty(): boolean {
		var e = this.extents;
		return e[0] === 0 && e[1] === 0 && e[2] === 0;
	}

	clone(): Bounds {
		return new Bounds(
			this.center.clone(),
			this.extents.mul(2.0)
		);
	}

	copy(value: Bounds): Bounds {
		if (value == null) {
			return;
		}
		var c = this.center;
		var e = this.extents;
		var vc = value.center;
		var ve = value.extents;
		c[0] = vc[0];
		c[1] = vc[1];
		c[2] = vc[2];
		e[0] = ve[0];
		e[1] = ve[1];
		e[2] = ve[2];
		return this;
	}

	equals(value: Bounds): boolean {
		if (value == null) {
			return false;
		}
		return this.center.equals(value.center)
			&& this.extents.equals(value.extents);
	}

	approxEquals(value: Bounds): boolean {
		if (value == null) {
			return false;
		}
		return this.center.approxEquals(value.center)
			&& this.extents.approxEquals(value.extents);
	}

	getPoint(index: number): Tea.Vector3 {
		var center = this.center.clone();
		var extents = this.extents;
		switch (index) {
			case 0:
				center[0] -= extents[0];
				center[1] += extents[1];
				center[2] -= extents[2];
				return center;
			case 1:
				center[0] += extents[0];
				center[1] += extents[1];
				center[2] -= extents[2];
				return center;
			case 2:
				center[0] -= extents[0];
				center[1] -= extents[1];
				center[2] -= extents[2];
				return center;
			case 3:
				center[0] += extents[0];
				center[1] -= extents[1];
				center[2] -= extents[2];
				return center;
			case 4:
				center[0] -= extents[0];
				center[1] += extents[1];
				center[2] += extents[2];
				return center;
			case 5:
				center[0] += extents[0];
				center[1] += extents[1];
				center[2] += extents[2];
				return center;
			case 6:
				center[0] -= extents[0];
				center[1] -= extents[1];
				center[2] += extents[2];
				return center;
			case 7:
				center[0] += extents[0];
				center[1] -= extents[1];
				center[2] += extents[2];
				return center;
		}
		return null;
	}

	contains(point: Tea.Vector3): boolean {
		if (point == null) {
			return false;
		}
		var min = this.min;
		var max = this.max;
		var x = point[0], y = point[1], z = point[2];
		return min[0] <= x && min[1] <= y && min[2] <= z
			&& max[0] >= x && max[1] >= y && max[2] >= z;
	}

	toString(): string {
		return JSON.stringify(this);
	}

	collideRay(ray: Tea.Ray): boolean {
		var line = new Tea.Line();
		line.point = ray.origin;
		line.direction = ray.direction;
		return this.collideLine(line);
	}

	collideLine(line: Tea.Line): boolean {
		var min = this.min, max = this.max;
		var p = line.point;
		var d = line.direction;
		var early = -Number.MAX_VALUE;
		var late = Number.MAX_VALUE;

		for (var i = 0; i < 3; i++) {
			if (d[i] === 0) {
				continue;
			}
			var id = 1.0 / d[i];
			var near = (min[i] - p[i]) * id;
			var far = (max[i] - p[i]) * id;
			if (near > far) {
				var tmp = near;
				near = far;
				far = tmp;
			}
			if (near > early) {
				early = near;
			}
			if (far < late) {
				late = far;
			}
			if (early > late) {
				return false;
			}
		}
		return true;
	}
}
