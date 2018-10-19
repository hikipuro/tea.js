import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../../Tea";

@Component({
	template: `
		<div class="ShapeModule">
			<SelectEnum
				ref="shape"
				:value="shape"
				@update="onUpdateShape">Shape</SelectEnum>
			<InputNumber
				ref="angle"
				class="number"
				:value="angle"
				@update="onUpdateAngle">Angle</InputNumber>
			<InputNumber
				ref="radius"
				class="number"
				:value="radius"
				@update="onUpdateRadius">Radius</InputNumber>
		</div>
	`,
	data: () => {
		return {
			shape: "",
			angle: 0,
			radius: 0,
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as ShapeModule;
			self._module.enabled = value;
		}
	}
})
export class ShapeModule extends Vue {
	_module: Tea.ParticleSystem.ShapeModule;
	shape: string;
	angle: number;
	radius: number;

	update(): void {
		var module = this._module;
		if (module == null) {
			return;
		}
		var shape = this.$refs.shape as Vue;
		shape.$data.keys = Tea.ParticleSystemShapeType.getKeys();
		this.angle = module.angle;
		this.radius = module.radius;
		this.$nextTick(() => {
			this.shape = Tea.ParticleSystemShapeType[module.shapeType];
		});
	}

	protected onUpdateShape(value: string): void {
		this.shape = value;
		if (this._module) {
			this._module.shapeType = Tea.ParticleSystemShapeType[value];
		}
	}

	protected onUpdateAngle(value: number): void {
		this.angle = value;
		if (this._module) {
			this._module.angle = value;
		}
	}

	protected onUpdateRadius(value: number): void {
		this.radius = value;
		if (this._module) {
			this._module.radius = value;
		}
	}
}
