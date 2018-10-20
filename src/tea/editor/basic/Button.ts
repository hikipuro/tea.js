import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: "<button>{{ text }}</button>",
	props: {
		text: {
			type: String,
			default: ""
		}
	}
})
export class Button extends Vue {
}
