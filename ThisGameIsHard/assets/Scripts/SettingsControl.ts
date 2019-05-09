import { Helpers } from "./Objects/Helpers";
import { Context } from "./Objects/Context";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SettingsControl extends cc.Component {
    window:cc.Node = null;
    start () {
        Helpers.scheme.loadColors(this.node);
        Helpers.setUpSounds(this.node);

        this.node.getChildByName("Back").on('touchstart', function() { Helpers.returnToMenu(this.node)}, this)
        this.node.getChildByName("Help").on('touchstart', function() { Helpers.switchScenes("Tutorial",this.node)}, this)
        //this.node.getChildByName("Reset").on('touchstart', this.reset, this);
        this.node.getChildByName("PPolicy").on('touchstart', function() { Helpers.switchScenes("PrivacyPolicy",this.node)}, this)
    }
    reset()
    {
        Context.resetCharacter();
        Helpers.checkForDBUpdates();
        
        Helpers.setUpAll();
    }
}
