import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="SphereCollider">
			<Vector3
				ref="center"
				:x="center[0]"
				:y="center[1]"
				:z="center[2]"
				@update="onUpdateCenter">
				{{ translator.center }}
			</Vector3>
			<InputNumber
				ref="radius"
				:value="radius"
				:min="0.001"
				@update="onUpdateRadius">
				{{ translator.radius }}
			</InputNumber>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "SphereCollider",
			enabled: false,
			center: [0, 0, 0],
			radius: 0
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as SphereCollider;
			self._component.enabled = value;
		}
	}
})
export class SphereCollider extends Vue {
	_component: Tea.SphereCollider;
	translator: any;
	name: string;
	enabled: boolean;
	center: Array<number>;
	radius: number;

	setCenter(value: Tea.Vector3): void {
		var x = value[0], y = value[1], z = value[2];
		x = Math.abs(x) < Tea.Mathf.Epsilon ? 0 : x;
		y = Math.abs(y) < Tea.Mathf.Epsilon ? 0 : y;
		z = Math.abs(z) < Tea.Mathf.Epsilon ? 0 : z;
		var center = this.center;
		this.$set(center, 0, x);
		this.$set(center, 1, y);
		this.$set(center, 2, z);
	}

	setRadius(radius: number): void {
		this.radius = radius;
	}

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/SphereCollider";
		this.name = translator.getText("Title");
		this.translator.center = translator.getText("Center");
		this.translator.radius = translator.getText("Radius");
	}

	protected mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.enabled = component.enabled;
		this.setCenter(component.center);
		this.setRadius(component.radius);
	}

	protected onUpdateCenter(x: number, y: number, z: number): void {
		var center = this.center;
		this.$set(center, 0, x);
		this.$set(center, 1, y);
		this.$set(center, 2, z);
		if (this._component != null) {
			this._component.center.set(x, y, z);
		}
		this.$emit("update", "center");
	}

	protected onUpdateRadius(value: number): void {
		this.radius = value;
		if (this._component != null) {
			this._component.radius = value;
		}
		this.$emit("update", "radius");
	}
}

Tea.SphereCollider.editorView = SphereCollider;
