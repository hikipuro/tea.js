import * as Tea from "../Tea";
import { Component } from "./Component";

export class Collider extends Component {
	bounds: Tea.Bounds;
	
	constructor(app: Tea.App) {
		super(app);
	}

	raycast(ray: Tea.Ray, hitInfo: Tea.RaycastHit, maxDistance: number): boolean {
		return false;
	}
}
