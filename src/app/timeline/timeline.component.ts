import { Component, OnInit, Input, HostListener } from '@angular/core';
import { InputStateService } from '../input-state.service';
import { Doc } from '../../core/Doc';
import { Vec } from '../../core/Vec';
import { App } from '../../core/App';
import { Layer } from '../../core/Layer';


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  @Input() doc: Doc;
  @Input() app: App;

  selection: Layer[] = [];
  dragDropIndex: number = -1;

  constructor(public inputState: InputStateService) { }

  ngOnInit() {
  }

  mousedown(e: MouseEvent, layer: Layer) {
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

  mouseEventPositionInElementNormalized(e: MouseEvent, el: Element) {
    var elRect = el.getBoundingClientRect();
    return new Vec((e.pageX - elRect.left) / elRect.width, (e.pageY - elRect.top) / elRect.height);
  }

  @HostListener('window:mousemove', ['$event'])
  mousemove(e: MouseEvent, layer: Layer) {
    // NOTE: this can come in with/without layer undefined, meaning it's an event from outside the div...
    if (this.inputState.hasFocus(this)) {
      if (layer) {
        this.dragDropIndex = this.doc.layers.indexOf(layer);
        if (this.mouseEventPositionInElementNormalized(e, <Element>e.target).y > 0.5) {
          this.dragDropIndex += 1;
        }
      }
    }
  }

  @HostListener('window:mouseup', ['$event'])
  mouseup(e: MouseEvent, layer: Layer) {
    // NOTE: this can come in with/without layer undefined, meaning it's an event from outside the div...
    if (this.inputState.hasFocus(this)) {
      if (layer) {
        this.doc.historyPush("Rearrange Layers");

        var targetIndexInNewLayers = this.doc.layers.indexOf(layer);
        if (this.mouseEventPositionInElementNormalized(e, <Element>e.target).y > 0.5) {
          targetIndexInNewLayers += 1;
        }

        // make a list of layers where selected stuff is nulled out.
        // that way we can still insert in the right place without creating a
        // surprisingly complicated problem
        // (what if you drag a mixed selection onto one of them? the end? the start? etc)
        var reorderedLayers = this.doc.layers.map(l => this.selection.includes(l) ? null : l);

        // insert the new layers
        reorderedLayers.splice(targetIndexInNewLayers, 0, ...this.selection);

        // only NOW can we remove the null placeholders that made our indexes consistent
        reorderedLayers = reorderedLayers.filter(l => l != null);

        // and we're done
        this.doc.layers = reorderedLayers;

        // reset dragdrop
        this.dragDropIndex = -1;
      }
      this.inputState.releaseFocus(this);
    }
  }

  @HostListener('window:keydown', ['$event'])
  keydown(e: KeyboardEvent) {

  }
}
