import * as Tea from "../Tea";
import { Component } from "./Component";

class Uniforms {
	app: Tea.App;
	program: WebGLProgram;
	protected _locationsCache: object;

	constructor(app: Tea.App, program: WebGLProgram) {
		this.app = app;
		this.program = program;
		this._locationsCache = {};
	}

	remove(): void {
		this._locationsCache = {};
	}

	useProgram(): void {
		var gl = this.app.gl;
		gl.useProgram(this.program);
	}

	uniform1f(name: string, value: number): void {
		var gl = this.app.gl;
		var location = this.getLocation(name);
		gl.uniform1f(location, value);
	}

	uniform1fv(name: string, value: Float32Array | ArrayLike<number>): void {
		var gl = this.app.gl;
		var location = this.getLocation(name);
		gl.uniform1fv(location, value);
	}

	uniform1i(name: string, value: number): void {
		var gl = this.app.gl;
		var location = this.getLocation(name);
		gl.uniform1i(location, value);
	}

	uniform1iv(name: string, value: Int32Array | ArrayLike<number>): void {
		var gl = this.app.gl;
		var location = this.getLocation(name);
		gl.uniform1iv(location, value);
	}

	uniform2f(name: string, x: number, y: number): void {
		var gl = this.app.gl;
		var location = this.getLocation(name);
		gl.uniform2f(location, x, y);
	}

	uniform2fv(name: string, value: Float32Array | ArrayLike<number>): void {
		var gl = this.app.gl;
		var location = this.getLocation(name);
		gl.uniform2fv(location, value);
	}

	uniform2i(name: string, x: number, y: number): void {
		var gl = this.app.gl;
		var location = this.getLocation(name);
		gl.uniform2i(location, x, y);
	}

	uniform2iv(name: string, value: Int32Array | ArrayLike<number>): void {
		var gl = this.app.gl;
		var location = this.getLocation(name);
		gl.uniform2iv(location, value);
	}

	uniform3f(name: string, x: number, y: number, z: number): void {
		var gl = this.app.gl;
		var location = this.getLocation(name);
		gl.uniform3f(location, x, y, z);
	}

	uniform3fv(name: string, value: Float32Array | ArrayLike<number>): void {
		var gl = this.app.gl;
		var location = this.getLocation(name);
		gl.uniform3fv(location, value);
	}

	uniform3i(name: string, x: number, y: number, z: number): void {
		var gl = this.app.gl;
		var location = this.getLocation(name);
		gl.uniform3i(location, x, y, z);
	}

	uniform3iv(name: string, value: Int32Array | ArrayLike<number>): void {
		var gl = this.app.gl;
		var location = this.getLocation(name);
		gl.uniform3iv(location, value);
	}

	uniform4f(name: string, x: number, y: number, z: number, w: number): void {
		var gl = this.app.gl;
		var location = this.getLocation(name);
		gl.uniform4f(location, x, y, z, w);
	}

	uniform4fv(name: string, value: Float32Array | ArrayLike<number>): void {
		var gl = this.app.gl;
		var location = this.getLocation(name);
		gl.uniform4fv(location, value);
	}

	uniform4i(name: string, x: number, y: number, z: number, w: number): void {
		var gl = this.app.gl;
		var location = this.getLocation(name);
		gl.uniform4i(location, x, y, z, w);
	}

	uniform4iv(name: string, value: Int32Array | ArrayLike<number>): void {
		var gl = this.app.gl;
		var location = this.getLocation(name);
		gl.uniform3iv(location, value);
	}

	uniformMatrix2fv(name: string, value: Float32Array | ArrayLike<number>): void {
		var gl = this.app.gl;
		var location = this.getLocation(name);
		gl.uniformMatrix2fv(location, false, value);
	}

	uniformMatrix3fv(name: string, value: Float32Array | ArrayLike<number>): void {
		var gl = this.app.gl;
		var location = this.getLocation(name);
		gl.uniformMatrix3fv(location, false, value);
	}

	uniformMatrix4fv(name: string, value: Float32Array | ArrayLike<number>): void {
		var gl = this.app.gl;
		var location = this.getLocation(name);
		gl.uniformMatrix4fv(location, false, value);
	}

	protected getLocation(name: string): WebGLUniformLocation {
		var gl = this.app.gl;
		var location: WebGLUniformLocation = -1;
		if (this._locationsCache[name]) {
			location = this._locationsCache[name];
		} else {
			location = gl.getUniformLocation(this.program, name);
			this._locationsCache[name] = location;
		}
		return location;
	}
}

export class Renderer extends Component {
	enabled: boolean;
	object3d: Tea.Object3D;
	material: Tea.Material;
	protected _uniforms: Uniforms;
	protected _locationsCache: object;

	constructor(app: Tea.App) {
		super(app);
		this.enabled = true;
		this.material = Tea.Material.getDefault(app);
		this._uniforms = new Uniforms(app, null);
		this._locationsCache = {};
	}

	get localToWorldMatrix(): Tea.Matrix4x4 {
		var object3d = this.object3d;
		return object3d.localToWorldMatrix;
	}

	get worldToLocalMatrix(): Tea.Matrix4x4 {
		var object3d = this.object3d;
		return object3d.localToWorldMatrix.inverse;
	}

	render(camera: Tea.Camera): void {
		var program = this.material.shader.program;
		if (program == null) {
			return;
		}
		this._uniforms.program = program;
		this._uniforms.useProgram();
		this.setUniforms(camera);
		this.setTexture(this.material.mainTexture);
	}

	protected getAttribLocation(name: string): number {
		var gl = this.app.gl;
		var location: WebGLUniformLocation = -1;
		if (this._locationsCache[name]) {
			location = this._locationsCache[name];
		} else {
			var program = this.material.shader.program;
			location = gl.getAttribLocation(program, name);
			this._locationsCache[name] = location;
		}
		return location as number;
	}

	setAttribute(name: string, size: number): void {
		var gl = this.app.gl;
		var location = this.getAttribLocation(name);
		if (location < 0) {
			return;
		}
		gl.enableVertexAttribArray(location);
		gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
	}

	disableVertexAttrib(name: string): void {
		var gl = this.app.gl;
		var location = this.getAttribLocation(name);
		if (0 <= location) {
			gl.disableVertexAttribArray(location);
		}
	}

	protected setUniforms(camera: Tea.Camera): void {
		this.setIntrinsicUniforms(camera);
		this.setMaterialUniforms();
		this.setLightUniforms();
	}

	protected setIntrinsicUniforms(camera: Tea.Camera): void {
		var model = this.localToWorldMatrix;
		var view = camera.worldToCameraMatrix;
		var projection = camera.projectionMatrix;

		var mvMatrix = view.mul(model);
		var mvpMatrix = projection.mul(mvMatrix);
		var vpMatrix = projection.mul(view);
		//var invMatrix = mvpMatrix.inverse;

		this._uniforms.uniformMatrix4fv("TEA_MATRIX_MVP", mvpMatrix);
		this._uniforms.uniformMatrix4fv("TEA_MATRIX_MV", mvMatrix);
		this._uniforms.uniformMatrix4fv("TEA_MATRIX_V", view);
		this._uniforms.uniformMatrix4fv("TEA_MATRIX_P", projection);
		this._uniforms.uniformMatrix4fv("TEA_MATRIX_VP", vpMatrix);
		this._uniforms.uniformMatrix4fv("TEA_OBJECT_TO_WORLD", model);
		this._uniforms.uniformMatrix4fv("TEA_WORLD_TO_OBJECT", this.worldToLocalMatrix);
		//this._uniforms.uniformMatrix4fv("invMatrix", invMatrix);
	}

	protected setMaterialUniforms(): void {
		this.material.eachProperty((name, item) => {
			if (name == null || name === "" || item == null) {
				return false;
			}
			switch (item.type) {
				case Tea.UniformType.Int:
					this._uniforms.uniform1i(
						name, item.value as number
					);
					break;
				case Tea.UniformType.Float:
					this._uniforms.uniform1f(
						name, item.value as number
					);
					break;
				case Tea.UniformType.Vector2:
					this._uniforms.uniform2fv(
						name, item.value as Tea.Vector2
					);
					break;
				case Tea.UniformType.Vector4:
					this._uniforms.uniform4fv(
						name, item.value as Tea.Vector4
					);
					break;
				case Tea.UniformType.Matrix:
					this._uniforms.uniformMatrix4fv(
						name, item.value as Tea.Matrix4x4
					);
					break;
				case Tea.UniformType.Color:
					this._uniforms.uniform4fv(
						name, item.value as Tea.Color
					);
					break;
				case Tea.UniformType.FloatArray:
					this._uniforms.uniform1fv(
						name, item.value as Array<number>
					);
					break;
				case Tea.UniformType.Vector4Array:
					this._uniforms.uniform4fv(
						name, Tea.ArrayUtil.unroll(item.value as Array<Tea.Vector4>)
					);
					break;
				case Tea.UniformType.MatrixArray:
					this._uniforms.uniformMatrix4fv(
						name, Tea.ArrayUtil.unroll(item.value as Array<Tea.Matrix4x4>)
					);
					break;
				case Tea.UniformType.ColorArray:
					this._uniforms.uniform4fv(
						name, Tea.ArrayUtil.unroll(item.value as Array<Tea.Color>)
					);
					break;
			}
		});
	}

	protected setLightUniforms(): void {
		let light = new Tea.Vector3(0, 0, -1);
		light.rotateX$(Tea.radians(30));
		//light.rotateX(Tea.radians(this.app.frames/2));
		light.rotateY$(Tea.radians(90));
		//light.x = 0.5;
		//light.x = Tea.radians(light.x);
		//light.y = Tea.radians(light.y);
		//light.z = Tea.radians(light.z);
		light = light.normalized;

		this._uniforms.uniform3fv("lightDirection", light);
		this._uniforms.uniform4fv("ambientColor", [0.2, 0.2, 0.2, 0.0]);
	}

	protected setTexture(texture: Tea.Texture): void {
		var gl = this.app.gl;
		if (texture == null) {
			gl.bindTexture(gl.TEXTURE_2D, null);
			return;
		}
		gl.bindTexture(gl.TEXTURE_2D, texture.webgl.texture);
		//this._uniforms.uniform1i("texture", 0);
	}
}
