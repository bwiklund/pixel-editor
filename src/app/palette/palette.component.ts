import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Color } from '../../core';

@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.css']
})
export class PaletteComponent {
  @Input() colors: Color[];
  @Input() currentColor: Color[];
  @Output() pickColor: EventEmitter<Color> = new EventEmitter();
}
