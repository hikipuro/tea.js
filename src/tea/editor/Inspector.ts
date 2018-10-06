import Vue from "vue";
import Component from "vue-class-component";
import * as Tea from "../Tea";

@Component({
	template: `
		<div
			class="Inspector">
			<div>{{ name }}</div>
			<Vector3 text="Position" :value="position"></Vector3>
			<Vector3 text="Rotation" :value="rotation"></Vector3>
			<Vector3 text="Scale" :value="scale"></Vector3>
		</div>
	`,
	data: () => { return {
		name: "",
		position: null,
		rotation: null,
		scale: null
	}}
})
export class Inspector extends Vue {
	name: string;
	position: Tea.Vector3;
	rotation: Tea.Vector3;
	scale: Tea.Vector3;
}
