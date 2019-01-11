import * as Tea from "../Tea";
import { Renderer } from "./Renderer";
import { BufferData } from "./BufferData";

export class CanvasRenderer extends Renderer {
	static readonly className: string = "CanvasRenderer";
	protected _components: Array<Tea.UI.UIComponent>;
	protected _mesh: Tea.Mesh;
	protected _data: BufferData;
	protected _frontFace: number;
	protected _position: Tea.Vector3;
	protected _rotation: Tea.Quaternion;
	protected _scale: Tea.Vector3;
	protected _mvpMatrix: Tea.Matrix4x4;
	
	constructor(app: Tea.App) {
		super(app);
		var gl = this.gl;
		this._components = null;
		this._mesh = Tea.Primitives.createQuad2DMesh();
		this._data = new BufferData(app);
		this._frontFace = gl.CCW;
		this._position = new Tea.Vector3();
		this._rotation = Tea.Quaternion.identity.clone();
		this._scale = Tea.Vector3.one.clone();
		this._mvpMatrix = new Tea.Matrix4x4();
	}

	protected get isRenderable(): boolean {
		return (
			this.enabled &&
			this.object3d != null &&
			this.material != null &&
			this.material.shader != null &&
			this._components != null &&
			this._components.length >= 1 &&
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
		super.destroy();
	}

	update(): void {
		var object3d = this.object3d;
		if (object3d == null) {
			this._components = null;
			return;
		}
		var canvas = object3d.getComponent(Tea.Canvas);
		if (canvas != null && canvas.enabled === true) {
			var components = object3d.getComponentsInChildren(Tea.UI.UIComponent);
			this._components = components.filter((component: Tea.UI.UIComponent) => {
				return component != null && component.enabled === true;
			});
		} else {
			this._components = null;
		}
		if (this._mesh.isModified) {
			this._data.setMeshData(this._mesh);
			this._mesh.isModified = false;
		}
	}

	render(camera: Tea.Camera, lights: Array<Tea.Light>, renderSettings: Tea.RenderSettings): void {
		if (!this.isRenderable) {
			return;
		}
		//super.render(camera, lights, renderSettings);
		this.gl.useProgram(this.material.shader.program);
		this.setShaderSettings();
		this._data.setBuffers(this.material.shader);
		this.setFrontFace();
		//console.log(this._components.length)
		this.draw(camera);
		//this.disableAllAttributes();
	}

	toJSON(): Object {
		var json = super.toJSON();
		json[Tea.JSONUtil.TypeName] = CanvasRenderer.className;
		return json;
	}

	protected setFrontFace(): void {
		this.app.status.setFrontFace(this._frontFace);
	}
	
	protected draw(camera: Tea.Camera): void {
		var shader = this.material.shader;
		var locations = {
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

		var viewportWidth = 1.0;
		var viewportHeight = 1.0;
		if (camera != null) {
			var viewportRect = camera.viewportRect;
			if (viewportRect[2] !== 0.0) {
				viewportWidth = 1.0 / viewportRect[2];
			}
			if (viewportRect[3] !== 0.0) {
				viewportHeight = 1.0 / viewportRect[3];
			}
		}

		var gl = this.gl;
		var TRIANGLES = gl.TRIANGLES;
		var UNSIGNED_SHORT = gl.UNSIGNED_SHORT;
		var screenHeight = this.app.height;
		gl.activeTexture(gl.TEXTURE0);
		gl.uniform1i(locations.texture, 0);
		gl.uniform2f(locations.screenSize, this.app.width, screenHeight);

		var triangleCount = this._data.triangleCount * 3;
		var components = this._components;
		var componentCount = components.length;
		for (var i = 0; i < componentCount; i++) {
			var component = components[i];
			if (component == null
			||  component.texture == null
			||  component.texture.image == null) {
				continue;
			}
			var width = component.width;
			var height = component.height;
			var texWidth = Tea.Mathf.closestPowerOfTwo(width) / width;
			var texHeight = Tea.Mathf.closestPowerOfTwo(height) / height;
			if (texWidth === 0.0 || texHeight === 0.0) {
				continue;
			}
			gl.uniform2f(locations.textureST, texWidth, texHeight);
			gl.uniform2f(locations.textureUV, 0.0, texHeight - 1.0);
			//gl.uniform2f(locations.textureST, 1.0, 1.0);
			//gl.uniform2f(locations.textureUV, 0.0, 0.0);

			var object3d = component.object3d;
			var p = object3d.position;
			var s = object3d.scale;
			gl.uniform2f(locations.anchor, -1.0, -1.0);
			gl.uniform2f(
				locations.position,
				p[0] * viewportWidth,
				p[1] * viewportHeight
			);
			gl.uniform2f(
				locations.size,
				width * s[0] * viewportWidth,
				height * s[1] * viewportHeight
			);

			gl.uniform4fv(locations.colorOffset, component.colorOffset);
			gl.uniform4fv(locations.colorMultiplier, component.colorMultiplier);

			var rect = component.parentClippingRect;
			if (rect != null) {
				//rect = rect.clone();
				gl.uniform4f(
					locations.clippingRect,
					rect[0],
					screenHeight - rect[1],
					rect[0] + rect[2],
					screenHeight - (rect[1] + rect[3])
				);
			} else {
				gl.uniform4f(
					locations.clippingRect,
					-Infinity, Infinity,
					Infinity, -Infinity
				);
			}

			gl.bindTexture(gl.TEXTURE_2D, component.texture.texture);

			gl.drawElements(
				TRIANGLES, triangleCount,
				UNSIGNED_SHORT, 0
			);
		}
		Renderer.drawCallCount += componentCount;
	}
}
