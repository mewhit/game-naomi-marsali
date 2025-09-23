import { _decorator, Component, TiledMap, TiledLayer, log } from "cc";
const { ccclass } = _decorator;

@ccclass("TilemapInspector")
export class TilemapInspector extends Component {
  start() {
    const map = this.getComponent(TiledMap)!;
    const plants = map.getLayer("Plants");
    if (!plants) {
      log('[TilemapInspector] Layer "Plants" not found');
      return;
    }

    // bring Plants to top render order
    plants.node.setSiblingIndex(plants.node.parent!.children.length - 1);

    // count non-empty tiles
    const size = plants.getLayerSize();
    let count = 0;
    for (let x = 0; x < size.width; x++) {
      for (let y = 0; y < size.height; y++) {
        if (plants.getTileGIDAt(x, y)) count++;
      }
    }
    log(`[TilemapInspector] Plants layer ${size.width}x${size.height}, tiles placed: ${count}`);
  }
}
