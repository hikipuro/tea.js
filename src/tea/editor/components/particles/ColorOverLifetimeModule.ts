import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../../Tea";
import { Translator } from "../../translate/Translator";
import { TitleBar } from "../TitleBar";
import { Gradient } from "../../basic/Gradient";

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
				<Gradient
					ref="color"
					@update="onUpdateColor">{{ translator.color }}</Gradient>
			</div>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "Color over Lifetime",
			enabled: false
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as ColorOverLifetimeModule;
			self._module.enabled = value;
		}
	},
	components: {
		TitleBar: TitleBar
	}
})
export class ColorOverLifetimeModule extends Vue {
	_module: Tea.ParticleSystem.ColorOverLifetimeModule;
	translator: any;
	name: string;
	enabled: boolean;

	update(): void {
		var module = this._module;
		if (module == null) {
			return;
		}
		this.enabled = module.enabled;
		var color = this.$refs.color as Gradient;
		color._gradient = module.color.gradient;
		color.updateImage();
	}

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/ParticleSystem/ColorOverLifetimeModule";
		this.name = translator.getText("Title");
		this.translator.color = translator.getText("Color");
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

	protected onUpdateColor(value: Tea.Gradient): void {
		this.$emit("update", "color", value);
	}
}
