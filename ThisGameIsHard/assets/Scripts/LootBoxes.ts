import {Helpers} from "./Objects/Helpers"
const {ccclass, property} = cc._decorator;

@ccclass
export default class LootBoxes extends cc.Component {
    count:number = 0;
    start () {
        this.node.getChildByName("Back").on('touchstart', function() { Helpers.switchScenes("PaletteEdit",this.node)}, this);    
        this.node.getChildByName("Count").getComponent(cc.Label).string = "x" + Helpers.user.LootBoxes;
        var list = Helpers.schemeList.List.filter(e => e.unl == false);
        if(list.length <= 0)
        {
            this.node.getChildByName("Box").runAction(cc.fadeOut(1));
            this.node.getChildByName("ErrMsg").getComponent(cc.Label).string = "You have all\nthe schemes!";
            this.node.getChildByName("ErrMsg").runAction(cc.fadeIn(1));
            this.node.getChildByName("Count").opacity = 0;
        }else{
            var Box = this.node.getChildByName("Box");
            Box.on('touchstart', this.choose, this)
            this.shake();
        }
        this.count = 0;
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
            this.node.getChildByName("ErrMsg").getComponent(cc.Label).string = "You have all the schemes!";
            this.node.getChildByName("ErrMsg").runAction(cc.fadeIn(1));
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

        this.node.addChild(nod);
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
