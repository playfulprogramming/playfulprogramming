---
{
  title: "LibTracker Updates 11/25/24: Get to personally know your apps with this simple SBOM Tool",
  description: "Updates to the LibTracker Vscode Extension. Simplify dependency management with this simple SBOM tool",
  published: '2024-12-2',
  tags: ["LibTracker","SBOM","DependencyManagement","SoftwareLicenses","SecurityVulnerabilities","VisualStudioCode","VSCodeExtensions","SoftwareDevelopment","OpenSource","SoftwareEngineering","ApplicationManagement","DevTools","GitIntegration","CVEInsights","SoftwareBillOfMaterials","DeveloperTools"],
  collection: "LibTracker",
  license: 'cc-by-4'
}
---


We are excited to announce the latest updates to *LibTracker*, our VSCode extension designed for professionals to simplify software bill of materials (SBOM) management. With LibTracker, you can effortlessly analyze and manage your apps, ensuring up-to-date versions, addressing security vulnerabilities, and resolving licensing issues—all at a glance.

Access it here: [LibTracker on VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=windmillcode-publisher-0.lib-tracker)

![Demo](./demo.gif)

### New Features in the Latest Release:
- **Grouped Paths**: Added the ability to associate multiple apps with a root folder, easing project transfers between computers.
- **App Detail Page**:
  - **Subdependency Information**: View detailed info and license info for subdependencies.
  - Toggle between root and subdependency data to explore license and CVE details.

- **Bulk Group Path Update**:
  - Recursively searches for app basenames within directories. or the exact subPath. Can specify a recusion level

### Upcoming Features:
- **App Detail Page Enhancements**:
  - Integration of CVE details for all dependencis and subdependencies.
  - Search functionality extended to include nested child rows.
  - Expand and collapse all subtables within rows for streamlined navigation.
  - Responsive design updates to allow a card-based layout for improved usability.
- **Toggle Select All Apps**: Introducing a select-all option on the project detail page.
- **Workspace Folder Management**: Development depends on VSCode API’s ability to support VSCode profiles.
- **SBOM Generation**: Generating SBOM


### Future Milestones (Exploring Feasibility):
- **Git Backup Changes**: Enhancements to streamline version control and backup capabilities.
- **AI-Powered Summaries**: Considering automated generation of license and CVE category summaries.
- **Subdependency Navigation**: Exploring the possibility of linking subdependencies in the license pane to their locations in the dependency table
- **Advanced Table Features** - the current package does not support
  - child row search
  - expand and collapse all subtables in a given row
  - responsiveness (remove columns or using cards at a certain viewport)
