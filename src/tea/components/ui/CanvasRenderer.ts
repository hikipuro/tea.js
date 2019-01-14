import * as Tea from "../../Tea";
import { Renderer } from "../Renderer";
import { BufferData } from "../BufferData";

export class CanvasRenderer extends Renderer {
	static readonly className: string = "CanvasRenderer";
	protected _mesh: Tea.Mesh;
	protected _data: BufferData;
	protected _frontFace: number;
	protected _drawCallCount: number;
	protected _isClipped: boolean;
	protected _locations: any;
	protected _viewport: Tea.Vector2;
	protected _clippingRect: Tea.Rect;
	protected _scroll: Tea.Vector2;
	
	constructor(app: Tea.App) {
		super(app);
		var gl = this.gl;
		this._mesh = Tea.Primitives.createQuad2DMesh();
		this._data = new BufferData(app);
		this._data.setMeshData(this._mesh);
		this._mesh.isModified = false;
		this._frontFace = gl.CCW;
		this._drawCallCount = 0;
		this._isClipped = false;
		this._locations = null;
		this._viewport = new Tea.Vector2();
		this._clippingRect = null;
		this._scroll = new Tea.Vector2();
	}

	protected get isRenderable(): boolean {
		return (
			this.enabled &&
			this.object3d != null &&
			this.material != null &&
			this.material.shader != null &&
			this._data != null
		);
	}

	static fromJSON(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, CanvasRenderer.className) === false) {
			callback(null);
			return;
		}
		var renderer = new CanvasRenderer(app);
		var shader = new Tea.Shader(app);
		shader.attach(
			Tea.ShaderSources.uiComponentVS,
			Tea.ShaderSources.uiComponentFS
		);
		shader.settings.enableDepthTest = false;
		shader.settings.enableBlend = true;
		shader.settings.blend.srcRGB = Tea.ShaderBlendFunc.SrcAlpha;
		shader.settings.blend.dstRGB = Tea.ShaderBlendFunc.OneMinusSrcAlpha;
		shader.settings.blend.srcAlpha = Tea.ShaderBlendFunc.One;
		shader.settings.blend.dstAlpha = Tea.ShaderBlendFunc.One;
		renderer.material = Tea.Material.getDefault(app);
		renderer.material.renderQueue = 4000;
		renderer.material.setFloat("_Cutoff", 0.0);
		renderer.material.shader = shader;
		callback(renderer);
	}

	destroy(): void {
		if (this._mesh != null) {
			this._mesh.destroy();
			this._mesh = undefined;
		}
		if (this._data != null) {
			this._data.destroy();
			this._data = undefined;
		}
		this._frontFace = undefined;
		this._drawCallCount = undefined;
		this._isClipped = undefined;
		this._locations = undefined;
		this._viewport = undefined;
		this._clippingRect = undefined;
		this._scroll = undefined;
		super.destroy();
	}

	toJSON(): Object {
		var json = super.toJSON();
		json[Tea.JSONUtil.TypeName] = CanvasRenderer.className;
		return json;
	}

	render(camera: Tea.Camera, lights: Array<Tea.Light>, renderSettings: Tea.RenderSettings): void {
		if (!this.isRenderable) {
			return;
		}
		//super.render(camera, lights, renderSettings);
		this.gl.useProgram(this.material.shader.program);
		this.setShaderSettings();
		this._data.setBuffers(this.material.shader);
		this.app.status.setFrontFace(this._frontFace);
		this.draw(camera);
		//this.disableAllAttributes();
	}

	protected drawChildren(children: Array<Tea.Object3D>): void {
		if (children == null || children.length <= 0) {
			return;
		}
		var length = children.length;
		for (var i = 0; i < length; i++) {
			this.drawObject3D(children[i]);
		}
	}

	protected drawObject3D(object3d: Tea.Object3D): void {
		if (object3d == null || !object3d.isActive) {
			return;
		}
		var component = object3d.getComponent(Tea.UI.UIComponent);
		if (component == null
		||  !component.enabled
		||  component.texture == null
		||  component.texture.image == null) {
			this.drawChildren(object3d.children);
			return;
		}

		var gl = this.gl;
		var locations = this._locations;
		var clippingRect = this._clippingRect;
		if (clippingRect != null) {
			var screenHeight = this.app.height;
			var clippingX = clippingRect[0];
			var clippingY = clippingRect[1];
			gl.uniform4f(
				locations.clippingRect,
				clippingX,
				screenHeight - clippingY,
				clippingX + clippingRect[2],
				screenHeight - (clippingY + clippingRect[3])
			);
			this._isClipped = true;
		} else if (this._isClipped === true) {
			gl.uniform4f(
				locations.clippingRect,
				-Infinity, Infinity,
				Infinity, -Infinity
			);
			this._isClipped  = false;
		}

		var width = component.width;
		var height = component.height;
		var texWidth = component.texture.width / width;
		var texHeight = component.texture.height / height;
		if (texWidth === 0.0 || texHeight === 0.0) {
			this.drawChildren(object3d.children);
			return;
		}
		gl.uniform2f(locations.textureST, texWidth, texHeight);
		gl.uniform2f(locations.textureUV, 0.0, texHeight - 1.0);
		//gl.uniform2f(locations.textureST, 1.0, 1.0);
		//gl.uniform2f(locations.textureUV, 0.0, 0.0);

		var viewport = this._viewport;
		var scroll = this._scroll;
		var object3d = component.object3d;
		var p = object3d.position;
		var s = object3d.scale;
		gl.uniform2f(locations.anchor, -1.0, -1.0);
		gl.uniform2f(
			locations.position,
			p[0] * viewport[0] - scroll[0],
			p[1] * viewport[1] - scroll[1]
		);
		gl.uniform2f(
			locations.size,
			width * s[0] * viewport[0],
			height * s[1] * viewport[1]
		);

		gl.uniform4fv(locations.colorOffset, component.colorOffset);
		gl.uniform4fv(locations.colorMultiplier, component.colorMultiplier);
		gl.bindTexture(gl.TEXTURE_2D, component.texture.texture);

		var triangleCount = this._data.triangleCount * 3;
		gl.drawElements(
			gl.TRIANGLES, triangleCount,
			gl.UNSIGNED_SHORT, 0
		);
		this._drawCallCount++;

		var children = object3d.children;
		if (children == null || children.length <= 0) {
			return;
		}
		//var clippingRectOrg = this._clippingRect;
		var scrollX = scroll[0];
		var scrollY = scroll[1];
		var isScrollView = false;
		if (component instanceof Tea.UI.ScrollView) {
			isScrollView = true;
			//if (clippingRectOrg != null) {
			//	clippingRectOrg = clippingRectOrg.clone();
			//}
			this._clippingRect = component.clippingRect;
			var componentScroll = component.scroll;
			this._scroll[0] = componentScroll[0];
			this._scroll[1] = componentScroll[1];
		}

		var length = children.length;
		for (var i = 0; i < length; i++) {
			this.drawObject3D(children[i]);
		}
		
		if (isScrollView) {
			this._clippingRect = clippingRect;
			this._scroll[0] = scrollX;
			this._scroll[1] = scrollY;
		}
	}
	
	protected draw(camera: Tea.Camera): void {
		var canvas = this.object3d.getComponent(Tea.UI.Canvas);
		if (canvas == null || !canvas.enabled) {
			return;
		}
		var children = this.object3d.children;
		if (children == null || children.length <= 0) {
			return;
		}

		if (this._locations == null) {
			var shader = this.material.shader;
			this._locations = {
				texture: shader.getUniformLocation("_MainTex"),
				textureUV: shader.getUniformLocation("uv_MainTex"),
				textureST: shader.getUniformLocation("_MainTex_ST"),
				screenSize: shader.getUniformLocation("_ScreenSize"),
				anchor: shader.getUniformLocation("_Anchor"),
				position: shader.getUniformLocation("_Position"),
				size: shader.getUniformLocation("_Size"),
				colorOffset: shader.getUniformLocation("_ColorOffset"),
				colorMultiplier: shader.getUniformLocation("_ColorMultiplier"),
				clippingRect: shader.getUniformLocation("_ClippingRect"),
			};
		}
		var viewport = this._viewport;
		if (camera != null) {
			var viewportRect = camera.viewportRect;
			if (viewportRect[2] !== 0.0) {
				viewport[0] = 1.0 / viewportRect[2];
			}
			if (viewportRect[3] !== 0.0) {
				viewport[1] = 1.0 / viewportRect[3];
			}
		} else {
			viewport[0] = 1.0;
			viewport[1] = 1.0;
		}

		var gl = this.gl;
		var locations = this._locations;
		gl.activeTexture(gl.TEXTURE0);
		gl.uniform1i(locations.texture, 0);
		gl.uniform2f(locations.screenSize, this.app.width, this.app.height);

		this._drawCallCount = 0;
		var length = children.length;
		for (var i = 0; i < length; i++) {
			this._clippingRect = null;
			this._isClipped = true;
			this._scroll[0] = 0.0;
			this._scroll[1] = 0.0;
			this.drawObject3D(children[i]);
		}
		Renderer.drawCallCount += this._drawCallCount;
	}
}
