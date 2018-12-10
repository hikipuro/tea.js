import * as Tea from "../Tea";
import { DaeDocument } from "./dae/DaeDocument";

export class DaeReader {
	static convertToMeshes(url: string, callback: (meshes: Array<Tea.Mesh>) => void): void {
		if (callback == null) {
			return;
		}
		Tea.File.readText(url, (err: any, data: string) => {
			if (err) {
				callback(null);
				return;
			}
			DaeReader.parseDae(data, (document: DaeDocument) => {
				callback(document.toMeshes());
			});
		});
	}

	static parseDae(data: string, callback: (document: DaeDocument) => void): void {
		if (data == null || data === "") {
			return;
		}
		var parser = new DOMParser();
		var document = parser.parseFromString(data, "text/xml");

		if (document.getElementsByTagName("parsererror").length) {
			console.error("parse error");
			return null;
		}

		var daeDocument = DaeDocument.parse(document);
		callback(daeDocument);
	}
}
