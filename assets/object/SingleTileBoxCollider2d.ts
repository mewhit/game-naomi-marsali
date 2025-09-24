import { _decorator, Component, Node, TiledMap, TiledLayer, BoxCollider2D, RigidBody2D, ERigidBody2DType, Size } from "cc";
const { ccclass, property } = _decorator;

/**
 * Creates individual static BoxCollider2D colliders for each occupied tile in a target layer.
 * Assumes tile (0,0) is top-left in the Tiled map; converts to Cocos coordinates (y up).
 */
@ccclass("SingleTileBoxCollider2d")
export class SingleTileBoxCollider2d extends Component {
  @property({ tooltip: "Log debug info" })
  debug: boolean = true;

  protected start(): void {
    this.build();
  }

  public build() {
    const layer = this.getComponent(TiledLayer);

    if (!layer) {
      console.warn(`[SingleTileBoxCollider2d] Layer 'plants' not found.`);
      return;
    }

    const layerSize = layer.getLayerSize(); // in tiles
    const tileSize = layer.getMapTileSize(); // Size (pixels)
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
        col.size = new Size(w - 8, h - 8);
        col.apply();
        colliders++;
      }
    }
    if (this.debug) console.log(`[SingleTileBoxCollider2d] Done. tilesWithGid=${tiles} colliders=${colliders}`);
  }
}
