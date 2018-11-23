import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<form>
			<select
				class="ListView"
				:size="items.length"
				v-model="selected"
				@change="onChange(selected)">
				<option
					v-for="i in items"
					:value="i.text">
					{{ i.text }}
				</option>
			</select>
		</form>
	`,
	data: () => {
		return {
			selected: null,
			items: []
		}
	}
})
export class ListView extends Vue {
	items: Array<object>;

	add(text: string): void {
		this.items.push({
			text: text
		});
	}

	onChange(selected: string): void {
		console.log("onChange", selected);
	}
}
