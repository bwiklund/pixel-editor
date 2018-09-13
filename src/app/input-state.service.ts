import { Injectable } from '@angular/core';

// this is useful for stuff that does drag drop, where mouse events spill
// potentially all over the page and components need to ignore stuff that isn't for them.
@Injectable({
  providedIn: 'root'
})
export class InputStateService {
  private objectWithFocus: Object = null;

  takeFocus(comp: Object) {
    this.objectWithFocus = comp;
  }

  hasFocus(comp: Object) {
    return this.objectWithFocus == comp;
  }

  releaseFocus(comp: Object) {
    if (this.hasFocus(comp)) { this.objectWithFocus = null; }
    else { throw new Error("Focus released by component that doesn't even have it!"); }
  }

  takeIfFree(comp: Object) {
    if (this.objectWithFocus == null) { this.objectWithFocus = comp; }
  }
}
