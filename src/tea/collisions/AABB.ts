import * as Tea from "../Tea";

export class AABB {
	center: Tea.Vector3;
	extents: Tea.Vector3;

	constructor() {
		this.center = new Tea.Vector3();
		this.extents = new Tea.Vector3();
	}

	collideLine(line: Tea.Line): boolean {
		return false;
	}
}
