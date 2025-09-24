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
  CircleCollider2D,
} from "cc";
import { Interactable } from "../object/Interactable";
const { ccclass, property } = _decorator;

@ccclass("InteractionManager")
export class InteractionManager extends Component {
  @property(Node) uiPanel!: Node; // A UI panel prefab under Canvas
  @property(Camera) uiCamera!: Camera; // Your UI Camera (Canvas camera)
  @property(Camera) worldCamera!: Camera; // World camera for world->UI conversion

  private candidates: Set<Node> = new Set();
  private current?: Node;

  start() {
    const col = this.getComponent(Collider2D);
    console.log("col", col);
    col.on(Contact2DType.BEGIN_CONTACT, this.onEnter, this);
  }

  onDestroy() {}

  private onEnter(self: Collider2D, other: Collider2D, _c?: IPhysics2DContact) {
    console.log("enter", other);
  }
}
