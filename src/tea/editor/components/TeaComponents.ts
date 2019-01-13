import { AudioSource } from "./AudioSource";
import { BoxCollider } from "./BoxCollider";
import { Camera } from "./Camera";
import { Canvas } from "./Canvas";
import { CanvasRenderer } from "./CanvasRenderer";
import { Light } from "./Light";
import { LineRenderer } from "./LineRenderer";
import { MeshFilter } from "./MeshFilter";
import { MeshRenderer } from "./MeshRenderer";
import { ParticleSystem } from "./ParticleSystem";
import { Rigidbody } from "./Rigidbody";
import { Script } from "./Script";
import { SphereCollider } from "./SphereCollider";
import { TextMesh } from "./TextMesh";
import { UIButton } from "./UIButton";
import { UIRadioButton } from "./UIRadioButton";
import { UICheckbox } from "./UICheckbox";
import { UIImage } from "./UIImage";
import { UIText } from "./UIText";
import { UISlider } from "./UISlider";
import { UIPanel } from "./UIPanel";
import { UIScrollView } from "./UIScrollView";
import { UIHScrollBar } from "./UIHScrollBar";

export {
	AudioSource,
	BoxCollider,
	Camera,
	Canvas,
	CanvasRenderer,
	Light,
	LineRenderer,
	MeshFilter,
	MeshRenderer,
	ParticleSystem,
	Rigidbody,
	Script,
	SphereCollider,
	TextMesh,
	UIButton,
	UIRadioButton,
	UICheckbox,
	UIImage,
	UIText,
	UISlider,
	UIPanel,
	UIScrollView,
	UIHScrollBar,
}

export function getComponents(): Object {
	return {
		AudioSource: AudioSource,
		BoxCollider: BoxCollider,
		Camera: Camera,
		Canvas: Canvas,
		CanvasRenderer: CanvasRenderer,
		Light: Light,
		LineRenderer: LineRenderer,
		MeshFilter: MeshFilter,
		MeshRenderer: MeshRenderer,
		ParticleSystem: ParticleSystem,
		Rigidbody: Rigidbody,
		Script: Script,
		SphereCollider: SphereCollider,
		TextMesh: TextMesh,
		UIButton: UIButton,
		UIRadioButton: UIRadioButton,
		UICheckbox: UICheckbox,
		UIImage: UIImage,
		UIText: UIText,
		UISlider: UISlider,
		UIPanel: UIPanel,
		UIScrollView: UIScrollView,
		UIHScrollBar: UIHScrollBar,
	}
}
