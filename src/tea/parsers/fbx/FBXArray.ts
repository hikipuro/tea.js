import * as zlib from "zlib";
import * as Tea from "../../Tea";

export class FBXArray {
	typeCode: string;
	arrayLength: number;
	encoding: number;
	compressedLength: number;
	contents: ArrayBuffer;
	data: any;

	constructor() {
		this.typeCode = "";
		this.arrayLength = 0;
		this.encoding = 0;
		this.compressedLength = 0;
		this.contents = null;
		this.data = null;
	}

	static parse(size: number, typeCode: string, reader: Tea.BinaryReader): FBXArray {
		var array = new FBXArray();
		array.typeCode = typeCode;
		array.arrayLength = reader.readUint32();
		array.encoding = reader.readUint32();
		array.compressedLength = reader.readUint32();
		if (array.encoding === 0) {
			array.contents = reader.readBuffer(size * array.arrayLength);
		} else {
			var buffer = reader.readBuffer(array.compressedLength);
			array.contents = this.inflate(buffer);
		}
		array.data = array.extract();
		return array;
	}

	protected static inflate(buffer: ArrayBuffer): ArrayBuffer {
		if (buffer == null) {
			return null;
		}
		var view = new DataView(buffer);
		var data = zlib.inflateSync(view);
		return this.fromBuffer(data);
	}

	protected static toBuffer(buffer: ArrayBuffer): Buffer {
		if (buffer == null) {
			return null;
		}
		var length = buffer.byteLength;
		var buf = new Buffer(length);
		var view = new Uint8Array(buffer);
		for (var i = 0; i < length; i++) {
			buf[i] = view[i];
		}
		return buf;
	}

	protected static fromBuffer(buffer: Buffer): ArrayBuffer {
		var length = buffer.length;
		var buf = new ArrayBuffer(length);
		var view = new Uint8Array(buf);
		for (var i = 0; i < length; i++) {
			view[i] = buffer[i];
		}
		return buf;
	}

	toJSON(): Object {
		return this.data;
	}

	protected extract(): Array<any> {
		switch (this.typeCode) {
			case "b":
				return this.extractBoolArray();
			case "i":
				return this.extractInt32Array();
			case "l":
				return this.extractInt64Array();
			case "f":
				return this.extractFloatArray();
			case "d":
				return this.extractDoubleArray();
		}
		return null;
	}

	protected isValidContents(): boolean {
		var contents = this.contents;
		if (contents == null || contents.byteLength <= 0) {
			return false;
		}
		return true;
	}

	protected extractBoolArray(): Array<boolean> {
		if (this.isValidContents() === false) {
			return null;
		}
		var data = [];
		var reader = new Tea.BinaryReader(this.contents, true);
		while (reader.isCompleted === false) {
			var value = reader.readUint8();
			data.push(value !== 0);
		}
		return data;
	}

	protected extractInt32Array(): Array<number> {
		if (this.isValidContents() === false) {
			return null;
		}
		var data = [];
		var reader = new Tea.BinaryReader(this.contents, true);
		while (reader.isCompleted === false) {
			var value = reader.readInt32();
			data.push(value);
		}
		return data;
	}

	protected extractInt64Array(): Array<any> {
		if (this.isValidContents() === false) {
			return null;
		}
		var data = [];
		var reader = new Tea.BinaryReader(this.contents, true);
		while (reader.isCompleted === false) {
			var value = reader.readInt64();
			data.push(value);
		}
		return data;
	}

	protected extractFloatArray(): Array<number> {
		if (this.isValidContents() === false) {
			return null;
		}
		var data = [];
		var reader = new Tea.BinaryReader(this.contents, true);
		while (reader.isCompleted === false) {
			var value = reader.readFloat();
			data.push(value);
		}
		return data;
	}

	protected extractDoubleArray(): Array<number> {
		if (this.isValidContents() === false) {
			return null;
		}
		var data = [];
		var reader = new Tea.BinaryReader(this.contents, true);
		while (reader.isCompleted === false) {
			var value = reader.readDouble();
			data.push(value);
		}
		return data;
	}
}
