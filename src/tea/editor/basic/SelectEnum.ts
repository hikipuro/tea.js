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
		keys: {
			type: Array,
			default: []
		},
		value: {
			type: String,
			default: ""
		}
	},
	watch: {
		value: function (newValue) {
			var self = this as SelectEnum;
			self.$nextTick(() => {
				var el = this.$refs.select as HTMLSelectElement;
				var index = self.keys.indexOf(newValue);
				el.selectedIndex = index;
			});
		}
	}
})
export class SelectEnum extends Vue {
	keys: Array<string>;
	value: string;
	
	protected onChange(e: Event): void {
		var el = e.target as HTMLSelectElement;
		this.$emit("update", el.value);
	}
}
