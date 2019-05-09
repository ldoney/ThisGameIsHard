import {Helpers} from "./Objects/Helpers"
const {ccclass, property} = cc._decorator;

@ccclass
export default class LootBoxes extends cc.Component {
    count:number = 0;
    touchable:boolean = true;
    start () {
        this.node.getChildByName("Back").on('touchstart', function() { Helpers.switchScenes("PaletteEdit",this.node)}, this);    
        this.node.getChildByName("Count").getComponent(cc.Label).string = "x" + Helpers.user.LootBoxes;
        var list = Helpers.schemeList.List.filter(e => e.unl == false);
        Helpers.setUpSounds(this.node);
        if(list.length <= 0)
        {
            this.node.getChildByName("Box").runAction(cc.fadeOut(1));
            this.node.getChildByName("ErrMsg").getComponent(cc.Label).string = "You have all\nthe schemes!";
            this.node.getChildByName("ErrMsg").runAction(cc.fadeIn(1));
            if(Helpers.user.LootBoxes > 0)
            {
                this.setupExchange();
            }
            this.node.getChildByName("Count").opacity = 0;
        }else{
            var Box = this.node.getChildByName("Box");
            Box.on('touchstart', this.choose, this)
            this.shake();
        }
        this.count = 0;
    }
    setupExchange()
    {
        this.node.getChildByName("Exchange").runAction(cc.fadeIn(1));
        this.node.getChildByName("Exchange").getChildByName("Count").getComponent(cc.Label).string = "x" + Helpers.user.LootBoxes;
        this.node.getChildByName("Exchange").getChildByName("Button").on("touchstart", function(){
            if(this.touchable)
            {
                Helpers.exchangeBox();
                this.node.getChildByName("Exchange").getChildByName("Count").getComponent(cc.Label).string = "x" + Helpers.user.LootBoxes;
                if(Helpers.user.LootBoxes <= 0)
                {
                    this.touchable = false;
                }
                var FlimLam = this.node.getChildByName("CoinFlimLam");
                FlimLam.runAction(cc.sequence(
                    cc.fadeIn(0.25),
                    cc.moveBy(0.5,cc.v2(0, 50)),
                    cc.fadeOut(0.5),
                    cc.moveBy(0.0000000000000001, cc.v2(0,-50)),                    
                ));                    
                if(Helpers.user.LootBoxes <= 0)
                {
                    this.node.getChildByName("Exchange")
                    .runAction(cc.fadeOut(0.25));
                }
            }                
            }
        , this);
    }
    shake()
    {
        if(Helpers.user.LootBoxes > 0)
        {
            var Box = this.node.getChildByName("Box");
            Box.opacity = 255;
            this.node.getChildByName("ErrMsg").opacity = 0;
            Box.runAction(cc.repeatForever(cc.sequence(
                cc.rotateBy(0.01,15),
                cc.rotateBy(0.01,-15),
                cc.rotateBy(0.01,-15),
                cc.rotateBy(0.01,15),
                cc.delayTime(2),
            )));
        }
    }
    unlock(ID:string)
    {
        var elem = Helpers.schemeList.List.filter(e => e.ID == ID)[0];
        Helpers.user.LootBoxes--;
        Helpers.updatePlayer();
        elem.unl = true;
        elem.Enabled = true;
        this.createItemDisp(elem);
        Helpers.updateSchemes();
    }
    updateCount()
    {
        this.node.getChildByName("Count").getComponent(cc.Label).string = "x" + Helpers.user.LootBoxes;
        var list = Helpers.schemeList.List.filter(e => e.unl == false);
        if(Helpers.user.LootBoxes < 1)
        {
            this.node.getChildByName("Box").runAction(cc.fadeOut(1));
            this.node.getChildByName("ErrMsg").getComponent(cc.Label).string = "You ran out :(";
            this.node.getChildByName("ErrMsg").runAction(cc.fadeIn(1));
        }else if(list.length <= 0)
        {
            this.node.getChildByName("Box").runAction(cc.fadeOut(1));
            this.node.getChildByName("ErrMsg").getComponent(cc.Label).string = "You have all\nthe schemes!";
            this.node.getChildByName("ErrMsg").runAction(cc.fadeIn(1));
            if(Helpers.user.LootBoxes > 0)
            {
                this.node.getChildByName("Count").runAction(cc.fadeOut(0.25));
                this.node.getChildByName("NewDisp").runAction(cc.fadeOut(0.25));
                this.setupExchange();
            }
        }
    }
    choose()
    {
        var list = Helpers.schemeList.List.filter(e => e.unl == false);
        var index = (Math.floor(Math.random() * list.length));
        if(list.length > 0)
        {
        var amount = Math.floor((Math.random()* 10) + 1);
        var Box = this.node.getChildByName("Box");
        Box.setPosition(0,0);
        Box.runAction(cc.sequence(cc.moveBy(0.01, cc.v2(amount, 0)),
        cc.moveBy(0.01, cc.v2(0, -amount)),
        cc.moveBy(0.01, cc.v2(0, amount)),
        cc.moveBy(0.01, cc.v2(-amount, 0))));
        this.count++;
        if(this.count >= 5)
        {
            this.count = 0;
            this.unlock(list[index].ID);
            this.updateCount();
        }
    }
    }
    createItemDisp(scheme)
    {
        var nod = new cc.Node();
        nod.name = scheme.ID;
        nod.addComponent(cc.Sprite);
        var sprite = nod.getComponent(cc.Sprite);            
        Helpers.setFrame(sprite, "Sprites/Button");

        var lblnode = new cc.Node();
        lblnode.addComponent(cc.Label);
        var lbl = lblnode.getComponent(cc.Label);
        lbl.string = scheme.Name;

        lblnode.scaleX = 0.87;
        lblnode.color = Helpers.fromHex(scheme.Primary);
        nod.color = Helpers.fromHex(scheme.Background);            
        nod.addChild(lblnode);

        nod.setPosition(0, -200);
        nod.setScale(0.11, 0.11);

        this.node.getChildByName("NewDisp").addChild(nod);
        nod.runAction(cc.sequence(
            cc.spawn(
                cc.fadeIn(0.25),
                cc.scaleTo(0.2,0.61,0.61),
                cc.rotateBy(0.2,360),
                ),
            cc.delayTime(5),
            cc.fadeOut(10)
        ))
    }
}
