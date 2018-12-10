import { BinaryReader } from "./BinaryReader";
import { FbxHeader } from "./FbxHeader";
import { FbxNode } from "./FbxNode";

export class FbxDocument {
	header: FbxHeader;
	nodes: Array<FbxNode>;

	constructor() {
		this.header = null;
		this.nodes = [];
	}

	static parse(reader: BinaryReader): FbxDocument {
		var document = new FbxDocument();
		document.header = FbxHeader.parse(reader);
		while (reader.isCompleted === false) {
			var node = FbxNode.parse(reader);
			document.nodes.push(node);
			if (node.endOffset === 0) {
				break;
			}
			reader.offset = node.endOffset;
		}
		return document;
	}

	toJSON(): Object {
		if (this.nodes == null) {
			return null;
		}
		var json = {} as any;
		this.nodes.forEach((node: FbxNode) => {
			json[node.name] = node.toJSON();
		});
		return json;
	}
}
