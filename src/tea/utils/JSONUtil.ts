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
}
