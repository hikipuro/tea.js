
export class ArrayUtil {
	static unroll(array: Array<any>): Array<number> {
		if (array == null || array.length <= 0) {
			return [];
		}
		var length = array.length;
		var a = [];
		for (var i = 0; i < length; i++) {
			var item = array[i];
			a.push.apply(a, item);
		}
		return a;
	}

	static each<T>(array: ArrayLike<T>, callback: (index: number, value: T) => boolean | void): void {
		if (array == null) {
			return;
		}
		var length = array.length;
		for (var i = 0; i < length; i++) {
			var item = array[i];
			if (callback(i, item) === false) {
				break;
			}
		}
	}
}
