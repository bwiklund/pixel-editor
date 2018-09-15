import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Menu, MenuList, MenuItem } from '../../core/Menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  @Input() menu: MenuList;
  @Input() parent: MenuComponent;

  get isRoot() {
    return parent != null;
  }

  mousedown(e, m: Menu) {
    if (this.menu.isOpen && this.isRoot) { // you can click again to close a top levelmenu if you didn't click drag
    console.log(this.menu.label);
      this.menu.isOpen = false;
      this.closeMenusRecursive();
      return;
    }

    if (m instanceof MenuList) {
      this.menu.isOpen = true;
      this.closeOtherMenusRecursive(m);
      m.isOpen = !m.isOpen;
    }

  }

  mousemove(e, m: Menu) {
    if (this.menu.isOpen) {
      m.isOpen = true;
      this.closeOtherMenusRecursive(m);
    }
  }

  mouseup(e, m: Menu) {
    // if (this.isRoot) {
    //   this.menuIsBeingInteractedWith = false;
    // }

    if (m instanceof MenuItem) {
      m.action();
      this.closeMenusRecursive();
    }
  }

  clickedUnderlay() {
    this.closeMenusRecursive();
  }

  // go up the chain of parents, closing everything that isn't direct ancestors of a particular menu item
  closeOtherMenusRecursive(exceptThisMenu: Menu = null) {
    this.menu.children.filter(x => (x != exceptThisMenu)).forEach(x => {
      x.isOpen = false;
      if (x instanceof MenuList) {
        x.closeChildrenRecursive();
      }
    });
    if (this.parent) { this.parent.closeOtherMenusRecursive(this.menu); }
  }

  closeMenusRecursive() {
    this.menu.isOpen = false;
    this.menu.children.forEach(x => x.isOpen = false);
    if (this.parent) { this.parent.closeMenusRecursive(); }
  }
}
