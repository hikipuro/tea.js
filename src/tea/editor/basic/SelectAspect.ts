import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<select
			class="SelectAspect"
			@change="onChange">
			<option value="free">Free Aspect</option>
			<option value="4:3">4:3</option>
			<option value="16:9">16:9</option>
		</select>
	`
})
export class SelectAspect extends Vue {
	x: number;
	y: number;

	protected created(): void {
		this.x = 0;
		this.y = 0;
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
