import { AnimationCurve } from "./AnimationCurve";
import { Button } from "./Button";
import { CheckBox } from "./CheckBox";
import { ColorPicker } from "./ColorPicker";
import { ContextMenu } from "./ContextMenu";
import { ContextMenuItem } from "./ContextMenuItem";
import { Gradient } from "./Gradient";
import { HResizeBar } from "./HResizeBar";
import { ImageSelector } from "./ImageSelector";
import { InputNumber } from "./InputNumber";
import { InputRange } from "./InputRange";
import { InputText } from "./InputText";
import { Label } from "./Label";
import { ListView } from "./ListView";
import { NativeContextMenu } from "./NativeContextMenu";
import { ObjectTitle } from "./ObjectTitle";
import { Rectangle } from "./Rectangle";
import { SelectAspect } from "./SelectAspect";
import { SelectEnum } from "./SelectEnum";
import { TextArea } from "./TextArea";
import { TreeView } from "./TreeView";
import { TreeViewItem } from "./TreeViewItem";
import { Vector2 } from "./Vector2";
import { Vector3 } from "./Vector3";
import { VResizeBar } from "./VResizeBar";

export {
	AnimationCurve,
	Button,
	CheckBox,
	ColorPicker,
	ContextMenu,
	ContextMenuItem,
	Gradient,
	HResizeBar,
	ImageSelector,
	InputNumber,
	InputRange,
	InputText,
	Label,
	ListView,
	NativeContextMenu,
	ObjectTitle,
	Rectangle,
	SelectAspect,
	SelectEnum,
	TextArea,
	TreeView,
	TreeViewItem,
	Vector2,
	Vector3,
	VResizeBar,
}

export function getComponents(): Object {
	return {
		AnimationCurve: AnimationCurve,
		Button: Button,
		CheckBox: CheckBox,
		ColorPicker: ColorPicker,
		ContextMenu: ContextMenu,
		Gradient: Gradient,
		HResizeBar: HResizeBar,
		ImageSelector: ImageSelector,
		InputNumber: InputNumber,
		InputRange: InputRange,
		InputText: InputText,
		Label: Label,
		ListView: ListView,
		ObjectTitle: ObjectTitle,
		Rectangle: Rectangle,
		SelectAspect: SelectAspect,
		SelectEnum: SelectEnum,
		TextArea: TextArea,
		TreeView: TreeView,
		Vector2: Vector2,
		Vector3: Vector3,
		VResizeBar: VResizeBar,
	}
}
