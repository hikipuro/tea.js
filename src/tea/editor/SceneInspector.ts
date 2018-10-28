import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../Tea";

@Component({
	template: `
		<div class="SceneInspector">
			Scene Settings
		</div>
	`,
	data: () => {
		return {
		}
	}
})
export class SceneInspector extends Vue {
}
