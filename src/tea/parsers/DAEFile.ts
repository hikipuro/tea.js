import * as Tea from "../Tea";
import { DAEUtil } from "./dae/DAEUtil";
import { DAEAsset } from "./dae/core/metadata/DAEAsset";
import { DAELibraryAnimationClips } from "./dae/core/animation/DAELibraryAnimationClips";
import { DAELibraryAnimations } from "./dae/core/animation/DAELibraryAnimations";
import { DAELibraryArticulatedSystems } from "./dae/kinematics/articulated/DAELibraryArticulatedSystems";
import { DAELibraryCameras } from "./dae/core/camera/DAELibraryCameras";
import { DAELibraryControllers } from "./dae/core/controller/DAELibraryControllers";
import { DAELibraryEffects } from "./dae/fx/effects/DAELibraryEffects";
import { DAELibraryForceFields } from "./dae/physics/scene/DAELibraryForceFields";
import { DAELibraryFormulas } from "./dae/core/math/DAELibraryFormulas";
import { DAELibraryGeometries } from "./dae/core/geometry/DAELibraryGeometries";
import { DAELibraryImages } from "./dae/fx/texturing/DAELibraryImages";
import { DAELibraryJoints } from "./dae/kinematics/joints/DAELibraryJoints";
import { DAELibraryKinematicsModels } from "./dae/kinematics/models/DAELibraryKinematicsModels";
import { DAELibraryKinematicsScenes } from "./dae/kinematics/scenes/DAELibraryKinematicsScenes";
import { DAELibraryLights } from "./dae/core/lighting/DAELibraryLights";
import { DAELibraryMaterials } from "./dae/fx/materials/DAELibraryMaterials";
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
	libraryArticulatedSystems: DAELibraryArticulatedSystems;
	libraryCameras: DAELibraryCameras;
	libraryControllers: DAELibraryControllers;
	libraryEffects: DAELibraryEffects;
	libraryForceFields: DAELibraryForceFields;
	libraryFormulas: DAELibraryFormulas;
	libraryGeometries?: DAELibraryGeometries;
	libraryImages: DAELibraryImages;
	libraryJoints: DAELibraryJoints;
	libraryKinematicsModels: DAELibraryKinematicsModels;
	libraryKinematicsScenes: DAELibraryKinematicsScenes;
	libraryLights: DAELibraryLights;
	libraryMaterials: DAELibraryMaterials;
	libraryNodes: DAELibraryNodes;
	libraryPhysicsMaterials: DAELibraryPhysicsMaterials;
	libraryPhysicsModels: DAELibraryPhysicsModels;
	libraryPhysicsScenes: DAELibraryPhysicsScenes;
	libraryVisualScenes: DAELibraryVisualScenes;
	scene?: DAEScene;
	extras?: Array<DAEExtra>;

	constructor() {
		this.asset = null;
		this.libraryAnimationClips = null;
		this.libraryAnimations = null;
		this.libraryArticulatedSystems = null;
		this.libraryCameras = null;
		this.libraryControllers = null;
		this.libraryEffects = null;
		this.libraryForceFields = null;
		this.libraryFormulas = null;
		this.libraryGeometries = null;
		this.libraryImages = null;
		this.libraryJoints = null;
		this.libraryKinematicsModels = null;
		this.libraryKinematicsScenes = null;
		this.libraryLights = null;
		this.libraryMaterials = null;
		this.libraryNodes = null;
		this.libraryPhysicsMaterials = null;
		this.libraryPhysicsModels = null;
		this.libraryPhysicsScenes = null;
		this.libraryVisualScenes = null;
		this.scene = null;
		this.extras = null;
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
				DAEUtil.queryChildSelector(document, DAEAsset.TagName)
			);
			file.libraryAnimationClips = DAELibraryAnimationClips.parse(
				DAEUtil.queryChildSelector(document, DAELibraryAnimationClips.TagName)
			);
			file.libraryAnimations = DAELibraryAnimations.parse(
				DAEUtil.queryChildSelector(document, DAELibraryAnimations.TagName)
			);
			file.libraryArticulatedSystems = DAELibraryArticulatedSystems.parse(
				DAEUtil.queryChildSelector(document, DAELibraryArticulatedSystems.TagName)
			);
			file.libraryCameras = DAELibraryCameras.parse(
				DAEUtil.queryChildSelector(document, DAELibraryCameras.TagName)
			);
			file.libraryControllers = DAELibraryControllers.parse(
				DAEUtil.queryChildSelector(document, DAELibraryControllers.TagName)
			);
			file.libraryEffects = DAELibraryEffects.parse(
				DAEUtil.queryChildSelector(document, DAELibraryEffects.TagName)
			);
			file.libraryForceFields = DAELibraryForceFields.parse(
				DAEUtil.queryChildSelector(document, DAELibraryForceFields.TagName)
			);
			file.libraryFormulas = DAELibraryFormulas.parse(
				DAEUtil.queryChildSelector(document, DAELibraryFormulas.TagName)
			);
			file.libraryImages = DAELibraryImages.parse(
				DAEUtil.queryChildSelector(document, DAELibraryImages.TagName)
			);
			file.libraryJoints = DAELibraryJoints.parse(
				DAEUtil.queryChildSelector(document, DAELibraryJoints.TagName)
			);
			file.libraryKinematicsModels = DAELibraryKinematicsModels.parse(
				DAEUtil.queryChildSelector(document, DAELibraryKinematicsModels.TagName)
			);
			file.libraryKinematicsScenes = DAELibraryKinematicsScenes.parse(
				DAEUtil.queryChildSelector(document, DAELibraryKinematicsScenes.TagName)
			);
			file.libraryLights = DAELibraryLights.parse(
				DAEUtil.queryChildSelector(document, DAELibraryLights.TagName)
			);
			file.libraryMaterials = DAELibraryMaterials.parse(
				DAEUtil.queryChildSelector(document, DAELibraryMaterials.TagName)
			);
			file.libraryNodes = DAELibraryNodes.parse(
				DAEUtil.queryChildSelector(document, DAELibraryNodes.TagName)
			);
			file.libraryPhysicsMaterials = DAELibraryPhysicsMaterials.parse(
				DAEUtil.queryChildSelector(document, DAELibraryPhysicsMaterials.TagName)
			);
			file.libraryPhysicsModels = DAELibraryPhysicsModels.parse(
				DAEUtil.queryChildSelector(document, DAELibraryPhysicsModels.TagName)
			);
			file.libraryPhysicsScenes = DAELibraryPhysicsScenes.parse(
				DAEUtil.queryChildSelector(document, DAELibraryPhysicsScenes.TagName)
			);
			file.libraryVisualScenes = DAELibraryVisualScenes.parse(
				DAEUtil.queryChildSelector(document, DAELibraryVisualScenes.TagName)
			);
			file.extras = DAEExtra.parseArray(document);
			file.scene = DAEScene.parse(
				DAEUtil.queryChildSelector(document, DAEScene.TagName)
			);
			var $libraryGeometries = DAEUtil.queryChildSelector(document, DAELibraryGeometries.TagName)
			DAELibraryGeometries.parse($libraryGeometries, (geometries: DAELibraryGeometries) => {
				file.libraryGeometries = geometries;
				progress(1.0);
				callback(file);
				console.log(file);
				//var xml = new XMLSerializer().serializeToString(file.toXML());
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
		var root = this.createRootElement(doc);
		DAEUtil.addElement(root, this.asset);
		DAEUtil.addElement(root, this.libraryAnimationClips);
		DAEUtil.addElement(root, this.libraryAnimations);
		DAEUtil.addElement(root, this.libraryArticulatedSystems);
		DAEUtil.addElement(root, this.libraryCameras);
		DAEUtil.addElement(root, this.libraryControllers);
		DAEUtil.addElement(root, this.libraryEffects);
		DAEUtil.addElement(root, this.libraryForceFields);
		DAEUtil.addElement(root, this.libraryFormulas);
		DAEUtil.addElement(root, this.libraryGeometries);
		DAEUtil.addElement(root, this.libraryImages);
		DAEUtil.addElement(root, this.libraryJoints);
		DAEUtil.addElement(root, this.libraryKinematicsModels);
		DAEUtil.addElement(root, this.libraryKinematicsScenes);
		DAEUtil.addElement(root, this.libraryLights);
		DAEUtil.addElement(root, this.libraryMaterials);
		DAEUtil.addElement(root, this.libraryNodes);
		DAEUtil.addElement(root, this.libraryPhysicsMaterials);
		DAEUtil.addElement(root, this.libraryPhysicsModels);
		DAEUtil.addElement(root, this.libraryPhysicsScenes);
		DAEUtil.addElement(root, this.libraryVisualScenes);
		DAEUtil.addElement(root, this.scene);
		DAEUtil.addElement(root, this.extras);
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
