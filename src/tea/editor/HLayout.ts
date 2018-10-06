import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../Tea";

type Panel = Tea.Editor.Panel;

@Component({
	template: `
		<div
			class="HLayout">
			<Panel
				v-for="(child, index) in children"
				:key="index">
				<component :is="child"></component>
			</Panel>
			<slot></slot>
		</div>
	`,
	data: () => {
		return {
			children: []
		}
	}
})
export class HLayout extends Vue {
	protected children: Array<string>;

	get panelCount(): number {
		return this.$children.length;
	}

	add(componentName: string): void {
		this.children.push(componentName);
	}

	panel(index: number): Panel {
		return this.$children[index] as Panel;
	}
}
