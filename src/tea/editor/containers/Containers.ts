import { Panel } from "./Panel";
import { HLayout } from "./HLayout";
import { VLayout } from "./VLayout";
import { Tabs, TabItem } from "./Tabs";
import { Window } from "./Window";

export {
	Panel,
	HLayout,
	VLayout,
	Tabs,
	TabItem,
	Window
}

export function getComponents(): Object {
	return {
		Panel: Panel,
		HLayout: HLayout,
		VLayout: VLayout,
		Tabs: Tabs,
		TabItem: TabItem,
		Window: Window,
	}
}
