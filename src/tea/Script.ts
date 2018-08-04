import * as Tea from "./Tea";

export class Script {
	object3d: Tea.Object3D;

	constructor() {

	}

	get position(): Tea.Vector3 {
		return this.object3d.position;
	}
	set position(value: Tea.Vector3) {
		this.object3d.position = value;
	}

	start(): void {

	}

	update(): void {

	}
}