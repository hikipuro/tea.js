import * as Tea from "../Tea";
import { Component } from "./Component";

export class Collider extends Component {
	static readonly className: string = "Collider";
	bounds: Tea.Bounds;
	
	constructor(app: Tea.App) {
		super(app);
	}

	destroy(): void {
		this.bounds = undefined;
		super.destroy();
	}

	raycast(ray: Tea.Ray, hitInfo: Tea.RaycastHit, maxDistance: number): boolean {
		return false;
	}

	toJSON(): Object {
		var json = super.toJSON();
		json[Tea.JSONUtil.TypeName] = Collider.className;
		Object.assign(json, {
			bounds: this.bounds
		});
		return json;
	}
}
