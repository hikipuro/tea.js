import * as Tea from "../Tea";

export class CameraStatus {
	camera: Tea.Camera;
	position: Tea.Vector3;
	rotation: Tea.Quaternion;
	fieldOfView: number;
	aspect: number;
	nearClipPlane: number;
	farClipPlane: number;
	orthographic: boolean;
	orthographicSize: number;
	frustumPlanes: Array<Tea.Plane>;

	cameraToWorldMatrix: Tea.Matrix4x4;
	projectionMatrix: Tea.Matrix4x4;
	protected _worldToCameraMatrix: Tea.Matrix4x4;
	protected _viewProjectionMatrix: Tea.Matrix4x4;
	protected _inverseViewProjectionMatrix: Tea.Matrix4x4;

	constructor(camera: Tea.Camera) {
		this.camera = camera;
		this.position = new Tea.Vector3(0.0001, 0.0002, 0.0003);
		this.rotation = new Tea.Quaternion(0.0001, 0.0002, 0.0003);
		this.fieldOfView = 0;
		this.aspect = 0;
		this.nearClipPlane = 0;
		this.farClipPlane = 0;
		this.orthographic = false;
		this.orthographicSize = 0;
		this.frustumPlanes = null;
		this.cameraToWorldMatrix = new Tea.Matrix4x4();
		this.projectionMatrix = new Tea.Matrix4x4();
		this._worldToCameraMatrix = null;
		this._viewProjectionMatrix = null;
		this._inverseViewProjectionMatrix = null;
	}

	get worldToCameraMatrix(): Tea.Matrix4x4 {
		if (this._worldToCameraMatrix == null) {
			this._worldToCameraMatrix = this.cameraToWorldMatrix.inverse;
		}
		return this._worldToCameraMatrix;
	}

	get viewProjectionMatrix(): Tea.Matrix4x4 {
		if (this._viewProjectionMatrix == null) {
			this._viewProjectionMatrix = this.projectionMatrix.mul(
				this.worldToCameraMatrix
			);
		}
		return this._viewProjectionMatrix;
	}

	get inverseViewProjectionMatrix(): Tea.Matrix4x4 {
		if (this._inverseViewProjectionMatrix == null) {
			this._inverseViewProjectionMatrix = this.viewProjectionMatrix.inverse;
		}
		return this._inverseViewProjectionMatrix;
	}

	destroy(): void {
		this.position = undefined;
		this.rotation = undefined;
		this.fieldOfView = undefined;
		this.aspect = undefined;
		this.nearClipPlane = undefined;
		this.farClipPlane = undefined;
		this.orthographicSize = undefined;
		this.frustumPlanes = undefined;
		this.cameraToWorldMatrix = undefined;
		this.projectionMatrix = undefined;
		this._worldToCameraMatrix = undefined;
		this._viewProjectionMatrix = undefined;
		this._inverseViewProjectionMatrix = undefined;
	}

	updateMatrix(): void {
		var object3d = this.camera.object3d;
		if (object3d == null) {
			return;
		}
		var isChanged = false;
		var camera = this.camera;
		var op = object3d.position;
		var or = object3d.rotation;
		if (this.isViewChanged(object3d)) {
			this.cameraToWorldMatrix.setTR(op, or);
			var m = this.cameraToWorldMatrix;
			m[8]  *= -1.0;
			m[9]  *= -1.0;
			m[10] *= -1.0;
			m[11] *= -1.0;
			this._worldToCameraMatrix = null;
			var p = this.position;
			var r = this.rotation;
			p[0] = op[0];
			p[1] = op[1];
			p[2] = op[2];
			r[0] = or[0];
			r[1] = or[1];
			r[2] = or[2];
			r[3] = or[3];
			isChanged = true;
		}

		var aspect = this.camera.aspect;
		if (this.orthographic) {
			if (this.isOrthoChanged(camera, aspect)) {
				var h = camera.orthographicSize;
				var w = h * aspect;
				this.projectionMatrix.ortho(
					-w, w, -h, h,
					camera.nearClipPlane,
					camera.farClipPlane
				);
				this.aspect = aspect;
				this.orthographicSize = camera.orthographicSize;
				this.nearClipPlane = camera.nearClipPlane;
				this.farClipPlane = camera.farClipPlane;
				isChanged = true;
			}
		} else {
			if (this.isPerspectiveChanged(camera, aspect)) {
				this.projectionMatrix.perspective(
					camera.fieldOfView,
					aspect,
					camera.nearClipPlane,
					camera.farClipPlane
				);
				this.fieldOfView = camera.fieldOfView;
				this.aspect = aspect;
				this.nearClipPlane = camera.nearClipPlane;
				this.farClipPlane = camera.farClipPlane;
				isChanged = true;
			}
		}

		if (isChanged) {
			this._viewProjectionMatrix = null;
			this._inverseViewProjectionMatrix = null;
			this.frustumPlanes = Tea.GeometryUtil.calculateFrustumPlanes(camera);
		}
	}

	isViewChanged(object3d: Tea.Object3D): boolean {
		var p = this.position;
		var r = this.rotation;
		var op = object3d.position;
		var or = object3d.rotation;
		return (
			p[0] !== op[0] ||
			p[1] !== op[1] ||
			p[2] !== op[2] ||
			r[0] !== or[0] ||
			r[1] !== or[1] ||
			r[2] !== or[2] ||
			r[3] !== or[3]
		);
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

	updateStereo(isLeft: boolean): void {
		var camera = this.camera;
		var object3d = camera.object3d;
		if (object3d == null) {
			return;
		}
		var op = object3d.position.clone();
		var or = object3d.rotation;
		if (isLeft) {
			op.x -= camera.stereoDistance;
		} else {
			op.x += camera.stereoDistance;
		}

		this.cameraToWorldMatrix.setTR(op, or);
		this.cameraToWorldMatrix.toggleHand();
		this._worldToCameraMatrix = null;

		if (this.orthographic) {
			var aspect = camera.aspect;
			var h = camera.orthographicSize;
			var w = h * aspect;
			this.projectionMatrix.ortho(
				-w, w, -h, h,
				camera.nearClipPlane,
				camera.farClipPlane
			);
		} else {
			this.projectionMatrix.perspective(
				camera.fieldOfView,
				camera.aspect,
				camera.nearClipPlane,
				camera.farClipPlane
			);
		}

		this._viewProjectionMatrix = null;
		this._inverseViewProjectionMatrix = null;
		//this.frustumPlanes = Tea.GeometryUtil.calculateFrustumPlanes(this);
	}
}
