import { Component, Input, HostBinding } from '@angular/core';
import { Menu } from '../../core/core';

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
    if (this.menu.action) {
      this.menu.action();
      this.root.menu.closeRecursive();
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
