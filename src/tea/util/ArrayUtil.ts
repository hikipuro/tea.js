
export class ArrayUtil {
	static unroll(array: Array<any>): Array<number> {
		if (array == null || array.length <= 0) {
			return [];
		}
		const length = array.length;
		const a = [];
		for (let i = 0; i < length; i++) {
			const item = array[i];
			a.push.apply(a, item);
		}
		return a;
	}
}
