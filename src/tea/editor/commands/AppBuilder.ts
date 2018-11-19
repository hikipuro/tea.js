import * as fs from "fs";
import * as nodePath from "path";
import * as Electron from "electron";

export class AppBuilder {
	appPath: string;
	targetPath: string;

	constructor() {
		this.appPath = Electron.remote.app.getAppPath();
	}

	build(): boolean {
		var targetPath = this.targetPath;
		if (targetPath == null || fs.existsSync(targetPath) === false) {
			return false;
		}
		this.copyAppFile("html/build.html", "index.html");
		this.copyAppFile("html/build.js", "tea.js");
		this.copyFolder("assets", this.targetPath);
		return true;
	}

	protected copyAppFile(src: string, dest: string): void {
		var appPath = this.appPath;
		var srcPath = nodePath.join(appPath, src);
		var destPath = this.targetPath;
		destPath = nodePath.join(destPath, dest);
		fs.copyFileSync(srcPath, destPath);
	}

	protected copyFolder(src: string, dest: string): void {
		var stat = fs.statSync(src);
		if (stat.isDirectory()) {
			var files = fs.readdirSync(src);
			files.forEach((file: string) => {
				var srcPath = nodePath.join(src, file);
				var destPath = "";
				stat = fs.statSync(srcPath);
				if (stat.isDirectory()) {
					destPath = nodePath.join(dest, file);
					fs.copyFileSync(srcPath, destPath);
					this.copyFolder(srcPath, destPath);
					return;
				}
				destPath = nodePath.join(dest, file);
				fs.copyFileSync(srcPath, destPath);
			});
		} else {
			fs.copyFileSync(src, dest);
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
