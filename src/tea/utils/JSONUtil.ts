export class JSONUtil {
	static readonly TypeName: string = "_type";

	static isValidSceneJSON(json: any, className: string): boolean {
		if (json == null) {
			return false;
		}
		if (json[JSONUtil.TypeName] !== className) {
			return false;
		}
		return true;
	}

	static createSceneJSON(className: string): any {
		var json: any = {};
		json[JSONUtil.TypeName] = className;
		return json;
	}

	static toJSON(value: any): Object {
		if (value == null || value.toJSON == null) {
			return null;
		}
		return value.toJSON();
	}

	static arrayToJSON(array: Array<any>): Array<Object> {
		if (array == null) {
			return null;
		}
		var result = [];
		var length = array.length;
		for (var i = 0; i < length; i++) {
			var item = array[i];
			if (item == null || item.toJSON == null) {
				continue;
			}
			result.push(item.toJSON());
		}
		return result;
	}
}
