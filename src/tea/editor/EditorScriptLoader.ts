import * as Tea from "../Tea";
import { LocalFile } from "./LocalFile";
import { ScriptLoader } from "../utils/ScriptLoader";

export class EditorScriptLoader extends ScriptLoader {
	static load(app: Tea.App, path: string, callback: (script: Tea.Script) => void): void {
		var data = LocalFile.readText(path);
		if (data == null) {
			console.error("error");
			callback(null);
			return;
		}
		this.loadScriptFile(app, path, data, callback);
	}
}
