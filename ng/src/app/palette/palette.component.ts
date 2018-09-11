import { Component, OnInit, Input } from '@angular/core';
import { Color } from '../../models/Color';

@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.css']
})
export class PaletteComponent implements OnInit {
  @Input() colors: Color[];

  constructor() { }

  ngOnInit() {
  }

}
