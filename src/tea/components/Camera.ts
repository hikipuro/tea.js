import * as Tea from "../Tea";
import { Component } from "./Component";

class Prev {
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

export class Camera extends Component {
	static editorView = Tea.Editor.Camera;
	protected static _skyboxCamera: Camera;
	depth: number;
	clearFlags: Tea.CameraClearFlags;
	fieldOfView: number;
	nearClipPlane: number;
	farClipPlane: number;
	backgroundColor: Tea.Color;
	orthographicSize: number;
	rect: Tea.Rect;
	targetTexture: Tea.RenderTexture;
	enableStereo: boolean;
	stereoDistance: number;
	stereoMode: Tea.CameraStereoMode;
	isStereoLeft: boolean;
	frustumPlanes: Array<Tea.Plane>;

	protected gl: WebGLRenderingContext;
	protected _aspect: number;
	protected _orthographic: boolean;
	protected _cameraToWorldMatrix: Tea.Matrix4x4;
	protected _worldToCameraMatrix: Tea.Matrix4x4;
	protected _projectionMatrix: Tea.Matrix4x4;
	protected _viewProjectionMatrix: Tea.Matrix4x4;
	protected _inverseViewProjectionMatrix: Tea.Matrix4x4;
	protected _prev: Prev;
	protected _viewportRect: Tea.Rect;
	static currentBGColor: Tea.Color;

	constructor(app: Tea.App) {
		super(app);
		if (Camera._skyboxCamera === undefined) {
			Camera._skyboxCamera = null;
			var camera = new Camera(app);
			camera.clearFlags = Tea.CameraClearFlags.Nothing;
			camera.object3d = new Tea.Object3D(app);
			camera.object3d.name = "Skybox Camera";
			Camera._skyboxCamera = camera;
		}
		if (Camera.currentBGColor == null) {
			Camera.currentBGColor = Tea.Color.black.clone();
		}
		this.gl = app.gl;
		this.depth = 0;
		this.clearFlags = Tea.CameraClearFlags.SolidColor;
		this.fieldOfView = 60.0;
		this.nearClipPlane = 0.3;
		this.farClipPlane = 1000.0;
		this.backgroundColor = Tea.Color.background.clone();
		this._orthographic = false;
		this.orthographicSize = 5.0;
		this.rect = new Tea.Rect(0.0, 0.0, 1.0, 1.0);
		this.enableStereo = false;
		this.stereoDistance = 0.1;
		this.stereoMode = Tea.CameraStereoMode.SideBySide;
		this.isStereoLeft = true;
		this._cameraToWorldMatrix = new Tea.Matrix4x4();
		this._worldToCameraMatrix = new Tea.Matrix4x4();
		this._projectionMatrix = new Tea.Matrix4x4();
		this._viewProjectionMatrix = new Tea.Matrix4x4();
		this._inverseViewProjectionMatrix = new Tea.Matrix4x4();
		this._prev = new Prev();
		this._viewportRect = new Tea.Rect();
		//this.update();
	}

	get aspect(): number {
		if (this._aspect != null) {
			return this._aspect;
		}
		var rect = this.getViewportRect();
		var width = this.app.width;
		var height = this.app.height;
		return (width * rect.width) / (height * rect.height);
	}
	set aspect(value: number) {
		this._aspect = value;
	}
	
	get orthographic(): boolean {
		return this._orthographic;
	}
	set orthographic(value: boolean) {
		this._prev.aspect = 0.0;
		this._orthographic = value;
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

	get viewProjectionMatrix(): Tea.Matrix4x4 {
		return this._viewProjectionMatrix;
	}

	destroy(): void {
		this.depth = undefined;
		this.clearFlags = undefined;
		this.fieldOfView = undefined;
		this.nearClipPlane = undefined;
		this.farClipPlane = undefined;
		this.backgroundColor = undefined;
		this.orthographic = undefined;
		this.orthographicSize = undefined;
		this.rect = undefined;
		this.targetTexture = undefined;
		this.enableStereo = undefined;
		this.stereoDistance = undefined;
		this.stereoMode = undefined;
		this.isStereoLeft = undefined;
		this.frustumPlanes = undefined;
		this.gl = undefined;
		this._aspect = undefined;
		this._cameraToWorldMatrix = undefined;
		this._worldToCameraMatrix = undefined;
		this._projectionMatrix = undefined;
		this._viewProjectionMatrix = undefined;
		this._inverseViewProjectionMatrix = undefined;
		this._prev.destroy();
		this._prev = undefined;
		this._cameraToWorldMatrix = undefined;
		super.destroy();
	}

	update(): void {
		var isChanged = false;
		var object3d = this.object3d;
		if (this._prev.isViewChanged(object3d)) {
			this._cameraToWorldMatrix.setTR(
				object3d.position,
				object3d.rotation
			);
			this._cameraToWorldMatrix.toggleHand();
			this._worldToCameraMatrix = this._cameraToWorldMatrix.inverse;

			this._prev.position.copy(object3d.position);
			this._prev.rotation.copy(object3d.rotation);
			isChanged = true;
		}

		if (this.orthographic) {
			var aspect = this.aspect;
			if (this._prev.isOrthoChanged(this, aspect)) {
				var h = this.orthographicSize;
				var w = h * aspect;
				this._projectionMatrix.ortho(
					-w, w, -h, h,
					this.nearClipPlane,
					this.farClipPlane
				);
				this._prev.aspect = aspect;
				this._prev.orthographicSize = this.orthographicSize;
				this._prev.nearClipPlane = this.nearClipPlane;
				this._prev.farClipPlane = this.farClipPlane;
				isChanged = true;
			}
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
				isChanged = true;
			}
		}

		if (isChanged) {
			this._viewProjectionMatrix = this._projectionMatrix.mul(
				this._worldToCameraMatrix
			);
			this._inverseViewProjectionMatrix = this._viewProjectionMatrix.inverse;
			//this.frustumPlanes = Tea.GeometryUtil.calculateFrustumPlanes(this);
		}

		if (this.targetTexture != null) {
			var t = this.targetTexture;
			var w = t.width;
			var h = t.height;
			this.gl.viewport(0.0, 0.0, w, h);
			this.gl.scissor(0.0, 0.0, w, h);
			this.clear();
		} else {
			var scene = this.object3d.scene;
			if (scene != null && scene.enablePostProcessing) {
				//scene.renderTexture.bindFramebuffer();
				this.setViewport(scene);
				this.clear();
				//scene.renderTexture.unbindFramebuffer();
			} else {
				this.setViewport();
				this.clear();
			}
		}
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
		p[0] += 0.5;
		p[1] += 1.0;
		p[2] = this.nearClipPlane;
		var near = this.screenToWorldPoint(p);
		p[2] = this.farClipPlane;
		var far = this.screenToWorldPoint(p);
		return new Tea.Ray(
			near,
			far.sub$(near).normalize$()
		);
	}

	screenToViewportPoint(position: Tea.Vector3): Tea.Vector3 {
		var viewport = position.clone();
		var rect = this.getViewportRect();
		viewport[0] = viewport[0] / this.app.width;
		viewport[0] = (viewport[0] - rect[0]) / rect[2];
		viewport[1] = viewport[1] / this.app.height;
		viewport[1] = (viewport[1] - rect[1]) / rect[3];
		return viewport;
	}

	screenToWorldPoint(position: Tea.Vector3): Tea.Vector3 {
		if (position == null) {
			return Tea.Vector3.zero;
		}
		var viewport = position.clone();
		var rect = this.getViewportRect();
		viewport[0] = viewport[0] / this.app.width;
		viewport[0] = (viewport[0] - rect[0]) / rect[2];
		viewport[1] = viewport[1] / this.app.height;
		viewport[1] = (viewport[1] - rect[1]) / rect[3];
		return this.viewportToWorldPoint(viewport);
	}

	viewportPointToRay(position: Tea.Vector3): Tea.Ray {
		var p = position.clone();
		p[2] = this.nearClipPlane;
		var near = this.viewportToWorldPoint(p);
		p[2] = this.farClipPlane;
		var far = this.viewportToWorldPoint(p);
		return new Tea.Ray(
			near,
			far.sub(near).normalized
		);
	}

	viewportToScreenPoint(position: Tea.Vector3): Tea.Vector3 {
		var screen = position.clone();
		screen[0] = screen[0] * this.app.width;
		screen[1] = screen[1] * this.app.height;
		return screen;
	}

	viewportToWorldPoint(position: Tea.Vector3): Tea.Vector3 {
		if (position == null) {
			return Tea.Vector3.zero;
		}

		if (this.orthographic) {
			var p = position.clone();
			p.z = -1.0;
			var near = this.unproject(p);
			p.z = 1.0;
			var far = this.unproject(p);
			var direction = far.sub(near).normalized;
			var z = (position.z - this.nearClipPlane);
			return near.add(direction.mul(z));
		}

		var pos = this.object3d.position;
		var p = position.clone();
		p[2] = 1.0;
		var far = this.unproject$(p);
		var ray = far.sub$(pos).normalize$();

		var direction = new Tea.Vector3(0.0, 0.0, 1.0);
		direction.applyQuaternion(this.object3d.rotation);
		var d = ray.dot(direction);
		return pos.add(ray.mul$(position.z / d));
	}

	unproject(viewport: Tea.Vector3): Tea.Vector3 {
		var world = viewport.clone();
		world[0] = world[0] * 2.0 - 1.0;
		world[1] = world[1] * 2.0 - 1.0;
		world.applyMatrix4(this._inverseViewProjectionMatrix);
		return world;
	}

	unproject$(viewport: Tea.Vector3): Tea.Vector3 {
		viewport[0] = viewport[0] * 2.0 - 1.0;
		viewport[1] = viewport[1] * 2.0 - 1.0;
		viewport.applyMatrix4(this._inverseViewProjectionMatrix);
		return viewport;
	}

	/*
	lookAt(eye): void {
		this.vMatrix = Matrix4.identity;
		this.vMatrix = this.vMatrix.lookAt(eye, [0, 0, 0], [0, 1, 0]);
	}
	*/

	toJSON(): Object {
		var json = super.toJSON();
		Object.assign(json, {
			_type: "Camera",
			depth: this.depth,
			clearFlags: Tea.CameraClearFlags.toString(this.clearFlags),
			fieldOfView: this.fieldOfView,
			nearClipPlane: this.nearClipPlane,
			farClipPlane: this.farClipPlane,
			backgroundColor: this.backgroundColor,
			orthographic: this._orthographic,
			orthographicSize: this.orthographicSize,
			rect: this.rect,
			//targetTexture: this.targetTexture,
			enableStereo: this.enableStereo,
			stereoDistance: this.stereoDistance,
			stereoMode: this.stereoMode,
			isStereoLeft: this.isStereoLeft,
		});
		return json;
	}

	static fromJSON(app: Tea.App, json: any): Camera {
		if (json == null || json._type !== "Camera") {
			return null;
		}
		var camera = new Camera(app);
		camera.depth = json.depth;
		camera.clearFlags = Tea.CameraClearFlags[json.clearFlags as string];
		camera.fieldOfView = json.fieldOfView;
		camera.nearClipPlane = json.nearClipPlane;
		camera.farClipPlane = json.farClipPlane;
		camera.backgroundColor = Tea.Color.fromArray(json.backgroundColor);
		camera.orthographic = json.orthographic;
		camera.orthographicSize = json.orthographicSize;
		camera.rect = Tea.Rect.fromArray(json.rect);
		//camera.targetTexture = json.targetTexture;
		camera.enableStereo = json.enableStereo;
		camera.stereoDistance = json.stereoDistance;
		camera.stereoMode = json.stereoMode;
		camera.isStereoLeft = json.isStereoLeft;
		return camera;
	}

	protected getViewportRect(): Tea.Rect {
		var rect = this._viewportRect;
		rect.copy(this.rect);
		if (rect[0] < 0.0) {
			rect[2] += rect[0];
			rect[0] = 0.0;
		}
		if (rect[1] < 0.0) {
			rect[3] += rect[1];
			rect[1] = 0.0;
		}
		if (rect[0] + rect[2] > 1.0) {
			rect[2] = 1.0 - rect[0];
		}
		if (rect[1] + rect[3] > 1.0) {
			rect[3] = 1.0 - rect[1];
		}
		if (rect[2] < 0.0) {
			rect[2] = 0.0;
		}
		if (rect[3] < 0.0) {
			rect[3] = 0.0;
		}
		return rect;
	}
	
	setViewport(scene: Tea.Scene = null): void {
		var rx = this.rect[0];
		var ry = this.rect[1];
		var rw = this.rect[2];
		var rh = this.rect[3];
		
		if (rx < 0.0) {
			rw += rx;
			rx = 0.0;
		}
		if (ry < 0.0) {
			rh += ry;
			ry = 0.0;
		}
		if (rx + rw > 1.0) {
			rw = 1.0 - rx;
		}
		if (ry + rh > 1.0) {
			rh = 1.0 - ry;
		}

		var width: number = 0.0;
		var height: number = 0.0;

		if (scene != null && scene.enablePostProcessing) {
			width = scene.renderTexture.width;
			height = scene.renderTexture.height;
		} else {
			width = this.app.width;
			height = this.app.height;
		}

		var x = rx * width;
		var y = ry * height;
		var w = rw * width;
		var h = rh * height;
		if (w < 0.0) {
			w = 0.0;
		}
		if (h < 0.0) {
			h = 0.0;
		}

		x = Math.round(x);
		y = Math.round(y);
		w = Math.round(w);
		h = Math.round(h);

		var gl = this.gl;
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

		if (w < 0.0) {
			w = 0.0;
		}
		if (h < 0.0) {
			h = 0.0;
		}
		
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

		if (w < 0.0) {
			w = 0.0;
		}
		if (h < 0.0) {
			h = 0.0;
		}

		var viewport = this.app.status.viewport;
		if (viewport[0] !== x && viewport[1] !== y &&
			viewport[2] !== w && viewport[3] !== h) {
			gl.viewport(x, y, w, h);
			gl.scissor(x, y, w, h);
			viewport.set(x, y, w, h);
		}
	}

	protected clear(): void {
		var gl = this.gl;
		switch (this.clearFlags) {
			case Tea.CameraClearFlags.Nothing:
				//this.clearNothing();
				break;
			case Tea.CameraClearFlags.SolidColor:
				this.updateClearColor();
				gl.clear(
					gl.COLOR_BUFFER_BIT |
					gl.DEPTH_BUFFER_BIT |
					gl.STENCIL_BUFFER_BIT
				);
				break;
			case Tea.CameraClearFlags.Depth:
				gl.clear(
					gl.DEPTH_BUFFER_BIT |
					gl.STENCIL_BUFFER_BIT
				);
				break;
			case Tea.CameraClearFlags.Skybox:
				this.drawSkybox();
				break;
		}
	}

	protected updateClearColor(): void {
		var color = this.backgroundColor;
		if (Camera.currentBGColor.equals(color) === false) {
			this.gl.clearColor(color[0], color[1], color[2], color[3]);
			Camera.currentBGColor.copy(color);
		}
	}

	protected clearNothing(): void {
		/*
		var gl = this.gl;
		var scene = this.object3d.scene;
		if (scene != null && scene.enablePostProcessing) {
			scene.renderTexture.bindFramebuffer();
			var width = scene.renderTexture.width;
			var height = scene.renderTexture.height;
			gl.scissor(0.0, 0.0, width, height);
			gl.viewport(0.0, 0.0, width, height);
		}
		//*/
	}

	protected clearSolidColor(): void {
		var gl = this.gl;
		gl.clear(
			gl.COLOR_BUFFER_BIT |
			gl.DEPTH_BUFFER_BIT |
			gl.STENCIL_BUFFER_BIT
		);
	}

	protected clearDepth(): void {
		var gl = this.gl;
		gl.clear(
			gl.DEPTH_BUFFER_BIT |
			gl.STENCIL_BUFFER_BIT
		);
	}

	protected drawSkybox(): void {
		var gl = this.gl;
		var camera = Camera._skyboxCamera;
		var scene = this.object3d.scene;
		var skybox = scene.renderSettings.skybox;
		//gl.clear(gl.COLOR_BUFFER_BIT);

		/*
		if (scene != null && scene.enablePostProcessing) {
			gl.clear(
				gl.DEPTH_BUFFER_BIT |
				gl.STENCIL_BUFFER_BIT
			);
		}
		//*/

		//if (this.orthographic) {
			//camera.targetTexture = this.targetTexture;
			if (this.orthographic === false) {
				camera.fieldOfView = this.fieldOfView;
			} else {
				camera.fieldOfView = 60.0;
			}
			camera.object3d.scene = this.object3d.scene;
			camera.rect.copy(this.rect);
			camera.object3d.localRotation.copy(this.object3d.rotation);
			camera.update();
			skybox.object3d.localPosition.set(0.0, 0.0, 0.0);
			skybox.object3d.update();
			skybox.renderer.render(
				camera, [], scene.renderSettings
			);
		/*} else {
			var skyboxPosition = skybox.object3d.localPosition;
			var position = this.object3d.position;
			skyboxPosition[0] = position[0];
			skyboxPosition[1] = position[1];
			skyboxPosition[2] = position[2];
			skybox.object3d.update();
			skybox.renderer.render(
				this, [], scene.renderSettings
			);
		}*/
		gl.clear(
			gl.DEPTH_BUFFER_BIT |
			gl.STENCIL_BUFFER_BIT
		);
	}

	protected flush(): void {
		this.gl.flush();
	}
}
