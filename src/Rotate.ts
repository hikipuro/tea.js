import * as Tea from "./tea/Tea";

export class Rotate extends Tea.Script {
	count: number = 0;
	rotateVec: Tea.Vector3 = new Tea.Vector3(0, 1, 0);

	update(): void {
		//console.log(this.object3d.name);
		//console.log("update");
		this.count++;

		//this.object3d.rotateAround(new Tea.Vector3(2,0,0), new Tea.Vector3(1, 2), 2);
		var mouse = this.mouse;
		var p = new Tea.Vector3(mouse.x, mouse.y, 1);
		p = this.object3d.scene.mainCamera.screenToWorldPoint(p);
		//this.object3d.lookAt(p);
		//this.object3d.rotate(0, 180, 0);
		//this.object3d.rotate(new Tea.Vector3(1, 2, 0));
		this.object3d.rotate(this.rotateVec);
		//console.log(this.object3d.rotation.eulerAngles);
	}
}
