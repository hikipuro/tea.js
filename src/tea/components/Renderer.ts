import * as Tea from "../Tea";
import { Component } from "./Component";

class Attributes {
	list: Array<boolean>;
	indexList: Array<number>;
	constructor() {
		this.list = [];
		this.indexList = [];
	}
	isEnabled(i: number): boolean {
		return this.list[i] != null ? this.list[i] : false;
	}
	enable(i: number): void {
		if (i < 0) {
			return;
		}
		this.indexList.push(i);
		this.list[i] = true;
	}
	end(gl: WebGLRenderingContext):void {
		var list = this.list;
		var indexList = this.indexList;
		var keys = list.keys();
		for (var key of keys) {
			if (indexList.indexOf(key) >= 0) {
				continue;
			}
			if (list[key] === false) {
				continue;
			}
			gl.disableVertexAttribArray(key);
			list[key] = false;
		}
		indexList.splice(0, indexList.length);
	}
}

export class Renderer extends Component {
	static drawCallCount: number = 0;
	static readonly MaxLightCount: number = 4;
	static readonly attributes: Attributes = new Attributes();
	material: Tea.Material;
	protected gl: WebGLRenderingContext;
	protected _mvMatrix: Tea.Matrix4x4 = new Tea.Matrix4x4();
	protected _mvpMatrix: Tea.Matrix4x4 = new Tea.Matrix4x4();

	constructor(app: Tea.App) {
		super(app);
		this.gl = app.gl;
		this.enabled = true;
		//this.material = Tea.Material.getDefault(app);
	}

	get localToWorldMatrix(): Tea.Matrix4x4 {
		var object3d = this.object3d;
		return object3d.localToWorldMatrix;
	}

	get worldToLocalMatrix(): Tea.Matrix4x4 {
		var object3d = this.object3d;
		return object3d.worldToLocalMatrix;
	}

	destroy(): void {
		if (this.material != null) {
			this.material.destroy();
			this.material = undefined;
		}
		this.gl = undefined;
		this._mvMatrix = undefined;
		this._mvpMatrix = undefined;
		super.destroy();
	}

	render(camera: Tea.Camera, lights: Array<Tea.Light>, renderSettings: Tea.RenderSettings): void {
		var shader = this.material.shader;
		if (shader == null) {
			return;
		}
		this.gl.useProgram(this.material.shader.program);
		this.setShaderSettings();
		this.setIntrinsicUniforms(camera);
		this.setMaterialUniforms();
		if (lights != null && renderSettings != null) {
			this.setLightUniforms(lights, renderSettings);
		}
		this.setTextures();
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

	toJSON(): Object {
		var json = super.toJSON();
		Object.assign(json, {
			_type: "Renderer",
			material: this.material.toJSON()
		});
		return json;
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
		var vpMatrix = camera.viewProjectionMatrix;

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

		var enableMV = false;
		var mvMatrix = this._mvMatrix;
		location = shader.propertyToID("TEA_MATRIX_MV");
		if (location != null) {
			enableMV = true;
			mvMatrix.copy(view);
			mvMatrix.mul$(model);
			gl.uniformMatrix4fv(location, false, mvMatrix);
		}
		//u.uniformMatrix4fv("TEA_MATRIX_MV", mvMatrix);

		location = shader.propertyToID("TEA_MATRIX_MVP");
		if (location != null) {
			if (enableMV === false) {
				mvMatrix.copy(view);
				mvMatrix.mul$(model);
			}
			var mvpMatrix = this._mvpMatrix;
			mvpMatrix.copy(projection);
			mvpMatrix.mul$(mvMatrix);
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

	protected setLightUniforms(lights: Array<Tea.Light>, renderSettings: Tea.RenderSettings): void {
		var gl = this.gl;
		var shader = this.material.shader;
		var location: WebGLUniformLocation = null;
		
		if (lights == null && lights.length <= 0) {
			location = shader.propertyToID("lightCount");
			if (location != null) {
				gl.uniform1i(location, 0);
			}
			location = shader.propertyToID("ambientColor");
			if (location != null) {
				gl.uniform4fv(location, renderSettings.ambientLight);
			}
			return;
		}

		var length = Math.min(lights.length, Renderer.MaxLightCount);
		for (var i = 0; i < length; i++) {
			var light = lights[i];
			location = shader.propertyToID("lights[" + i + "].color");
			if (location != null) {
				var color = light.color;
				var intensity = light.intensity;
				gl.uniform4f(
					location,
					color[0] * intensity,
					color[1] * intensity,
					color[2] * intensity,
					color[3]
				);
			}
			location = shader.propertyToID("lights[" + i + "].position");
			if (location != null) {
				var p = light.object3d.position;
				gl.uniform4f(
					location, p[0], p[1], p[2], 0.0
				);
			}
			location = shader.propertyToID("lights[" + i + "].direction");
			if (location != null) {
				var d = light.direction;
				gl.uniform4f(
					location, d[0], d[1], d[2], light.type
				);
			}
			location = shader.propertyToID("lights[" + i + "].range");
			if (location != null) {
				gl.uniform1f(location, light.range);
			}
			location = shader.propertyToID("lights[" + i + "].spotAngle");
			if (location != null) {
				gl.uniform1f(
					location,
					light.spotAngle * Math.PI / 180.0
				);
			}
		}
		location = shader.propertyToID("lightCount");
		if (location != null) {
			gl.uniform1i(location, length);
		}
		location = shader.propertyToID("ambientColor");
		if (location != null) {
			gl.uniform4fv(location, renderSettings.ambientLight);
		}
		//this._uniforms.uniform3fv("eyeDirection", camera.object3d.position);
	}

	protected setTextures(): void {
		var gl = this.gl;
		var shader = this.material.shader;
		var maxUnits = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
		var keys = this.material.textureKeys;
		var length = Math.min(maxUnits, keys.length);
		var id = 0;
		for (var i = 0; i < length; i++) {
			var key = keys[i];
			var location = shader.propertyToID(key);
			if (location == null) {
				continue;
			}
			var texture = this.material.getTexture(key);
			gl.activeTexture(gl["TEXTURE" + id]);
			if (texture == null) {
				gl.bindTexture(gl.TEXTURE_2D, null);
				continue;
			}
			gl.bindTexture(gl.TEXTURE_2D, texture.texture);
			gl.uniform1i(location, id);
			id++;
		}
	}
}
