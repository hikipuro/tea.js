import * as Tea from "../Tea";
import { Renderer } from "./Renderer";

export class ParticleSystemRenderer extends Renderer {
	vertexBuffer: WebGLBuffer;

	constructor(app: Tea.App) {
		super(app);
		var gl = this.gl;
		this.vertexBuffer = gl.createBuffer();
	}

	destroy(): void {
		var gl = this.gl;
		if (this.vertexBuffer != null) {
			gl.deleteBuffer(this.vertexBuffer);
			this.vertexBuffer = undefined;
		}
		super.destroy();
	}

	render(camera: Tea.Camera, lights: Array<Tea.Light>, renderSettings: Tea.RenderSettings): void {
		if (this.enabled === false || camera == null) {
			return;
		}
		if (this.isRenderable === false) {
			return;
		}
		var particleSystem = this.object3d.getComponent(Tea.ParticleSystem);
		if (particleSystem == null) {
			return;
		}
		//particleSystem.update();
		if (particleSystem.particleCount <= 0) {
			return;
		}
		super.render(camera, lights, renderSettings);
		//this._uniforms.uniform1f("pointSize", particleSystem.pointSize);
		this.setVertexBuffer(particleSystem);
		this.draw(particleSystem);
	}

	toJSON(): Object {
		var json = super.toJSON();
		Object.assign(json, {
			_type: "ParticleSystemRenderer"
		});
		return json;
	}

	protected get isRenderable(): boolean {
		return (
			this.object3d != null &&
			this.material != null &&
			this.material.shader != null
		);
	}

	protected setVertexBuffer(particleSystem: Tea.ParticleSystem): void {
		var gl = this.gl;
		var target = gl.ARRAY_BUFFER;
		gl.useProgram(this.material.shader.program);
		var data = new Float32Array(particleSystem.bufferData);
		gl.bindBuffer(target, this.vertexBuffer);
		gl.bufferData(target, data, gl.DYNAMIC_DRAW);
		var stride = 4 * 8;
		this.enableVertexAttribArray("vertex");
		this.enableVertexAttribArray("color");
		this.enableVertexAttribArray("size");
		this.vertexAttribPointer("vertex", 3, stride, 0);
		this.vertexAttribPointer("color",  4, stride, 4 * 3);
		this.vertexAttribPointer("size",   1, stride, 4 * 7);
		gl.bindBuffer(target, null);
	}

	protected draw(particleSystem: Tea.ParticleSystem): void {
		var gl = this.gl;
		var count = particleSystem.particleCount;
		gl.drawArrays(gl.POINTS, 0, count);
	}
}
