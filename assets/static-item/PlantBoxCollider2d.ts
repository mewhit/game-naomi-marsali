// CameraFollowClamp.ts
import { _decorator, Component, Node, UITransform, Vec3, Camera, math, Rect, TiledLayer, RigidBodyComponent, BoxCollider2D } from "cc";
const { ccclass } = _decorator;

@ccclass("PlantBoxCollider2d")
export class PlantBoxCollider2d extends Component {
  protected start(): void {
    const layer = this.getComponent(TiledLayer);
    if (!layer) return;

    const layerSize = layer.getLayerSize();

    console.log("layerSize", layerSize);
    for (let x = 0; x < layerSize.width; x++) {
      for (let y = 0; y < layerSize.height; y++) {
        const tileNode = layer.getTileGIDAt(x, y);
        if (!tileNode) continue;
        console.log("x", x, "y", y);
        const component = new BoxCollider2D();
        component.size.height = 64;
        component.size.width = 64;
        component.offset.x = x * 64 + 32;
        component.offset.y = y * 64 + 32;
        console.log("hello");
        this.node.addComponent(BoxCollider2D);
      }
    }
  }
}
