import * as Tea from "../Tea";

export class Bounds {
	min: Tea.Vector3;
	max: Tea.Vector3;
	center: Tea.Vector3;
	extents: Tea.Vector3;
	size: Tea.Vector3;

	constructor() {

	}

	toString(): string {
		return JSON.stringify(this);
	}
}
