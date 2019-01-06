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
				<InputNumber
					ref="x"
					class="number"
					:value="x"
					@update="onUpdateX">X</InputNumber>
				<InputNumber
					ref="y"
					class="number"
					:value="y"
					@update="onUpdateY">Y</InputNumber>
				<InputNumber
					ref="z"
					class="number"
					:value="z"
					@update="onUpdateZ">Z</InputNumber>
			</div>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "Velocity over Lifetime",
			enabled: false,
			x: 0,
			y: 0,
			z: 0,
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as VelocityOverLifetimeModule;
			self._module.enabled = value;
		}
	},
	components: {
		TitleBar: TitleBar
	}
})
export class VelocityOverLifetimeModule extends Vue {
	_module: Tea.ParticleSystem.VelocityOverLifetimeModule;
	translator: any;
	name: string;
	enabled: boolean;
	x: number;
	y: number;
	z: number;

	update(): void {
		var module = this._module;
		if (module == null) {
			return;
		}
		//console.log("update");
		this.enabled = module.enabled;
		this.x = module.x.constant;
	}

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/ParticleSystem/VelocityOverLifetimeModule";
		this.name = translator.getText("Title");
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

	protected onUpdateX(value: number): void {
		this.x = value;
		if (this._module) {
			this._module.x.constant = value;
		}
	}

	protected onUpdateY(value: number): void {
		this.y = value;
		if (this._module) {
			this._module.y.constant = value;
		}
	}

	protected onUpdateZ(value: number): void {
		this.z = value;
		if (this._module) {
			this._module.z.constant = value;
		}
	}
}
