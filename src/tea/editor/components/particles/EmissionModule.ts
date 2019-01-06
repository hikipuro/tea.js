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
					ref="rateOverTime"
					class="number"
					:value="rateOverTime"
					@update="onUpdateRateOverTime">{{ translator.rateOverTime }}</InputNumber>
			</div>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "Emission",
			enabled: false,
			rateOverTime: 0,
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as EmissionModule;
			self._module.enabled = value;
		}
	},
	components: {
		TitleBar: TitleBar
	}
})
export class EmissionModule extends Vue {
	_module: Tea.ParticleSystem.EmissionModule;
	translator: any;
	name: string;
	enabled: boolean;
	rateOverTime: number;

	update(): void {
		var module = this._module;
		if (module == null) {
			return;
		}
		this.enabled = module.enabled;
		this.rateOverTime = module.rateOverTime.constant;
	}

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/ParticleSystem/EmissionModule";
		this.name = translator.getText("Title");
		this.translator.rateOverTime = translator.getText("RateOverTime");
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

	protected onUpdateRateOverTime(value: number): void {
		this.rateOverTime = value;
		if (this._module) {
			this._module.rateOverTime.constant = value;
		}
	}
}
