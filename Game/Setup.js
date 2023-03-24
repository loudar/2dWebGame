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
import {EnemyEntity} from "../Engine/js/Models/LayerContent/Entity/EnemyEntity.js";
import {EntityTypes} from "../Engine/js/Enums/EntityTypes.js";
import {PlayerState} from "./Models/States/PlayerState.js";
import {HealthHelpers} from "./Helpers/Player/HealthHelpers.js";
import {CustomUiLayerElements} from "./JensElements/CustomUiLayerElements.js";
import {StyleManager} from "../Engine/js/static/StyleManager.js";
import {LayerTypes} from "../Engine/js/Enums/LayerTypes.js";
import {EntityManager} from "../Engine/js/static/EntityManager.js";

export class Setup {
    static async setup() {
        StyleManager.registerCustomStylesheet("globalOverride", "Game/Styles/global.css");
        StyleManager.registerCustomStylesheet("globalOverride", "Game/Styles/elements.css");
        const gameOptions = DataManager.getKey(DataEntries.GAME_OPTIONS);

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
        const imgSource = "assets/images/Stage_Basement_room.webp";
        const image = new Image(imgSource);
        const aspectRatio = await AspectRatioHelper.getAspectRatioFromImageSource(imgSource);
        DataManager.addOrUpdateKey(DataEntries.ASPECT_RATIO, aspectRatio);
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
            x: 0.775,
            y: 0.65
        };
        const floorCollision = new PositionCollision(
            Math.floor(-xCollision * floorFactor.x),
            Math.floor(xCollision * floorFactor.x),
            Math.floor(-yCollision * floorFactor.y),
            Math.floor(yCollision * floorFactor.y)
        ).ignoreZ().lowPriority();

        return {
            wallCollision,
            floorCollision
        }
    }

    static setupEntities(worldCollisions) {
        const entityLayer = new EntityLayer("testEntity");
        const enemyEntity = new EnemyEntity("enemy", new CharacterTexture("#f0f"), new Size3D(5, 5), new Coordinates3D(200, 200));
        enemyEntity.setSpeed(.5);
        const blockEntity2 = new BlockEntity("test", new Texture("#fff"), new Size3D(100, 100), new Coordinates3D(100, 100), new Rotation(0));
        const boxCollision = blockEntity2.getCollision().ignoreZ().lowPriority();
        const enemyCollision = enemyEntity.getCollision().ignoreZ().isNonPhysical();

        const characterEntity = new CharacterEntity("test", new CharacterTexture(), new Size3D(10, 10), new Coordinates3D(0, 0), new Rotation(0), 1, new PlayerState(3, 3));
        characterEntity.setAsPlayer();
        enemyEntity.setTarget(characterEntity);

        characterEntity.hook.setOnCollide((c, collidingEntity, collision, collisionSuccess) => {
            if (!collidingEntity) {
                return;
            }
            if (collidingEntity.type === EntityTypes.enemy) {
                const oldHealth = c.state.getHealth();
                c.state.setHealth(oldHealth - 1);
                if (oldHealth === c.state.getHealth()) {
                    return;
                }
                const uiLayer = LayerManager.getLayersByType(LayerTypes.ui)[0];
                const damageId = UUID.new.generate();
                uiLayer.addTemplate("damageText" + damageId, UUID.new.generate(), CustomUiLayerElements.damageText, {
                    text: "-1"
                }, new Coordinates3D(c.position.x, c.position.y), true);
                uiLayer.updateElementByName("damageText" + damageId, {
                    text: "-1"
                }, new Coordinates3D(c.position.x, c.position.y), true);
                setTimeout(() => {
                    uiLayer.removeElementByName("damageText" + damageId);
                }, 1000);
                uiLayer.updateElementByName("healthText", {
                    text: `health: ${c.state.getHealth()}/${c.state.getBaseHealth()}`
                });
                uiLayer.updateElementByName("healthImages", {images: HealthHelpers.getHealthImages(c.state)});
                c.state.setDamageLock();
            }
        });
        const characterCollision = characterEntity.getCollision().ignoreZ().isNonPhysical();
        enemyEntity.addCollisions(worldCollisions.floorCollision, boxCollision, characterCollision);
        entityLayer.addEntities(enemyEntity, blockEntity2, characterEntity);

        characterEntity.addCollisions(enemyCollision, worldCollisions.floorCollision, boxCollision);
        characterEntity.hook.setOnMove(c => {
            const uiLayer = LayerManager.getLayersByType(LayerTypes.ui)[0];
            uiLayer.updateElementByName("positionText", {
                text: `position: ${c.position.x}, ${c.position.y}`
            });
        })

        LayerManager.addLayers(entityLayer);
    }
}