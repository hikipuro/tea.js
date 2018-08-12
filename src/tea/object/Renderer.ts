import * as Tea from "../Tea";

export class Renderer {
	object3d: Tea.Object3D;
	shader: Tea.Shader;

	constructor() {
	}

	get localToWorldMatrix(): Tea.Matrix4 {
		const object3d = this.object3d;
		return object3d.localToWorldMatrix;
	}

	render(camera: Tea.Camera): void {
	}
}
