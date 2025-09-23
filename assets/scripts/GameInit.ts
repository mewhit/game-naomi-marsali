import { _decorator, Component, PhysicsSystem2D, EPhysics2DDrawFlags, Vec2 } from "cc";
const { ccclass } = _decorator;

@ccclass("GameInit")
export class GameInit extends Component {
  start() {
    // Enable Box2D simulation
    PhysicsSystem2D.instance.enable = true;

    // Gravity downwards (Y-)
    PhysicsSystem2D.instance.gravity = new Vec2(0, -20);

    // Debug draw to see colliders in the Game view
    PhysicsSystem2D.instance.debugDrawFlags =
      EPhysics2DDrawFlags.Aabb |
      EPhysics2DDrawFlags.Pair |
      EPhysics2DDrawFlags.CenterOfMass |
      EPhysics2DDrawFlags.Joint |
      EPhysics2DDrawFlags.Shape;

    console.log("[GameInit] PhysicsSystem2D enabled, gravity set, debug draw enabled");
  }
}
