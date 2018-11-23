import { AudioSource } from "./AudioSource";
import { BoxCollider } from "./BoxCollider";
import { Camera } from "./Camera";
import { Light } from "./Light";
import { LineRenderer } from "./LineRenderer";
import { MeshFilter } from "./MeshFilter";
import { MeshRenderer } from "./MeshRenderer";
import { ParticleSystem } from "./ParticleSystem";
import { Rigidbody } from "./Rigidbody";
import { Script } from "./Script";
import { TextMesh } from "./TextMesh";

export {
	AudioSource,
	BoxCollider,
	Camera,
	Light,
	LineRenderer,
	MeshFilter,
	MeshRenderer,
	ParticleSystem,
	Rigidbody,
	Script,
	TextMesh
}

export function getComponents(): Object {
	return {
		AudioSource: AudioSource,
		BoxCollider: BoxCollider,
		Camera: Camera,
		Light: Light,
		LineRenderer: LineRenderer,
		MeshFilter: MeshFilter,
		MeshRenderer: MeshRenderer,
		ParticleSystem: ParticleSystem,
		Rigidbody: Rigidbody,
		Script: Script,
		TextMesh: TextMesh,
	}
}
