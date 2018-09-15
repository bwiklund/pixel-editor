import {Command} from './Command';
import {App} from './App';

export class Menu {
  isOpen: boolean = false;
  
  constructor(public label: string, public children: Menu[]) { }

  invoke() { }

  closeRecursive() {
    this.isOpen = false;
    if (this.children) {
      this.children.forEach(c => { c.closeRecursive(); });
    }
  }
}

export class MenuItemFunction extends Menu {
  constructor(label: string, public func: () => void) {
    super(label, null);
  }
  
  invoke() {
    this.func();
  }
}

// a menu item that contains a command, and is constructed with an App reference to make wiring things up less of a headache.
// this way the menu component still doesn't need to know that App even exists
export class MenuItemCommand extends Menu {
  constructor(label: string, public command: Command, public app: App) {
    super(label, null);
  }
  
  invoke() {
    this.command.invoke(this.app);
  }
}