import * as Tea from "../../Tea";
import { ScrollView } from "./ScrollView";

export class Panel extends ScrollView {
	static readonly className: string = "Panel";
	protected _graphics: Tea.Graphics2D;
	protected _isChanged: boolean;
	
	constructor(app: Tea.App) {
		super(app);
		this._width = 100;
		this._height = 100;
		this._graphics = new Tea.Graphics2D(
			this._width, this._height
		);
		this._isChanged = true;
	}

	get width(): number {
		return this._width;
	}
	set width(value: number) {
		if (value == null || value === this._width) {
			return;
		}
		this._width = value;
		this._graphics.resize(value, this._height);
		this._isSizeChanged = true;
		this._isChanged = true;
	}

	get height(): number {
		return this._height;
	}
	set height(value: number) {
		if (value == null || value === this._height) {
			return;
		}
		this._height = value;
		this._graphics.resize(this._width, value);
		this._isSizeChanged = true;
		this._isChanged = true;
	}

	static fromJSON(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, Panel.className) === false) {
			callback(null);
			return;
		}
		var panel = new Panel(app);
		panel._width = json.width;
		panel._height = json.height;
		panel._graphics.resize(json.width, json.height);
		var margin = ScrollView.ClipMargin * 2;
		panel._clippingRect[2] = json.width - margin;
		panel._clippingRect[3] = json.height - margin;
		callback(panel);
	}

	destroy(): void {
		if (this._graphics != null) {
			this._graphics.destroy();
			this._graphics = undefined;
		}
		this._isChanged = undefined;
		super.destroy();
	}

	toJSON(): Object {
		var json: any = super.toJSON();
		json[Tea.JSONUtil.TypeName] = Panel.className;
		return json;
	}

	update(): void {
		super.update();
		if (this._isChanged === false) {
			return;
		}
		this._graphics.clear();
		this.drawPanel();
		this.texture.image = this._graphics.canvas;
		this._isChanged = false;
	}

	protected drawPanel(): void {
		var g = this._graphics;
		var lineWidth = 1;
		var padding = lineWidth / 2;
		var w = this._width - lineWidth;
		var h = this._height - lineWidth;
		g.save();
		g.fillStyle = "#DDD";
		g.strokeStyle = "#888";
		g.lineWidth = lineWidth;
		g.translate(padding, padding);
		g.fillRoundRect(0, 0, w, h, 5);
		g.storokeRoundRect(0, 0, w, h, 5);
		g.restore();
	}
}
