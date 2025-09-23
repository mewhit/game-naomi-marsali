import { _decorator, Component, TiledMap, TiledLayer, Node, RigidBody2D, ERigidBody2DType, BoxCollider2D, Vec3 } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlantColliders")
export class PlantColliders extends Component {
  @property({ tooltip: "Tile layer name containing plants" })
  plantsLayerName = "Plants";

  @property({ tooltip: "Bottom portion of the tile that is solid (0..1)" })
  basePct = 0.35;

  start() {
    const map = this.getComponent(TiledMap);
    if (!map) {
      console.warn("[PlantColliders] No TiledMap on this node");
      return;
    }

    const layer: TiledLayer | null = map.getLayer(this.plantsLayerName);
    if (!layer) {
      console.warn(`[PlantColliders] Layer '${this.plantsLayerName}' not found`);
      return;
    }

    // clear previous
    for (const c of [...layer.node.children]) if (c.name.startsWith("plant_col_")) c.destroy();

    const tileSize = map.getTileSize();
    const size = layer.getLayerSize();
    let count = 0;

    for (let x = 0; x < size.width; x++) {
      for (let y = 0; y < size.height; y++) {
        // Create/access a TiledTile node for this cell; it has the right local/world transform
        const tiledTile = layer.getTiledTileAt(x, y, true);
        if (!tiledTile) continue;

        const gid = layer.getTileGIDAt(x, y);
        if (!gid) continue; // empty cell

        // Position: use the tile node's world position to avoid Y-flip issues
        const worldPos = tiledTile.node.worldPosition;
        const colNode = new Node(`plant_col_${x}_${y}`);
        layer.node.scene.addChild(colNode); // add at scene root so we can set worldPosition directly
        colNode.setWorldPosition(new Vec3(worldPos.x, worldPos.y, worldPos.z));

        const rb = colNode.addComponent(RigidBody2D);
        rb.type = ERigidBody2DType.Static;

        const col = colNode.addComponent(BoxCollider2D);
        const h = Math.max(1, Math.floor(tileSize.height * this.basePct));
        col.size.set(tileSize.width, h);
        col.offset.set(0, -(tileSize.height - h) / 2); // hug the bottom of the tile
        col.apply();

        count++;
      }
    }

    console.log(`[PlantColliders] Built ${count} plant colliders via getTiledTileAt`);
  }
}
