import { Mesh } from "./object/Mesh";

interface ForEachLineCallback {
	(text: string, index: number): void
}

export class ObjReader {
	static read(data: string): Mesh {
		const vertices = [];
		const triangles = [];

		this.forEachLine(data, (text: string, index: number) => {
			const params = text.split(/\s+/);
			switch (params[0]) {
				case "v":
					this.pushArray(vertices, this.parseVertex(params));
					break;
				case "f":
					this.pushArray(triangles, this.parseIndex(params));
					break;
			}
		});
		//console.log("vertices", vertices.length / 3);
		//console.log("indices", indices.length / 3);
		const mesh = new Mesh();
		mesh.vertices = new Float32Array(vertices);
		mesh.triangles = new Uint16Array(triangles);
		return mesh;
	}

	protected static forEachLine(data: string, callback: ForEachLineCallback): void {
		const lines = data.split(/\r?\n/);
		const length = lines.length;
		for (let i = 0; i < length; i++) {
			callback(lines[i], i);
		}
	}

	protected static pushArray(target: Array<any>, array: Array<any>): void {
		target.push.apply(target, array);
	}

	protected static parseVertex(params: Array<string>): Array<number> {
		const vertices = [];
		const x = parseFloat(params[1]);
		const y = parseFloat(params[2]);
		const z = parseFloat(params[3]);
		vertices.push(x);
		vertices.push(y);
		vertices.push(z);
		return vertices;
	}

	protected static parseIndex(params: Array<string>): Array<number> {
		const list = [];
		for (let i = 1; i < params.length; i++) {
			if (params[i] == "") {
				continue;
			}
			const param = params[i].split("/");
			const index = parseInt(param[0]);
			//if (index == null || isNaN(index)) {
			//	console.log("nan", i);
			//	continue;
			//}
			//console.log(item);
			list.push(index - 1);
		}

		const indices = [];
		switch (list.length) {
			case 3:
				indices.push(list[0]);
				indices.push(list[1]);
				indices.push(list[2]);
				break;
			case 4:
				indices.push(list[0]);
				indices.push(list[1]);
				indices.push(list[2]);
				indices.push(list[0]);
				indices.push(list[2]);
				indices.push(list[3]);
				break;
			default:
				//console.log("5");
				break;
		}
		return indices;
	}
}
