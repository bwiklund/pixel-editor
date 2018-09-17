import { MenuItemCommand } from './../../core/Menu';
import { Component, Input, HostBinding } from '@angular/core';
import { Menu } from '../../core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  @Input() menu: Menu;
  @Input() parent: MenuComponent;

  @HostBinding('class.open') get isOpen() { return this.menu.isOpen; }

  get root() {
    var p: MenuComponent = this;
    while(p.parent) { p = p.parent; }
    return p;
  }

  get isRoot() {
    return this.parent == null;
  }

  mousedown(e) {
    if (this.parent.isRoot) {
      if (!this.menu.isOpen) {
        this.openThisMenuAndCloseOthersUpTheTree(this.menu);
      } else {
        this.root.menu.closeRecursive();
      }
    }
  }

  mousemove(e) {
    var willRespondToMouseMove = (this.parent.isRoot && this.parent.menu.isOpen) || !this.parent.isRoot;
    if (willRespondToMouseMove && this.menu.children != null) {
      this.parent.openThisMenuAndCloseOthersUpTheTree(this.menu);
    }
  }

  mouseup(e) {
    if (!this.menu.children) { // if it has no children it's by definition an item that can be invoked, but maybe this should be enforced with types
      this.root.menu.closeRecursive(); // close first in case the `invoke()` throws
      this.menu.invoke();
    }
  }

  clickedUnderlay() {
    this.root.menu.closeRecursive();
  }

  openThisMenuAndCloseOthersUpTheTree(m: Menu) {
    m.isOpen = true;
    this.menu.isOpen = true;
    this.menu.children.filter(x => (x != m)).forEach(x => {
      x.closeRecursive();
    });
    if (this.parent) { this.parent.openThisMenuAndCloseOthersUpTheTree(this.menu); }
  }
}
