import * as Tea from "./Tea";

export class Script {
	app: Tea.App;
	object3d: Tea.Object3D;

	constructor() {
	}

	get localPosition(): Tea.Vector3 {
		return this.object3d.localPosition;
	}
	set localPosition(value: Tea.Vector3) {
		this.object3d.localPosition = value;
	}

	get localRotation(): Tea.Quaternion {
		return this.object3d.localRotation;
	}
	set localRotation(value: Tea.Quaternion) {
		this.object3d.localRotation = value;
	}

	start(): void {
	}

	update(): void {
	}
}