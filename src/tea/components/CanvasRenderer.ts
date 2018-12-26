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
		if (camera == null) {
			return;
		}
		if (!this.isRenderable) {
			return;
		}
		super.render(camera, lights, renderSettings);
		this._data.setBuffers(this.material.shader);
		this.setFrontFace();
		//console.log(this._components.length)
		this.draw();
		//this.disableAllAttributes();
		Renderer.drawCallCount++;
	}

	toJSON(): Object {
		var json = super.toJSON();
		json[Tea.JSONUtil.TypeName] = CanvasRenderer.className;
		return json;
	}

	protected setFrontFace(): void {
		this.app.status.setFrontFace(this._frontFace);
	}
	
	protected draw(): void {
		var shader = this.material.shader;
		var mvpLocation = shader.getUniformLocation("MATRIX_MVP");
		var texLocation = shader.getUniformLocation("_MainTex");
		var texUVLocation = shader.getUniformLocation("uv_MainTex");
		var texSTLocation = shader.getUniformLocation("_MainTex_ST");
		if (mvpLocation == null
		||  texLocation == null
		||  texUVLocation == null
		||  texSTLocation == null) {
			return;
		}

		var gl = this.gl;
		var TRIANGLES = gl.TRIANGLES;
		var UNSIGNED_SHORT = gl.UNSIGNED_SHORT;
		gl.activeTexture(gl.TEXTURE0);
		var triangleCount = this._data.triangleCount * 3;
		var screenWidth = 1.0 / this.app.width;
		var screenHeight = 1.0 / this.app.height;
		var position = this._position;
		var rotation = this._rotation;
		var scale = this._scale;
		var mvpMatrix = this._mvpMatrix;

		var components = this._components;
		var componentCount = components.length;
		for (var i = 0; i < componentCount; i++) {
			var component = components[i];
			if (component == null || component.texture == null) {
				continue;
			}
			scale[0] = component.width * screenWidth;
			scale[1] = component.height * screenHeight;
			position[0] = scale[0] - 1.0;
			position[1] = 1.0 - scale[1];
			position[0] += component.x * screenWidth;
			position[1] -= component.y * screenHeight;

			//mvpMatrix.setIdentity();
			mvpMatrix.setTRS(position, rotation, scale);
			gl.uniformMatrix4fv(mvpLocation, false, mvpMatrix);

			gl.bindTexture(gl.TEXTURE_2D, component.texture.texture);
			gl.uniform1i(texLocation, 0);

			var texWidth = component.width;
			texWidth = Tea.Mathf.closestPowerOfTwo(texWidth) / texWidth;
			var texHeight = component.height;
			texHeight = Tea.Mathf.closestPowerOfTwo(texHeight) / texHeight;
			gl.uniform2f(texSTLocation, texWidth, texHeight);
			gl.uniform2f(texUVLocation, 0.0, texHeight - 1.0);

			gl.drawElements(
				TRIANGLES, triangleCount,
				UNSIGNED_SHORT, 0
			);
		}
	}
}
