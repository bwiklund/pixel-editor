import { App } from './App';

export class Command {
  static Shortcuts: {[key: string]: string} = {};

  constructor(public key: string, public defaultShortcut, public action: (app: App) => void) {
    Command.Shortcuts[key] = this.defaultShortcut;
  }
  get label() {
    return this.key;//Labels[this.key];
  }
  get shortcut() {
    return this.defaultShortcut;//Shortcuts[this.key];
  }
  invoke(app: App) {
    this.action(app);
  }
}