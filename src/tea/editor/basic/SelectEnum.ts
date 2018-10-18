import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<div class="SelectEnum">
			<div
				class="title">
				<slot></slot>
			</div>
			<select
				ref="select"
				@change="onChange">
				<option
					v-for="key in keys"
					:value="key">{{ key }}</option>
			</select>
		</div>
	`,
	props: {
		value: String
	},
	data: () => {
		return {
			keys: []
		}
	},
	watch: {
		value: function (newValue) {
			var el = this.$refs.select as HTMLSelectElement;
			var index = this.$data.keys.indexOf(newValue);
			el.selectedIndex = index;
		}
	}
})
export class SelectEnum extends Vue {
	keys: Array<string>;
	
	protected onChange(e: Event): void {
		var el = e.target as HTMLSelectElement;
		this.$emit("update", el.value);
	}
}
