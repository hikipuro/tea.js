import * as Tea from "../Tea";

export class CameraStatus {
	position: Tea.Vector3;
	rotation: Tea.Quaternion;
	fieldOfView: number;
	aspect: number;
	nearClipPlane: number;
	farClipPlane: number;
	orthographicSize: number;

	constructor() {
		this.position = new Tea.Vector3(0.0001, 0.0002, 0.0003);
		this.rotation = new Tea.Quaternion(0.0001, 0.0002, 0.0003);
		this.fieldOfView = 0;
		this.aspect = 0;
		this.nearClipPlane = 0;
		this.farClipPlane = 0;
		this.orthographicSize = 0;
	}

	destroy(): void {
		this.position = undefined;
		this.rotation = undefined;
		this.fieldOfView = undefined;
		this.aspect = undefined;
		this.nearClipPlane = undefined;
		this.farClipPlane = undefined;
		this.orthographicSize = undefined;
	}

	isViewChanged(object3d: Tea.Object3D): boolean {
		return !this.position.equals(object3d.position)
			|| !this.rotation.equals(object3d.rotation);
	}

	isPerspectiveChanged(camera: Tea.Camera, aspect: number): boolean {
		return this.fieldOfView != camera.fieldOfView
			|| this.aspect != aspect
			|| this.nearClipPlane != camera.nearClipPlane
			|| this.farClipPlane != camera.farClipPlane;
	}

	isOrthoChanged(camera: Tea.Camera, aspect: number): boolean {
		return this.aspect != aspect
			|| this.orthographicSize != camera.orthographicSize
			|| this.nearClipPlane != camera.nearClipPlane
			|| this.farClipPlane != camera.farClipPlane;
	}
}
