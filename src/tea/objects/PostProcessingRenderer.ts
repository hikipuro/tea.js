import * as Tea from "../Tea";
import { Renderer } from "../components/Renderer";

export class PostProcessingRenderer extends Renderer {
	vertexBuffer: WebGLBuffer;
	indexBuffer: WebGLBuffer;
	mesh: Tea.Mesh;
	renderTexture: Tea.RenderTexture;
	backgroundColor: Tea.Color;

	constructor(app: Tea.App) {
		super(app);
		var gl = this.gl;
		this.vertexBuffer = gl.createBuffer();
		this.indexBuffer = gl.createBuffer();
		this.mesh = Tea.Primitives.createPostProcessingMesh();
		this.setMeshData(this.mesh);
		this.renderTexture = null;
		var shader = new Tea.Shader(app);
		shader.attach(
			Tea.ShaderSources.simplePostProcessingVS,
			Tea.ShaderSources.simplePostProcessingFS
		);
		this.material = Tea.Material.getDefault(app);
		this.material.shader = shader;
		this.backgroundColor = Tea.Color.black.clone();
	}

	clear(): void {
		var gl = this.gl;
		this.app.status.setClearColor(this.backgroundColor);
		var texture = this.renderTexture;
		this.app.status.setViewport(
			0.0, 0.0, texture.width, texture.height
		);
		gl.clear(
			gl.COLOR_BUFFER_BIT |
			gl.DEPTH_BUFFER_BIT |
			gl.STENCIL_BUFFER_BIT
		);
	}

	render(): void {
		var shader = this.material.shader;
		if (shader == null) {
			return;
		}
		var gl = this.gl;
		gl.useProgram(shader.program);
		var width = this.app.width;
		var height = this.app.height;
		this.material.setFloat("ScreenWidth", width);
		this.material.setFloat("ScreenHeight", height);
		this.setMaterialUniforms();
		//this.renderTexture.filterMode = Tea.FilterMode.Point;
		//this.renderTexture.wrapMode = Tea.TextureWrapMode.Mirror;
		this.material.mainTexture = this.renderTexture;
		this.setTextures();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		var location = shader.getAttribLocation("vertex");
		if (location >= 0) {
			gl.enableVertexAttribArray(location);
			gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 20, 0);
		}
		location = shader.getAttribLocation("texcoord");
		if (location >= 0) {
			gl.enableVertexAttribArray(location);
			gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 20, 12);
		}
		this.app.status.setViewport(
			0.0, 0.0, width, height
		);
		/*
		gl.clear(
			gl.COLOR_BUFFER_BIT |
			gl.DEPTH_BUFFER_BIT |
			gl.STENCIL_BUFFER_BIT
		);
		*/

		this.app.status.setFrontFace(gl.CCW);

		var count = 6;//this.mesh.triangles.length * 3;
		gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
		Renderer.drawCallCount++;
	}

	protected setMeshData(mesh: Tea.Mesh): void {
		var data = mesh.createVertexBufferData();
		var gl = this.gl;
		var target = gl.ARRAY_BUFFER;
		gl.bindBuffer(target, this.vertexBuffer);
		gl.bufferData(target, data, gl.STATIC_DRAW);
		target = gl.ELEMENT_ARRAY_BUFFER;
		var triangles = new Uint16Array(Tea.ArrayUtil.unroll(mesh.triangles));
		gl.bindBuffer(target, this.indexBuffer);
		gl.bufferData(target, triangles, gl.STATIC_DRAW);
		mesh.isModified = false;
	}
}
