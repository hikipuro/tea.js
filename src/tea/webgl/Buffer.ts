export class Buffer {
	buffer: WebGLBuffer;
	protected gl: WebGLRenderingContext;

	constructor(gl: WebGLRenderingContext) {
		this.gl = gl;
		this.buffer = gl.createBuffer();
	}

	get isBuffer(): boolean {
		return this.gl.isBuffer(this.buffer);
	}

	delete(): void {
		this.gl.deleteBuffer(this.buffer);
		this.buffer = null;
	}

	bind(target: BufferTarget): void {
		this.gl.bindBuffer(target, this.buffer);
	}

	getParameter(target: BufferTarget, pname: BufferParameter): number {
		return this.gl.getBufferParameter(target, pname);
	}

	data(target: BufferTarget, 
		size: number | Int8Array | Int16Array | Int32Array |
		Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray |
		Float32Array | Float64Array | DataView | ArrayBuffer | null,
		usage: number): void
	{
		this.gl.bufferData(target, size, usage);
	}

	subData(): void {
		//this.gl.bufferSubData();
	}
}

export enum BufferTarget {
	ArrayBuffer = 0x8892,
	ElementArrayBuffer = 0x8893
}

export enum BufferParameter {
	BufferSize = 0x8764,
	BufferUsage = 0x8765,
	StaticDraw = 0x88E4,
	DynamicDraw = 0x88E8,
	StreamDraw = 0x88E0
}

export enum BufferUsage {
	StaticDraw = 0x88E4,
	DynamicDraw = 0x88E8,
	StreamDraw = 0x88E0
}

