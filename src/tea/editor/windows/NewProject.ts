import * as nodePath from "path";
import * as fs from "fs";
import * as Electron from "electron";
import Vue from "vue";
import Component from "vue-class-component";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div id="NewProject">
			<h1>New Project</h1>
			<div class="form">
				<div class="item">
					<div class="label">
						Project name
					</div>
					<div class="value">
						<input
							ref="name"
							type="text"
							placeholder="Project name"
							:value="projectName"
							@input="onInputProjectName">
					</div>
				</div>
				<div class="item">
					<div class="label">
						Location
					</div>
					<div class="value">
						<input
							ref="location"
							type="text"
							placeholder="Location"
							:value="location"
							@input="onInputLocation">
						<button
							@click="onClickSelectFolderButton">...</button>
					</div>
				</div>
				<div class="item createButton">
					<button
						ref="createButton"
						@click="onClickCreateButton">
						Create Project
					</button>
				</div>
			</div>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			projectName: "New Project",
			location: ""
		}
	}
})
export class NewProject extends Vue {
	static instance: NewProject;
	translator: any;
	projectName: string;
	location: string;

	translate(): void {
		var translator = Translator.getInstance();
		translator.basePath = "Windows/NewProject";
	}

	protected created(): void {
		//this.emitToParent("ready", null);
		this.translate();
		var path = this.getDocumentsPath();
		this.location = nodePath.resolve(path);
	}

	protected emitToParent(key: string, value: any): void {
		var data = {
			type: "newProject",
			key: key,
			value: value
		}
		window.opener.postMessage(data, "*");
	}

	protected getDocumentsPath(): string {
		return Electron.remote.app.getPath("documents");
	}

	protected showSelectFolderDialog(): void {
		var defaultPath = this.getDocumentsPath();
		var location = this.$refs.location as HTMLInputElement;
		var path = location.value;
		if (fs.existsSync(path)) {
			defaultPath = path;
		}

		var browserWindow = Electron.remote.getCurrentWindow();
		var options: Electron.OpenDialogOptions = {
			defaultPath: defaultPath,
			title: "Select folder",
			message: "Select folder",
			properties: ["openDirectory", "createDirectory"],
			filters: [
			]
		};
		Electron.remote.dialog.showOpenDialog(
			browserWindow, options,
			this.onCloseSelectFolderDialog
		);
	}

	protected onInputProjectName(): void {
		console.log("onInputProjectName");
		var name = this.$refs.name as HTMLInputElement;
		var createButton = this.$refs.createButton as HTMLButtonElement;
		if (name.value === "") {
			createButton.disabled = true;
		} else {
			createButton.disabled = false;
		}
	}

	protected onInputLocation(): void {
		console.log("onInputLocation");
		var location = this.$refs.location as HTMLInputElement;
		var createButton = this.$refs.createButton as HTMLButtonElement;
		var path = location.value;
		if (path === "" || fs.existsSync(path) === false) {
			createButton.disabled = true;
		} else {
			createButton.disabled = false;
		}
	}

	protected onClickSelectFolderButton(): void {
		console.log("onClickSelectFolderButton");
		this.showSelectFolderDialog();
	}

	protected onClickCreateButton(): void {
		console.log("onClickCreateButton");
		var name = this.$refs.name as HTMLInputElement;
		var location = this.$refs.location as HTMLInputElement;
		var path = nodePath.join(location.value, name.value);
		console.log(path);
		if (fs.existsSync(path) === false) {
			fs.mkdirSync(path, { recursive: true });
		}
		var assetsPath = nodePath.join(path, "assets");
		if (fs.existsSync(assetsPath) === false) {
			fs.mkdirSync(assetsPath, { recursive: true });
		}
		Electron.ipcRenderer.sendSync("chdir", path);
		Electron.ipcRenderer.sendSync("showMainWindow");
		window.close();
	}

	protected onCloseSelectFolderDialog = (filePaths: string[]): void => {
		if (filePaths == null || filePaths.length < 1) {
			return;
		}
		var path = filePaths[0];
		this.location = path;
		var location = this.$refs.location as HTMLInputElement;
		location.value = path;
	}
}

var loaded = () => {
	document.removeEventListener(
		"DOMContentLoaded", loaded
	);
	var id = "#NewProject";
	var main = document.querySelector(id);
	if (main) {
		NewProject.instance = new NewProject({
			el: id
		});
	}
};
document.addEventListener(
	"DOMContentLoaded", loaded
);
