import { ObjFValues } from "./ObjFValue";

export class ObjIndices {
	group: string;
	material: string;
	fValues: Array<ObjFValues>;

	constructor() {
		this.group = "";
		this.material = "";
		this.fValues = [];
	}

	get length(): number {
		return this.fValues.length;
	}

	push(item: ObjFValues): number {
		return this.fValues.push(item);
	}
}
