import * as Tea from "../Tea";

export class Bounds {
	center: Tea.Vector3;
	extents: Tea.Vector3;

	constructor(center: Tea.Vector3 = new Tea.Vector3(), size: Tea.Vector3 = new Tea.Vector3()) {
		this.center = center;
		this.extents = size.div(2);
	}

	get min(): Tea.Vector3 {
		return this.center.sub(this.extents);
	}

	get max(): Tea.Vector3 {
		return this.center.add(this.extents);
	}
	
	get size(): Tea.Vector3 {
		return this.extents.mul(2);
	}

	clone(): Bounds {
		return new Bounds(
			this.center.clone(),
			this.extents.mul(2)
		);
	}

	contains(point: Tea.Vector3): boolean {
		if (point == null) {
			return false;
		}
		var min = this.min;
		var max = this.max;
		var x = point.x, y = point.y, z = point.z;
		return min.x <= x && min.y <= y && min.z <= z
			&& max.x >= x && max.y >= y && max.z >= z;
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
