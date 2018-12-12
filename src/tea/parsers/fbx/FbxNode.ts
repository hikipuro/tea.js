import * as Tea from "../../Tea";
import { FBXProperty } from "./FBXProperty";

export class FBXNode {
	endOffset: number;
	numProperties: number;
	propertyListLen: number;
	nameLen: number;
	name: string;
	properties: Array<FBXProperty>;
	children: Array<FBXNode>;

	constructor() {
		this.endOffset = 0;
		this.numProperties = 0;
		this.propertyListLen = 0;
		this.nameLen = 0;
		this.name = "";
		this.properties = [];
		this.children = [];
	}

	static parse(reader: Tea.BinaryReader, callback: (node: FBXNode) => void, bytesPerWait: number = 0x10000): void {
		var offset = reader.offset;
		var node = new FBXNode();
		node.endOffset = reader.readUint32();
		node.numProperties = reader.readUint32();
		node.propertyListLen = reader.readUint32();
		node.nameLen = reader.readUint8();
		node.name = reader.readAsciiString(node.nameLen);
		var length = node.numProperties;
		for (var i = 0; i < length; i++) {
			var property = FBXProperty.parse(reader);
			if (property == null) {
				continue;
			}
			node.properties.push(property);
		}
		var parseChildren = (reader: Tea.BinaryReader) => {
			if (node.endOffset <= reader.offset) {
				callback(node);
				return;
			}
			FBXNode.parse(reader, (child: FBXNode) => {
				node.children.push(child);
				if (child.endOffset === 0) {
					callback(node);
					return;
				}
				if (child.endOffset - offset > bytesPerWait) {
					offset += bytesPerWait;
					setTimeout(() => {
						parseChildren(reader);
					}, 0);
					return;
				}
				parseChildren(reader);
			});
		};
		parseChildren(reader);
	}

	toJSON(): Object {
		if (this.endOffset === 0) {
			return null;
		}
		var json = {} as any;
		var properties = [];
		var children = [];
		this.properties.forEach((property: FBXProperty) => {
			properties.push(property.toJSON());
		});
		this.children.forEach((node: FBXNode) => {
			var nodeJson = node.toJSON();
			if (nodeJson == null) {
				return;
			}
			children.push(nodeJson);
			if (json[node.name] == null) {
				json[node.name] = [];
			}
			json[node.name].push(nodeJson);
		});
		var keys = Object.keys(json);
		keys.forEach((key: string) => {
			if (json[key].length === 1) {
				json[key] = json[key][0];
			}
		});
		if (children.length === 0) {
			if (properties.length === 1) {
				return properties[0];
			}
			return properties;
		}
		return json;
	}
}
