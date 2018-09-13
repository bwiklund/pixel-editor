import { Vec } from '../Vec';
import { App } from '../App';
import { Doc } from '../Doc';

export interface ToolContext {
  app: App,
  doc: Doc,
  pos: Vec,
  posInElement: Vec
}

export class Tool {
  name: string;
  icon: string;

  onMouseDown(context: ToolContext): void {};
  onMouseMove(context: ToolContext): void {};
  onMouseUp(context: ToolContext): void {};
  interrupt(): void {};

  getCssCursor(): string {return 'cursor'};
}
