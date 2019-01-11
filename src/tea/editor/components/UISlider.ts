import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="Slider">
			<Vector2
				ref="size"
				:x="size[0]"
				:y="size[1]"
				:step="1"
				@update="onUpdateSize">{{ translator.size }}</Vector2>
			<InputNumber
				ref="value"
				:value="value"
				:step="0.01"
				:min="0.0"
				:max="1.0"
				@update="onUpdateValue">{{ translator.value }}</InputNumber>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "Slider",
			enabled: false,
			size: [0, 0],
			value: 0
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as UISlider;
			self._component.enabled = value;
		}
	}
})
export class UISlider extends Vue {
	_component: Tea.UI.Slider;
	translator: any;
	name: string;
	enabled: boolean;
	size: Array<number>;
	value: number;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/Slider";
		this.name = translator.getText("Title");
		this.translator.size = translator.getText("Size");
		this.translator.value = translator.getText("Value");
	}

	protected mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.enabled = component.enabled;
		this.$set(this.size, 0, component.width);
		this.$set(this.size, 1, component.height);
		this.value = component.value;
	}

	protected onUpdateSize(x: number, y: number): void {
		this.$set(this.size, 0, x);
		this.$set(this.size, 1, y);
		if (this._component != null) {
			this._component.width = x;
			this._component.height = y;
		}
		this.$emit("update", "size");
	}

	protected onUpdateValue(value: number): void {
		this.value = value;
		if (this._component != null) {
			this._component.value = value;
		}
		this.$emit("update", "value");
	}
}

Tea.UI.Slider.editorView = UISlider;
