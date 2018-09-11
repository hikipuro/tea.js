import * as Tea from "../Tea";
import { Collider } from "./Collider";

export class BoxCollider extends Collider {
	center: Tea.Vector3;
	size: Tea.Vector3;

	constructor(app: Tea.App) {
		super(app);
		this.center = new Tea.Vector3();
		this.size = new Tea.Vector3();
	}

	//get bounds(): Tea.Bounds {
	//}

	//closestPoint(point: Tea.Vector3): Tea.Vector3 {
	//}

	raycast(ray: Tea.Ray, hitInfo: Tea.RaycastHit, maxDistance: number): boolean {
		return false;
	}

	testRay(ray: Tea.Ray): boolean {
		var r = this.object3d.rotation;
		var p = ray.getPoint(1);
		p.applyQuaternion(r);
		var d = ray.direction.clone();
		d.applyQuaternion(r);
		
		var extents = this.size.mul(0.5);
		var min = this.center.sub(extents);
		var max = this.center.add(extents);
		var early = -Number.MAX_VALUE;
		var late = Number.MAX_VALUE;

		for (var i = 0; i < 3; i++) {
			if (d[i] === 0) {
				continue;
			}
			var id = 1.0 / d[i];
			var near = (min[i] - p[i]) * id;
			var far = (max[i] - p[i]) * id;
			if (near > far) {
				var tmp = near;
				near = far;
				far = tmp;
			}
			if (near > early) {
				early = near;
			}
			if (far < late) {
				late = far;
			}
			if (early > late) {
				return false;
			}
		}
		return true;
	}
}
