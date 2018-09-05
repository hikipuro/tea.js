import * as Tea from "../Tea";
import { Component } from "./Component";

export class MeshFilter extends Component {
	mesh: Tea.Mesh;
	
	constructor(app: Tea.App) {
		super(app);
	}
}
