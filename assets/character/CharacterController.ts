import { _decorator, Component, input, Input, EventKeyboard, KeyCode, Vec2 } from "cc";
import { RigidBody2D } from "cc";
const { ccclass, property } = _decorator;

@ccclass("CharacterController")
export class CharacterController extends Component {
  @property({ tooltip: "Pixels per second" })
  speed: number;
  @property({ tooltip: "Enable reading Web Gamepad API (left stick/D-pad)." })
  enableGamepad = true;
  @property({ tooltip: "Analog stick deadzone (0..1)." })
  gamepadDeadzone = 0.2;

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
    // Start with keyboard direction
    const dir = new Vec2(this.dir.x, this.dir.y);

    // Merge gamepad direction (if enabled and supported)
    if (this.enableGamepad) {
      const gp = this.getFirstActiveGamepad();
      if (gp) {
        const pad = this.readGamepadAxes(gp, this.gamepadDeadzone);
        // Prefer the strongest input per axis; combine if keyboard is zero
        if (Math.abs(dir.x) < Math.abs(pad.x)) dir.x = pad.x;
        if (Math.abs(dir.y) < Math.abs(pad.y)) dir.y = pad.y;
        // Also read D-pad buttons as digital axes
        const dpad = this.readGamepadDpad(gp);
        if (dpad.x !== 0) dir.x = dpad.x;
        if (dpad.y !== 0) dir.y = dpad.y;
      }
    }

    const { x, y } = dir;
    if (x !== 0 || y !== 0) {
      const len = Math.hypot(x, y) || 1;
      this.rb.linearVelocity = new Vec2((x / len) * this.speed, (y / len) * this.speed);
    } else {
      this.rb.linearVelocity = new Vec2(0, 0);
    }
  }

  // Returns the first non-null, connected gamepad (browser runtime only)
  private getFirstActiveGamepad(): Gamepad | null {
    // Guard for non-browser runtimes (native preview, etc.)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const nav: any = typeof navigator !== "undefined" ? navigator : null;
    if (!nav || typeof nav.getGamepads !== "function") return null;
    const pads: (Gamepad | null)[] = nav.getGamepads ? nav.getGamepads() : [];
    for (const p of pads) if (p && p.connected) return p;
    return null;
  }

  // Read left stick axes with deadzone, remap to x,y where up is +1
  private readGamepadAxes(gp: Gamepad, deadzone: number): Vec2 {
    // Standard mapping: axes[0]=LX (-1 left, +1 right), axes[1]=LY (-1 up, +1 down)
    const ax = gp.axes || [];
    const lx = ax[0] ?? 0;
    const ly = ax[1] ?? 0;
    const x = this.applyDeadzone(lx, deadzone);
    // Invert Y so up is +1 (matching W key)
    const y = -this.applyDeadzone(ly, deadzone);
    return new Vec2(x, y);
  }

  // Map D-pad buttons to digital axes where up=+1, right=+1
  private readGamepadDpad(gp: Gamepad): Vec2 {
    const btn = gp.buttons || [];
    // Standard mapping indices per W3C: 12=Up, 13=Down, 14=Left, 15=Right
    const up = btn[12]?.pressed ? 1 : 0;
    const down = btn[13]?.pressed ? 1 : 0;
    const left = btn[14]?.pressed ? 1 : 0;
    const right = btn[15]?.pressed ? 1 : 0;
    const x = right ? 1 : left ? -1 : 0;
    const y = up ? 1 : down ? -1 : 0;
    return new Vec2(x, y);
  }

  private applyDeadzone(v: number, dz: number): number {
    const a = Math.abs(v);
    if (a < dz) return 0;
    // Optional: rescale so output starts at 0 after deadzone
    const scaled = (a - dz) / (1 - dz);
    return Math.sign(v) * scaled;
  }
}
