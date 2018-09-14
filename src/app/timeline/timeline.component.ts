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
  isMouseDown: boolean = false;
  isDragging: boolean = false;
  dragStartedOnLayer: Layer = null;

  constructor(public inputState: InputStateService) { }

  ngOnInit() {
  }

  mousedown(e: MouseEvent, layer: Layer) {
    this.inputState.takeFocus(this);
    this.isMouseDown = true;
    this.dragStartedOnLayer = layer;
  }

  mouseEventPositionInElementNormalized(e: MouseEvent, el: Element) {
    var elRect = el.getBoundingClientRect();
    return new Vec((e.pageX - elRect.left) / elRect.width, (e.pageY - elRect.top) / elRect.height);
  }

  @HostListener('window:mousemove', ['$event'])
  mousemove(e: MouseEvent, layer: Layer) {
    // NOTE: this can come in with/without layer undefined, meaning it's an event from outside the div...
    if (this.inputState.hasFocus(this)) {
      if (this.isMouseDown) {
        this.isDragging = true;
      }

      if (this.isDragging) {
        if (layer) {
          this.dragDropIndex = this.doc.layers.indexOf(layer);
          if (this.mouseEventPositionInElementNormalized(e, <Element>e.target).y > 0.5) {
            this.dragDropIndex += 1;
          }
        }
      }
    }
  }

  handleShiftSelect(e: MouseEvent, layer: Layer) {
    if (e.shiftKey) {
      if (!this.selection.includes(layer)) {
        this.selection.push(layer);
      } else {
        this.selection.splice(this.selection.indexOf(layer), 1);
      }
    } else {
      this.selection = [layer];
    }
    this.doc.activeLayer = layer;
  }

  resetDragDrop() {
    this.dragDropIndex = -1;
    this.isDragging = false;
    this.dragStartedOnLayer = null;
  }

  @HostListener('window:mouseup', ['$event'])
  mouseup(e: MouseEvent, layer: Layer) {
    this.isMouseDown = false;
    // NOTE: this can come in with/without layer undefined, meaning it's an event from outside the div...
    if (this.inputState.hasFocus(this)) {
      this.inputState.releaseFocus(this);

      if (!this.isDragging) {
        this.handleShiftSelect(e, layer);
      } else if (this.isDragging) {

        if (layer) {
          if (this.dragStartedOnLayer == layer) {
            this.handleShiftSelect(e, layer);
          } else {
            this.doc.historyPush("Rearrange Layers");

            // if you click dragged from a non-selected layer, we select that and move that instead
            if (!this.selection.includes(this.dragStartedOnLayer)) {
              this.selection = [this.dragStartedOnLayer];
            }

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
          }
        }
      }

      // and no matter what we end here
      this.resetDragDrop();
    }
  }

  deleteSelectedLayers() {
    this.doc.historyPush("Delete Layers");
    this.doc.layers = this.doc.layers.filter(l => !this.selection.includes(l));
    this.selection = [];
  }

  @HostListener('window:keydown', ['$event'])
  keydown(e: KeyboardEvent) {
    //if (this.inputState.hasFocus(this)){
    if (e.keyCode == 8 || e.keyCode == 46) { // delete or backspace
      this.deleteSelectedLayers();
    }
    //}
  }
}
