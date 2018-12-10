import { BinaryReader } from "./BinaryReader";

export class FbxArray {
	size: number;
	typeCode: string;
	arrayLength: number;
	encoding: number;
	compressedLength: number;
	contents: ArrayBuffer;

	constructor() {
		this.size = 0;
		this.typeCode = "";
		this.arrayLength = 0;
		this.encoding = 0;
		this.compressedLength = 0;
		this.contents = null;
	}

	static parse(size: number, typeCode: string, reader: BinaryReader): FbxArray {
		var array = new FbxArray();
		array.size = size;
		array.typeCode = typeCode;
		array.arrayLength = reader.readUint32();
		array.encoding = reader.readUint32();
		array.compressedLength = reader.readUint32();
		if (array.encoding === 0) {
			array.contents = reader.readBinary(size * array.arrayLength);
		} else {
			array.contents = reader.readBinary(array.compressedLength);
		}
		return array;
	}
}

export class FbxProperty {
	typeCode: string;
	length: number;
	data: any;

	constructor() {
		this.typeCode = "";
		this.length = 0;
		this.data = null;
	}

	static parse(reader: BinaryReader): FbxProperty {
		var property = new FbxProperty();
		property.typeCode = String.fromCharCode(reader.readUint8());
		switch (property.typeCode) {
			case "C":
				property.data = reader.readUint8();
				break;
			case "Y":
				property.data = reader.readInt16();
				break;
			case "I":
				property.data = reader.readInt32();
				break;
			case "L":
				property.data = reader.readInt64();
				break;
			case "F":
				property.data = reader.readFloat();
				break;
			case "D":
				property.data = reader.readDouble();
				break;
			case "R":
				property.data = property.parseR(reader);
				break;
			case "S":
				property.data = property.parseS(reader);
				break;
			case "b":
				property.data = FbxArray.parse(1, property.typeCode, reader);
				break;
			case "i":
				property.data = FbxArray.parse(4, property.typeCode, reader);
				break;
			case "l":
				property.data = FbxArray.parse(8, property.typeCode, reader);
				break;
			case "f":
				property.data = FbxArray.parse(4, property.typeCode, reader);
				break;
			case "d":
				property.data = FbxArray.parse(8, property.typeCode, reader);
				break;
		}
		return property;
	}

	toJSON(): Object {
		return this.data;
	}

	protected parseR(reader: BinaryReader): ArrayBuffer {
		this.length = reader.readUint32();
		return reader.readBinary(this.length);
	}

	protected parseS(reader: BinaryReader): string {
		this.length = reader.readUint32();
		return reader.readAsciiString(this.length);
	}
}
