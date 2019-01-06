import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../../Tea";
import { Translator } from "../../translate/Translator";
import { TitleBar } from "../TitleBar";

@Component({
	template: `
		<div class="Module">
			<TitleBar
				:enabled="enabled"
				:enableConfig="false"
				@update="onUpdateEnabled"
				@clickTitle="onClickTitle">{{ name }}</TitleBar>
			<div
				ref="items"
				class="Items"
				:style="{
					display: 'none'
				}">
				<SelectEnum
					ref="shape"
					:keys="shapeKeys"
					:value="shape"
					@update="onUpdateShape">{{ name }}</SelectEnum>
				<InputNumber
					ref="angle"
					class="number"
					:value="angle"
					@update="onUpdateAngle">{{ translator.angle }}</InputNumber>
				<InputNumber
					ref="radius"
					class="number"
					:value="radius"
					@update="onUpdateRadius">{{ translator.radius }}</InputNumber>
			</div>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "Shape",
			enabled: false,
			shapeKeys: [],
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
	},
	components: {
		TitleBar: TitleBar
	}
})
export class ShapeModule extends Vue {
	_module: Tea.ParticleSystem.ShapeModule;
	translator: any;
	name: string;
	enabled: boolean;
	shapeKeys: Array<string>;
	shape: string;
	angle: number;
	radius: number;

	update(): void {
		var module = this._module;
		if (module == null) {
			return;
		}
		this.enabled = module.enabled;
		this.shapeKeys = Tea.ParticleSystemShapeType.getKeys();
		this.shape = Tea.ParticleSystemShapeType[module.shapeType];
		this.angle = module.angle;
		this.radius = module.radius;
	}

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/ParticleSystem/ShapeModule";
		this.name = translator.getText("Title");
		this.translator.angle = translator.getText("Angle");
		this.translator.radius = translator.getText("Radius");
	}

	protected onUpdateEnabled(value: boolean): void {
		this.enabled = value;
		this._module.enabled = value;
		this.$emit("update", "enabled", value);
	}

	protected onClickTitle(): void {
		var items = this.$refs.items as HTMLElement;
		var style = items.style;
		if (style.display == "none") {
			style.display = "block";
		} else {
			style.display = "none";
		}
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
