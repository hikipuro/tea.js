import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="VScrollBar">
			<Vector2
				ref="size"
				:x="size[0]"
				:y="size[1]"
				:step="1"
				@update="onUpdateSize">{{ translator.size }}</Vector2>
			<InputNumber
				ref="value"
				:value="value"
				:step="Math.min(1, max / 100)"
				:min="0.0"
				:max="max"
				@update="onUpdateValue">{{ translator.value }}</InputNumber>
			<InputNumber
				ref="max"
				:value="max"
				:step="1"
				:min="1.0"
				:max="10000.0"
				@update="onUpdateMax">{{ translator.max }}</InputNumber>
			<InputNumber
				ref="thumbRatio"
				:value="thumbRatio"
				:step="0.01"
				:min="0.0"
				:max="1.0"
				@update="onUpdateThumbRatio">{{ translator.thumbRatio }}</InputNumber>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "VScrollBar",
			enabled: false,
			size: [0, 0],
			value: 0,
			max: 0,
			thumbRatio: 0
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as UIVScrollBar;
			self._component.enabled = value;
		}
	}
})
export class UIVScrollBar extends Vue {
	_component: Tea.UI.VScrollBar;
	translator: any;
	name: string;
	enabled: boolean;
	size: Array<number>;
	value: number;
	max: number;
	thumbRatio: number;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/VScrollBar";
		this.name = translator.getText("Title");
		this.translator.size = translator.getText("Size");
		this.translator.value = translator.getText("Value");
		this.translator.max = translator.getText("Max");
		this.translator.thumbRatio = translator.getText("ThumbRatio");
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
		this.max = component.max;
		this.thumbRatio = component.thumbRatio;
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

	protected onUpdateMax(value: number): void {
		this.max = value;
		if (this.value > value) {
			this.value = value;
			if (this._component != null) {
				this._component.value = value;
			}
		}
		if (this._component != null) {
			this._component.max = value;
		}
		this.$emit("update", "max");
	}

	protected onUpdateThumbRatio(value: number): void {
		this.thumbRatio = value;
		if (this._component != null) {
			this._component.thumbRatio = value;
		}
		this.$emit("update", "thumbRatio");
	}
}

Tea.UI.VScrollBar.editorView = UIVScrollBar;
