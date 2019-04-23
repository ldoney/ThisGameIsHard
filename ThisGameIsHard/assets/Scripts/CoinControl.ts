import { Helpers } from "./Objects/Helpers";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CoinControl extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    @property
    padLeft:number = 120

    @property
    padRight:number = 120

    @property
    padTop:number = 120

    @property
    padBottom:number = 120

    @property
    maxTime:number = 5

    currentTime:number = this.maxTime;
    
    onLoad () {
        this.spawnCoin();
        cc.director.getCollisionManager().enabled = true;
    
       this.node.addComponent(cc.CircleCollider);
       this.node.getComponent(cc.CircleCollider).radius = this.node.width/2;
       this.node.getComponent(cc.CircleCollider).enabled = true;
    }
    onCollisionStay(other)
    {
        if(this.canCollect)
        {
            if(other.node.name == "Ball")
            {
                this.node.parent.getComponent("Game").addCoin(1);
                this.spawnCoin();
            }
        }
    }
    onCollisionEnter(other)
    {
        this.onCollisionStay(other);
    }
    canCollect:boolean = true;
    spawnCoin() {
        var canvas = this.node.getParent();
        var width = (canvas.width/2);
        var height = (canvas.height/2);
        cc.log(Helpers.getDistance(this.node, this.node.parent.getChildByName("Ball")) + " / " + this.node.parent.getChildByName("Ball").width * 1.5);
        this.node.opacity = 0;
        this.canCollect = false;
        do
        {
            cc.log(Helpers.getDistance(this.node, this.node.parent.getChildByName("Ball")) + " / " + this.node.parent.getChildByName("Ball").width * 1.5);
            if(this.node.getPosition() != null)
            {
                var faded = cc.instantiate(this.node);
                faded.removeComponent(CoinControl);
                this.node.parent.addChild(faded);
                faded.runAction(cc.fadeOut(0.125));
            }
            this.node.setPosition(Helpers.getRndInt(-(width) + this.padLeft, (width) - this.padRight), 
                                  Helpers.getRndInt(-(height) + this.padBottom, (height) - this.padTop));

            this.currentTime = this.maxTime;
        }while((Helpers.getDistance(this.node, this.node.parent.getChildByName("Ball")) < this.node.parent.getChildByName("Ball").width * 3))
        this.node.opacity = 255;
        this.canCollect = true;
    }
    update (dt: number) {
        if(this.node.parent.getComponent("Game").inSession)
        {
            this.currentTime -= dt;
            this.node.parent.getChildByName("progressBar").getComponent(cc.ProgressBar).progress = (this.currentTime / this.maxTime);
            if(this.currentTime <= 0)
            {
                this.node.parent.getComponent("Game").gameOver();
            }
        }
    }
}
