import * as Tea from "../../Tea";
import { UIComponent } from "./UIComponent";

export class ScrollView extends UIComponent {
	static readonly className: string = "ScrollView";
	static readonly ClipMargin: number = 1;
	protected _graphics: Tea.Graphics2D;
	protected _isChanged: boolean;
	protected _clippingRect: Tea.Rect;
	protected _scroll: Tea.Vector2;
	
	constructor(app: Tea.App) {
		super(app);
		this._width = 100;
		this._height = 100;
		this._clippingRect = new Tea.Rect(
			0, 0, this._width, this._height
		);
		this._graphics = new Tea.Graphics2D(
			this._width, this._height
		);
		this._isChanged = true;
		this._scroll = new Tea.Vector2();
	}

	get width(): number {
		return this._width;
	}
	set width(value: number) {
		if (value == null || value === this._width) {
			return;
		}
		this._width = value;
		this._clippingRect[2] = value - ScrollView.ClipMargin * 2;
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
		this._clippingRect[3] = value - ScrollView.ClipMargin * 2;
		this._graphics.resize(this._width, value);
		this._isSizeChanged = true;
		this._isChanged = true;
	}

	get clippingRect(): Tea.Rect {
		var object3d = this.object3d;
		if (object3d == null) {
			return this._clippingRect;
		}
		var rect = this._clippingRect.clone();
		var s = object3d.scale;
		rect[2] *= s[0];
		rect[3] *= s[1];
		var parentRect = new Tea.Rect();
		var parent = object3d.parent;
		var length = Tea.Object3D.MaxDepth;
		for (var i = 0; i < length; i++) {
			if (parent == null) {
				break;
			}
			var view = parent.getComponent(Tea.UI.ScrollView);
			if (view == null) {
				break;
			}
			parentRect.copy(view._clippingRect);
			var s = parent.scale;
			parentRect[2] *= s[0];
			parentRect[3] *= s[1];
			rect.intersectSelf(parentRect);
			parent = parent.parent;
		}
		return rect;
	}

	static fromJSON(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, ScrollView.className) === false) {
			callback(null);
			return;
		}
		var view = new ScrollView(app);
		view._width = json.width;
		view._height = json.height;
		view._graphics.resize(json.width, json.height);
		var margin = ScrollView.ClipMargin * 2;
		view._clippingRect[2] = json.width - margin;
		view._clippingRect[3] = json.height - margin;
		callback(view);
	}

	destroy(): void {
		if (this._graphics != null) {
			this._graphics.destroy();
			this._graphics = undefined;
		}
		this._isChanged = undefined;
		this._clippingRect = undefined;
		this._scroll = undefined;
		super.destroy();
	}

	toJSON(): Object {
		var json: any = super.toJSON();
		json[Tea.JSONUtil.TypeName] = ScrollView.className;
		return json;
	}

	update(): void {
		var object3d = this.object3d;
		if (object3d != null && object3d.isMoved) {
			var p = object3d.position;
			var margin = ScrollView.ClipMargin;
			this._clippingRect[0] = p[0] + margin;
			this._clippingRect[1] = p[1] + margin;
		}
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
