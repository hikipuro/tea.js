import Vue from "vue";
import Component from "vue-class-component";
import { NoCache } from "../basic/NoCache";

@Component({
	template: `
		<div
			class="Panel"
			:class="{
				resize: isResizable,
				resizeX: isResizableX,
				resizeY: isResizableY
			}"
			:style="{
				width: width,
				height: height,
				marginLeft: marginLeft,
				marginRight: marginRight,
				marginTop: marginTop,
				marginBottom: marginBottom,
				paddingLeft: paddingLeft,
				paddingRight: paddingRight,
				paddingTop: paddingTop,
				paddingBottom: paddingBottom
			}">
			<slot></slot>
		</div>
	`,
	data: () => {
		return {
			width: "",
			height: "",
			marginLeft: "",
			marginRight: "",
			marginTop: "",
			marginBottom: "",
			paddingLeft: "",
			paddingRight: "",
			paddingTop: "",
			paddingBottom: "",
			isResizable: false,
			isResizableX: false,
			isResizableY: false
		}
	}
})
export class Panel extends Vue {
	width: string;
	height: string;
	marginLeft: string;
	marginRight: string;
	marginTop: string;
	marginBottom: string;
	paddingLeft: string;
	paddingRight: string;
	paddingTop: string;
	paddingBottom: string;
	isResizable: boolean;
	isResizableX: boolean;
	isResizableY: boolean;
	protected _isMouseDown: boolean = false;

	get margin(): string {
		return "";
	}
	set margin(value: string) {
		this.marginLeft = value;
		this.marginRight = value;
		this.marginTop = value;
		this.marginBottom = value;
	}

	get padding(): string {
		return "";
	}
	set padding(value: string) {
		this.paddingLeft = value;
		this.paddingRight = value;
		this.paddingTop = value;
		this.paddingBottom = value;
	}

	@NoCache
	get rect(): ClientRect {
		return this.$el.getBoundingClientRect();
	}
}
