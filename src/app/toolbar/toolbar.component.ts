import { Component, OnInit, Input } from '@angular/core';
import { Tool } from '../../models/Tools';
import { App } from '../../models/App';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  @Input() tools: Tool[];
  @Input() app: App;

  constructor() { }

  ngOnInit() {
  }

}
