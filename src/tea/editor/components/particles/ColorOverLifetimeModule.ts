import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../../Tea";
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
				<Gradient
					ref="color"
					:value="color"
					@update="onUpdateColor">Color</Gradient>
			</div>
		</div>
	`,
	data: () => {
		return {
			name: "Color over Lifetime",
			enabled: false,
			color: ""
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
	name: string;
	enabled: boolean;
	color: string;

	update(): void {
		var module = this._module;
		if (module == null) {
			return;
		}
		this.enabled = module.enabled;
		//this.color = module.color.color.toCssColor();
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

	protected onUpdateColor(value: Tea.Color): void {
		this.color = value.toCssColor();
		if (this._module) {
			this._module.color.color.copy(value);
		}
		this.$emit("update", "color", value);
	}
}
