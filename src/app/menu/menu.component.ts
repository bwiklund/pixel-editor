import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Menu } from '../../core/Menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  @Input() menu: Menu;
  @Input() parent: MenuComponent;


  get isRoot() {
    return parent != null;
  }

  mousedown(e, m: Menu) {
    console.log(this.menu.label);
    if (this.isRoot) {
      if (this.menu.isOpen) { // clicking anything in the top level menu again closes everything
        this.closeMenusRecursive();
        return;
      } else { // mouse down on top level menu opens the whole menu and shows the one you clicked
        this.menu.isOpen = true;
        m.isOpen = true;
        this.closeOtherMenusRecursive(m);
      }
    }
  }

  mousemove(e, m: Menu) {
    var willRespondToMouseMove = (this.isRoot && this.menu.isOpen) || !this.isRoot;
    if (willRespondToMouseMove && this.menu.children) {
      m.isOpen = true;
      this.closeOtherMenusRecursive(m);
    }
  }

  mouseup(e, m: Menu) {
    if (m.action) {
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
      x.closeChildrenRecursive();
    });
    if (this.parent) { this.parent.closeOtherMenusRecursive(this.menu); }
  }

  closeMenusRecursive() {
    this.menu.isOpen = false;
    this.menu.children.forEach(x => x.isOpen = false);
    if (this.parent) { this.parent.closeMenusRecursive(); }
  }
}
