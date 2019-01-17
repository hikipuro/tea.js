import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<div class="Padding">
			<div
				ref="title"
				class="title">
				<slot></slot>
			</div>
			<div class="value">
				<VLayout>
					<Panel>
						<InputNumber
							:value="top"
							:step="step"
							:min="min"
							:disabled="disabled"
							@update="onUpdateTop"
							@change="onChangeTop">T</InputNumber>
						<InputNumber
							:value="right"
							:step="step"
							:min="min"
							:disabled="disabled"
							@update="onUpdateRight"
							@change="onChangeRight">R</InputNumber>
					</Panel>

					<Panel>
						<InputNumber
							:value="bottom"
							:step="step"
							:min="min"
							:disabled="disabled"
							@update="onUpdateBottom"
							@change="onChangeBottom">B</InputNumber>
						<InputNumber
							:value="left"
							:step="step"
							:min="min"
							:disabled="disabled"
							@update="onUpdateLeft"
							@change="onChangeLeft">L</InputNumber>
					</Panel>
				</VLayout>
			</div>
		</div>
	`,
	props: {
		top: {
			type: Number,
			default: 0
		},
		right: {
			type: Number,
			default: 0
		},
		bottom: {
			type: Number,
			default: 0
		},
		left: {
			type: Number,
			default: 0
		},
		step: {
			type: Number,
			default: 1
		},
		min: {
			type: Number,
			default: -Infinity
		},
		disabled: {
			type: Boolean,
			default: false
		}
	}
})
export class Padding extends Vue {
	top: number;
	right: number;
	bottom: number;
	left: number;

	protected onUpdateTop(value: number): void {
		this.$emit("update", value, this.right, this.bottom, this.left);
	}

	protected onUpdateRight(value: number): void {
		this.$emit("update", this.top, value, this.bottom, this.left);
	}

	protected onUpdateBottom(value: number): void {
		this.$emit("update", this.top, this.right, value, this.left);
	}

	protected onUpdateLeft(value: number): void {
		this.$emit("update", this.top, this.right, this.bottom, value);
	}

	protected onChangeTop(value: number): void {
		this.$emit("change", value, this.right, this.bottom, this.left);
	}

	protected onChangeRight(value: number): void {
		this.$emit("change", this.top, value, this.bottom, this.left);
	}

	protected onChangeBottom(value: number): void {
		this.$emit("change", this.top, this.right, value, this.left);
	}

	protected onChangeLeft(value: number): void {
		this.$emit("change", this.top, this.right, this.bottom, value);
	}
}
