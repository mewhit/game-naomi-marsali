import { _decorator, Component, input, Input, EventKeyboard, KeyCode, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NaraController')
export class NaraController extends Component {
  @property
  speed = 2000; // pixels per second

  private dir = new Vec3();

  onLoad() {
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
  }

  onDestroy() {
    input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
  }

  private onKeyDown(event: EventKeyboard) {
    switch (event.keyCode) {
      case KeyCode.KEY_W: this.dir.y = 1; break;
      case KeyCode.KEY_S: this.dir.y = -1; break;
      case KeyCode.KEY_A: this.dir.x = -1; break;
      case KeyCode.KEY_D: this.dir.x = 1; break;
    }
  }

  private onKeyUp(event: EventKeyboard) {
    switch (event.keyCode) {
      case KeyCode.KEY_W:
      case KeyCode.KEY_S: this.dir.y = 0; break;
      case KeyCode.KEY_A:
      case KeyCode.KEY_D: this.dir.x = 0; break;
    }
  }

  update(dt: number) {
    if (this.dir.lengthSqr() === 0) return;

    const move = new Vec3(
      this.dir.x * this.speed * dt,
      this.dir.y * this.speed * dt,
      0
    );

    this.node.setPosition(this.node.position.clone().add(move));
  }
}
