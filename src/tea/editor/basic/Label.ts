import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: "<span @click='onClick'>{{ text }}</span>",
	data: () => {
		return {
			text: "Label"
		}
	}
})
export class Label extends Vue {
	text: string;
	onClick (): void {
		//window.alert(this.$data.test);
	}
}
