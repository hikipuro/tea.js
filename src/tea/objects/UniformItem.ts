
import * as Tea from "../Tea";
import { UniformType } from "./UniformType";

export type UniformValue = (
	number |
	Tea.Vector2 |
	Tea.Vector4 |
	Tea.Matrix4x4 |
	Tea.Color |
	Array<number> |
	Array<Tea.Vector4> |
	Array<Tea.Matrix4x4> |
	Array<Tea.Color>
);

export class UniformItem {
	type: UniformType;
	value: UniformValue;

	constructor(type?: UniformType, value?: UniformValue) {
		this.type = type;
		this.value = value;
	}

	static fromJSON(json: any): UniformItem {
		if (json == null) {
			return null;
		}
		var type = UniformType[json.type as string];
		var value = null;
		switch (type) {
			case UniformType.Int:
			case UniformType.Float:
			case UniformType.FloatArray:
				value = json.value;
				break;
			case UniformType.Vector2:
				value = Tea.Vector2.fromArray(json.value);
				break;
			case UniformType.Vector4:
				value = Tea.Vector4.fromArray(json.value);
				break;
			case UniformType.Matrix:
				value = Tea.Matrix4x4.fromArray(json.value);
				break;
			case UniformType.Color:
				value = Tea.Color.fromArray(json.value);
				break;
			case UniformType.Vector4Array:
				value = [];
				for (var i = 0; i < json.value.length; i++) {
					value.push(Tea.Vector4.fromArray(json.value[i]));
				}
				break;
			case UniformType.MatrixArray:
				value = [];
				for (var i = 0; i < json.value.length; i++) {
					value.push(Tea.Matrix4x4.fromArray(json.value[i]));
				}
				break;
			case UniformType.ColorArray:
				value = [];
				for (var i = 0; i < json.value.length; i++) {
					value.push(Tea.Color.fromArray(json.value[i]));
				}
				break;
		}
		return new UniformItem(type, value);
	}

	toJSON(): Object {
		var json = {
			type: UniformType.toString(this.type),
			value: this.value
		};
		return json;
	}
}
