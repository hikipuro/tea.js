import * as Tea from "./tea/Tea";

export class Rotate extends Tea.Script {
	count: number = 0;

	update(): void {
		//console.log(this.object3d.name);
		//console.log("update");
		this.count++;

		this.object3d.rotateAround(new Tea.Vector3(2,0,0), new Tea.Vector3(1, 2), 2);
	}
}
