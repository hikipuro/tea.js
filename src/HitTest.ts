import * as Tea from "./tea/Tea";

export class HitTest extends Tea.Script {
	update(): void {
		var mouse = this.mouse;
		if (mouse.isDown(0)) {
			//console.log("mouse down", mouse.x, mouse.y);
			var p2 = new Tea.Vector3(mouse.x, mouse.y, 0);
			var ray = this.scene.mainCamera.screenPointToRay(p2);
			var r = this.object3d.getComponent(Tea.MeshRenderer);
			var box = this.object3d.getComponent(Tea.BoxCollider);
			if (box != null && box.testRay(ray)) {
				console.log("HitTest: true");
				r.material.color = Tea.Color.red;
			} else {
				console.log("HitTest: false");
				r.material.color = Tea.Color.white;
			}
		}
	}
}
