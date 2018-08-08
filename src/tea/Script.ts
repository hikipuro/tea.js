import * as Tea from "./Tea";

export class Script {
	app: Tea.App;
	object3d: Tea.Object3D;

	constructor() {

	}

	get position(): Tea.Vector3 {
		return this.object3d.position;
	}
	set position(value: Tea.Vector3) {
		this.object3d.position = value;
	}

	get rotation(): Tea.Vector3 {
		return this.object3d.rotation;
	}
	set rotation(value: Tea.Vector3) {
		this.object3d.rotation = value;
	}

	start(): void {

	}

	update(): void {

	}
}