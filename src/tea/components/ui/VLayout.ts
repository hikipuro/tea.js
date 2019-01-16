import * as Tea from "../../Tea";
import { Layout } from "./Layout";

export class VLayout extends Layout {
	static readonly className: string = "VLayout";
	protected _padding: Tea.UI.Padding;

	constructor(app: Tea.App) {
		super(app);
		this._padding = new Tea.UI.Padding;
	}

	get padding(): Tea.UI.Padding {
		return this._padding;
	}
	set padding(value: Tea.UI.Padding)  {
		if (value == null || value.equals(this._padding)) {
			return;
		}
		this._padding = value;
	}

	static fromJSON(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, VLayout.className) === false) {
			callback(null);
			return;
		}
		var layout = new VLayout(app);
		layout.padding = Tea.UI.Padding.fromArray(json.padding);
		callback(layout);
	}

	destroy(): void {
		this._padding = undefined;
		super.destroy();
	}

	toJSON(): Object {
		var json: any = super.toJSON();
		json[Tea.JSONUtil.TypeName] = VLayout.className;
		json.padding = this._padding;
		return json;
	}

	update(): void {
		var object3d = this.object3d;
		if (object3d == null || object3d.childCount <= 0) {
			return;
		}
		var y = 0;
		var padding = this._padding;
		var children = object3d.children;
		var length = children.length;
		for (var i = 0; i < length; i++) {
			var child = children[i];
			var component = child.getComponent(Tea.UI.UIComponent);
			if (component == null) {
				continue;
			}
			var position = child.localPosition;
			var scale = child.localScale;
			position[0] = padding[3];
			position[1] = y + padding[0];
			y += component.height * scale[1] + padding[0] + padding[2];
		}
	}
}
