import {Helpers} from "./Objects/Helpers"
import {Context} from "./Objects/Context"

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadingScreenScript extends cc.Component {
    adviceList:string[] = ["Don't like a color scheme?\nClick the palette button!", 
                            "Have a great day!",
                            "Be careful- This game is hard",
                            "You may want to make sure there\nare no sharp objects nearby...",
                            "This game is still in beta!",
                            "Try to do the things that you're\nincapable of",
                            "Try to balance your speed!",
                            "Created by Lincoln Doney",
                            "Dark chocolate is nasty",
                            "Check out my youtube channel!\n@Nastyheatnor",
                            "Minecraft > Fortnite",
                            "Loot boxes are rather rare!",
                            "The best skin is the Soccer Ball\nChange my mind",
                            "This loading screen is\nquite a challenge",
                            "Purple Cow Men!",
                            "Yes. There are no settings.",
                            "There is a tutorial in the\nsettings menu",
                            "Modes are coming soon!",
                            "My high score is 69.58s, can\nyou beat it?",
                            "I have a minecraft girlfriend",
                            "How many shrimp can you eat\nuntil you make your skin turn pink?",
                            "I hate Evan Hartnett",
                            "Ride em Cowboy!",
                            "You should just give up",
                            "Coded in Typescript!"];
    onLoad () {
        this.node.getChildByName("Loading").runAction(cc.repeatForever(cc.rotateBy(1,360)));
        this.node.getChildByName("LogoWhite").runAction(cc.fadeIn(2));
        Helpers.checkForDBUpdates();
        Helpers.setUpAll();
        if(cc.sys.isMobile)
        {
            Context.setupAds();
        }
        
        
        cc.director.preloadScene("MainMenu");
        this.node.getChildByName("Loading").runAction(cc.sequence(cc.delayTime(4), cc.fadeOut(1)));
        this.node.getChildByName("LogoWhite").runAction(cc.sequence(
            cc.delayTime(2),cc.fadeOut(2), cc.delayTime(2), cc.callFunc(this.loadIn)
            ));
        this.node.on('touchstart', this.loadIn, this);
        var advice = this.node.getChildByName("Advice");
        advice.getComponent(cc.Label).string = this.adviceList[Math.floor(Math.random() * this.adviceList.length)];
        advice.runAction(cc.sequence(cc.fadeIn(0.50), cc.delayTime(3.5), cc.fadeOut(1)));

    }
    loadIn() {
        cc.director.loadScene("MainMenu");
    }
}
