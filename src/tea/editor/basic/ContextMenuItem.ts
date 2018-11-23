import Vue from "vue";
import Component from "vue-class-component";
import { ContextMenu } from "./ContextMenu";

@Component({
	template: `
		<div
			class="item"
			ref="item"
			:class="{
				separator: isSeparator,
				selected: isSelected,
				'selected-after': isSelectedAfter,
				unselected: isUnselected
			}"
			@click.stop="onClick">
			{{ isSeparator ? "" : model.text }}
		</div>
	`,
	props: {
		model: {
			type: Object,
			default: null
		},
		depth: {
			type: Number,
			default: 0
		}
	},
	data: () => {
		return {
			isSelected: false,
			isSelectedAfter: false,
			isUnselected: false
		}
	}
})
export class ContextMenuItem extends Vue {
	model: ContextMenu.Model;
	tag: any;
	protected isSelected: boolean;
	protected isSelectedAfter: boolean;
	isUnselected: boolean;

	get text(): string {
		return this.model.text;
	}

	get isSeparator(): boolean {
		return this.model.text === "-";
	}

	protected onClick(): void {
		if (this.isSeparator) {
			return;
		}
		this.$emit("beforeSelect", this);
		this.isSelected = true;
		setTimeout(() => {
			this.isSelected = false;
			this.isSelectedAfter = true;
		}, 50);
		setTimeout(() => {
			this.isSelectedAfter = false;
			this.$emit("select", this);
		}, 100);
	}
}
