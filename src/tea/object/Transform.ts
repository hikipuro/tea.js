import * as Tea from "../Tea";
import { Component } from "./Component";

export class Transform extends Component {
	constructor(app: Tea.App) {
		super(app);
	}

	get childCount(): number {
		return 0;
	}

	get eulerAngles(): Tea.Vector3 {
		return null;
	}

	get forward(): Tea.Vector3 {
		return null;
	}

	get hasChanged(): boolean {
		return false;
	}

	//get hierarchyCapacity(): number {
	//	return 0;
	//}

	//get hierarchyCount(): number {
	//	return 0;
	//}

	get localEulerAngles(): Tea.Vector3 {
		return null;
	}

	get localPosition(): Tea.Vector3 {
		return null;
	}

	get localRotation(): Tea.Quaternion {
		return null;
	}

	get localScale(): Tea.Vector3 {
		return null;
	}

	get localToWorldMatrix(): Tea.Matrix4x4 {
		return null;
	}

	get lossyScale(): Tea.Vector3 {
		return null;
	}

	get parent(): Transform {
		return null;
	}

	get position(): Tea.Vector3 {
		return null;
	}

	get right(): Tea.Vector3 {
		return null;
	}

	get root(): Transform {
		return null;
	}

	get rotation(): Tea.Quaternion {
		return null;
	}

	get up(): Tea.Vector3 {
		return null;
	}

	get worldToLocalMatrix(): Tea.Matrix4x4 {
		return null;
	}
}
