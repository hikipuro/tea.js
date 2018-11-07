export class Translator {
	protected static _instance: Translator;
	lang: string;
	basePath: string;
	protected _defaultResource: any;
	protected _resource: any;

	constructor() {
		this.lang = "en";
		this.basePath = null;
		this._defaultResource = Translator.en.getResource();
		this._resource = {};
	}

	static getInstance(): Translator {
		if (Translator._instance) {
			return Translator._instance;
		}
		Translator._instance = new Translator();
		return Translator._instance;
	}

	loadResource(lang: string): void {
		if (Translator[lang] == null) {
			console.warn("Translator.loadResource(): lang not found '" + lang + "'");
			return;
		}
		this.lang = lang;
		this._resource = Translator[lang].getResource();
	}

	getText(path: string): string {
		if (this.basePath) {
			path = this.basePath + "/" + path;
		}
		return this.findText(path);
	}

	protected findText(path: string): string {
		if (path == null || path === "") {
			return "";
		}
		var resource = this._resource;
		var e = path.split("/");
		var length = e.length;
		for (var i = 0; i < length; i++) {
			resource = resource[e[i]];
			if (resource == null) {
				break;
			}
		}
		if (resource) {
			return resource;
		}
		resource = this._defaultResource;
		for (var i = 0; i < length; i++) {
			resource = resource[e[i]];
			if (resource == null) {
				break;
			}
		}
		if (resource) {
			if (typeof resource !== "string") {
				return JSON.stringify(resource);
			}
			return resource;
		}
		return "";
	}
}

export module Translator {
	export class en {
		static getResource(): any {
			return {
				Tabs: {
					Player: "Player",
					Scene: "Scene",
					Project: "Project",
					Console: "Console"
				},
				SelectAspect: {
					"Free Aspect": "Free Aspect"
				},
				HierarchyView: {
					ContextMenu: {
						Delete: "Delete",
						"Create Empty": "Create Empty",
						"3D Object": {
							Title: "3D Object",
							Cube: "Cube",
							Sphere: "Sphere",
							Capsule: "Capsule",
							Cylinder: "Cylinder",
							Plane: "Plane",
							Quad: "Quad",
							Text: "Text"
						},
						Effects: {
							Title: "Effects",
							"Particle System": "Particle System"
						},
						Light: {
							Title: "Light",
							"Directional Light": "Directional Light",
							"Point Light": "Point Light",
							"Spot Light": "Spot Light"
						},
						Camera: {
							Title: "Camera"
						}
					}
				},
				ObjectInspector: {
					Position: "Position",
					Rotation: "Rotation",
					Scale: "Scale",
					"Add Component": "Add Component",
					ComponentMenu: {
						"Remove Component": "Remove Component"
					},
					AddComponentMenu: {
						Audio: {
							Title: "Audio",
							"Audio Source": "Audio Source"
						},
						Effects: {
							Title: "Effects"
						},
						Mesh: {
							Title: "Mesh"
						},
						Physics: {
							Title: "Physics"
						},
						Rendering: {
							Title: "Rendering"
						}
					}
				}
			}
		}
	}

	export class ja {
		static getResource(): any {
			return {
				Tabs: {
					Player: "再生",
					Scene: "シーン編集",
					Project: "プロジェクト",
					Console: "コンソール"
				},
				SelectAspect: {
					"Free Aspect": "アスペクト比可変"
				},
				HierarchyView: {
					ContextMenu: {
						Delete: "削除",
						"Create Empty": "空オブジェクト",
						"3D Object": {
							Title: "3Dオブジェクト",
							Cube: "立方体",
							Sphere: "球",
							Capsule: "カプセル",
							Cylinder: "円柱",
							Plane: "平面 (Plane)",
							Quad: "平面 (Quad)",
							Text: "テキスト"
						},
						Effects: {
							Title: "エフェクト",
							"Particle System": "パーティクルシステム"
						},
						Light: {
							Title: "ライト",
							"Directional Light": "平行光源",
							"Point Light": "点光源",
							"Spot Light": "スポットライト"
						},
						Camera: {
							Title: "カメラ"
						}
					}
				},
				ObjectInspector: {
					Position: "位置",
					Rotation: "回転",
					Scale: "拡大率",
					"Add Component": "コンポーネントの追加",
					ComponentMenu: {
						"Remove Component": "コンポーネントの削除"
					},
					AddComponentMenu: {
						Audio: {
							Title: "オーディオ"
						},
						Effects: {
							Title: "エフェクト"
						},
						Mesh: {
							Title: "メッシュ"
						},
						Physics: {
							Title: "物理"
						},
						Rendering: {
							Title: "レンダリング"
						}
					}
				}
			}
		}
	}
}
