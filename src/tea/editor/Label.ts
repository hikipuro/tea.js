import Vue from "vue";
//import Vue from "vue/dist/vue.common";
import Component from "vue-class-component";

@Component({
	template: "<div @click='onClick'>{{text}}</div>",
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
	/*
	set text(value: string) {
		this.$data.message = "test";
	}
	*/
}
