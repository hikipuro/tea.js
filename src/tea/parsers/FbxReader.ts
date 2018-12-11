import * as Tea from "../Tea";
import { BinaryReader } from "../utils/BinaryReader";
import { FbxDocument } from "./fbx/FbxDocument";

export class FbxReader {
	static convertToMeshes(url: string, callback: (meshes: Array<Tea.Mesh>) => void): void {
		if (callback == null) {
			return;
		}
		Tea.File.readArrayBuffer(url, (err: any, data: ArrayBuffer) => {
			if (err) {
				callback(null);
				return;
			}
			FbxReader.parseFbx(data, (document: FbxDocument) => {
				callback(document.toMeshes());
			});
		});
	}

	static parseFbx(data: ArrayBuffer, callback: (document: FbxDocument) => void): void {
		if (data == null || data.byteLength <= 0) {
			return;
		}
		var reader = new BinaryReader(data, true);
		var document = FbxDocument.parse(reader);
		console.log(document.toJSON());
		//console.log(document);
		callback(document);
	}
}
