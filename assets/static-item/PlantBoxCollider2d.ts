// CameraFollowClamp.ts
import {
  _decorator,
  Component,
  Node,
  UITransform,
  Vec3,
  Camera,
  math,
  Rect,
  TiledLayer,
  RigidBodyComponent,
  BoxCollider2D,
  TiledMap,
  widgetManager,
} from "cc";
const { ccclass } = _decorator;

@ccclass("PlantBoxCollider2d")
export class PlantBoxCollider2d extends Component {
  protected start(): void {
    const map = this.getComponent(TiledMap);
    if (!map) return;

    const layer = map.getLayer("plants");
    if (!layer) console.error("no plants layer");

    const layerSize = layer.getLayerSize();
    console.log("map tile sice", layer.getMapTileSize());

    const width = console.log("layerSize", layerSize);
    for (let x = 0; x < layerSize.width; x++) {
      for (let y = 0; y < layerSize.height; y++) {
        const tileNode = layer.getTileGIDAt(x, y);
        if (!tileNode) continue;
        console.log("x", x, "y", y);
        const component = new BoxCollider2D({});
        component.size.height = 64 * 64;
        component.size.set(64, 64);
        component.offset.set(
          x - layerSize.width * 64,
          y - layerSize.height * 64
        );

        console.log(component.offset.x, component.offset.y);
        // console.log("hello");
        this.node.addComponent(BoxCollider2D);
      }
    }
  }
}
