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
						<InputNumber
							ref="x"
							:value="value[0]"
							:step="step"
							@update="onUpdateX">X</InputNumber>
						<InputNumber
							ref="y"
							:value="value[1]"
							:step="step"
							@update="onUpdateY">Y</InputNumber>
					</Panel>

					<Panel>
						<InputNumber
							ref="w"
							:value="value[2]"
							:step="step"
							@update="onUpdateWidth">W</InputNumber>
						<InputNumber
							ref="h"
							:value="value[3]"
							:step="step"
							@update="onUpdateHeight">H</InputNumber>
					</Panel>
				</VLayout>
			</div>
		</div>
	`,
	props: {
		value: Array,
		step: {
			type: Number,
			default: 0.001
		}
	}
})
export class Rectangle extends Vue {
	value: Array<number>;
	step: number;

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
