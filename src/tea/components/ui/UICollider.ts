import * as Tea from "../../Tea";

export class UICollider {
	static readonly className: string = "UICollider";
	uiComponent: Tea.UI.UIComponent;
	center: Tea.Vector2;
	size: Tea.Vector2;

	constructor(uiComponent: Tea.UI.UIComponent) {
		this.uiComponent = uiComponent;
		this.center = new Tea.Vector2();
		this.size = new Tea.Vector2(1.0, 1.0);
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

	clone(): UICollider {
		var collider = new UICollider(this.uiComponent);
		collider.center.copy(this.center);
		collider.size.copy(this.size);
		return collider;
	}

	containsPoint(point: Tea.Vector2): boolean {
		if (point == null) {
			return false;
		}
		//var center = this.worldCenter;
		//var extents = this.extents;
		var object3d = this.object3d;
		var centerX = this.center[0];
		var centerY = this.center[1];
		var extentsX = this.size[0] * 0.5;
		var extentsY = this.size[1] * 0.5;
		if (object3d != null) {
			var p = object3d.position;
			var s = object3d.scale;
			centerX *= s[0];
			centerY *= s[1];
			//center.applyQuaternion(object3d.rotation);
			centerX += p[0];
			centerY += p[1];
			extentsX *= s[0];
			extentsY *= s[1];
		}

		var x = point[0], y = point[1];
		var minX = centerX - extentsX;
		var maxX = centerX + extentsX;
		var minY = centerY - extentsY;
		var maxY = centerY + extentsY;

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
