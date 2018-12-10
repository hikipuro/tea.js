import { BinaryReader } from "./BinaryReader";

export class FbxHeader {
	signature: string;
	reserved: number;
	version: number;

	constructor() {
		this.signature = "";
		this.reserved = 0;
		this.version = 0;
	}

	static parse(reader: BinaryReader): FbxHeader {
		var header = new FbxHeader();
		header.signature = reader.readAsciiString(21);
		header.reserved = reader.readUint16();
		header.version = reader.readUint32();
		return header;
	}
}
