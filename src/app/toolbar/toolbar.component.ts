import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Tool } from '../../core/tools/Tools';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {
  @Input() tools: Tool[];
  @Input() activeTool: Tool;
  @Output() selectTool: EventEmitter<Tool> = new EventEmitter();
}
