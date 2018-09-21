import * as Tea from "../Tea";

export class Physics {
	gravity: Tea.Vector3;

	constructor() {
		this.gravity = new Tea.Vector3(0.0, -9.81, 0.0);
	}

	static fromJSON(app: Tea.App, json: any): Physics {
		if (json == null || json._type !== "Physics") {
			return null;
		}
		var physics = new Physics();
		physics.gravity = Tea.Vector3.fromArray(json.gravity);
		return physics;
	}

	toJSON(): Object {
		var json = {
			_type: "Physics",
			gravity: this.gravity
		};
		return json;
	}
}
