import * as Tea from "../Tea";
import { SceneLoader } from "../objects/SceneLoader";
import { EditorScriptLoader } from "./EditorScriptLoader";

export class EditorSceneLoader extends SceneLoader {
	protected static loadScript(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (json == null || json._type !== "Script") {
			callback(null);
			return;
		}
		if (json.path == null || json.path === "") {
			callback(null);
			return;
		}
		EditorScriptLoader.load(
			app, json.path,
			(script: Tea.Script) => {
				if (script == null) {
					callback(script);
					return;
				}
				script.enabled = json.enabled;
				var members = json.members as Array<any>;
				if (members && members.length != null) {
					members.forEach((member: any) => {
						var key = member.key;
						var value = member.value;
						if (typeof value === "object") {
							// TODO: read object
							script[key] = member.value;
							return;
						}
						script[key] = member.value;
					});
				}
				callback(script);
			}
		);
	}
}