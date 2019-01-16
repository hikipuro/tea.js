import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="VLayout">
			<Padding
				ref="padding"
				:top="padding[0]"
				:right="padding[1]"
				:bottom="padding[2]"
				:left="padding[3]"
				:step="1"
				@update="onUpdatePadding">{{ translator.padding }}</Padding>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "VLayout",
			enabled: false,
			padding: [0, 0, 0, 0]
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as UIVLayout;
			self._component.enabled = value;
		}
	}
})
export class UIVLayout extends Vue {
	_component: Tea.UI.VLayout;
	translator: any;
	name: string;
	enabled: boolean;
	padding: Array<number>;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/VLayout";
		this.name = translator.getText("Title");
		this.translator.padding = translator.getText("Padding");
	}

	protected mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.enabled = component.enabled;
		this.$set(this.padding, 0, component.padding[0]);
		this.$set(this.padding, 1, component.padding[1]);
		this.$set(this.padding, 2, component.padding[2]);
		this.$set(this.padding, 3, component.padding[3]);
	}

	protected onUpdatePadding(top: number, right: number, bottom: number, left: number): void {
		this.$set(this.padding, 0, top);
		this.$set(this.padding, 1, right);
		this.$set(this.padding, 2, bottom);
		this.$set(this.padding, 3, left);
		if (this._component != null) {
			var padding = new Tea.UI.Padding();
			padding[0] = top;
			padding[1] = right;
			padding[2] = bottom;
			padding[3] = left;
			this._component.padding = padding;
		}
		this.$emit("update", "padding");
	}
}

Tea.UI.VLayout.editorView = UIVLayout;
