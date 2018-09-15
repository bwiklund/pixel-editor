import { Component, Input } from '@angular/core';
import { Tool } from '../../core/tools/Tools';

@Component({
  selector: 'app-tool-properties',
  templateUrl: './tool-properties.component.html',
  styleUrls: ['./tool-properties.component.css']
})
export class ToolPropertiesComponent {
  @Input() tool: Tool;
}
