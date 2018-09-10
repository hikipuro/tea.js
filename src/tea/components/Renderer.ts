import * as Tea from "../Tea";
import { Component } from "./Component";

class Uniforms {
	app: Tea.App;
	gl: WebGLRenderingContext;
	shader: Tea.Shader;

	constructor(app: Tea.App) {
		this.app = app;
		this.gl = this.app.gl;
	}

	remove(): void {
		this.app = null;
		this.gl = null;
		this.shader = null;
	}

	useProgram(): void {
		this.gl.useProgram(this.shader.program);
	}

	uniform1f(name: string, value: number): void {
		var location = this.shader.propertyToID(name);
		if (location < 0) {
			return;
		}
		this.gl.uniform1f(location, value);
	}

	uniform1fv(name: string, value: Float32Array | ArrayLike<number>): void {
		var location = this.shader.propertyToID(name);
		if (location < 0) {
			return;
		}
		this.gl.uniform1fv(location, value);
	}

	uniform1i(name: string, value: number): void {
		var location = this.shader.propertyToID(name);
		if (location < 0) {
			return;
		}
		this.gl.uniform1i(location, value);
	}

	uniform1iv(name: string, value: Int32Array | ArrayLike<number>): void {
		var location = this.shader.propertyToID(name);
		if (location < 0) {
			return;
		}
		this.gl.uniform1iv(location, value);
	}

	uniform2f(name: string, x: number, y: number): void {
		var location = this.shader.propertyToID(name);
		if (location < 0) {
			return;
		}
		this.gl.uniform2f(location, x, y);
	}

	uniform2fv(name: string, value: Float32Array | ArrayLike<number>): void {
		var location = this.shader.propertyToID(name);
		if (location < 0) {
			return;
		}
		this.gl.uniform2fv(location, value);
	}

	uniform2i(name: string, x: number, y: number): void {
		var location = this.shader.propertyToID(name);
		if (location < 0) {
			return;
		}
		this.gl.uniform2i(location, x, y);
	}

	uniform2iv(name: string, value: Int32Array | ArrayLike<number>): void {
		var location = this.shader.propertyToID(name);
		if (location < 0) {
			return;
		}
		this.gl.uniform2iv(location, value);
	}

	uniform3f(name: string, x: number, y: number, z: number): void {
		var location = this.shader.propertyToID(name);
		if (location < 0) {
			return;
		}
		this.gl.uniform3f(location, x, y, z);
	}

	uniform3fv(name: string, value: Float32Array | ArrayLike<number>): void {
		var location = this.shader.propertyToID(name);
		if (location < 0) {
			return;
		}
		this.gl.uniform3fv(location, value);
	}

	uniform3i(name: string, x: number, y: number, z: number): void {
		var location = this.shader.propertyToID(name);
		if (location < 0) {
			return;
		}
		this.gl.uniform3i(location, x, y, z);
	}

	uniform3iv(name: string, value: Int32Array | ArrayLike<number>): void {
		var location = this.shader.propertyToID(name);
		if (location < 0) {
			return;
		}
		this.gl.uniform3iv(location, value);
	}

	uniform4f(name: string, x: number, y: number, z: number, w: number): void {
		var location = this.shader.propertyToID(name);
		if (location < 0) {
			return;
		}
		this.gl.uniform4f(location, x, y, z, w);
	}

	uniform4fv(name: string, value: Float32Array | ArrayLike<number>): void {
		var location = this.shader.propertyToID(name);
		if (location < 0) {
			return;
		}
		this.gl.uniform4fv(location, value);
	}

	uniform4i(name: string, x: number, y: number, z: number, w: number): void {
		var location = this.shader.propertyToID(name);
		if (location < 0) {
			return;
		}
		this.gl.uniform4i(location, x, y, z, w);
	}

	uniform4iv(name: string, value: Int32Array | ArrayLike<number>): void {
		var location = this.shader.propertyToID(name);
		if (location < 0) {
			return;
		}
		this.gl.uniform3iv(location, value);
	}

	uniformMatrix2fv(name: string, value: Float32Array | ArrayLike<number>): void {
		var location = this.shader.propertyToID(name);
		if (location < 0) {
			return;
		}
		this.gl.uniformMatrix2fv(location, false, value);
	}

	uniformMatrix3fv(name: string, value: Float32Array | ArrayLike<number>): void {
		var location = this.shader.propertyToID(name);
		if (location < 0) {
			return;
		}
		this.gl.uniformMatrix3fv(location, false, value);
	}

	uniformMatrix4fv(name: string, value: Float32Array | ArrayLike<number>): void {
		var location = this.shader.propertyToID(name);
		if (location < 0) {
			return;
		}
		this.gl.uniformMatrix4fv(location, false, value);
	}

	hasName(name: string): boolean {
		var location = this.shader.propertyToID(name);
		return location >= 0;
	}
}

export class Renderer extends Component {
	static drawCallCount: number = 0;
	enabled: boolean;
	object3d: Tea.Object3D;
	material: Tea.Material;
	protected gl: WebGLRenderingContext;
	//protected _uniforms: Uniforms;

	constructor(app: Tea.App) {
		super(app);
		this.gl = app.gl;
		this.enabled = true;
		this.material = Tea.Material.getDefault(app);
		//this._uniforms = new Uniforms(app);
	}

	get localToWorldMatrix(): Tea.Matrix4x4 {
		var object3d = this.object3d;
		return object3d.localToWorldMatrix;
	}

	get worldToLocalMatrix(): Tea.Matrix4x4 {
		var object3d = this.object3d;
		return object3d.worldToLocalMatrix;
	}

	render(camera: Tea.Camera, lights: Array<Tea.Light>): void {
		var shader = this.material.shader;
		if (shader == null) {
			return;
		}
		//this._uniforms.shader = shader;
		this.gl.useProgram(this.material.shader.program);
		this.setShaderSettings();
		this.setIntrinsicUniforms(camera);
		this.setMaterialUniforms();
		this.setLightUniforms(camera, lights);
		this.setTextures();
		//this.setTexture(this.material.mainTexture);
	}

	vertexAttribPointer(name: string, size: number, stride: number = 0, offset: number = 0): void {
		var location = this.material.shader.getAttribLocation(name);
		if (location < 0) {
			return;
		}
		var gl = this.gl;
		gl.vertexAttribPointer(
			location, size, gl.FLOAT, false, stride, offset
		);
	}

	enableVertexAttribArray(name: string): void {
		var location = this.material.shader.getAttribLocation(name);
		if (0 <= location) {
			this.gl.enableVertexAttribArray(location);
		}
	}

	disableVertexAttrib(name: string): void {
		var location = this.material.shader.getAttribLocation(name);
		if (0 <= location) {
			this.gl.disableVertexAttribArray(location);
		}
	}

	protected setShaderSettings(): void {
		var gl = this.gl;
		var settings = this.material.shader.settings;
		if (settings.enableBlend) {
			gl.enable(gl.BLEND);
			this.setShaderBlend(settings);
		} else {
			gl.disable(gl.BLEND);
		}
		if (settings.enableCullFace) {
			gl.enable(gl.CULL_FACE);
			var mode = Tea.Shader.getFaceValue(
				gl, settings.cullFaceMode
			);
			gl.cullFace(mode);
		} else {
			gl.disable(gl.CULL_FACE);
		}
		if (settings.enableDither) {
			gl.enable(gl.DITHER);
		} else {
			gl.disable(gl.DITHER);
		}
		if (settings.enableDepthTest) {
			gl.enable(gl.DEPTH_TEST);
			var func = Tea.Shader.getTestFuncValue(
				gl, settings.depthFunc
			);
			gl.depthFunc(func);
		} else {
			gl.disable(gl.DEPTH_TEST);
		}
		if (settings.depthWriteMask) {
			gl.depthMask(true);
		} else {
			gl.depthMask(false);
		}
		if (settings.colorWriteMask != null) {
			var colorWriteMask = settings.colorWriteMask;
			gl.colorMask(
				colorWriteMask.red,
				colorWriteMask.green,
				colorWriteMask.blue,
				colorWriteMask.alpha
			);
		}
		//if (settings.enablePolygonOffsetFill) {
		//	gl.enable(gl.POLYGON_OFFSET_FILL);
		//} else {
		//	gl.disable(gl.POLYGON_OFFSET_FILL);
		//}
		//if (settings.enableSampleCoverage) {
		//	gl.enable(gl.SAMPLE_COVERAGE);
		//} else {
		//	gl.disable(gl.SAMPLE_COVERAGE);
		//}
		//if (settings.enableScissorTest) {
		//	gl.enable(gl.SCISSOR_TEST);
		//} else {
		//	gl.disable(gl.SCISSOR_TEST);
		//}
		if (settings.enableStencilTest) {
			gl.enable(gl.STENCIL_TEST);
			this.setShaderStencil(settings);
		} else {
			gl.disable(gl.STENCIL_TEST);
		}
	}

	protected setShaderBlend(settings: Tea.ShaderSettings): void {
		var gl = this.gl;
		var blend = settings.blend;
		gl.blendColor(
			blend.red,
			blend.green,
			blend.blue,
			blend.alpha
		);
		var modeRGB = Tea.Shader.getBlendEquationValue(
			gl, blend.equationRGB
		);
		var modeAlpha = Tea.Shader.getBlendEquationValue(
			gl, blend.equationAlpha
		);
		gl.blendEquationSeparate(
			modeRGB,
			modeAlpha
		);
		var srcRGB = Tea.Shader.getBlendFuncValue(
			gl, blend.srcRGB
		);
		var dstRGB = Tea.Shader.getBlendFuncValue(
			gl, blend.dstRGB
		);
		var srcAlpha = Tea.Shader.getBlendFuncValue(
			gl, blend.srcAlpha
		);
		var dstAlpha = Tea.Shader.getBlendFuncValue(
			gl, blend.dstAlpha
		);
		gl.blendFuncSeparate(
			srcRGB,
			dstRGB,
			srcAlpha,
			dstAlpha
		);
	}

	protected setShaderStencil(settings: Tea.ShaderSettings): void {
		var gl = this.gl;
		var stencil = settings.stencil;
		var func = Tea.Shader.getTestFuncValue(
			gl, stencil.frontFunc
		);
		gl.stencilFuncSeparate(
			gl.FRONT,
			func,
			stencil.frontRef,
			stencil.frontMask
		);
		func = Tea.Shader.getTestFuncValue(
			gl, stencil.backFunc
		);
		gl.stencilFuncSeparate(
			gl.BACK,
			func,
			stencil.backRef,
			stencil.backMask
		);
		var fail = Tea.Shader.getStencilOpValue(
			gl, stencil.frontFail
		);
		var zfail = Tea.Shader.getStencilOpValue(
			gl, stencil.frontZfail
		);
		var zpass = Tea.Shader.getStencilOpValue(
			gl, stencil.frontZpass
		);
		gl.stencilOpSeparate(
			gl.FRONT,
			fail,
			zfail,
			zpass
		);
		fail = Tea.Shader.getStencilOpValue(
			gl, stencil.backFail
		);
		zfail = Tea.Shader.getStencilOpValue(
			gl, stencil.backZfail
		);
		zpass = Tea.Shader.getStencilOpValue(
			gl, stencil.backZpass
		);
		gl.stencilOpSeparate(
			gl.BACK,
			fail,
			zfail,
			zpass
		);
		//var stencilMask = settings.stencilMask;
		//gl.stencilMaskSeparate(gl.FRONT, stencilMask.front);
		//gl.stencilMaskSeparate(gl.BACK, stencilMask.back);
	}

	protected setIntrinsicUniforms(camera: Tea.Camera): void {
		var gl = this.gl;
		var shader = this.material.shader;

		//var u = this._uniforms;
		var model = this.object3d.localToWorldMatrix;
		var view = camera.worldToCameraMatrix;
		var projection = camera.projectionMatrix;
		var vpMatrix = camera.vpMatrix;

		var inverseModel = this.object3d.worldToLocalMatrix;
		var inverseView = camera.cameraToWorldMatrix;

		var location: WebGLUniformLocation = null;

		location = shader.propertyToID("TEA_MATRIX_V");
		if (location != null) {
			gl.uniformMatrix4fv(location, false, view);
		}
		location = shader.propertyToID("TEA_MATRIX_I_V");
		if (location != null) {
			gl.uniformMatrix4fv(location, false, inverseView);
		}
		location = shader.propertyToID("TEA_MATRIX_P");
		if (location != null) {
			gl.uniformMatrix4fv(location, false, projection);
		}
		location = shader.propertyToID("TEA_OBJECT_TO_WORLD");
		if (location != null) {
			gl.uniformMatrix4fv(location, false, model);
		}
		location = shader.propertyToID("TEA_WORLD_TO_OBJECT");
		if (location != null) {
			gl.uniformMatrix4fv(location, false, inverseModel);
		}
		location = shader.propertyToID("TEA_MATRIX_VP");
		if (location != null) {
			gl.uniformMatrix4fv(location, false, vpMatrix);
		}

		/*
		u.uniformMatrix4fv("TEA_MATRIX_V", view);
		u.uniformMatrix4fv("TEA_MATRIX_I_V", inverseView);
		u.uniformMatrix4fv("TEA_MATRIX_P", projection);
		u.uniformMatrix4fv("TEA_OBJECT_TO_WORLD", model);
		u.uniformMatrix4fv("TEA_WORLD_TO_OBJECT", inverseModel);
		u.uniformMatrix4fv("TEA_MATRIX_VP", vpMatrix);
		*/

		var mvMatrix = view.mul(model);
		location = shader.propertyToID("TEA_MATRIX_MV");
		if (location != null) {
			gl.uniformMatrix4fv(location, false, mvMatrix);
		}
		//u.uniformMatrix4fv("TEA_MATRIX_MV", mvMatrix);

		location = shader.propertyToID("TEA_MATRIX_MVP");
		if (location != null) {
			var mvpMatrix = projection.mul(mvMatrix);
			gl.uniformMatrix4fv(location, false, mvpMatrix);
		}
		//u.uniformMatrix4fv("TEA_MATRIX_MVP", mvpMatrix);

		//u.uniformMatrix4fv("TEA_MATRIX_I_MVP", invMatrix);
		//u.uniformMatrix4fv("TEA_MATRIX_IT_MV", itmvMatrix);
		//u.uniformMatrix4fv("TEA_MATRIX_IT_P", projection);
		//u.uniformMatrix4fv("invMatrix", invMatrix);

		location = shader.propertyToID("TEA_CAMERA_STEREO");
		if (location != null && camera.enableStereo) {
			if (camera.stereoMode === Tea.CameraStereoMode.LineByLine) {
				var stereoMod = 2;
				if (camera.isStereoLeft) {
					stereoMod--;
				}
				gl.uniform1i(location, stereoMod);
			} else {
				gl.uniform1i(location, 0);
			}
		}
	}

	protected setMaterialUniforms(): void {
		var gl = this.gl;
		var shader = this.material.shader;
		this.material.eachProperty((name, item) => {
			var location = shader.propertyToID(name);
			if (location == null) {
				return;
			}

			switch (item.type) {
				case Tea.UniformType.Int:
					gl.uniform1i(
						location, item.value as number
					);
					break;
				case Tea.UniformType.Float:
					gl.uniform1f(
						location, item.value as number
					);
					break;
				case Tea.UniformType.Vector2:
					gl.uniform2fv(
						location, item.value as Tea.Vector2
					);
					break;
				case Tea.UniformType.Vector4:
					gl.uniform4fv(
						location, item.value as Tea.Vector4
					);
					break;
				case Tea.UniformType.Matrix:
					gl.uniformMatrix4fv(
						location, false, item.value as Tea.Matrix4x4
					);
					break;
				case Tea.UniformType.Color:
					gl.uniform4fv(
						location, item.value as Tea.Color
					);
					break;
				case Tea.UniformType.FloatArray:
					gl.uniform1fv(
						location, item.value as Array<number>
					);
					break;
				case Tea.UniformType.Vector4Array:
					gl.uniform4fv(
						location, Tea.ArrayUtil.unroll(item.value as Array<Tea.Vector4>)
					);
					break;
				case Tea.UniformType.MatrixArray:
					gl.uniformMatrix4fv(
						location, false, Tea.ArrayUtil.unroll(item.value as Array<Tea.Matrix4x4>)
					);
					break;
				case Tea.UniformType.ColorArray:
					gl.uniform4fv(
						location, Tea.ArrayUtil.unroll(item.value as Array<Tea.Color>)
					);
					break;
			}
		});
	}

	protected setLightUniforms(camera: Tea.Camera, lights: Array<Tea.Light>): void {
		var gl = this.gl;
		/*
		var light = new Tea.Vector3(0, 0, -1);
		light.rotateX$(Tea.radians(30));
		light.rotateY$(Tea.radians(60));
		//light.rotateX(Tea.radians(this.app.frames/2));
		//light.rotateY$(Tea.radians(90));
		//light.x = 0.5;
		//light.x = Tea.radians(light.x);
		//light.y = Tea.radians(light.y);
		//light.z = Tea.radians(light.z);
		light = light.normalized;
		*/

		var location: WebGLUniformLocation = null;

		var d = new Tea.Vector3(0, 0, -1);
		var lightCount = Math.min(2, lights.length);
		for (var i = 0; i < lightCount; i++) {
			location = this.material.shader.propertyToID("lights[" + i + "].direction");
			if (location != null) {
				d.applyQuaternion(lights[i].object3d.rotation);
				d.normalize$();
				gl.uniform3fv(location, d);
			}
		}
		location = this.material.shader.propertyToID("ambientColor");
		if (location != null) {
			gl.uniform3fv(location, [0.2, 0.2, 0.2]);
		}
		//this._uniforms.uniform3fv("lightDirection", light);
		//this._uniforms.uniform3fv("eyeDirection", camera.object3d.position);
		//this._uniforms.uniform3fv("ambientColor", [0.2, 0.2, 0.2]);
	}

	protected setTextures(): void {
		var gl = this.gl;
		var keys = this.material.textureKeys;
		var length = keys.length;
		for (var i = 0; i < length; i++) {
			var key = keys[i];
			var texture = this.material.getTexture(key);
			gl.activeTexture(gl["TEXTURE" + i]);
			this.setTexture(i, key, texture);
		}
	}

	protected setTexture(id: number, name: string, texture: Tea.Texture): void {
		var location = this.material.shader.propertyToID(name);
		if (location == null) {
			return;
		}
		var gl = this.gl;
		if (texture == null) {
			gl.bindTexture(gl.TEXTURE_2D, null);
			return;
		}
		gl.bindTexture(gl.TEXTURE_2D, texture.webgl.texture);
		gl.uniform1i(location, id);
		//this._uniforms.uniform1i(name, id);
	}
}
