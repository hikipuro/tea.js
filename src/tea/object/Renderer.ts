import * as Tea from "../Tea";

export class Renderer {
	app: Tea.App;
	object3d: Tea.Object3D;
	shader: Tea.Shader;
	mesh: Tea.Mesh;
	camera: Tea.Camera;

	vertexBuffer: WebGLBuffer;
	indexBuffer: WebGLBuffer;
	uvBuffer: WebGLBuffer;

	wireframe: boolean = false;

	constructor(app: Tea.App) {
		this.app = app;
		const gl = this.app.gl;
		this.vertexBuffer = gl.createBuffer();
		this.indexBuffer = gl.createBuffer();
	}

	remove(): void {
		const gl = this.app.gl;
		if (this.vertexBuffer != null) {
			gl.deleteBuffer(this.vertexBuffer);
			this.vertexBuffer = null;
		}
		if (this.indexBuffer != null) {
			gl.deleteBuffer(this.indexBuffer);
			this.indexBuffer = null;
		}
		if (this.uvBuffer != null) {
			gl.deleteBuffer(this.uvBuffer);
			this.uvBuffer = null;
		}
	}

	render(): void {
		if (this.isRenderable === false) {
			return;
		}

		const gl = this.app.gl;
		const height = this.app.height;
		//gl.enable(gl.SCISSOR_TEST);
		//gl.scissor(0, 0, 400, height * 0.9);
		//gl.viewport(0, -height * 0.1, 400, height);
		//console.log("this.height", this.app.height);

		this.setUniforms();
		this.setTexture(this.shader.texture);
		this.setVertexBuffer(this.mesh);
		this.setIndexBuffer(this.mesh);
		this.draw();
	}

	protected get isRenderable(): boolean {
		return (
			this.object3d != null &&
			this.shader != null &&
			this.mesh != null &&
			this.camera != null
		);
	}

	protected setUniforms(): void {
		let model = Tea.Matrix4.identity;
		model = model.mul(Tea.Matrix4.translate(this.object3d.position));
		model = model.mul(Tea.Matrix4.rotateZXY(this.object3d.rotation));
		model = model.mul(Tea.Matrix4.scale(this.object3d.scale));

		const mvpMatrix = this.camera.mvpMatrix(model);
		this.shader.uniformMatrix4fv("mvpMatrix", mvpMatrix);
	}

	protected setTexture(texture: Tea.Texture): void {
		const gl = this.app.gl;
		gl.bindTexture(gl.TEXTURE_2D, texture.webgl.texture);
		this.shader.uniform1i("texture", 0);
	}

	protected setVertexBuffer(mesh: Tea.Mesh): void {
		const gl = this.app.gl;
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);
		this.shader.setAttribute("position", 3);

		if (mesh.uv != null && mesh.uv.length > 0) {
			if (this.uvBuffer == null) {
				this.uvBuffer = gl.createBuffer();
			}
			gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, mesh.uv, gl.STATIC_DRAW);
			this.shader.setAttribute("texCoord", 2);
		}
	}

	protected setIndexBuffer(mesh: Tea.Mesh): void {
		const gl = this.app.gl;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.triangles, gl.STATIC_DRAW);
	}

	protected draw(): void {
		const gl = this.app.gl;
		if (this.mesh.triangles == null || this.mesh.triangles.length <= 0) {
			const count = this.mesh.vertices.length / 3;
			//gl.drawArrays(gl.POINTS, 0, count);
			//gl.drawArrays(gl.LINE_LOOP, 0, count);
			gl.drawArrays(gl.TRIANGLES, 0, count);
			//gl.drawArrays(gl.TRIANGLE_STRIP, 0, count);
			return;
		}

		if (this.wireframe) {
			const count = this.mesh.triangles.length;
			gl.drawElements(gl.LINE_LOOP, count, gl.UNSIGNED_SHORT, 0);
			return;
		}

		const scale = this.object3d.scale;
		if (scale.x * scale.y * scale.z < 0) {
			gl.frontFace(gl.CW);
		} else {
			gl.frontFace(gl.CCW);
		}

		const count = this.mesh.triangles.length;
		gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0);
	}
}
