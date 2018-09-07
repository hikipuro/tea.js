import * as Tea from "../Tea";

export class DaeReader {
	static mimeType = "text/xml";

	static read(data: string): Tea.Mesh {
		var vertices = [];
		var indices = [];

		var parser = new DOMParser();
		var document = parser.parseFromString(data, DaeReader.mimeType);
		//console.log(document);

		if (document.getElementsByTagName("parsererror").length) {
			console.error("parse error");
			return null;
		}

		//var asset = document.querySelector("asset");
		//console.log(asset.querySelector("author").textContent);

		var geometries = document.querySelector("library_geometries");
		console.log(geometries.querySelector("geometry mesh float_array"));

		/*
		this.forEachLine(data, (text: string, index: number) => {
			var params = text.split(/\s+/);
			switch (params[0]) {
				case "v":
					this.pushArray(vertices, this.parseVertex(params));
					break;
				case "f":
					this.pushArray(indices, this.parseIndex(params));
					break;
			}
		});
		*/
		//console.log("vertices", vertices.length / 3);
		//console.log("indices", indices.length / 3);
		return new Tea.Mesh();
	}
}
