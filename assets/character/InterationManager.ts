// InteractionManager.ts
import {
  _decorator,
  Component,
  Collider2D,
  Contact2DType,
  IPhysics2DContact,
  Node,
  input,
  Input,
  EventKeyboard,
  KeyCode,
  Vec3,
  UITransform,
  Camera,
  Label,
} from "cc";
import { Interactable } from "../object/Interactable";
const { ccclass, property } = _decorator;

@ccclass("InteractionManager")
export class InteractionManager extends Component {
  @property(Node) uiPanel!: Node; // A panel under Canvas
  @property(Camera) uiCamera!: Camera;
  @property(Camera) worldCamera!: Camera;

  private candidates: Set<Node> = new Set();
  private current?: Node;

  onLoad() {
    const col = this.getComponent(Collider2D);
    if (col) {
      col.on(Contact2DType.BEGIN_CONTACT, this.onEnter, this);
      col.on(Contact2DType.END_CONTACT, this.onExit, this);
    }
    input.on(Input.EventType.KEY_DOWN, this.onKey, this);
    if (this.uiPanel) this.uiPanel.active = false;
  }
  onDestroy() {
    input.off(Input.EventType.KEY_DOWN, this.onKey, this);
  }

  private onEnter(_s: Collider2D, other: Collider2D, _c?: IPhysics2DContact) {
    console.log("here");
    if (other.getComponent(Interactable)) {
      this.candidates.add(other.node);
      this.refresh();
    }
  }
  private onExit(_s: Collider2D, other: Collider2D) {
    if (this.candidates.delete(other.node)) this.refresh();
  }
  private refresh() {
    // choose nearest interactable
    let best: Node | undefined;
    let bestD = Number.MAX_VALUE;
    const me = this.node.worldPosition;
    this.candidates.forEach((n) => {
      const d = me.subtract(n.worldPosition).lengthSqr();
      if (d < bestD) {
        bestD = d;
        best = n;
      }
    });
    this.current = best;
    this.updateUI();
  }

  private onKey(e: EventKeyboard) {
    if (!this.current) return;
    const int = this.current.getComponent(Interactable)!;
    if (e.keyCode === KeyCode.KEY_E) {
      int.execute(0, this.node);
      return;
    }
    const map: Record<number, number> = { [KeyCode.DIGIT_1]: 1, [KeyCode.DIGIT_2]: 2, [KeyCode.DIGIT_3]: 3, [KeyCode.DIGIT_4]: 4 };
    const idx = (map as any)[e.keyCode];
    if (idx !== undefined && idx < int.actions.length) int.execute(idx, this.node);
  }

  private updateUI() {
    if (!this.uiPanel) return;

    if (!this.current) {
      // No interactable nearby → hide
      this.uiPanel.active = false;
      return;
    }

    // Found interactable → show panel
    this.uiPanel.active = true;

    const int = this.current.getComponent(Interactable)!;
    const title = this.uiPanel.getChildByName("Title")?.getComponent(Label);
    if (title) title.string = int.displayName;

    // Fill in actions
    for (let i = 0; i < 4; i++) {
      const slot = this.uiPanel.getChildByName(`Action${i}`);
      if (!slot) continue;
      const label = slot.getComponent(Label)!;
      if (i < int.actions.length) {
        label.string = int.actions[i];
        slot.active = true;
      } else {
        slot.active = false;
      }
    }
  }
}
