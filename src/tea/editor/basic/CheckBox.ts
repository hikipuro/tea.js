import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<div class="CheckBox">
			<div class="title">
				<label :for="id"><slot></slot></label>
			</div>
			<div class="value">
				<input
					:id="id"
					type="checkbox"
					ref="checkbox"
					:checked="value"
					@change="onChange"></input>
			</div>
		</div>
	`,
	props: {
		value: {
			type: Boolean,
			default: false
		}
	}
})
export class CheckBox extends Vue {
	get id(): string {
		return "_CheckBox_" + (this as any)._uid;
	}

	protected onChange (): void {
		var checkbox = this.$refs.checkbox as HTMLInputElement;
		this.$emit("update", checkbox.checked);
	}
}
