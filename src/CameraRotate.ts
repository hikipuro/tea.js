import * as Tea from "./tea/Tea";

export class CameraRotate extends Tea.Script {
	count: number = 0;

	update(): void {
		this.count++;
		this.rotateAround(Tea.vec3(2), Tea.Vector3.up, 2);
	}
}
