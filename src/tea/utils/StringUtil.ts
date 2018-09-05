export class StringUtil {
	static format(format: string, ...args: any[]): string {
		if (args == null) {
			return format;
		}
		return format.replace(/\{(\d+)\}/g, (substring: string, m0: any) => {
			return args[m0];
		});
	}
}
