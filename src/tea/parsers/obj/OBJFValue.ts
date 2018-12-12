export class OBJFValue {
	index: number;
	uv: number;
	normal: number;

	constructor() {
		this.index = 0;
		this.uv = 0;
		this.normal = 0;
	}
}

export class OBJFValues extends Array<OBJFValue> {
}
