import * as Tea from "../Tea";

export class Renderer {
	object3d: Tea.Object3D;
	shader: Tea.Shader;

	constructor() {
	}

	get localToWorldMatrix(): Tea.Matrix4 {
		let m = Tea.Matrix4.identity;
		m = m.mul(Tea.Matrix4.translate(this.object3d.position));
		m = m.mul(Tea.Matrix4.rotateZXY(this.object3d.rotation));
		m = m.mul(Tea.Matrix4.scale(this.object3d.scale));
		return m;
	}

	render(camera: Tea.Camera): void {
	}
}
