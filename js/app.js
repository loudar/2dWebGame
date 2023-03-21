import {LayerManager} from "./static/LayerManager.js";
import {ImageLayer} from "./Models/Layers/ImageLayer.js";
import {DataManager} from "./static/DataManager.js";
import {DataEntries} from "./Enums/DataEntries.js";
import {UpdateManager} from "./static/UpdateManager.js";
import {Image} from "./Models/LayerContent/Image/Image.js";
import {AspectRatioHelper} from "./Helpers/AspectRatioHelper.js";
import {EntityLayer} from "./Models/Layers/EntityLayer.js";
import {Size3D} from "./Models/Size3D.js";
import {CharacterEntity} from "./Models/LayerContent/Entity/CharacterEntity.js";
import {CharacterTexture} from "./Models/CharacterTexture.js";
import {BlockEntity} from "./Models/LayerContent/Entity/BlockEntity.js";
import {Texture} from "./Models/Texture.js";
import {Coordinates3D} from "./Models/Coordinates3D.js";
import {Rotation} from "./Models/Rotation.js";
import {IntervalManager} from "./static/IntervalManager.js";
import {UiLayer} from "./Models/Layers/UiLayer.js";
import {UiLayerElements} from "./JensElements/LayerContentElements/UiLayerElements.js";
import {UUID} from "./Helpers/UUID.js";
import {PositionCollision} from "./Models/Collisions/PositionCollision.js";
import {GameManager} from "./static/GameManager.js";
import {EnemyEntity} from "./Models/LayerContent/Entity/EnemyEntity.js";
import {EntityTypes} from "./Enums/EntityTypes.js";

GameManager.create();
const gameOptions = DataManager.getKey(DataEntries.GAME_OPTIONS);

const imgSource = "assets/images/Stage_Basement_room.webp";
const image = new Image(imgSource);
const aspectRatio = await AspectRatioHelper.getAspectRatioFromImageSource(imgSource);
DataManager.addOrUpdateKey(DataEntries.ASPECT_RATIO, aspectRatio);
image.setFixedSize(AspectRatioHelper.getWidthFromHeightOrWidthAsMin(window.innerWidth, window.innerHeight, aspectRatio), AspectRatioHelper.getHeightFromWidthOrHeightAsMin(window.innerWidth, window.innerHeight, aspectRatio), e => {
    image.setFixedSize(AspectRatioHelper.getWidthFromHeightOrWidthAsMin(window.innerWidth, window.innerHeight, aspectRatio), AspectRatioHelper.getHeightFromWidthOrHeightAsMin(window.innerWidth, window.innerHeight, aspectRatio));
});
const imageLayer = new ImageLayer("testImage", image);

const entityLayer = new EntityLayer("testEntity");
const enemyEntity = new EnemyEntity("enemy", new CharacterTexture("#f0f"), new Size3D(5, 5), new Coordinates3D(200, 200));
enemyEntity.setSpeed(.5);
const blockEntity2 = new BlockEntity("test", new Texture("#fff"), new Size3D(100, 100), new Coordinates3D(100, 100), new Rotation(0));

const characterEntity = new CharacterEntity("test", new CharacterTexture(), new Size3D(10, 10));
characterEntity.setAsPlayer();
const xCollision = gameOptions.gridSize / 2;
const yCollision = (gameOptions.gridSize / 2) / aspectRatio;
const wallCollision = new PositionCollision(
    Math.floor(-xCollision),
    Math.floor(xCollision),
    Math.floor(-yCollision),
    Math.floor(yCollision)
).ignoreZ();
const floorFactor = {
    x: 0.775,
    y: 0.65
};
const floorCollision = new PositionCollision(
    Math.floor(-xCollision * floorFactor.x),
    Math.floor(xCollision * floorFactor.x),
    Math.floor(-yCollision * floorFactor.y),
    Math.floor(yCollision * floorFactor.y)
).ignoreZ().lowPriority();
const boxCollision = blockEntity2.getCollision().ignoreZ().lowPriority();
const enemyCollision = enemyEntity.getCollision().ignoreZ().isNonPhysical();
characterEntity.addCollisions(enemyCollision, floorCollision, boxCollision);
characterEntity.hook.setOnCollide((character, collidingEntity, collision, collisionSuccess) => {
    if (!collidingEntity) {
        return;
    }
    if (collidingEntity.type === EntityTypes.enemy) {
        //entityLayer.removeEntity(collidingEntity);
    }
});
const characterCollision = characterEntity.getCollision().ignoreZ().isNonPhysical();
enemyEntity.addCollisions(floorCollision, boxCollision, characterCollision);
entityLayer.addEntities(enemyEntity, blockEntity2, characterEntity);

const uiLayer = new UiLayer("testUi");
const textId = UUID.new.generate();
uiLayer.addTemplate(textId, UiLayerElements.text, {
    id: textId, text: 'test'
});
characterEntity.hook.setOnMove(c => {
    uiLayer.updateElement(textId, {
        text: `x: ${c.position.x} y: ${c.position.y}`
    });
});

LayerManager.addLayers(imageLayer, entityLayer, uiLayer);
UpdateManager.updateLayerList();
let lastIntervalRun = Date.now();
IntervalManager.startInterval(() => {
    const now = Date.now();
    UpdateManager.updateTick();
    const delta = now - lastIntervalRun;
    lastIntervalRun = now;
}, 1000 / 120);