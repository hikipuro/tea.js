import Vue, { VueConstructor } from "vue";
import Component from "vue-class-component";
import { UICommands } from "./commands/UICommands";

@Component({
	template: `
		<div class="InspectorView">
			<component
				ref="component"
				v-if="isVisible"
				:is="component"
				@update="onUpdate"
				@change="onChange"
				@menu="onMenu"></component>
		</div>
	`,
	data: () => {
		return {
			isVisible: false,
		}
	}
})
export class InspectorView extends Vue {
	_commands: UICommands;
	isVisible: boolean;
	component: VueConstructor<Record<never, any> & Vue>;

	show(): void {
		this.isVisible = true;
	}

	hide(): void {
		this.isVisible = false;
		this.clear();
	}

	getComponent(): Vue {
		return this.$refs.component as Vue;
	}

	hasFocus(): boolean {
		return this.$el.querySelector(":focus") != null;
	}

	clear(): void {
		this.component = null;
	}

	protected onUpdate(...args: Array<any>): void {
		this.$emit.apply(this, ["update"].concat(args));
	}

	protected onChange(...args: Array<any>): void {
		this.$emit.apply(this, ["change"].concat(args));
	}

	protected onMenu(...args: Array<any>): void {
		this.$emit.apply(this, ["menu"].concat(args));
	}
}
