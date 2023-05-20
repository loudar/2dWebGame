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
import {BlockEntity} from "../Engine/js/Models/LayerContent/Entity/BlockEntity.js";
import {Texture} from "../Engine/js/Models/Properties/Textures/Texture.js";
import {Coordinates3D} from "../Engine/js/Models/Properties/Coordinates3D.js";
import {Rotation} from "../Engine/js/Models/Properties/Rotation.js";
import {IntervalManager} from "../Engine/js/static/IntervalManager.js";
import {UiLayer} from "../Engine/js/Models/Layers/UiLayer.js";
import {UiLayerElements} from "../Engine/js/JensElements/LayerContentElements/UiLayerElements.js";
import {UUID} from "../Engine/js/Helpers/UUID.js";
import {PositionCollision} from "../Engine/js/Models/Collisions/PositionCollision.js";
import {EnemyEntity} from "../Engine/js/Models/LayerContent/Entity/EnemyEntity.js";
import {EntityTypes} from "../Engine/js/Enums/EntityTypes.js";
import {PlayerState} from "./Models/States/PlayerState.js";
import {HealthHelpers} from "./Helpers/Player/HealthHelpers.js";
import {CustomUiLayerElements} from "./JensElements/CustomUiLayerElements.js";
import {StyleManager} from "../Engine/js/static/StyleManager.js";
import {LayerTypes} from "../Engine/js/Enums/LayerTypes.js";
import {EntityManager} from "../Engine/js/static/EntityManager.js";
import {PlayerFunctions} from "./Functions/PlayerFunctions.js";
import {WorldGenerator} from "./Generators/WorldGenerator.js";
import {ImageAssets} from "./Assets/ImageAssets.js";
import {ColorAssets} from "./Assets/ColorAssets.js";
import {ActionTypes} from "../Engine/js/Models/ActionTypes.js";
import {WorldFunctions} from "./Functions/WorldFunctions";

export class Setup {
    static async setup() {
        StyleManager.registerCustomStylesheet("globalOverride", "Game/Styles/global.css");
        StyleManager.registerCustomStylesheet("globalOverride", "Game/Styles/elements.css");
        const gameOptions = DataManager.getKey(DataEntries.GAME_OPTIONS);
        const globalPositionOffset = {
            x: 0,
            y: 0,
        };
        DataManager.addOrUpdateKey(DataEntries.GLOBAL_POSITION_OFFSET, globalPositionOffset);

        const aspectRatio = await this.setupBackground();

        const worldCollisions = this.setupWorldCollisions(gameOptions, aspectRatio);
        this.setupEntities(worldCollisions);
        this.setupUi(gameOptions, aspectRatio);

        UpdateManager.updateLayerList();
        let lastIntervalRun = Date.now();
        IntervalManager.startInterval(() => {
            const now = Date.now();
            UpdateManager.updateTick();
            const delta = now - lastIntervalRun;
            lastIntervalRun = now;
        }, 1000 / 120);
    }

    static async setupBackground() {
        const imgSource = ImageAssets.Background;
        const image = new Image(imgSource);
        const aspectRatio = await AspectRatioHelper.getAspectRatioFromImageSource(imgSource);
        DataManager.addOrUpdateKey(DataEntries.ASPECT_RATIO, Math.round(aspectRatio * 100) / 100);
        image.setFixedSize(AspectRatioHelper.getWidthFromHeightOrWidthAsMin(window.innerWidth, window.innerHeight, aspectRatio), AspectRatioHelper.getHeightFromWidthOrHeightAsMin(window.innerWidth, window.innerHeight, aspectRatio), e => {
            image.setFixedSize(AspectRatioHelper.getWidthFromHeightOrWidthAsMin(window.innerWidth, window.innerHeight, aspectRatio), AspectRatioHelper.getHeightFromWidthOrHeightAsMin(window.innerWidth, window.innerHeight, aspectRatio));
        });
        const imageLayer = new ImageLayer("testImage", image);
        LayerManager.addLayers(imageLayer);
        return aspectRatio;
    }

    static setupUi(gameOptions, aspectRatio) {
        const uiLayer = new UiLayer("testUi", true);
        const textId = UUID.new.generate();

        const textId2 = UUID.new.generate();
        const characterEntity = EntityManager.getByType(EntityTypes.character)[0];
        uiLayer.addTemplate("healthText", textId, UiLayerElements.text, {
            id: textId, text: `health: ${characterEntity.state.getHealth()}/${characterEntity.state.getBaseHealth()}`
        }, new Coordinates3D(0, -(gameOptions.gridSize / 2) / aspectRatio));
        uiLayer.addTemplate("positionText", textId2, UiLayerElements.text, {
            id: textId2, text: 'position: 0, 0'
        });
        const imageId = UUID.new.generate();
        uiLayer.addTemplate("healthImages", imageId, CustomUiLayerElements.imageArray, {
            images: HealthHelpers.getHealthImages(characterEntity.state)
        }, new Coordinates3D(-(gameOptions.gridSize / 2), -(gameOptions.gridSize / 2) / aspectRatio), false);

        LayerManager.addLayers(uiLayer);
    }

    static setupWorldCollisions(gameOptions, aspectRatio) {
        const xCollision = gameOptions.gridSize / 2;
        const yCollision = (gameOptions.gridSize / 2) / aspectRatio;
        const wallCollision = new PositionCollision(
            Math.floor(-xCollision),
            Math.floor(xCollision),
            Math.floor(-yCollision),
            Math.floor(yCollision)
        ).ignoreZ();
        const floorFactor = {
            x: 0.8,
            y: 0.55
        };
        const floorCollision = new PositionCollision(
            Math.floor(-xCollision * floorFactor.x),
            Math.floor(xCollision * floorFactor.x),
            Math.floor(-yCollision * floorFactor.y),
            Math.floor(yCollision * floorFactor.y)
        ).ignoreZ().lowPriority();

        const collisions = {
            wallCollision,
            floorCollision
        };
        DataManager.addOrUpdateKey(DataEntries.WORLD_COLLISIONS, collisions);
        return collisions;
    }

    static insertRandomEnemy() {
        console.log("inserting enemy");
        const worldCollisions = DataManager.getKey(DataEntries.WORLD_COLLISIONS);
        const entityLayer = LayerManager.getLayerByName("characters");
        const characterEntity = EntityManager.getByType(EntityTypes.character)[0];
        const characterCollision = characterEntity.getCollision().ignoreZ().isNonPhysical();

        const newEnemyPosition = new Coordinates3D(
            Math.random() * worldCollisions.floorCollision.width - (worldCollisions.floorCollision.width / 2),
            Math.random() * worldCollisions.floorCollision.height - (worldCollisions.floorCollision.height / 2)
        );
        const newEnemy = new EnemyEntity("enemy" + Math.random().toString(), ColorAssets.Enemy, new Size3D(5, 5), newEnemyPosition);
        const newEnemyCollision = newEnemy.getCollision().ignoreZ().isNonPhysical();
        newEnemy.addCollisions(worldCollisions.floorCollision, characterCollision);
        newEnemy.setSpeed(.5);
        newEnemy.setTarget(characterEntity);
        characterEntity.addCollisions(newEnemyCollision);
        entityLayer.addEntities(newEnemy);
        UpdateManager.updateLayer(entityLayer);
    }

    static setupEntities(worldCollisions) {
        //const worldEntityCollisions = this.setupWorldEntities(worldCollisions);
        const entityLayer = new EntityLayer("characters");
        const characterEntity = new CharacterEntity("test", ColorAssets.Player, new Size3D(40, 52), new Coordinates3D(0, 0), new Rotation(0), 1, new PlayerState(3, 3));
        characterEntity.setAsPlayer();
        const characterCollision = characterEntity.getCollision().ignoreZ().isNonPhysical();
        characterEntity.hook.setOnCollide(async (c, collidingEntity, collision, collisionSuccess) => {
            if (!collidingEntity) {
                return;
            }
            if (collidingEntity.type === EntityTypes.enemy || collidingEntity.type === EntityTypes.bullet) {
                await PlayerFunctions.damage(c, collidingEntity);
            }
        });
        characterEntity.hook.setOnAction(ActionTypes.key_space, (entity, data) => {
            console.log("space has been pressed for " + data.count + " times");
            WorldFunctions.damageInRadiusFromCoordinates3d(entity.position, entity.size.width, 1);
        });
        entityLayer.addEntities(characterEntity);

        //setTimeout(Setup.insertRandomEnemy, 2000);

        characterEntity.addCollisions(worldCollisions.floorCollision);
        //characterEntity.addCollisions(...worldEntityCollisions);
        characterEntity.hook.setOnMove(c => {
            const uiLayer = LayerManager.getLayersByType(LayerTypes.ui)[0];
            uiLayer.updateElementByName("positionText", {
                text: `position: ${c.position.x}, ${c.position.y}`
            });
        })

        LayerManager.addLayers(entityLayer);
    }

    static setupWorldEntities(worldCollisions) {
        const worldEntityLayer = new EntityLayer("worldEntities");
        const collisions = this.setupGeneratedEntities(worldEntityLayer, worldCollisions);

        /*
        const blockEntity2 = new BlockEntity("test", new Texture("#fff"), new Size3D(100, 100), new Coordinates3D(100, 100), new Rotation(0));
        const boxCollision = blockEntity2.getCollision().ignoreZ().lowPriority();
        worldEntityLayer.addEntities(blockEntity2);

        const collisions = {
            boxCollision
        };*/
        DataManager.addOrUpdateKey(DataEntries.WORLD_ENTITY_COLLISIONS, collisions);
        LayerManager.addLayers(worldEntityLayer);
        return collisions;
    }

    static setupGeneratedEntities(layer, worldCollisions) {
        const rooms = WorldGenerator.generateRooms(1, {x: 19, y: 10});
        let collisions = [];
        const startRoom = rooms[0];
        const windowScale = AspectRatioHelper.getWindowScale();
        const blockSize = 35;
        for (const tile of startRoom.tiles) {
            const x = tile.position.x - 5;
            const y = tile.position.y - 5;
            const blockEntity = new BlockEntity("tile", new Texture("#aaa"), new Size3D(blockSize, blockSize), new Coordinates3D(x * 50 * windowScale.ar, y * 50), new Rotation(0));
            const floorCollisionSuccess = worldCollisions.floorCollision.success(blockEntity);
            if (!floorCollisionSuccess.all) {
                continue;
            }
            const collision = blockEntity.getCollision().ignoreZ().lowPriority();
            collisions.push(collision);
            layer.addEntities(blockEntity);
        }
        return collisions;
    }
}