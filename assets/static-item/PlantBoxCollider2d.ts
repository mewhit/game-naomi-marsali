import { _decorator, Component, Node, TiledMap, TiledLayer, BoxCollider2D, RigidBody2D, ERigidBody2DType, Size } from "cc";
const { ccclass, property } = _decorator;

/**
 * Creates individual static BoxCollider2D colliders for each occupied tile in a target layer.
 * Assumes tile (0,0) is top-left in the Tiled map; converts to Cocos coordinates (y up).
 */
@ccclass("PlantBoxCollider2d")
export class PlantBoxCollider2d extends Component {
  @property({ tooltip: "Optional parent container name (will be recreated each build). Leave blank to attach directly." })
  containerName: string = "PlantTileColliders";

  @property({ tooltip: "Log debug info" })
  debug: boolean = true;

  protected start(): void {
    this.build();
  }

  public build() {
    const map = this.getComponent(TiledMap);
    if (!map) {
      console.warn("[PlantBoxCollider2d] No TiledMap on node.");
      return;
    }
    const layer = map.getLayer("plants") as TiledLayer | null;
    if (!layer) {
      console.warn(`[PlantBoxCollider2d] Layer 'plants' not found.`);
      return;
    }

    const tileSize = map.getTileSize(); // Size (pixels)
    const layerSize = layer.getLayerSize(); // in tiles
    let tiles = 0;
    let colliders = 0;

    for (let y = 0; y < layerSize.height; y++) {
      for (let x = 0; x < layerSize.width; x++) {
        const gid = layer.getTileGIDAt(x, y);
        if (!gid) continue; // empty
        tiles++;

        const p = new Node(`TileCollider_${x}_${y}`);
        p.setPosition((-tileSize.x * layerSize.width) / 2 + x * 64 + 32, (tileSize.y * layerSize.height) / 2 - y * 64 - 32);

        // Convert tile coords (top-left origin) to cocos local (origin top-left assumption)
        const w = tileSize.width;
        const h = tileSize.height;
        const xCenter = x * w + w / 2;
        const yTop = y * h;
        const yCenter = -(yTop + h / 2); // invert Y

        layer.node.addChild(p);
        const col = p.addComponent(BoxCollider2D);
        col.size = new Size(w, h);
        col.apply();
        colliders++;
        if (this.debug && colliders <= 10) {
          console.log(`[PlantBoxCollider2d] Collider (${x},${y}) center=(${xCenter},${yCenter}) size=(${w},${h})`);
        }
      }
    }
    if (this.debug) console.log(`[PlantBoxCollider2d] Done. tilesWithGid=${tiles} colliders=${colliders}`);
  }
}
