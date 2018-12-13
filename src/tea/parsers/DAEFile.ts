import * as Tea from "../Tea";
import { DAEAsset } from "./dae/metadata/DAEAsset";
import { DAELibraryAnimationClips } from "./dae/animation/DAELibraryAnimationClips";
import { DAELibraryAnimations } from "./dae/animation/DAELibraryAnimations";
import { DAELibraryCameras } from "./dae/camera/DAELibraryCameras";
import { DAELibraryControllers } from "./dae/controller/DAELibraryControllers";
import { DAELibraryFormulas } from "./dae/math/DAELibraryFormulas";
import { DAELibraryGeometries } from "./dae/geometry/DAELibraryGeometries";
import { DAELibraryLights } from "./dae/lighting/DAELibraryLights";
import { DAELibraryNodes } from "./dae/scene/DAELibraryNodes";
import { DAELibraryVisualScenes } from "./dae/scene/DAELibraryVisualScenes";
import { DAEScene } from "./dae/scene/DAEScene";
import { DAEExtra } from "./dae/extensibility/DAEExtra";

export class DAEFile {
	asset: DAEAsset;
	libraryAnimationClips?: DAELibraryAnimationClips;
	libraryAnimations: DAELibraryAnimations;
	//libraryArticulatedSystems: any;
	libraryCameras: DAELibraryCameras;
	libraryControllers: DAELibraryControllers;
	//libraryEffects: any;
	//libraryForceFields: any;
	libraryFormulas: DAELibraryFormulas;
	libraryGeometries?: DAELibraryGeometries;
	//libraryImages: any;
	//libraryJoints: any;
	//libraryKinematicsModels: any;
	//libraryKinematicsScenes: any;
	libraryLights: DAELibraryLights;
	//libraryMaterials: any;
	libraryNodes: DAELibraryNodes;
	//libraryPhysicsMaterials: any;
	//libraryPhysicsModels: any;
	//libraryPhysicsScenes: any;
	libraryVisualScenes: DAELibraryVisualScenes;
	scene?: DAEScene;
	extras?: Array<DAEExtra>;

	constructor() {
		this.asset = null;
		this.libraryGeometries = null;
	}

	static load(url: string, callback: (daeFile: DAEFile) => void): void {
		if (url == null || url === "") {
			callback(null);
			return;
		}
		Tea.File.readText(url, (err: any, data: string) => {
			if (err) {
				callback(null);
				return;
			}
			this.parse(data, callback, (progress: number) => {
				console.log("loading", progress);
			});
		});
	}

	static parse(
		data: string,
		callback: (daeFile: DAEFile) => void,
		progress: (progress: number) => void = null
	): void {
		if (data == null || data === "") {
			callback(null);
			return;
		}
		if (progress == null) {
			progress = (progress: number) => {};
		}
		setTimeout(() => {
			var parser = new DOMParser();
			var document: Document = null;
			try {
				document = parser.parseFromString(data, "text/xml");
			} catch (err) {
				console.error("parse error", err);
				callback(null);
				return;
			}
			if (this.isValidDocument(document) === false) {
				console.error("parse error");
				callback(null);
				return;
			}
			var file = new DAEFile();
			file.asset = DAEAsset.parse(
				document.querySelector("asset")
			);
			file.libraryAnimationClips = DAELibraryAnimationClips.parse(
				document.querySelector("library_animation_clips")
			);
			file.libraryAnimations = DAELibraryAnimations.parse(
				document.querySelector("library_animations")
			);
			file.libraryCameras = DAELibraryCameras.parse(
				document.querySelector("library_cameras")
			);
			file.libraryControllers = DAELibraryControllers.parse(
				document.querySelector("library_controllers")
			);
			file.libraryFormulas = DAELibraryFormulas.parse(
				document.querySelector("library_formulas")
			);
			file.libraryLights = DAELibraryLights.parse(
				document.querySelector("library_lights")
			);
			file.libraryNodes = DAELibraryNodes.parse(
				document.querySelector("library_nodes")
			);
			file.libraryVisualScenes = DAELibraryVisualScenes.parse(
				document.querySelector("library_visual_scenes")
			);
			file.extras = DAEExtra.parseArray(document);
			file.scene = DAEScene.parse(
				document.querySelector("scene")
			);
			var $libraryGeometries = document.querySelector("library_geometries");
			DAELibraryGeometries.parse($libraryGeometries, (geometries: DAELibraryGeometries) => {
				file.libraryGeometries = geometries;
				progress(1.0);
				callback(file);
				console.log("xml", file.toXML());
			});
		}, 0);
	}

	toMeshes(): Array<Tea.Mesh> {
		var geometries = this.libraryGeometries;
		if (geometries == null) {
			return null;
		}
		return geometries.toMeshes();
	}

	toXML(): Document {
		var doc = document.implementation.createDocument(
			"", "", null
		);
		var root = doc.createElement("COLLADA");
		root.setAttribute("xmlns", "http://www.collada.org/2005/11/COLLADASchema");
		root.setAttribute("version", "1.4.1");
		root.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
		var asset = this.asset.toXML();
		root.appendChild(asset);
		var libraryGeometries = this.libraryGeometries.toXML();
		root.appendChild(libraryGeometries);
		doc.appendChild(root);
		return doc;
	}

	protected static isValidDocument(document: Document): boolean {
		if (document == null) {
			return false;
		}
		if (document.children.length <= 0) {
			return false;
		}
		if (document.children[0].nodeName !== "COLLADA") {
			return false;
		}
		if (document.getElementsByTagName("parsererror").length > 0) {
			return false;
		}
		return true;
	}
}
