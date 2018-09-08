import * as Tea from "../Tea";
import { Component } from "./Component";

class Prev {
	position: Tea.Vector3;
	rotation: Tea.Quaternion;

	fieldOfView: number;
	aspect: number;
	nearClipPlane: number;
	farClipPlane: number;

	constructor() {
		this.position = new Tea.Vector3(0.0001, 0.0002, 0.0003);
		this.rotation = new Tea.Quaternion(0.0001, 0.0002, 0.0003);

		this.fieldOfView = 0;
		this.aspect = 0;
		this.nearClipPlane = 0;
		this.farClipPlane = 0;
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
}

export class Camera extends Component {
	fieldOfView: number;
	nearClipPlane: number;
	farClipPlane: number;
	backgroundColor: Tea.Color;
	orthographic: boolean;
	orthographicSize: number;
	rect: Tea.Rect;
	targetTexture: Tea.RenderTexture;
	enableStereo: boolean;
	stereoDistance: number;
	stereoMode: Tea.CameraStereoMode;
	isStereoLeft: boolean;

	protected gl: WebGLRenderingContext;
	protected _cameraToWorldMatrix: Tea.Matrix4x4;
	protected _worldToCameraMatrix: Tea.Matrix4x4;
	protected _projectionMatrix: Tea.Matrix4x4;
	protected _vpMatrix: Tea.Matrix4x4;
	protected _prev: Prev;
	protected _viewportRect: Tea.Rect;
	protected static currentBGColor: Tea.Color;

	constructor(app: Tea.App) {
		super(app);
		this.gl = app.gl;
		this.fieldOfView = 60;
		this.nearClipPlane = 0.3;
		this.farClipPlane = 1000;
		this.backgroundColor = Tea.Color.background;
		this.orthographic = false;
		this.orthographicSize = 5;
		this.rect = new Tea.Rect(0, 0, 1, 1);
		this.enableStereo = false;
		this.stereoDistance = 0.1;
		this.stereoMode = Tea.CameraStereoMode.SideBySide;
		this.isStereoLeft = true;
		this._projectionMatrix = new Tea.Matrix4x4();
		this._vpMatrix = new Tea.Matrix4x4();
		this._prev = new Prev();
		this._viewportRect = new Tea.Rect();
		//this.update();
	}

	get aspect(): number {
		var rect = this.getViewportRect();
		var width = this.app.width;
		var height = this.app.height;
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

	get vpMatrix(): Tea.Matrix4x4 {
		return this._vpMatrix;
	}

	update(): void {
		if (this._prev.isViewChanged(this.object3d)) {
			var view = Tea.Matrix4x4.tr(
				this.object3d.position,
				this.object3d.rotation
			);
			view.toggleHand();
			this._cameraToWorldMatrix = view;
	
			view = view.inverse;
			this._worldToCameraMatrix = view;

			this._prev.position = this.object3d.position.clone();
			this._prev.rotation = this.object3d.rotation.clone();
		}

		if (this.orthographic) {
			var h = this.orthographicSize;
			var w = h * this.aspect;
			this._projectionMatrix = Tea.Matrix4x4.ortho(
				-w, w, -h, h,
				this.nearClipPlane,
				this.farClipPlane
			);
		} else {
			var aspect = this.aspect;
			if (this._prev.isPerspectiveChanged(this, aspect)) {
				this._projectionMatrix.perspective(
					this.fieldOfView,
					aspect,
					this.nearClipPlane,
					this.farClipPlane
				);
				this._prev.fieldOfView = this.fieldOfView;
				this._prev.aspect = aspect;
				this._prev.nearClipPlane = this.nearClipPlane;
				this._prev.farClipPlane = this.farClipPlane;
			}
		}
		this._vpMatrix = this._projectionMatrix.mul(
			this._worldToCameraMatrix
		);

		if (this.targetTexture != null) {
			var t = this.targetTexture;
			this.gl.viewport(0, 0, t.width, t.height);
			this.gl.scissor(0, 0, t.width, t.height);
		} else {
			this.setViewport();
		}
		this.clear();
	}

	updateLeft(): void {
		var position = this.object3d.position.clone();
		position.x -= this.stereoDistance;

		var view = Tea.Matrix4x4.tr(
			position,
			this.object3d.rotation
		);
		view.toggleHand();
		this._cameraToWorldMatrix = view;

		view = view.inverse;
		this._worldToCameraMatrix = view;
		this.setViewportLeft();
		this.isStereoLeft = true;
	}

	updateRight(): void {
		var position = this.object3d.position.clone();
		position.x += this.stereoDistance;

		var view = Tea.Matrix4x4.tr(
			position,
			this.object3d.rotation
		);
		view.toggleHand();
		this._cameraToWorldMatrix = view;

		view = view.inverse;
		this._worldToCameraMatrix = view;
		this.setViewportRight();
		this.isStereoLeft = false;
	}

	screenPointToRay(position: Tea.Vector3): Tea.Ray {
		var p = position.clone();
		p.z = this.nearClipPlane;
		var near = this.screenToWorldPoint(p);
		p.z = this.farClipPlane;
		var far = this.screenToWorldPoint(p);
		return new Tea.Ray(
			near,
			far.sub$(near).normalize$()
		);
	}

	screenToViewportPoint(position: Tea.Vector3): Tea.Vector3 {
		var viewport = position.clone();
		var rect = this.getViewportRect();
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
		var p = this.screenToViewportPoint(position);
		return this.viewportToWorldPoint(p);
	}

	viewportPointToRay(position: Tea.Vector3): Tea.Ray {
		var p = position.clone();
		p.z = this.nearClipPlane;
		var near = this.viewportToWorldPoint(p);
		p.z = this.farClipPlane;
		var far = this.viewportToWorldPoint(p);
		return new Tea.Ray(
			near,
			far.sub(near).normalized
		);
	}

	viewportToScreenPoint(position: Tea.Vector3): Tea.Vector3 {
		var screen = position.clone();
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
		var ray = far.sub$(this.object3d.position).normalize$();

		var direction = new Tea.Vector3(0, 0, 1);
		//direction.rotate$(this.rotation.eulerAngles.mul(Tea.Mathf.Deg2Rad));
		//direction = this.object3d.rotation.mul(direction);
		direction.applyQuaternion(this.object3d.rotation);
		var d = Tea.Vector3.dot(ray, direction.normalize$());

		return this.object3d.position.add(ray.mul(position.z / d));
	}

	unproject(viewport: Tea.Vector3): Tea.Vector3 {
		//var view = this.worldToCameraMatrix;
		//var projection = this.projectionMatrix;
		//var vp = projection.mul(view);
		var vp = this._vpMatrix.inverse;

		var world = viewport.clone();
		world[0] = world[0] * 2 - 1;
		world[1] = world[1] * 2 - 1;
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
		var rect = this._viewportRect;
		rect.copy(this.rect);
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
		var gl = this.gl;
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
		var x = rect.x * width;
		var y = rect.y * height;
		var w = rect.width * width;
		var h = rect.height * height;

		gl.viewport(x, y, w, h);
		gl.scissor(x, y, w, h);
	}
	
	protected setViewportLeft(): void {
		var gl = this.gl;
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

		switch (this.stereoMode) {
			case Tea.CameraStereoMode.SideBySide:
				rect.width /= 2;
				break;
			case Tea.CameraStereoMode.TopAndBottom:
				rect.height /= 2;
				rect.y += rect.height;
				break;
			case Tea.CameraStereoMode.LineByLine:
				break;
		}

		var width = this.app.width;
		var height = this.app.height;
		var x = rect.x * width;
		var y = rect.y * height;
		var w = rect.width * width;
		var h = rect.height * height;

		gl.viewport(x, y, w, h);
		gl.scissor(x, y, w, h);
	}
	
	protected setViewportRight(): void {
		var gl = this.gl;
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

		switch (this.stereoMode) {
			case Tea.CameraStereoMode.SideBySide:
				rect.width /= 2;
				rect.x += rect.width;
				break;
			case Tea.CameraStereoMode.TopAndBottom:
				rect.height /= 2;
				break;
			case Tea.CameraStereoMode.LineByLine:
				break;
		}

		var width = this.app.width;
		var height = this.app.height;
		var x = rect.x * width;
		var y = rect.y * height;
		var w = rect.width * width;
		var h = rect.height * height;

		gl.viewport(x, y, w, h);
		gl.scissor(x, y, w, h);
	}

	protected clear(): void {
		var gl = this.gl;
		var color = this.backgroundColor;
		if (Camera.currentBGColor !== color) {
			gl.clearColor(color.r, color.g, color.b, color.a);
			Camera.currentBGColor = color;
		}
		gl.clear(
			gl.COLOR_BUFFER_BIT |
			gl.DEPTH_BUFFER_BIT |
			gl.STENCIL_BUFFER_BIT
		);
	}

	protected flush(): void {
		this.gl.flush();
	}
}
