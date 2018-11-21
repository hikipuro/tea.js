import * as Tea from "../Tea";
import { EventDispatcher } from "../utils/EventDispatcher";

export class EditorStatus extends EventDispatcher {
	app: Tea.App;
	scene: Tea.Scene;
	scenePath: string;
	protected _isChanged: boolean;

	constructor() {
		super();
		this.scenePath = null;
		this._isChanged = false;
	}

	get isChanged(): boolean {
		return this._isChanged;
	}
	set isChanged(value: boolean) {
		if (this.app.isEditing === false) {
			return;
		}
		if (this._isChanged === value) {
			return;
		}
		this._isChanged = value;
		this.emit("isChanged", value);
	}
}
