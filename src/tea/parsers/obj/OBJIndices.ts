import { OBJFValues } from "./OBJFValue";

export class OBJIndices {
	group: string;
	material: string;
	fValues: Array<OBJFValues>;

	constructor() {
		this.group = "";
		this.material = "";
		this.fValues = [];
	}

	get length(): number {
		return this.fValues.length;
	}

	push(item: OBJFValues): number {
		return this.fValues.push(item);
	}
}
