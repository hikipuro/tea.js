import Vue from "vue";
import Component from "vue-class-component";
import { Translator } from "../Translator";

@Component({
	template: `
		<select
			class="SelectAspect"
			@change="onChange">
			<option value="free">{{ translator.free }}</option>
			<option value="4:3">4:3</option>
			<option value="16:9">16:9</option>
		</select>
	`,
	data: () => {
		return {
			translator: {}
		}
	},
})
export class SelectAspect extends Vue {
	translator: any;
	x: number;
	y: number;

	protected created(): void {
		this.x = 0;
		this.y = 0;
		var translator = Translator.getInstance();
		translator.basePath = "SelectAspect";
		this.translator.free = translator.getText("Free Aspect");
	}
	
	protected onChange(e: Event): void {
		var el = e.target as HTMLSelectElement;
		switch (el.value) {
			case "free":
				this.x = 0;
				this.y = 0;
				break;
			case "4:3":
				this.x = 4;
				this.y = 3;
				break;
			case "16:9":
				this.x = 16;
				this.y = 9;
				break;
		}
		this.$emit("update");
	}
}
