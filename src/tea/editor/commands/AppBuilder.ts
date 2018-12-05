import * as Electron from "electron";
import { Directory } from "../Directory";
import { NativeFile } from "../NativeFile";

export class AppBuilder {
	appPath: string;
	targetPath: string;

	constructor() {
		this.appPath = Electron.remote.app.getAppPath();
	}

	build(): boolean {
		var targetPath = this.targetPath;
		if (targetPath == null || NativeFile.exists(targetPath) === false) {
			return false;
		}
		this.copyAppFile("html/build.html", "index.html");
		this.copyAppFile("html/build.js", "tea.js");
		this.copyFolder("assets", this.targetPath);
		return true;
	}

	protected copyAppFile(src: string, dest: string): void {
		var appPath = this.appPath;
		var srcPath = NativeFile.join(appPath, src);
		var destPath = this.targetPath;
		destPath = NativeFile.join(destPath, dest);
		NativeFile.copyFile(srcPath, destPath);
	}

	protected copyFolder(src: string, dest: string): void {
		if (NativeFile.isFolder(src)) {
			var files = Directory.getFilesSync(src);
			files.forEach((file: Directory.FileInfo) => {
				var srcPath = NativeFile.join(src, file.name);
				var destPath = "";
				if (NativeFile.isFolder(srcPath)) {
					destPath = NativeFile.join(dest, file.name);
					NativeFile.copyFile(srcPath, destPath);
					this.copyFolder(srcPath, destPath);
					return;
				}
				destPath = NativeFile.join(dest, file.name);
				NativeFile.copyFile(srcPath, destPath);
			});
		} else {
			NativeFile.copyFile(src, dest);
		}
	}

	protected findScriptPaths(data: any): Array<string> {
		var find = (children: Array<any>): Array<string> => {
			if (children == null || children.length <= 0) {
				return [];
			}
			var scripts = [];
			var length = children.length;
			for (var i = 0; i < length; i++) {
				var child = children[i];
				if (child._type !== "Object3D") {
					continue;
				}
				var components = child.components as Array<any>;
				if (components == null || components.length <= 0) {
					continue;
				}
				scripts.push.apply(scripts,
					components.filter((component: any) => {
						return component._type === "Script";
					}
				));
			}
			var paths = scripts.map((script: any) => {
				return script.path;
			});
			for (var i = 0; i < length; i++) {
				var child = children[i];
				paths.push.apply(paths, find(child.children));
			}
			return paths;
		};
		return find(data.children);
	}
}
