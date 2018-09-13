export interface IMenu {}

export class Menu {
  constructor(public label: string, public children: IMenu[]) { }
}

export class MenuItem  {
  constructor(public label: string, public action: Function) { }
}