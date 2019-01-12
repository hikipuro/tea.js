import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../../Tea";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div class="ScrollView">
			<Vector2
				ref="size"
				:x="size[0]"
				:y="size[1]"
				:step="1"
				@update="onUpdateSize">{{ translator.size }}</Vector2>
			<Vector2
				ref="scroll"
				:x="scroll[0]"
				:y="scroll[1]"
				:step="1"
				@update="onUpdateScroll">{{ translator.scroll }}</Vector2>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			name: "ScrollView",
			enabled: false,
			size: [0, 0],
			scroll: [0, 0]
		}
	},
	watch: {
		enabled: function (value: boolean) {
			var self = this as UIScrollView;
			self._component.enabled = value;
		}
	}
})
export class UIScrollView extends Vue {
	_component: Tea.UI.ScrollView;
	translator: any;
	name: string;
	enabled: boolean;
	size: Array<number>;
	scroll: Array<number>;

	protected created(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Components/ScrollView";
		this.name = translator.getText("Title");
		this.translator.size = translator.getText("Size");
		this.translator.scroll = translator.getText("Scroll");
	}

	protected mounted(): void {
		var component = this._component;
		if (component == null) {
			return;
		}
		this.enabled = component.enabled;
		this.$set(this.size, 0, component.width);
		this.$set(this.size, 1, component.height);
		this.$set(this.scroll, 0, component.localScroll[0]);
		this.$set(this.scroll, 1, component.localScroll[1]);
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

	protected onUpdateScroll(x: number, y: number): void {
		this.$set(this.scroll, 0, x);
		this.$set(this.scroll, 1, y);
		if (this._component != null) {
			this._component.localScroll.set(x, y);
		}
		this.$emit("update", "size");
	}
}

Tea.UI.ScrollView.editorView = UIScrollView;
