import { Component, OnInit, Input } from '@angular/core';
import { App } from '../../models/App';
import { Tool } from '../../models/Tools';

@Component({
  selector: 'app-tool-properties',
  templateUrl: './tool-properties.component.html',
  styleUrls: ['./tool-properties.component.css']
})
export class ToolPropertiesComponent implements OnInit {
  @Input() app: App;
  @Input() tool: Tool;

  constructor() { }

  ngOnInit() {
  }

}
