import * as Tea from "../Tea";
import { Component } from "./Component";

export class Camera extends Component {
	position: Tea.Vector3;
	rotation: Tea.Quaternion;

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
	protected _prevRect: Tea.Rect;

	constructor(app: Tea.App) {
		super(app);
		this.position = new Tea.Vector3(0, 1, -10);
		this.rotation = new Tea.Quaternion();
		this.fieldOfView = 60;
		this.nearClipPlane = 0.3;
		this.farClipPlane = 1000;
		this.backgroundColor = Tea.Color.background;
		this.orthographic = false;
		this.orthographicSize = 5;
		this.rect = new Tea.Rect(0, 0, 1, 1);
		this._prevRect = new Tea.Rect();
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
		var view = Tea.Matrix4x4.tr(
			this.position,
			this.rotation
		);
		view.toggleHand();
		this._cameraToWorldMatrix = view;

		view = view.inverse;
		this._worldToCameraMatrix = view;

		var projection: Tea.Matrix4x4;
		if (this.orthographic) {
			var h = this.orthographicSize;
			var w = h * this.aspect;
			projection = Tea.Matrix4x4.ortho(
				-w, w, -h, h,
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
		//projection.toggleHand();
		this._projectionMatrix = projection;

		this.setViewport();
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

		if (this.orthographic) {
			var p = position.clone();
			p.z = -1;
			var near = this.unproject(p);
			p.z = 1;
			var far = this.unproject(p);
			var direction = far.sub(near).normalized;
			var z = (position.z - this.nearClipPlane);
			return near.add(direction.mul(z));
		}

		var p = position.clone();
		p.z = 1;
		var far = this.unproject(p);
		var ray = far.sub(this.position).normalized;

		var direction = new Tea.Vector3(0, 0, 1);
		//direction.rotate$(this.rotation.eulerAngles.mul(Tea.Mathf.Deg2Rad));
		direction = this.rotation.mul(direction);
		var d = Tea.Vector3.dot(ray, direction.normalized);

		return this.position.add(ray.mul(position.z / d));
	}

	unproject(viewport: Tea.Vector3): Tea.Vector3 {
		var view = this.worldToCameraMatrix;
		var projection = this.projectionMatrix;
		var vp = projection.mul(view);
		vp = vp.inverse;

		var world = viewport.clone();
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
	
	protected setViewport(): void {
		var gl = this.app.gl;

		if (this._prevRect.equals(this.rect)) {
			return;
		}

		var rect = this.rect.clone();
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

		var width = this.app.width;
		var height = this.app.height;

		gl.viewport(
			rect.x * width,
			rect.y * height,
			rect.width * width,
			rect.height * height
		);
		gl.scissor(
			rect.x * width,
			rect.y * height,
			rect.width * width,
			rect.height * height
		);
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
