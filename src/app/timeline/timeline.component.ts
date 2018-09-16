import { Component, Input, HostListener } from '@angular/core';
import { InputStateService } from '../input-state.service';
import { Doc, Vec, Layer } from '../../core/core';


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent {
  @Input() doc: Doc;

  // TODO: should selection be kept track of by Doc itself? since things deleting layers elsewhere could get this out of sync!!!
  selection: Layer[] = [];
  dragDropIndex: number = -1;
  isMouseDown: boolean = false;
  isDragging: boolean = false;
  dragStartedOnLayer: Layer = null;

  constructor(public inputState: InputStateService) { }

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

  @HostListener('window:mouseup', ['$event'])
  mouseup(e: MouseEvent, layer: Layer) {
    this.isMouseDown = false;
    // NOTE: this can come in with/without `layer` defined,
    // meaning it's an event from outside the div if undefined
    if (this.inputState.hasFocus(this)) {
      this.inputState.releaseFocus(this);

      if (!this.isDragging) {
        this.handleShiftSelect(e, layer);
      } else if (this.isDragging) {

        if (layer) {
          if (this.dragStartedOnLayer == layer) {
            this.handleShiftSelect(e, layer);
          } else {
            
            var targetIndexInNewLayers = this.doc.layers.indexOf(layer);
            if (this.mouseEventPositionInElementNormalized(e, <Element>e.target).y > 0.5) {
              targetIndexInNewLayers += 1;
            }

            this.reorderLayers(targetIndexInNewLayers);
          }
        } else {
          //event was fired from outside the div
          // maybe actually we can ignore this
        }
      }

      // and no matter what we end here
      this.resetDragDrop();
    }
  }

  resetDragDrop() {
    this.dragDropIndex = -1;
    this.isDragging = false;
    this.dragStartedOnLayer = null;
  }

  handleShiftSelect(e: MouseEvent, layer: Layer) {
    if (e.shiftKey) {
      if (!this.selection.includes(layer)) {
        this.selection.push(layer);
      } else {
        this.selection.splice(this.selection.indexOf(layer), 1);
      }
      // keep selection in the same order as the layers are in the doc
      // FIXME: this isn't grrrreat for big O complexity but layers are never millions
      this.selection.sort((a, b) => this.doc.layers.indexOf(a) - this.doc.layers.indexOf(b));
    } else {
      this.selection = [layer];
    }
    this.doc.activeLayer = layer;
  }

  reorderLayers(moveToIndex: number) {
    this.doc.historyPush("Rearrange Layers");
    var nextActiveLayer = this.doc.activeLayer;
    // if you click dragged from a non-selected layer, we select that and move that instead
    if (!this.selection.includes(this.dragStartedOnLayer)) {
      this.selection = [this.dragStartedOnLayer];
      nextActiveLayer = this.dragStartedOnLayer;
    }

    // make a list of layers where selected stuff is nulled out. that way we can still
    // insert in the right place without creating a surprisingly complicated problem
    // (what if you drag a mixed selection onto one of them? the end? the start? etc)
    var reorderedLayers = this.doc.layers.map(l => this.selection.includes(l) ? null : l);
    reorderedLayers.splice(moveToIndex, 0, ...this.selection);
    reorderedLayers = reorderedLayers.filter(l => l != null);
    this.doc.layers = reorderedLayers;
    this.doc.activeLayer = nextActiveLayer;
  }

  @HostListener('window:keydown', ['$event'])
  keydown(e: KeyboardEvent) {
    //if (this.inputState.hasFocus(this)){
    if (e.keyCode == 8 || e.keyCode == 46) { // delete or backspace
      this.doc.deleteLayers(this.selection);
      this.selection = [];
    }
    //}
  }
}
