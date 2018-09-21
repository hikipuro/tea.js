import * as Tea from "../Tea";

export class Physics {
	gravity: Tea.Vector3;

	constructor() {
		this.gravity = new Tea.Vector3(0.0, -9.81, 0.0);
	}

	toJSON(): Object {
		var json = {
			_type: "Physics",
			gravity: this.gravity
		};
		return json;
	}
}
