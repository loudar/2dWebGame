import {LayerManager} from "../Engine/js/static/LayerManager.js";
import {ImageLayer} from "../Engine/js/Models/Layers/ImageLayer.js";
import {DataManager} from "../Engine/js/static/DataManager.js";
import {DataEntries} from "../Engine/js/Enums/DataEntries.js";
import {UpdateManager} from "../Engine/js/static/UpdateManager.js";
import {Image} from "../Engine/js/Models/LayerContent/Image/Image.js";
import {AspectRatioHelper} from "../Engine/js/Helpers/AspectRatioHelper.js";
import {EntityLayer} from "../Engine/js/Models/Layers/EntityLayer.js";
import {Size3D} from "../Engine/js/Models/Properties/Size3D.js";
import {CharacterEntity} from "../Engine/js/Models/LayerContent/Entity/CharacterEntity.js";
import {CharacterTexture} from "../Engine/js/Models/Properties/Textures/CharacterTexture.js";
import {BlockEntity} from "../Engine/js/Models/LayerContent/Entity/BlockEntity.js";
import {Texture} from "../Engine/js/Models/Properties/Textures/Texture.js";
import {Coordinates3D} from "../Engine/js/Models/Properties/Coordinates3D.js";
import {Rotation} from "../Engine/js/Models/Properties/Rotation.js";
import {IntervalManager} from "../Engine/js/static/IntervalManager.js";
import {UiLayer} from "../Engine/js/Models/Layers/UiLayer.js";
import {UiLayerElements} from "../Engine/js/JensElements/LayerContentElements/UiLayerElements.js";
import {UUID} from "../Engine/js/Helpers/UUID.js";
import {PositionCollision} from "../Engine/js/Models/Collisions/PositionCollision.js";
import {GameManager} from "../Engine/js/static/GameManager.js";
import {EnemyEntity} from "../Engine/js/Models/LayerContent/Entity/EnemyEntity.js";
import {EntityTypes} from "../Engine/js/Enums/EntityTypes.js";
import {PlayerState} from "./Models/States/PlayerState.js";

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

const characterEntity = new CharacterEntity("test", new CharacterTexture(), new Size3D(10, 10), new Coordinates3D(0, 0), new Rotation(0), 1, new PlayerState());
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
characterEntity.hook.setOnCollide((c, collidingEntity, collision, collisionSuccess) => {
    if (!collidingEntity) {
        return;
    }
    if (collidingEntity.type === EntityTypes.enemy) {
        characterEntity.state.setHealth(characterEntity.state.getHealth() - 1);
        uiLayer.updateElement(textId, {
            text: `health: ${c.state.getHealth()}/${c.state.getBaseHealth()}`
        });
        c.state.setDamageLock();
    }
});
const characterCollision = characterEntity.getCollision().ignoreZ().isNonPhysical();
enemyEntity.addCollisions(floorCollision, boxCollision, characterCollision);
entityLayer.addEntities(enemyEntity, blockEntity2, characterEntity);

const uiLayer = new UiLayer("testUi");
const textId = UUID.new.generate();
uiLayer.addTemplate(textId, UiLayerElements.text, {
    id: textId, text: 'health: 100/100'
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