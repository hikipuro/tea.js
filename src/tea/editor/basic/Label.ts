import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: "<span @click='onClick'>{{ text }}</span>",
	props: {
		text: {
			type: String,
			default: ""
		}
	}
})
export class Label extends Vue {
	text: string;
	onClick (): void {
		//window.alert(this.$data.test);
	}
}
