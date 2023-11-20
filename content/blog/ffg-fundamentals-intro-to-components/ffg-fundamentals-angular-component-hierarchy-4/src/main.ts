import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'file-date',
  standalone: true,
  template: `<span>12/03/21</span>`,
})
export class FileDateComponent {}

@Component({
  selector: 'file',
  standalone: true,
  imports: [FileDateComponent],
  template: `
    <div>
      <a href="/file/file_one">File one<file-date/></a>
    </div>
  `,
})
export class FileComponent {}

@Component({
  selector: 'file-list',
  standalone: true,
  imports: [FileComponent],
  template: `
    <ul>
      <li><file/></li>
      <li><file/></li>
      <li><file/></li>
    </ul>
  `,
})
export class FileListComponent {}

bootstrapApplication(FileListComponent);
