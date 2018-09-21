import * as Tea from "../Tea";

export class Component {
	app: Tea.App;
	object3d: Tea.Object3D;
	enabled: boolean;

	constructor(app: Tea.App) {
		this.app = app;
		this.enabled = true;
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
