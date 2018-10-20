import { UICommandTarget } from "./UICommandTarget";

export class UICommand {
	target: UICommandTarget;
	type: string;
	value: any;

	constructor(target: UICommandTarget, type: string, value: any) {
		this.target = target;
		this.type = type;
		this.value = value;
	}
}
