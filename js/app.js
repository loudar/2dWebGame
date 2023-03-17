import {LayerManager} from "./static/LayerManager.js";
import {ImageLayer} from "./Models/ImageLayer.js";
import {DataManager} from "./static/DataManager.js";
import {DataEntries} from "./Enums/DataEntries.js";
import {UpdateManager} from "./static/UpdateManager.js";
import {Image} from "./Models/Image.js";

const image = new Image("https://64.media.tumblr.com/d4646b444b99c2b2249b421e9ac6b7df/5bfa5a176a9dabd6-9f/s1280x1920/53656c627ac905f0ae0749890407312a925f5503.jpg");
const layer = new ImageLayer("testImage", image);
LayerManager.addLayer(layer);

const appDom = document.getElementById("app");
DataManager.addKey(DataEntries.APP_DOM, appDom);

UpdateManager.updateLayerList();