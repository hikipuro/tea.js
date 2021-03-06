import * as Tea from "../Tea";
import { Component } from "./Component";
import { CameraStatus } from "./CameraStatus";

export class Camera extends Component {
	protected static _skyboxCamera: Camera;
	static readonly className: string = "Camera";
	depth: number;
	clearFlags: Tea.CameraClearFlags;
	fieldOfView: number;
	nearClipPlane: number;
	farClipPlane: number;
	backgroundColor: Tea.Color;
	orthographicSize: number;
	rect: Tea.Rect;
	targetTexture: Tea.RenderTexture;
	stereoDistance: number;
	stereoMode: Tea.CameraStereoMode;
	isStereoLeft: boolean;

	protected gl: WebGLRenderingContext;
	protected _aspect: number;
	protected _status: CameraStatus;
	protected _viewportRect: Tea.Rect;
	protected _enableStereo: boolean;

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
		this.gl = app.gl;
		this.depth = 0;
		this.clearFlags = Tea.CameraClearFlags.SolidColor;
		this.fieldOfView = 60.0;
		this.nearClipPlane = 0.3;
		this.farClipPlane = 1000.0;
		this.backgroundColor = Tea.Color.background.clone();
		this.orthographicSize = 5.0;
		this.rect = new Tea.Rect(0.0, 0.0, 1.0, 1.0);
		this.stereoDistance = 0.1;
		this.stereoMode = Tea.CameraStereoMode.SideBySide;
		this.isStereoLeft = true;
		this._status = new CameraStatus(this);
		this._viewportRect = new Tea.Rect();
		this._enableStereo = false;
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

	get viewportRect(): Tea.Rect {
		return this.getViewportRect();
	}
	
	get orthographic(): boolean {
		return this._status.orthographic;
	}
	set orthographic(value: boolean) {
		this._status.aspect = 0.0;
		this._status.orthographic = value;
	}

	get cameraToWorldMatrix(): Tea.Matrix4x4 {
		return this._status.cameraToWorldMatrix;
	}

	get worldToCameraMatrix(): Tea.Matrix4x4 {
		return this._status.worldToCameraMatrix;
	}

	get projectionMatrix(): Tea.Matrix4x4 {
		return this._status.projectionMatrix;
	}

	get viewProjectionMatrix(): Tea.Matrix4x4 {
		return this._status.viewProjectionMatrix;
	}

	get enableStereo(): boolean {
		return this._enableStereo;
	}
	set enableStereo(value: boolean) {
		this._status.aspect = 0.0;
		this._status.position.set(0.0001, 0.0002, 0.0003);
		this._enableStereo = value;
	}

	get frustumPlanes(): Array<Tea.Plane> {
		return this._status.frustumPlanes;
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
		this.stereoDistance = undefined;
		this.stereoMode = undefined;
		this.isStereoLeft = undefined;
		this.gl = undefined;
		this._aspect = undefined;
		this._status.destroy();
		this._status = undefined;
		this._enableStereo = undefined;
		super.destroy();
	}

	updateMatrix(): void {
		this._status.updateMatrix();
	}

	update(): void {
		this.updateMatrix();
		if (this.targetTexture != null) {
			var t = this.targetTexture;
			var w = t.width;
			var h = t.height;
			this.app.status.setViewport(0.0, 0.0, w, h);
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

	updateLeft(setViewport: boolean = true): void {
		this._status.updateStereo(true);
		this.isStereoLeft = true;
		if (setViewport) {
			var scene = this.object3d.scene;
			if (scene != null && scene.enablePostProcessing) {
				this.setViewportLeft(scene);
				this.clear();
			} else {
				this.setViewportLeft();
				this.clear();
			}
		}
	}

	updateRight(setViewport: boolean = true): void {
		this._status.updateStereo(false);
		this.isStereoLeft = false;
		if (setViewport) {
			var scene = this.object3d.scene;
			if (scene != null && scene.enablePostProcessing) {
				this.setViewportRight(scene);
				this.clear();
			} else {
				this.setViewportRight();
				this.clear();
			}
		}
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
			far.subSelf(near).normalizeSelf()
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
		var ray = far.subSelf(pos).normalizeSelf();

		var direction = new Tea.Vector3(0.0, 0.0, 1.0);
		direction.applyQuaternion(this.object3d.rotation);
		var d = ray.dot(direction);
		return pos.add(ray.mulSelf(position.z / d));
	}

	unproject(viewport: Tea.Vector3): Tea.Vector3 {
		var world = viewport.clone();
		world[0] = world[0] * 2.0 - 1.0;
		world[1] = world[1] * 2.0 - 1.0;
		world.applyMatrix4(this._status.inverseViewProjectionMatrix);
		return world;
	}

	unproject$(viewport: Tea.Vector3): Tea.Vector3 {
		viewport[0] = viewport[0] * 2.0 - 1.0;
		viewport[1] = viewport[1] * 2.0 - 1.0;
		viewport.applyMatrix4(this._status.inverseViewProjectionMatrix);
		return viewport;
	}

	/*
	lookAt(eye): void {
		this.vMatrix = Matrix4.identity;
		this.vMatrix = this.vMatrix.lookAt(eye, [0, 0, 0], [0, 1, 0]);
	}
	*/

	toJSON(): Object {
		var json: any = super.toJSON();
		json[Tea.JSONUtil.TypeName] = Camera.className;
		json.depth = this.depth;
		json.clearFlags = Tea.CameraClearFlags.toString(this.clearFlags);
		json.fieldOfView = this.fieldOfView;
		json.nearClipPlane = this.nearClipPlane;
		json.farClipPlane = this.farClipPlane;
		json.backgroundColor = this.backgroundColor;
		json.orthographic = this._status.orthographic;
		json.orthographicSize = this.orthographicSize;
		json.rect = this.rect;
		//json.targetTexture = this.targetTexture;
		json.enableStereo = this._enableStereo;
		json.stereoDistance = this.stereoDistance;
		json.stereoMode = Tea.CameraStereoMode.toString(this.stereoMode);
		return json;
	}

	static fromJSON(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, Camera.className) === false) {
			callback(null);
			return;
		}
		var camera = new Camera(app);
		camera.enabled = json.enabled;
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
		camera._enableStereo = json.enableStereo;
		camera.stereoDistance = json.stereoDistance;
		camera.stereoMode = Tea.CameraStereoMode[json.stereoMode as string];
		callback(camera);
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

		this.app.status.setViewport(x, y, w, h);
	}
	
	protected setViewportLeft(scene: Tea.Scene = null): void {
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

		switch (this.stereoMode) {
			case Tea.CameraStereoMode.SideBySide:
				rw /= 2;
				break;
			case Tea.CameraStereoMode.TopAndBottom:
				rh /= 2;
				ry += rh;
				break;
			case Tea.CameraStereoMode.LineByLine:
				break;
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
		
		this.app.status.setViewport(x, y, w, h);
	}
	
	protected setViewportRight(scene: Tea.Scene = null): void {
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

		switch (this.stereoMode) {
			case Tea.CameraStereoMode.SideBySide:
				rw /= 2;
				rx += rw;
				break;
			case Tea.CameraStereoMode.TopAndBottom:
				rh /= 2;
				break;
			case Tea.CameraStereoMode.LineByLine:
				break;
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
		
		this.app.status.setViewport(x, y, w, h);
	}

	protected clear(): void {
		var gl = this.gl;
		switch (this.clearFlags) {
			case Tea.CameraClearFlags.Nothing:
				break;
			case Tea.CameraClearFlags.SolidColor:
				if (this._enableStereo) {
					if (this.stereoMode === Tea.CameraStereoMode.LineByLine) {
						if (this.isStereoLeft) {
							this.updateClearColor();
							gl.clear(
								gl.COLOR_BUFFER_BIT |
								gl.DEPTH_BUFFER_BIT |
								gl.STENCIL_BUFFER_BIT
							);
						}
						return;
					}
				}
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
		this.app.status.setClearColor(this.backgroundColor);
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
			camera._enableStereo = this._enableStereo;
			camera.stereoMode = this.stereoMode;
			camera.object3d.scene = scene;
			camera.rect.copy(this.rect);
			camera.object3d.localRotation.copy(this.object3d.rotation);
			if (this._enableStereo) {
				if (this.isStereoLeft) {
					camera.updateLeft(false);
				} else {
					camera.updateRight(false);
				}
			} else {
				camera.update();
			}
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
