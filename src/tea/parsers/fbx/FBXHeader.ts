import * as Tea from "../../Tea";

export class FBXHeader {
	signature: string;
	reserved: number;
	version: number;

	constructor() {
		this.signature = "";
		this.reserved = 0;
		this.version = 0;
	}

	static parse(reader: Tea.BinaryReader): FBXHeader {
		var header = new FBXHeader();
		header.signature = reader.readAsciiString(21);
		header.reserved = reader.readUint16();
		header.version = reader.readUint32();
		return header;
	}
}
