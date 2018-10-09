import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<div class="Rectangle">
			<div
				class="title">
				<slot></slot>
			</div>
			<div class="value">
				<VLayout>
					<Panel>
						<InputNumber :value="value[0]" @update="onUpdateX">X</InputNumber>
						<InputNumber :value="value[1]" @update="onUpdateY">Y</InputNumber>
					</Panel>

					<Panel>
						<InputNumber :value="value[2]" @update="onUpdateWidth">W</InputNumber>
						<InputNumber :value="value[3]" @update="onUpdateHeight">H</InputNumber>
					</Panel>
				</VLayout>
			</div>
		</div>
	`,
	props: {
		value: Array
	}
})
export class Rectangle extends Vue {
	value: Array<number>;

	protected onUpdateX(value: number): void {
		var rect = this.value.concat();
		rect[0] = value;
		this.$emit("update", rect);
	}

	protected onUpdateY(value: number): void {
		var rect = this.value.concat();
		rect[1] = value;
		this.$emit("update", rect);
	}

	protected onUpdateWidth(value: number): void {
		var rect = this.value.concat();
		rect[2] = value;
		this.$emit("update", rect);
	}

	protected onUpdateHeight(value: number): void {
		var rect = this.value.concat();
		rect[3] = value;
		this.$emit("update", rect);
	}
}
