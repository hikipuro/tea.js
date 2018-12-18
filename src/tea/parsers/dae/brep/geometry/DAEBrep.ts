import { DAEUtil } from "../../DAEUtil";
import { DAECurves } from "../curves/DAECurves";
import { DAESurfaceCurves } from "../curves/DAESurfaceCurves";
import { DAESurfaces } from "../surfaces/DAESurfaces";
import { DAESource } from "../../core/data/DAESource";
import { DAEVertices } from "../../core/geometry/DAEVertices";
import { DAEEdges } from "../topology/DAEEdges";
import { DAEWires } from "../topology/DAEWires";
import { DAEFaces } from "../topology/DAEFaces";
import { DAEPcurves } from "../topology/DAEPcurves";
import { DAEShells } from "../topology/DAEShells";
import { DAESolids } from "../topology/DAESolids";
import { DAEExtra } from "../../core/extensibility/DAEExtra";

// parent: geometry
export class DAEBrep {
	static readonly TagName: string = "brep";
	curves?: DAECurves;
	surfaceCurves?: DAESurfaceCurves;
	surfaces?: DAESurfaces;
	sources: Array<DAESource>;
	vertices: DAEVertices;
	edges?: DAEEdges;
	wires?: DAEWires;
	faces?: DAEFaces;
	pcurves?: DAEPcurves;
	shells?: DAEShells;
	solids?: DAESolids;
	extras?: Array<DAEExtra>;

	constructor() {
		this.curves = null;
		this.surfaceCurves = null;
		this.surfaces = null;
		this.sources = null;
		this.vertices = null;
		this.edges = null;
		this.wires = null;
		this.faces = null;
		this.pcurves = null;
		this.shells = null;
		this.solids = null;
		this.extras = null;
	}

	static parse(el: Element): DAEBrep {
		if (el == null) {
			return null;
		}
		var value = new DAEBrep();
		value.curves = DAECurves.parse(
			DAEUtil.queryChildSelector(el, DAECurves.TagName)
		);
		value.surfaceCurves = DAESurfaceCurves.parse(
			DAEUtil.queryChildSelector(el, DAESurfaceCurves.TagName)
		);
		value.surfaces = DAESurfaces.parse(
			DAEUtil.queryChildSelector(el, DAESurfaces.TagName)
		);
		value.sources = DAESource.parseArray(el);
		value.vertices = DAEVertices.parse(
			DAEUtil.queryChildSelector(el, DAEVertices.TagName)
		);
		value.edges = DAEEdges.parse(
			DAEUtil.queryChildSelector(el, DAEEdges.TagName)
		);
		value.wires = DAEWires.parse(
			DAEUtil.queryChildSelector(el, DAEWires.TagName)
		);
		value.faces = DAEFaces.parse(
			DAEUtil.queryChildSelector(el, DAEFaces.TagName)
		);
		value.pcurves = DAEPcurves.parse(
			DAEUtil.queryChildSelector(el, DAEPcurves.TagName)
		);
		value.shells = DAEShells.parse(
			DAEUtil.queryChildSelector(el, DAEShells.TagName)
		);
		value.solids = DAESolids.parse(
			DAEUtil.queryChildSelector(el, DAESolids.TagName)
		);
		value.extras = DAEExtra.parseArray(el);
		return value;
	}

	toXML(): Element {
		var el = document.createElement(DAEBrep.TagName);
		DAEUtil.addElement(el, this.curves);
		DAEUtil.addElement(el, this.surfaceCurves);
		DAEUtil.addElement(el, this.surfaces);
		DAEUtil.addElementArray(el, this.sources);
		DAEUtil.addElement(el, this.vertices);
		DAEUtil.addElement(el, this.edges);
		DAEUtil.addElement(el, this.wires);
		DAEUtil.addElement(el, this.faces);
		DAEUtil.addElement(el, this.pcurves);
		DAEUtil.addElement(el, this.shells);
		DAEUtil.addElement(el, this.solids);
		DAEUtil.addElementArray(el, this.extras);
		return el;
	}
}
