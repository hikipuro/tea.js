import * as Tea from "../Tea";
import { DAEAsset } from "./dae/core/metadata/DAEAsset";
import { DAELibraryAnimationClips } from "./dae/core/animation/DAELibraryAnimationClips";
import { DAELibraryAnimations } from "./dae/core/animation/DAELibraryAnimations";
import { DAELibraryCameras } from "./dae/core/camera/DAELibraryCameras";
import { DAELibraryControllers } from "./dae/core/controller/DAELibraryControllers";
import { DAELibraryForceFields } from "./dae/physics/scene/DAELibraryForceFields";
import { DAELibraryFormulas } from "./dae/core/math/DAELibraryFormulas";
import { DAELibraryGeometries } from "./dae/core/geometry/DAELibraryGeometries";
import { DAELibraryLights } from "./dae/core/lighting/DAELibraryLights";
import { DAELibraryNodes } from "./dae/core/scene/DAELibraryNodes";
import { DAELibraryPhysicsMaterials } from "./dae/physics/material/DAELibraryPhysicsMaterials";
import { DAELibraryPhysicsModels } from "./dae/physics/model/DAELibraryPhysicsModels";
import { DAELibraryPhysicsScenes } from "./dae/physics/scene/DAELibraryPhysicsScenes";
import { DAELibraryVisualScenes } from "./dae/core/scene/DAELibraryVisualScenes";
import { DAEScene } from "./dae/core/scene/DAEScene";
import { DAEExtra } from "./dae/core/extensibility/DAEExtra";

export class DAEFile {
	asset: DAEAsset;
	libraryAnimationClips?: DAELibraryAnimationClips;
	libraryAnimations: DAELibraryAnimations;
	//libraryArticulatedSystems: any;
	libraryCameras: DAELibraryCameras;
	libraryControllers: DAELibraryControllers;
	//libraryEffects: any;
	libraryForceFields: DAELibraryForceFields;
	libraryFormulas: DAELibraryFormulas;
	libraryGeometries?: DAELibraryGeometries;
	//libraryImages: any;
	//libraryJoints: any;
	//libraryKinematicsModels: any;
	//libraryKinematicsScenes: any;
	libraryLights: DAELibraryLights;
	//libraryMaterials: any;
	libraryNodes: DAELibraryNodes;
	libraryPhysicsMaterials: DAELibraryPhysicsMaterials;
	libraryPhysicsModels: DAELibraryPhysicsModels;
	libraryPhysicsScenes: DAELibraryPhysicsScenes;
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
				document.querySelector(":scope > asset")
			);
			file.libraryAnimationClips = DAELibraryAnimationClips.parse(
				document.querySelector(":scope > library_animation_clips")
			);
			file.libraryAnimations = DAELibraryAnimations.parse(
				document.querySelector(":scope > library_animations")
			);
			file.libraryCameras = DAELibraryCameras.parse(
				document.querySelector(":scope > library_cameras")
			);
			file.libraryControllers = DAELibraryControllers.parse(
				document.querySelector(":scope > library_controllers")
			);
			file.libraryForceFields = DAELibraryForceFields.parse(
				document.querySelector(":scope > library_force_fields")
			);
			file.libraryFormulas = DAELibraryFormulas.parse(
				document.querySelector(":scope > library_formulas")
			);
			file.libraryLights = DAELibraryLights.parse(
				document.querySelector(":scope > library_lights")
			);
			file.libraryNodes = DAELibraryNodes.parse(
				document.querySelector(":scope > library_nodes")
			);
			file.libraryPhysicsMaterials = DAELibraryPhysicsMaterials.parse(
				document.querySelector(":scope > library_physics_materials")
			);
			file.libraryPhysicsModels = DAELibraryPhysicsModels.parse(
				document.querySelector(":scope > library_physics_models")
			);
			file.libraryPhysicsScenes = DAELibraryPhysicsScenes.parse(
				document.querySelector(":scope > library_physics_scenes")
			);
			file.libraryVisualScenes = DAELibraryVisualScenes.parse(
				document.querySelector(":scope > library_visual_scenes")
			);
			file.extras = DAEExtra.parseArray(document);
			file.scene = DAEScene.parse(
				document.querySelector(":scope > scene")
			);
			var $libraryGeometries = document.querySelector(":scope > library_geometries");
			DAELibraryGeometries.parse($libraryGeometries, (geometries: DAELibraryGeometries) => {
				file.libraryGeometries = geometries;
				progress(1.0);
				callback(file);
				console.log("xml", file);
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
		var root = this.createRootElement(doc);
		var asset = this.asset.toXML();
		root.appendChild(asset);
		var libraryGeometries = this.libraryGeometries.toXML();
		root.appendChild(libraryGeometries);
		doc.appendChild(root);
		return doc;
	}

	protected createRootElement(document: Document, version: string = "1.5.0"): Element {
		var element = document.createElement("COLLADA");
		if (version === "1.5.0") {
			element.setAttribute("xmlns", "http://www.collada.org/2008/03/COLLADASchema");
			element.setAttribute("version", "1.5.0");
		} else {
			element.setAttribute("xmlns", "http://www.collada.org/2005/11/COLLADASchema");
			element.setAttribute("version", "1.4.1");
			element.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
		}
		return element;
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
