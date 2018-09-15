export class Menu {
  isOpen: boolean = false;
}

export class MenuList extends Menu {
  constructor(public label: string, public children: Menu[]) { super() }

  closeChildrenRecursive() {
    this.children.forEach(c => { c.isOpen = false; if (c instanceof MenuList) {c.closeChildrenRecursive();} });
  }
}

export class MenuItem extends Menu {
  constructor(public label: string, public action: Function) { super() }
}