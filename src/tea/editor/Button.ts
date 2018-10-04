import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: "<button>{{text}}</button>",
	data: () => {
		return {
			text: "Button"
		}
	}
})
export class Button extends Vue {
}
