import { _decorator, Component, input, Input, EventKeyboard, KeyCode } from "cc";
import { PhysicsSystem2D, EPhysics2DDrawFlags } from "cc";
const { ccclass } = _decorator;

@ccclass("DebugPhysics2D")
export class DebugPhysics2D extends Component {
  onLoad() {
    console.log("DebugPhysics2d onLoad");

    // Turn on shapes/AABB/joints outlines
    PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Shape | EPhysics2DDrawFlags.Aabb | EPhysics2DDrawFlags.Joint;
  }

  start() {
    console.log("[Physics2D Debug] flags =", PhysicsSystem2D.instance.debugDrawFlags);
    // Optional: toggle with F2 at runtime
    input.on(Input.EventType.KEY_DOWN, (e: EventKeyboard) => {
      if (e.keyCode === KeyCode.F2) {
        const cur = PhysicsSystem2D.instance.debugDrawFlags;
        PhysicsSystem2D.instance.debugDrawFlags =
          cur === EPhysics2DDrawFlags.None
            ? EPhysics2DDrawFlags.Shape | EPhysics2DDrawFlags.Aabb | EPhysics2DDrawFlags.Joint
            : EPhysics2DDrawFlags.None;
        console.log("[Physics2D Debug] flags =", PhysicsSystem2D.instance.debugDrawFlags);
      }
    });
  }
}
