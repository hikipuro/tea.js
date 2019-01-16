import * as Tea from "../../Tea";
import { UIComponent } from "./UIComponent";

export class Layout extends UIComponent {
	static readonly className: string = "Layout";

	constructor(app: Tea.App) {
		super(app);
		this.useMouseEvents = false;
	}
}
