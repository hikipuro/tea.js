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

	contains(point: Tea.Vector3): boolean {
		if (point == null) {
			return false;
		}
		const min = this.min;
		const max = this.max;
		const x = point.x, y = point.y, z = point.z;
		return min.x <= x && min.y <= y && min.z <= z
			&& max.x >= x && max.y >= y && max.z >= z;
	}

	toString(): string {
		return JSON.stringify(this);
	}
}
