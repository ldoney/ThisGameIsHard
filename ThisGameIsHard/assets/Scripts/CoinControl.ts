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
        cc.director.getCollisionManager().enabled = true;
        this.spawnCoin();
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
                this.node.parent.getChildByName("Stopwatch").stopAllActions();
                this.node.parent.getChildByName("Stopwatch").runAction(cc.fadeOut(0.1));
                this.node.parent.getComponent("Game").addCoin(1);
                this.spawnCoin();
            }
        }
    }
    onCollisionEnter(other)
    {
        this.onCollisionStay(other);
    }
    firstSpawn:boolean = true;
    canCollect:boolean = true;
    spawnCoin() {
        var canvas = this.node.getParent();
        var width = (canvas.width/2);
        var height = (canvas.height/2);
        this.node.opacity = 0;
        this.canCollect = false;
        if(this.node.getPosition() != null)
            {
                var faded = cc.instantiate(this.node);
                faded.removeComponent(CoinControl);
                this.node.parent.addChild(faded);
                faded.runAction(cc.fadeOut(0.125));
            }
        do
        {
            
            this.node.setPosition(Helpers.getRndInt(-(width) + this.padLeft, (width) - this.padRight), 
                                  Helpers.getRndInt(-(height) + this.padBottom, (height) - this.padTop));

            this.currentTime = this.maxTime;
        }while((Helpers.getDistance(this.node, this.node.parent.getChildByName("Ball")) < this.node.parent.getChildByName("Ball").width * 2.5
        && (this.node.parent.getComponent("Game").inSession || this.firstSpawn)))
        this.firstSpawn = false;
        this.node.opacity = 255;
        this.node.setRotation(0);
        this.node.runAction(
            cc.repeatForever(
                cc.rotateBy(5,360))
            );
        this.canCollect = true;
    }
    update (dt: number) {
        if(this.node.parent.getComponent("Game").inSession)
        {
            this.currentTime -= dt;
            this.node.parent.getChildByName("progressBar").getComponent(cc.ProgressBar).progress = (this.currentTime / this.maxTime);
            if(this.currentTime <= 2 && this.node.parent.getChildByName("Stopwatch").getNumberOfRunningActions() == 0)
            {
                this.node.parent.getChildByName("Stopwatch").stopAllActions();

                this.node.parent.getChildByName("Stopwatch").runAction(cc.fadeIn(0.2));
                this.node.parent.getChildByName("Stopwatch").runAction(cc.repeatForever(cc.sequence(cc.fadeIn(0.3), cc.fadeOut(0.3))));
            }
            if(this.currentTime <= 0)
            {
                this.node.parent.getComponent("Game").gameOver();
            }
        }
    }
}
