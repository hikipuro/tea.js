import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="BoxCollider">
			<Vector3
				ref="center"
				:x="center[0]"
				:y="center[1]"
				:z="center[2]"
				@update="onUpdateCenter">
				{{ translator.center }}
			</Vector3>
			<Vector3
				ref="size"
				:x="size[0]"
				:y="size[1]"
				:z="size[2]"
				@update="onUpdateSize">
				{{ translator.size }}
			</Vector3>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "BoxCollider",
			enabled: false,
			center: [0, 0, 0],
			size: [0, 0, 0]
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as BoxCollider;
			self._component.enabled = value;
		}
	}
})
export class BoxCollider extends Vue {
	_component: Tea.BoxCollider;
	translator: any;
	name: string;
	enabled: boolean;
	center: Array<number>;
	size: Array<number>;

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

	setSize(value: Tea.Vector3): void {
		var x = value[0], y = value[1], z = value[2];
		x = Math.abs(x) < Tea.Mathf.Epsilon ? 0 : x;
		y = Math.abs(y) < Tea.Mathf.Epsilon ? 0 : y;
		z = Math.abs(z) < Tea.Mathf.Epsilon ? 0 : z;
		var size = this.size;
		this.$set(size, 0, x);
		this.$set(size, 1, y);
		this.$set(size, 2, z);
	}

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/BoxCollider";
		this.name = translator.getText("Title");
		this.translator.center = translator.getText("Center");
		this.translator.size = translator.getText("Size");
	}

	protected mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.enabled = component.enabled;
		this.setCenter(component.center);
		this.setSize(component.size);
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

	protected onUpdateSize(x: number, y: number, z: number): void {
		var size = this.size;
		this.$set(size, 0, x);
		this.$set(size, 1, y);
		this.$set(size, 2, z);
		if (this._component != null) {
			this._component.size.set(x, y, z);
		}
		this.$emit("update", "size");
	}
}
