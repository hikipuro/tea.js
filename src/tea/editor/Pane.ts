import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<div>
			<div v-if="content" v-html="content"></div>
			<component :is="component" ref="comp"></component>
		</div>
	`,
	data: () => { return {
		content: "",
		component: ""
	}}
})
export class Pane extends Vue {
	content: string;
	component: string;

	getComponent(): Vue {
		return this.$refs.comp as Vue;
	}
}
