import * as Tea from "./tea/Tea";

export class Rotate extends Tea.Script {
	count: number = 0;

	update(): void {
		//console.log(this.object3d.name);
		//console.log("update");
		this.count++;

		//this.object3d.rotateAround(new Tea.Vector3(2,0,0), new Tea.Vector3(1, 2), 2);
		const mouse = this.app.mouse;
		let p = new Tea.Vector3(mouse.x, mouse.y, 1);
		p = this.object3d.scene.camera.screenToWorldPoint(p);
		this.object3d.lookAt(p);
		this.object3d.rotate(0, 180, 0);
		//console.log(this.object3d.rotation.eulerAngles);
	}
}
