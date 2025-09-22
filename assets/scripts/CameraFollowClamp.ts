// CameraFollowClamp.ts
import { _decorator, Component, Node, UITransform, Vec3, Camera, math, Rect } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraFollowClamp')
export class CameraFollowClamp extends Component {
  @property(Node) target!: Node;       // Nora
  @property(Node) worldBounds!: Node;  // Floor (has UITransform)
  @property padding = 0;
  @property(Vec3) offset: Vec3 = new Vec3(0, 0, 0);

  private out = new Vec3();

  update() {
    if (!this.target || !this.worldBounds) return;

    const cam = this.getComponent(Camera)!;
    const ui = this.worldBounds.getComponent(UITransform)!;

    // Visible half-size of camera in WORLD units
    const halfH = cam.orthoHeight;
    const halfW = cam.orthoHeight * cam.camera.aspect;

    // Floor/world rect in WORLD coordinates
    const rect: Rect = ui.getBoundingBoxToWorld();
    const minX = rect.x + halfW + this.padding;
    const maxX = rect.x + rect.width  - halfW - this.padding;
    const minY = rect.y + halfH + this.padding;
    const maxY = rect.y + rect.height - halfH - this.padding;

    // Desired camera center = target + offset (WORLD)
    let x = this.target.worldPosition.x + this.offset.x;
    let y = this.target.worldPosition.y + this.offset.y;

    // If map smaller than view in a dimension, center camera in that dimension
    x = (rect.width  <= halfW * 2) ? (minX + maxX) * 0.5 : math.clamp(x, minX, maxX);
    y = (rect.height <= halfH * 2) ? (minY + maxY) * 0.5 : math.clamp(y, minY, maxY);

    this.out.set(x, y, this.node.worldPosition.z);
    this.node.setWorldPosition(this.out);
  }
}
