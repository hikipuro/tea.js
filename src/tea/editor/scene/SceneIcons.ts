import * as Tea from "../../Tea";
import { SceneIcon } from "./SceneIcon";
import { NativeFile } from "../NativeFile";

export class SceneIcons {
	scene: Tea.Scene;
	cameras: Array<Tea.Camera>;
	lights: Array<Tea.Light>;
	protected _cameraIcon: SceneIcon;
	protected _lightIcon: SceneIcon;

	constructor(scene: Tea.Scene) {
		this.scene = scene;
		this.cameras = [];
		this.lights = [];
		this._cameraIcon = this.createIcon(
			"images/camera-icon.png"
		);
		this._lightIcon = this.createIcon(
			"images/light-icon.png"
		);
	}

	render(camera: Tea.Camera, lights: Array<Tea.Light>, renderSettings: Tea.RenderSettings): void {
		this.renderCameraIcons(camera, lights, renderSettings);
		this.renderLightIcons(camera, lights, renderSettings);
	}

	protected createIcon(iconPath: string): SceneIcon {
		var path = NativeFile.join(__dirname, iconPath);
		var icon = new SceneIcon(this.scene.app);
		icon.material.mainTexture.load(path);
		return icon;
	}

	protected renderCameraIcons(camera: Tea.Camera, lights: Array<Tea.Light>, renderSettings: Tea.RenderSettings): void {
		var cameras = this.cameras;
		if (cameras == null || cameras.length <= 0) {
			return;
		}
		var icon = this._cameraIcon;
		var length = cameras.length;
		for (var i = 0; i < length; i++) {
			icon.target = cameras[i].object3d;
			if (icon.target == null) {
				continue;
			}
			icon.update(this.scene.isEditing, camera);
			icon.renderer.render(camera, lights, renderSettings);
		}
	}

	protected renderLightIcons(camera: Tea.Camera, lights: Array<Tea.Light>, renderSettings: Tea.RenderSettings): void {
		var lights = this.lights;
		if (lights == null || lights.length <= 0) {
			return;
		}
		var icon = this._lightIcon;
		var length = lights.length;
		for (var i = 0; i < length; i++) {
			icon.target = lights[i].object3d;
			if (icon.target == null) {
				continue;
			}
			icon.update(this.scene.isEditing, camera);
			icon.renderer.render(camera, lights, renderSettings);
		}
	}
}
