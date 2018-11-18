import * as nodePath from "path";
import * as fs from "fs";
import * as Electron from "electron";
import Vue from "vue";
import Component from "vue-class-component";
import { EditorSettings } from "../EditorSettings";
import { Translator } from "../translate/Translator";

@Component({
	template: `
		<div id="NewProject">
			<div class="type">
				<input
					ref="radioNew"
					id="radioTypeNew"
					type="radio"
					name="type"
					value="new"
					checked="checked"
					@change="onChangeType">
				<label for="radioTypeNew">{{ translator.new }}</label>
				<input
					ref="radioOpen"
					id="radioTypeOpen"
					type="radio"
					name="type"
					value="open"
					@change="onChangeType">
				<label for="radioTypeOpen">{{ translator.open }}</label>
			</div>
			<div v-if="type === 'new'">
				<h1>{{ translator.newProject }}</h1>
				<div class="form">
					<div class="item">
						<div class="label">
							{{ translator.projectName }}
						</div>
						<div class="value">
							<input
								ref="name"
								type="text"
								:placeholder="translator.projectName"
								:value="projectName"
								@input="onInputProjectName">
						</div>
					</div>
					<div class="item">
						<div class="label">
							{{ translator.location }}
						</div>
						<div class="value">
							<input
								ref="location"
								type="text"
								:placeholder="translator.location"
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
							{{ translator.createProject }}
						</button>
					</div>
				</div>
			</div>
			<div v-if="type === 'open'">
				<h1>{{ translator.openProject }}</h1>
				<div class="form">
					<div class="item">
						<div class="label">
							{{ translator.location }}
						</div>
						<div class="value">
							<input
								ref="locationOpen"
								type="text"
								:placeholder="translator.location"
								:value="location"
								@input="onInputLocationOpen">
							<button
								@click="onClickSelectFolderButton">...</button>
						</div>
					</div>
					<div class="item createButton">
						<button
							ref="openButton"
							@click="onClickOpenButton">
							{{ translator.openProject }}
						</button>
					</div>
				</div>
			</div>
		</div>
	`,
	data: () => {
		return {
			translator: {},
			type: "new",
			projectName: "New Project",
			location: ""
		}
	}
})
export class NewProject extends Vue {
	static instance: NewProject;
	translator: any;
	type: string;
	projectName: string;
	location: string;

	translate(): void {
		var settings = EditorSettings.getInstance();
		settings.load();
		var translator = Translator.getInstance();
		if (settings.language) {
			translator.loadResource(settings.language);
		}
		translator.basePath = "Windows/NewProject";
		this.translator.new = translator.getText("New");
		this.translator.open = translator.getText("Open");
		this.translator.newProject = translator.getText("NewProject");
		this.translator.openProject = translator.getText("OpenProject");
		this.translator.createProject = translator.getText("CreateProject");
		this.translator.projectName = translator.getText("ProjectName");
		this.translator.location = translator.getText("Location");
	}

	protected created(): void {
		//this.emitToParent("ready", null);
		this.translate();
		var path = this.getDocumentsPath();
		this.location = nodePath.resolve(path);
		if (location.hash === "#open") {
			this.$nextTick(() => {
				var radioOpen = this.$refs.radioOpen as HTMLInputElement;
				radioOpen.checked = true;
			});
			this.type = "open";
		}
	}

	protected updated(): void {
		if (this.type === "new") {
			this.onInputLocation();
		} else {
			this.onInputLocationOpen();
		}
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

	protected createProjectFolder(path: string): void {
		//console.log(path);
		if (fs.existsSync(path) === false) {
			fs.mkdirSync(path, { recursive: true });
		}
		var assetsPath = nodePath.join(path, "assets");
		if (fs.existsSync(assetsPath) === false) {
			fs.mkdirSync(assetsPath, { recursive: true });
		}
	}

	protected showSelectFolderDialog(): void {
		var defaultPath = this.getDocumentsPath();
		var location = this.$refs.location as HTMLInputElement;
		if (this.type === "open") {
			location = this.$refs.locationOpen as HTMLInputElement;
		}
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

	protected isValidProjectNameAndLocation(): boolean {
		var name = this.$refs.name as HTMLInputElement;
		var location = this.$refs.location as HTMLInputElement;
		var path = location.value;
		if (name.value === ""
		||  path === ""
		||  fs.existsSync(path) === false) {
			return true;
		}
		return false;
	}

	protected onChangeType(): void {
		var radioNew = this.$refs.radioNew as HTMLInputElement;
		//var radioOpen = this.$refs.radioOpen as HTMLInputElement;
		if (radioNew.checked) {
			this.type = "new";
		} else {
			this.type = "open";
		}
	}

	protected onInputProjectName(): void {
		console.log("onInputProjectName");
		var name = this.$refs.name as HTMLInputElement;
		var createButton = this.$refs.createButton as HTMLButtonElement;
		if (this.isValidProjectNameAndLocation()) {
			createButton.disabled = true;
		} else {
			createButton.disabled = false;
		}
		this.projectName = name.value;
	}

	protected onInputLocation(): void {
		console.log("onInputLocation");
		var location = this.$refs.location as HTMLInputElement;
		var createButton = this.$refs.createButton as HTMLButtonElement;
		if (this.isValidProjectNameAndLocation()) {
			createButton.disabled = true;
		} else {
			createButton.disabled = false;
		}
		this.location = location.value;
	}

	protected onInputLocationOpen(): void {
		var location = this.$refs.locationOpen as HTMLInputElement;
		var openButton = this.$refs.openButton as HTMLButtonElement;
		var path = location.value;
		if (path === "" || fs.existsSync(path) === false) {
			openButton.disabled = true;
		} else {
			openButton.disabled = false;
		}
		this.location = path;
	}

	protected onClickSelectFolderButton(): void {
		console.log("onClickSelectFolderButton");
		this.showSelectFolderDialog();
	}

	protected onClickCreateButton(): void {
		console.log("onClickCreateButton");
		var createButton = this.$refs.createButton as HTMLButtonElement;
		createButton.disabled = true;
		var name = this.$refs.name as HTMLInputElement;
		var location = this.$refs.location as HTMLInputElement;
		var path = nodePath.join(location.value, name.value);
		this.createProjectFolder(path);
		Electron.ipcRenderer.sendSync("chdir", path);
		Electron.ipcRenderer.sendSync("showWindow", "main");
		window.close();
	}

	protected onClickOpenButton(): void {
		var openButton = this.$refs.openButton as HTMLButtonElement;
		openButton.disabled = true;
		var location = this.$refs.locationOpen as HTMLInputElement;
		var path = nodePath.join(location.value);
		Electron.ipcRenderer.sendSync("chdir", path);
		Electron.ipcRenderer.sendSync("showWindow", "main");
		window.close();
	}

	protected onCloseSelectFolderDialog(filePaths: string[]): void {
		if (filePaths == null || filePaths.length < 1) {
			return;
		}
		var path = filePaths[0];
		this.location = path;
		var location = this.$refs.location as HTMLInputElement;
		if (this.type === "open") {
			location = this.$refs.locationOpen as HTMLInputElement;
		}
		location.value = path;
	}
}

var loaded = () => {
	document.removeEventListener(
		"DOMContentLoaded", loaded
	);
	var id = "#NewProject";
	var main = document.querySelector(id);
	if (main == null) {
		return;
	}
	NewProject.instance = new NewProject({
		el: id
	});
};
document.addEventListener(
	"DOMContentLoaded", loaded
);
