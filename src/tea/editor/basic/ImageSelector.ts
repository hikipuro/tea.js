import Vue from "vue";
import Component from "vue-class-component";

@Component({
	template: `
		<div class="ImageSelector">
			<div class="title">
				<slot></slot>
			</div>
			<div class="value">
				<img
					ref="image"
					:src="url">
				</img>
			</div>
		</div>
	`,
	data: () => {
		return {
			url: ""
		}
	}
})
export class ImageSelector extends Vue {
	url: string;
}
