// Interactable.ts
import { _decorator, Component, CCInteger, CCString, EventHandler, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Interactable")
export class Interactable extends Component {
  @property(CCString)
  displayName: string = "Object";

  @property([CCString])
  actions: string[] = ["Inspect"]; // e.g., ["Open","Talk","Pick up"]

  // Optional: per-action callbacks configured in the editor
  @property([EventHandler])
  onAction: EventHandler[] = [];

  /** Invoke action by index. The actor is usually the player node. */
  execute(actionIndex: number, actor?: Node) {
    if (actionIndex < 0 || actionIndex >= this.actions.length) return;
    const handler = this.onAction[actionIndex];
    if (handler) EventHandler.emitEvents([handler], { actor, interactable: this.node, actionIndex });
    // You can also switch(actionName) here if you prefer code-based behavior.
  }
}
