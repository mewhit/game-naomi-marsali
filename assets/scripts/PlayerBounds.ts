// assets/scripts/PlayerBounds.ts
import { _decorator, Component, Node, UITransform, Vec3, Rect, math } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerBounds')
export class PlayerBounds extends Component {
  @property(Node)
  floorNode!: Node; // Assign your Floor node here

  private floorUI?: UITransform;
  private meUI?: UITransform;
  private tmp = new Vec3();

  onLoad() {
    this.floorUI = this.floorNode?.getComponent(UITransform) || undefined;
    this.meUI = this.getComponent(UITransform) || this.node.addComponent(UITransform);
  }

  update() {
    if (!this.floorUI || !this.meUI) return;

    // Nora’s world position after movement this frame
    this.tmp.set(this.node.worldPosition);

    // World-space bounds of the floor (accounts for position/scale)
    const floorWorldRect: Rect = this.floorUI.getBoundingBoxToWorld();

    // Half size of Nora (assumes anchor 0.5,0.5 on her UITransform)
    const halfW = this.meUI.width;
    const halfH = this.meUI.height;

    // Clamp within floor rectangle, leaving room for Nora’s size
    const minX = floorWorldRect.xMin;
    const maxX = floorWorldRect.xMax - halfW;
    const minY = floorWorldRect.yMin;
    const maxY = floorWorldRect.yMax - halfH;

    this.tmp.x = math.clamp(this.tmp.x, Math.min(minX, maxX), Math.max(minX, maxX));
    this.tmp.y = math.clamp(this.tmp.y, Math.min(minY, maxY), Math.max(minY, maxY));

    this.node.setWorldPosition(this.tmp);
  }
}
