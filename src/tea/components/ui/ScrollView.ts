import * as Tea from "../../Tea";
import { UIComponent } from "./UIComponent";

export class ScrollView extends UIComponent {
	static readonly className: string = "ScrollView";
	static readonly ClipMargin: number = 0;
	localScroll: Tea.Vector2;
	protected _clippingRect: Tea.Rect;
	
	constructor(app: Tea.App) {
		super(app);
		this._width = 100;
		this._height = 100;
		this._clippingRect = new Tea.Rect(
			0, 0, this._width, this._height
		);
		this.localScroll = new Tea.Vector2();
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
		this._isSizeChanged = true;
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
		this._isSizeChanged = true;
	}

	get clippingRect(): Tea.Rect {
		var object3d = this.object3d;
		if (object3d == null) {
			return this._clippingRect;
		}
		var rect = this._clippingRect.clone();
		//var scroll = this._scroll;
		//rect[0] -= scroll[0];
		//rect[1] -= scroll[1];
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
			var scroll = view.localScroll;
			rect[0] -= scroll[0];
			rect[1] -= scroll[1];
			parentRect.copy(view._clippingRect);
			var s = parent.scale;
			parentRect[2] *= s[0];
			parentRect[3] *= s[1];
			rect.intersectSelf(parentRect);
			parent = parent.parent;
		}
		return rect;
	}

	get scroll(): Tea.Vector2 {
		var object3d = this.object3d;
		if (object3d == null) {
			return this.localScroll;
		}
		var scroll = this.localScroll.clone();
		var s = object3d.scale;
		scroll[0] *= s[0];
		scroll[1] *= s[1];
		var parentScroll = new Tea.Vector2();
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
			parentScroll.copy(view.localScroll);
			var s = parent.scale;
			parentScroll[0] *= s[0];
			parentScroll[1] *= s[1];
			scroll[0] += parentScroll[0];
			scroll[1] += parentScroll[1];
			parent = parent.parent;
		}
		return scroll;
	}

	static fromJSON(app: Tea.App, json: any, callback: (component: Tea.Component) => void): void {
		if (Tea.JSONUtil.isValidSceneJSON(json, ScrollView.className) === false) {
			callback(null);
			return;
		}
		var view = new ScrollView(app);
		view._width = json.width;
		view._height = json.height;
		var margin = ScrollView.ClipMargin * 2;
		view._clippingRect[2] = json.width - margin;
		view._clippingRect[3] = json.height - margin;
		if (json.scroll) {
			view.localScroll = Tea.Vector2.fromArray(json.scroll);
		}
		callback(view);
	}

	destroy(): void {
		this._clippingRect = undefined;
		this.localScroll = undefined;
		super.destroy();
	}

	toJSON(): Object {
		var json: any = super.toJSON();
		json[Tea.JSONUtil.TypeName] = ScrollView.className;
		json.localScroll = this.localScroll;
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
	}
}
