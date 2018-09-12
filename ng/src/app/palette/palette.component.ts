import { Component, OnInit, Input } from '@angular/core';
import { Color } from '../../models/Color';
import { App } from '../../models/App';

@Component({
  selector: 'app-palette',
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.css']
})
export class PaletteComponent implements OnInit {
  @Input() colors: Color[];
  @Input() app: App[];

  constructor() { }

  ngOnInit() {
  }

}
