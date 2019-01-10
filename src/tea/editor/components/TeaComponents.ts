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
import { UIButton } from "./UIButton";
import { UICheckbox } from "./UICheckbox";
import { UIImage } from "./UIImage";
import { UIText } from "./UIText";
import { TextMesh } from "./TextMesh";

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
	UIButton,
	UICheckbox,
	UIImage,
	UIText,
	TextMesh
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
		UIButton: UIButton,
		UICheckbox: UICheckbox,
		UIImage: UIImage,
		UIText: UIText,
		TextMesh: TextMesh,
	}
}
