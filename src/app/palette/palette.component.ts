import { Component, OnInit, Input } from '@angular/core';
import { Color } from '../../core/Color';
import { App } from '../../core/App';

@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.css']
})
export class PaletteComponent implements OnInit {
  @Input() colors: Color[];
  @Input() app: App;

  constructor() { }

  ngOnInit() {
  }

  pickColor(color: Color) {
    this.app.colorFg = color;
  }
}
