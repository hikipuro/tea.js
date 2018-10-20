import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<div
			class="ObjectTitle">
			<input
				type="checkbox"
				ref="checkbox"
				:checked="isActive"
				@change="onChangeActive"></input>
			<input
				type="text"
				ref="name"
				size="1"
				:value="name"
				@focus="onFocus"
				@change="onChangeName"></input>
			<slot></slot>
		</div>
	`,
	props: {
		isActive: {
			type: Boolean,
			default: false
		},
		name: {
			type: String,
			default: ""
		}
	}
})
export class ObjectTitle extends Vue {
	isActive: boolean;
	_prevName: string;

	protected onChangeActive(): void {
		var checkbox = this.$refs.checkbox as HTMLInputElement;
		this.$emit("update", "isActive", checkbox.checked);
	}

	protected onFocus(): void {
		var name = this.$refs.name as HTMLInputElement;
		this._prevName = name.value;
		name.setSelectionRange(0, name.value.length);
	}

	protected onChangeName(): void {
		console.log("onChangeName");
		var name = this.$refs.name as HTMLInputElement;
		if (name.value === "") {
			name.value = this._prevName;
			return;
		}
		this.$emit("update", "name", name.value);
	}
}
