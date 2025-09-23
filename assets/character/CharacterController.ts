import { _decorator, Component, input, Input, EventKeyboard, KeyCode, Vec2 } from "cc";
import { RigidBody2D } from "cc";
const { ccclass, property } = _decorator;

@ccclass("CharacterController")
export class CharacterController extends Component {
  @property({ tooltip: "Pixels per second" })
  speed = 32;

  private dir = new Vec2(0, 0);
  private rb!: RigidBody2D;

  onLoad() {
    this.rb = this.getComponent(RigidBody2D)!;
    input.on(Input.EventType.KEY_DOWN, this.onKey, this);
    input.on(Input.EventType.KEY_UP, this.onKey, this);
  }
  onDestroy() {
    input.off(Input.EventType.KEY_DOWN, this.onKey, this);
    input.off(Input.EventType.KEY_UP, this.onKey, this);
  }

  private onKey(e: EventKeyboard) {
    const v = e.type === Input.EventType.KEY_DOWN ? 1 : 0;
    switch (e.keyCode) {
      case KeyCode.KEY_W:
        this.dir.y = v;
        break;
      case KeyCode.KEY_S:
        this.dir.y = -v;
        break;
      case KeyCode.KEY_A:
        this.dir.x = -v;
        break;
      case KeyCode.KEY_D:
        this.dir.x = v;
        break;
    }
  }

  update() {
    const { x, y } = this.dir;
    if (x !== 0 || y !== 0) {
      const len = Math.hypot(x, y) || 1;
      this.rb.linearVelocity = new Vec2((x / len) * this.speed, (y / len) * this.speed);
    } else {
      this.rb.linearVelocity = new Vec2(0, 0);
    }
  }
}
