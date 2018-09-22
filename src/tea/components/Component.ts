import * as Tea from "../Tea";

export class Component {
	app: Tea.App;
	object3d: Tea.Object3D;
	enabled: boolean;

	constructor(app: Tea.App) {
		this.app = app;
		this.enabled = true;
		this.object3d = null;
	}

	destroy(): void {
		this.app = undefined;
		this.object3d = undefined;
		this.enabled = undefined;
	}

	update(): void {
	}

	toJSON(): Object {
		var json = {
			_type: "Component",
			enabled: this.enabled
		};
		return json;
	}
}
