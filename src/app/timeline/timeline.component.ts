import { Component, OnInit, Input, HostListener } from '@angular/core';
import { InputStateService } from '../input-state.service';
import { Doc } from '../../core/Doc';
import { App } from '../../core/App';
import { Layer } from '../../core/Layer';


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  @Input() doc : Doc;
  @Input() app : App;

  selection: Layer[] = [];

  constructor(public inputState: InputStateService) { }

  ngOnInit() {

  }

  mousedown(e: MouseEvent, layer: Layer){
    this.inputState.takeFocus(this);
  
    if (e.shiftKey) {
      if (!this.selection.includes(layer)) {
        this.selection.push(layer);
      } else {
        this.selection.splice(this.selection.indexOf(layer), 1);
      }
    } else {
      this.selection = [layer];
    }
  }

  // we need to know if this gets dragged off the element
  @HostListener('window:mousemove', ['$event'])
  mousemove(e: MouseEvent, layer: Layer){
    if (this.inputState.hasFocus(this)) {
      console.log(layer);
    }
  }

  @HostListener('window:mouseup', ['$event'])
  mouseup(e: MouseEvent, layer: Layer){
    if (this.inputState.hasFocus(this)) {
      console.log(layer);
    }
  }

  @HostListener('window:keydown', ['$event'])
  keydown(e: KeyboardEvent) {

  }
}
