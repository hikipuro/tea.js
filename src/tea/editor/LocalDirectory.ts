import * as fs from "fs";
import * as nodePath from "path";

export class FileInfo {
	exists: boolean;
	fullName: string;

	constructor(path: string) {
		if (fs.existsSync(path) === false) {
			this.exists = false;
			this.fullName = "";
			return;
		}
		this.exists = true;
		this.fullName = path;
	}

	get name(): string {
		return nodePath.basename(this.fullName);
	}

	get extension(): string {
		return nodePath.extname(this.fullName);
	}

	get directoryName(): string {
		return nodePath.dirname(this.fullName);
	}

	get isDirectory(): boolean {
		var stat = fs.statSync(this.fullName);
		return stat.isDirectory();
	}

	get length(): number {
		var stat = fs.statSync(this.fullName);
		return stat.size;
	}

	get hasChildDirectory(): boolean {
		var path = this.fullName;
		var files = fs.readdirSync(path);
		return files.find((file) => {
			file = nodePath.join(path, file);
			return fs.statSync(file).isDirectory();
		}) != null;
	}
}

export class LocalDirectory {
	static getFiles(path: string, callback: (files: Array<FileInfo>) => void): void {
		fs.exists(path, exists => {
			if (exists === false) {
				callback(null);
				return;
			}
			var fileInfoList = [];
			fs.readdir(path, (err, files: Array<string>) => {
				if (err) {
					callback(null);
					return;
				}
				files.forEach((file: string) => {
					file = nodePath.join(path, file);
					//file = nodePath.resolve(file);
					var fileInfo = new FileInfo(file);
					fileInfoList.push(fileInfo);
				});
				callback(fileInfoList);
			});
		});
	}

	static getFilesSync(path: string): Array<FileInfo> {
		if (fs.existsSync(path) === false) {
			return null;
		}
		var fileInfoList = [];
		var files = fs.readdirSync(path);
		files.forEach(file => {
			file = nodePath.join(path, file);
			//file = nodePath.resolve(file);
			var fileInfo = new FileInfo(file);
			fileInfoList.push(fileInfo);
		});
		return fileInfoList;
	}
}

var  _FileInfo = FileInfo;
type _FileInfo = FileInfo;
export module LocalDirectory {
	export var  FileInfo = _FileInfo;
	export type FileInfo = _FileInfo;
}
