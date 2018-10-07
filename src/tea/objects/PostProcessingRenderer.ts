import * as Tea from "../Tea";
import { Renderer } from "../components/Renderer";

export class PostProcessingRenderer extends Renderer {
	vertexBuffer: WebGLBuffer;
	indexBuffer: WebGLBuffer;
	mesh: Tea.Mesh;
	renderTexture: Tea.RenderTexture;

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
		this.material.shader = shader;
	}

	render(camera: Tea.Camera): void {
		var shader = this.material.shader;
		if (shader == null) {
			return;
		}
		var gl = this.gl;
		var shader = this.material.shader;
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
		camera.setViewport();
		//gl.viewport(0.0, 0.0, this.app.width, this.app.height);

		var status = this.app.status;
		var face = gl.CCW;
		if (status.frontFace !== face) {
			gl.frontFace(face);
			status.frontFace = face;
		}

		var count = this.mesh.triangles.length * 3;
		gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
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
