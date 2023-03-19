import {LayerManager} from "./static/LayerManager.js";
import {ImageLayer} from "./Models/Layers/ImageLayer.js";
import {DataManager} from "./static/DataManager.js";
import {DataEntries} from "./Enums/DataEntries.js";
import {UpdateManager} from "./static/UpdateManager.js";
import {Image} from "./Models/LayerContent/Image/Image.js";
import {StyleManager} from "./static/StyleManager.js";
import {AspectRatioHelper} from "./Helpers/AspectRatioHelper.js";
import {EntityLayer} from "./Models/Layers/EntityLayer.js";
import {Size3D} from "./Models/Size3D.js";
import {CharacterEntity} from "./Models/LayerContent/Entity/CharacterEntity.js";
import {CharacterTexture} from "./Models/CharacterTexture.js";
import {BlockEntity} from "./Models/LayerContent/Entity/BlockEntity.js";
import {Texture} from "./Models/Texture.js";
import {Coordinates3D} from "./Models/Coordinates3D.js";
import {Rotation} from "./Models/Rotation.js";

StyleManager.initialize();

const appDom = document.getElementById("app");
DataManager.addKey(DataEntries.APP_DOM, appDom);

const imgSource = "assets/images/Stage_Basement_room.webp";
const image = new Image(imgSource);
const aspectRatio = await AspectRatioHelper.getAspectRatioFromImageSource(imgSource);
DataManager.addKey(DataEntries.ASPECT_RATIO, aspectRatio);
image.setFixedSize(AspectRatioHelper.getWidthFromHeightOrWidthAsMin(window.innerWidth, window.innerHeight, aspectRatio), AspectRatioHelper.getHeightFromWidthOrHeightAsMin(window.innerWidth, window.innerHeight, aspectRatio), e => {
    image.setFixedSize(AspectRatioHelper.getWidthFromHeightOrWidthAsMin(window.innerWidth, window.innerHeight, aspectRatio), AspectRatioHelper.getHeightFromWidthOrHeightAsMin(window.innerWidth, window.innerHeight, aspectRatio));
});
const imageLayer = new ImageLayer("testImage", image);
LayerManager.addLayer(imageLayer);

const entityLayer = new EntityLayer("testEntity");

const blockEntity = new BlockEntity("test", new Size3D(1, 2), new Texture("#ff0"), new Coordinates3D(2, 0), new Rotation(45));
entityLayer.addEntity(blockEntity);
const blockEntity2 = new BlockEntity("test", new Size3D(1, 2), new Texture("#fff"), new Coordinates3D(50, 0), new Rotation(0));
entityLayer.addEntity(blockEntity2);

const characterEntity = new CharacterEntity("test", new Size3D(1, 2), new CharacterTexture());
characterEntity.setAsPlayer(true);
entityLayer.addEntity(characterEntity);

LayerManager.addLayer(entityLayer);

UpdateManager.updateLayerList();