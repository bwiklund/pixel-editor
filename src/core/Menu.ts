export class Menu {
  isOpen: boolean = false;
}

export class MenuList extends Menu {
  constructor(public label: string, public children: Menu[]) { super() }
}

export class MenuItem extends Menu  {
  constructor(public label: string, public action: Function) { super() }
}