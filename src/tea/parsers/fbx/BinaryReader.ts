export class BinaryReader {
	data: ArrayBuffer;
	view: DataView;
	offset: number;
	littleEndian: boolean;

	constructor(data: ArrayBuffer, littleEndian: boolean = false) {
		this.data = data;
		this.view = new DataView(data);
		this.offset = 0;
		this.littleEndian = littleEndian;
	}

	get isCompleted(): boolean {
		return this.offset >= this.data.byteLength;
	}

	readBinary(length: number): ArrayBuffer {
		if (length <= 0) {
			return null;
		}
		var i = this.offset;
		this.offset += length;
		return this.data.slice(i, i + length);
	}

	readInt8(): number {
		var offset = this.offset;
		this.offset += 1;
		return this.view.getInt8(offset);
	}

	readInt16(): number {
		var offset = this.offset;
		this.offset += 2;
		return this.view.getInt16(
			offset, this.littleEndian
		);
	}

	readInt32(): number {
		var offset = this.offset;
		this.offset += 4;
		return this.view.getInt32(
			offset, this.littleEndian
		);
	}

	readInt64(): Array<number> {
		var offset = this.offset;
		this.offset += 8;
		var result = [];
		result.push(this.view.getInt32(
			offset, this.littleEndian
		));
		result.push(this.view.getInt32(
			offset + 4, this.littleEndian
		));
		return result;
	}

	readUint8(): number {
		var offset = this.offset;
		this.offset += 1;
		return this.view.getUint8(offset);
	}

	readUint16(): number {
		var offset = this.offset;
		this.offset += 2;
		return this.view.getUint16(
			offset, this.littleEndian
		);
	}

	readUint32(): number {
		var offset = this.offset;
		this.offset += 4;
		return this.view.getUint32(
			offset, this.littleEndian
		);
	}

	readFloat(): number {
		var offset = this.offset;
		this.offset += 4;
		return this.view.getFloat32(
			offset, this.littleEndian
		);
	}

	readDouble(): number {
		var offset = this.offset;
		this.offset += 8;
		return this.view.getFloat64(
			offset, this.littleEndian
		);
	}

	readAsciiString(length: number): string {
		if (length <= 0) {
			return "";
		}
		var data = this.readBinary(length);
		return String.fromCharCode.apply(null, new Uint8Array(data));
	}
}
