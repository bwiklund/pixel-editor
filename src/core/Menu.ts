export class Menu {
  isOpen: boolean = false;
  children: Menu[];
  action: Function;

  constructor(public label: string, contents: Menu[] | Function) {
    if (contents instanceof Array) { this.children = contents; }
    if (contents instanceof Function) { this.action = contents; }
  }

  closeChildrenRecursive() {
    if (this.children) {
      this.children.forEach(c => { c.isOpen = false; c.closeChildrenRecursive(); });
    }
  }
}