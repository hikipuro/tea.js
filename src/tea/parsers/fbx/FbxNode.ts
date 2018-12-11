import * as Tea from "../../Tea";
import { FbxProperty } from "./FbxProperty";

export class FbxNode {
	endOffset: number;
	numProperties: number;
	propertyListLen: number;
	nameLen: number;
	name: string;
	properties: Array<FbxProperty>;
	children: Array<FbxNode>;

	constructor() {
		this.endOffset = 0;
		this.numProperties = 0;
		this.propertyListLen = 0;
		this.nameLen = 0;
		this.name = "";
		this.properties = [];
		this.children = [];
	}

	static parse(reader: Tea.BinaryReader): FbxNode {
		var node = new FbxNode();
		node.endOffset = reader.readUint32();
		node.numProperties = reader.readUint32();
		node.propertyListLen = reader.readUint32();
		node.nameLen = reader.readUint8();
		node.name = reader.readAsciiString(node.nameLen);
		for (var i = 0; i < node.numProperties; i++) {
			var property = FbxProperty.parse(reader);
			if (property == null) {
				continue;
			}
			node.properties.push(property);
		}
		while (node.endOffset > reader.offset) {
			var child = FbxNode.parse(reader);
			node.children.push(child);
			if (child.endOffset === 0) {
				break;
			}
		}
		return node;
	}

	toJSON(): Object {
		if (this.endOffset === 0) {
			return null;
		}
		var json = {} as any;
		var properties = [];
		var children = [];
		this.properties.forEach((property: FbxProperty) => {
			properties.push(property.toJSON());
		});
		this.children.forEach((node: FbxNode) => {
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
