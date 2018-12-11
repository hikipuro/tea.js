import * as Tea from "../../Tea";
import { FbxArray } from "./FbxArray";

export class FbxProperty {
	typeCode: string;
	length: number;
	data: any;

	constructor() {
		this.typeCode = "";
		this.length = 0;
		this.data = null;
	}

	static parse(reader: Tea.BinaryReader): FbxProperty {
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
			default:
				console.warn("unknown type", property.typeCode);
				break;
		}
		return property;
	}

	toJSON(): Object {
		var data = this.data;
		if (data instanceof FbxArray) {
			return data.toJSON();
		}
		return this.data;
	}

	protected parseR(reader: Tea.BinaryReader): ArrayBuffer {
		this.length = reader.readUint32();
		return reader.readBuffer(this.length);
	}

	protected parseS(reader: Tea.BinaryReader): string {
		this.length = reader.readUint32();
		return reader.readAsciiString(this.length);
	}
}
