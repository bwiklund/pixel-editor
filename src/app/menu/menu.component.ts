import { Component, OnInit, Input } from '@angular/core';
import { MenuList } from '../../core/Menu';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  @Input() menu: MenuList;
  @Input() parent: MenuComponent;

  toggle(m: MenuList) {
    this.closeOtherMenusRecursive(m);
    m.isOpen = !m.isOpen;
  }

  closeOtherMenusRecursive(m: MenuList) {
    this.menu.children.filter(x => (x != m)).forEach(x => x.isOpen = false);

    if (this.parent) { this.parent.closeOtherMenusRecursive(m); }
  }
}
