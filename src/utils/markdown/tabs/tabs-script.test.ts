import { enableTabs } from "./tabs-script";

const tabsHtml = `
	<ul role="tablist" class="tabs__tab-list">
		<li role="tab" class="tabs__tab" data-tabname="angular" aria-selected="true" aria-controls="panel-0" id="tab-0" tabindex="0">Angular</li>
		<li role="tab" class="tabs__tab" data-tabname="react" aria-selected="false" aria-controls="panel-1" id="tab-1" tabindex="0">React</li>
		<li role="tab" class="tabs__tab" data-tabname="vue" aria-selected="false" aria-controls="panel-2" id="tab-2" tabindex="0">Vue</li>
	</ul>
	<div id="panel-0" role="tabpanel" class="tabs__tab-panel" tabindex="0" aria-labelledby="tab-0">
		Angular
	</div>
	<div id="panel-1" role="tabpanel" class="tabs__tab-panel" tabindex="0" aria-labelledby="tab-1" aria-hidden="true">
		React
	</div>
	<div id="panel-2" role="tabpanel" class="tabs__tab-panel" tabindex="0" aria-labelledby="tab-2" aria-hidden="true">
		Vue
	</div>
`;

function createTabs() {
	const tabs = document.createElement("div");
	tabs.className = "tabs";
	tabs.innerHTML = tabsHtml;
	document.body.appendChild(tabs);

	return {
		tabs,
		tab0: tabs.querySelector("#tab-0") as HTMLLIElement,
		tab1: tabs.querySelector("#tab-1") as HTMLLIElement,
		tab2: tabs.querySelector("#tab-2") as HTMLLIElement,
		panel0: tabs.querySelector("#panel-0") as HTMLDivElement,
		panel1: tabs.querySelector("#panel-1") as HTMLDivElement,
		panel2: tabs.querySelector("#panel-2") as HTMLDivElement,
	};
}

describe("tabs.ts", () => {
	test("enableTabs runs without errors", () => {
		createTabs();
		enableTabs();
	});

	test("switching tabs changes the aria-hidden panel value", () => {
		const tabs = createTabs();
		enableTabs();

		// the user clicks tab0
		tabs.tab0.click();
		// expectation: panel0 is displayed
		expect(tabs.panel0.getAttribute("aria-hidden")).toBeNull();
		expect(tabs.panel1.getAttribute("aria-hidden")).toBe("true");
		expect(tabs.panel2.getAttribute("aria-hidden")).toBe("true");

		// select tab1
		tabs.tab1.click();
		// expectation: panel1 is displayed
		expect(tabs.panel0.getAttribute("aria-hidden")).toBe("true");
		expect(tabs.panel1.getAttribute("aria-hidden")).toBeNull();
		expect(tabs.panel2.getAttribute("aria-hidden")).toBe("true");
	});

	test("switching tabs affects multiple tab containers", () => {
		const container1 = createTabs();
		const container2 = createTabs();
		enableTabs();

		// change to tab2 from the first container
		container1.tab2.click();
		// expectation: the first container is displaying panel2
		expect(container1.panel0.getAttribute("aria-hidden")).toBe("true");
		expect(container1.panel1.getAttribute("aria-hidden")).toBe("true");
		expect(container1.panel2.getAttribute("aria-hidden")).toBeNull();
		// expectation: the second container is displaying panel2
		expect(container2.panel0.getAttribute("aria-hidden")).toBe("true");
		expect(container2.panel1.getAttribute("aria-hidden")).toBe("true");
		expect(container2.panel2.getAttribute("aria-hidden")).toBeNull();

		// change to tab1 from the second container
		container2.tab1.click();
		// expectation: the first container is displaying panel1
		expect(container1.panel0.getAttribute("aria-hidden")).toBe("true");
		expect(container1.panel1.getAttribute("aria-hidden")).toBeNull();
		expect(container1.panel2.getAttribute("aria-hidden")).toBe("true");
		// expectation: the second container is displaying panel1
		expect(container2.panel0.getAttribute("aria-hidden")).toBe("true");
		expect(container2.panel1.getAttribute("aria-hidden")).toBeNull();
		expect(container2.panel2.getAttribute("aria-hidden")).toBe("true");
	});

	test("selected tab persists between pages", () => {
		const container1 = createTabs();
		enableTabs();

		// change to tab2 from the first container
		container1.tab2.click();
		// expectation: the first container is displaying panel2
		expect(container1.panel0.getAttribute("aria-hidden")).toBe("true");
		expect(container1.panel1.getAttribute("aria-hidden")).toBe("true");
		expect(container1.panel2.getAttribute("aria-hidden")).toBeNull();

		// remove the container1 tab container from the DOM
		container1.tabs.remove();

		// create & enable a new tab container (as if loading a new page)
		const container2 = createTabs();
		enableTabs();
		// expectation: the new container is also displaying panel2
		expect(container2.panel0.getAttribute("aria-hidden")).toBe("true");
		expect(container2.panel1.getAttribute("aria-hidden")).toBe("true");
		expect(container2.panel2.getAttribute("aria-hidden")).toBeNull();
	});
});
