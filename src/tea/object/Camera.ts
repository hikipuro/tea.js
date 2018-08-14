import * as Tea from "../Tea";
import { Component } from "./Component";

export class Camera extends Component {
	position: Tea.Vector3;
	rotation: Tea.Vector3;

	fieldOfView: number;
	nearClipPlane: number;
	farClipPlane: number;
	backgroundColor: Tea.Color;
	orthographic: boolean;
	orthographicSize: number;
	rect: Tea.Rect;

	protected _cameraToWorldMatrix: Tea.Matrix4x4;
	protected _worldToCameraMatrix: Tea.Matrix4x4;
	protected _projectionMatrix: Tea.Matrix4x4;

	constructor(app: Tea.App) {
		super(app);
		this.position = new Tea.Vector3(0, 1, -10);
		this.rotation = Tea.Vector3.zero;
		this.fieldOfView = 60;
		this.nearClipPlane = 0.3;
		this.farClipPlane = 1000;
		this.backgroundColor = Tea.Color.background;
		this.orthographic = false;
		this.orthographicSize = 5;
		this.rect = new Tea.Rect(0, 0, 1, 1);
		this.update();
	}

	get aspect(): number {
		const rect = this.getViewportRect();
		const width = this.app.width;
		const height = this.app.height;
		return (width * rect.width) / (height * rect.height);
	}

	get cameraToWorldMatrix(): Tea.Matrix4x4 {
		return this._cameraToWorldMatrix;
	}

	get worldToCameraMatrix(): Tea.Matrix4x4 {
		return this._worldToCameraMatrix;
	}

	get projectionMatrix(): Tea.Matrix4x4 {
		return this._projectionMatrix;
	}

	update(): void {
		let view = Tea.Matrix4x4.translate(this.position);
		view = view.mul(Tea.Matrix4x4.rotateZXY(this.rotation));
		view.convertToLH();
		this._cameraToWorldMatrix = view;

		view = view.inverse;
		this._worldToCameraMatrix = view;

		let projection: Tea.Matrix4x4;
		if (this.orthographic) {
			projection = Tea.Matrix4x4.ortho(
				this.orthographicSize,
				this.aspect,
				this.nearClipPlane,
				this.farClipPlane
			);
		} else {
			projection = Tea.Matrix4x4.perspective(
				this.fieldOfView,
				this.aspect,
				this.nearClipPlane,
				this.farClipPlane
			);
		}
		this._projectionMatrix = projection;

		this.clear();
	}

	screenPointToRay(position: Tea.Vector3): Tea.Ray {
		const p = position.clone();
		p.z = this.nearClipPlane;
		const near = this.screenToWorldPoint(p);
		p.z = this.farClipPlane;
		const far = this.screenToWorldPoint(p);
		return new Tea.Ray(
			near,
			far.sub(near).normalized
		);
	}

	screenToViewportPoint(position: Tea.Vector3): Tea.Vector3 {
		const viewport = position.clone();
		const rect = this.getViewportRect();
		viewport.x = viewport.x / this.app.width;
		viewport.x = (viewport.x - rect.x) / rect.width;
		viewport.y = viewport.y / this.app.height;
		viewport.y = (viewport.y - rect.y) / rect.height;
		return viewport;
	}

	screenToWorldPoint(position: Tea.Vector3): Tea.Vector3 {
		if (position == null) {
			return Tea.Vector3.zero;
		}
		const p = this.screenToViewportPoint(position);
		//const rect = this.getViewportRect();
		//p.y = p.y - 0.5;
		return this.viewportToWorldPoint(p);
	}

	viewportPointToRay(position: Tea.Vector3): Tea.Ray {
		const p = position.clone();
		p.z = this.nearClipPlane;
		const near = this.viewportToWorldPoint(p);
		p.z = this.farClipPlane;
		const far = this.viewportToWorldPoint(p);
		return new Tea.Ray(
			near,
			far.sub(near).normalized
		);
	}

	viewportToScreenPoint(position: Tea.Vector3): Tea.Vector3 {
		const screen = position.clone();
		screen.x = screen.x * this.app.width;
		screen.y = screen.y * this.app.height;
		return screen;
	}

	viewportToWorldPoint(position: Tea.Vector3): Tea.Vector3 {
		if (position == null) {
			return Tea.Vector3.zero;
		}

		const p = position.clone();
		p.z = 1;
		const far = this.unproject(p);
		let ray = far.sub(this.position).normalized;

		let rotation = new Tea.Vector3(0, 0, 1);
		rotation.rotateX(this.rotation.x);
		rotation.rotateY(this.rotation.y);
		rotation.rotateZ(this.rotation.z);
		let d = Tea.Vector3.dot(ray, rotation.normalized);
		
		return this.position.add(ray.mul(position.z / d));
	}

	unproject(viewport: Tea.Vector3): Tea.Vector3 {
		const view = this.worldToCameraMatrix;
		const projection = this.projectionMatrix;
		let vp = projection.mul(view);
		vp = vp.inverse;

		let world = viewport.clone();
		world.x = world.x * 2 - 1;
		world.y = world.y * 2 - 1;
		world.applyMatrix4(vp);
		return world;
	}

	/*
	lookAt(eye): void {
		this.vMatrix = Matrix4.identity;
		this.vMatrix = this.vMatrix.lookAt(eye, [0, 0, 0], [0, 1, 0]);
	}
	*/

	protected getViewportRect(): Tea.Rect {
		const rect = this.rect.clone();
		if (rect.x < 0) {
			rect.width += rect.x;
			rect.x = 0;
		}
		if (rect.y < 0) {
			rect.height += rect.y;
			rect.y = 0;
		}
		if (rect.xMax > 1) {
			rect.width = 1 - rect.x;
		}
		if (rect.yMax > 1) {
			rect.height = 1 - rect.y;
		}
		return rect;
	}

	protected clear(): void {
		const gl = this.app.gl;
		const color = this.backgroundColor;
		gl.clearColor(color.r, color.g, color.b, color.a);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		// STENCIL_BUFFER_BIT
	}

	protected flush(): void {
		const gl = this.app.gl;
		gl.flush();
	}
}
