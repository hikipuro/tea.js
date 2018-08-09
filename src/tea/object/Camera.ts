import * as Tea from "../Tea";
import { Object3D } from "./Object3D";
import { Rect } from "../math/Rect";

export class Camera extends Object3D {
	fieldOfView: number;
	nearClipPlane: number;
	farClipPlane: number;
	aspect: number;
	backgroundColor: Tea.Color;
	orthographic: boolean;
	orthographicSize: number;
	rect: Rect;

	constructor(app: Tea.App) {
		super(app);
		this.position = new Tea.Vector3(0, 1, 10);
		this.fieldOfView = 60;
		this.nearClipPlane = 0.3;
		this.farClipPlane = 1000;
		this.aspect = 1;
		this.backgroundColor = Tea.Color.background;
		this.orthographic = false;
		this.orthographicSize = 5;
		this.rect = new Rect(0, 0, 1, 1);
	}

	get cameraToWorldMatrix(): Tea.Matrix4 {
		let view = Tea.Matrix4.translate(this.position);
		view = view.mul(Tea.Matrix4.rotateZXY(this.rotation));
		view = view.inverse;
		return view;
	}

	get worldToCameraMatrix(): Tea.Matrix4 {
		let view = Tea.Matrix4.translate(this.position);
		view = view.mul(Tea.Matrix4.rotateZXY(this.rotation));
		//view = view.inverse;
		return view;
	}

	get projectionMatrix(): Tea.Matrix4 {
		const aspect = this.app.width / this.app.height;
		let projection: Tea.Matrix4;
		if (this.orthographic) {
			projection = projection.mul(Tea.Matrix4.ortho(
				this.orthographicSize,
				aspect,
				this.nearClipPlane,
				this.farClipPlane
			));
		} else {
			projection = Tea.Matrix4.perspective(
				this.fieldOfView,
				aspect,
				this.nearClipPlane,
				this.farClipPlane
			);
		}
		return projection;
	}

	screenToWorldPoint(position: Tea.Vector3): Tea.Vector3 {
		if (position == null) {
			return Tea.Vector3.zero;
		}

		const p = this.screenToViewport(position);
		p.z = 1;
		const far = this.unproject(p);
		let ray = far.sub(this.position).normalized;

		let rotation = new Tea.Vector3(0, 0, -1);
		rotation.rotateX(this.rotation.x);
		rotation.rotateY(this.rotation.y);
		rotation.rotateZ(this.rotation.z);
		let d = Tea.Vector3.dot(ray, rotation.normalized);
		
		return this.position.add(ray.mul(position.z / d));
	}

	screenToViewport(screen: Tea.Vector3): Tea.Vector3 {
		const viewport = screen.clone();
		viewport.x = 2 * viewport.x / this.app.width - 1;
		viewport.y = 2 * viewport.y / this.app.height - 1;
		return viewport;
	}

	unproject(viewport: Tea.Vector3): Tea.Vector3 {
		const view = this.cameraToWorldMatrix;
		const projection = this.projectionMatrix;
		let vp = projection.mul(view);
		vp = vp.inverse;

		let result = viewport.clone();
		result.applyMatrix4(vp);
		return result;
	}

	/*
	lookAt(eye): void {
		this.vMatrix = Matrix4.identity;
		this.vMatrix = this.vMatrix.lookAt(eye, [0, 0, 0], [0, 1, 0]);
	}
	*/
}
