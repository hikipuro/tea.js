import * as Tea from "../../Tea";

export class UICollider {
	static readonly className: string = "UICollider";
	uiComponent: Tea.UI.UIComponent;
	center: Tea.Vector2;
	size: Tea.Vector2;

	constructor(app: Tea.App, uiComponent: Tea.UI.UIComponent) {
		this.uiComponent = uiComponent;
		this.center = new Tea.Vector2();
		this.size = Tea.Vector2.one.clone();
	}

	get object3d(): Tea.Object3D {
		return this.uiComponent.object3d;
	}

	get worldCenter(): Tea.Vector2 {
		var object3d = this.object3d;
		var center = this.center.clone();
		if (object3d == null) {
			return center;
		}
		var p = object3d.position;
		var s = object3d.scale;
		center[0] *= s[0];
		center[1] *= s[1];
		center.applyQuaternion(object3d.rotation);
		center[0] += p[0];
		center[1] += p[1];
		return center;
	}

	get extents(): Tea.Vector2 {
		var object3d = this.object3d;
		var extents = this.size.clone();
		extents[0] *= 0.5;
		extents[1] *= 0.5;
		if (object3d == null) {
			return extents;
		}
		var s = object3d.scale;
		extents[0] *= s[0];
		extents[1] *= s[1];
		return extents;
	}

	containsPoint(point: Tea.Vector2): boolean {
		if (point == null) {
			return false;
		}
		var center = this.worldCenter;
		var extents = this.extents;

		var x = point[0], y = point[1];
		var minX = center[0] - extents[0];
		var maxX = center[0] + extents[0];
		var minY = center[1] - extents[1];
		var maxY = center[1] + extents[1];

		return (
			minX <= x
		&&  x <= maxX
		&&  minY <= y
		&&  y <= maxY
		);
	}

	toString(): string {
		return Tea.StringUtil.format(
			"{ center: {0}, size: {1} }",
			this.center.toString(),
			this.size.toString()
		);
	}
}
