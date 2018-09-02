import * as Tea from "../Tea";

export class Component {
	app: Tea.App;
	object3d: Tea.Object3D;

	constructor(app: Tea.App) {
		this.app = app;
	}

	update(): void {
	}
}