import {ColorScheme} from "./Objects/ColorScheme"
import { Helpers } from "./Objects/Helpers";
import { Context } from "./Objects/Context";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    onLoad () {
        var bar = this.node.getChildByName("progressBar");

        var progress = bar.getComponent(cc.ProgressBar);
        progress.totalLength = this.node.width;
        bar.setPosition((-(this.node.width / 2)) + bar.width / 2, 0);
    }
    getBallRepAsSF(sprite:cc.Sprite, id:string)
    {
        cc.loader.loadRes("Balls/"+id, function (err, res) {
            if(!err)
            {
                cc.log("Resource Loaded!")
                sprite.spriteFrame = new cc.SpriteFrame(res);
            }else
            {
                cc.log(err.message);
            }
        });
    }
    inSession:boolean = true;

    gameEnd:boolean = false;

    sessionTimer:number = 0.00;

    start () {
        this.inSession = true;
        this.sessionTimer = 0.00;
        this.getEndGame().getChildByName("Menu").on('touchstart', function() {
            if(!this.inSession){cc.director.loadScene("MainMenu")}}, this);
        this.node.getChildByName("Pause").on('touchstart', this.onPauseTouchEvent, this);
        this.getBallRepAsSF(this.node.getChildByName("Ball").getComponent(cc.Sprite), Helpers.skins.CurBall);
        this.getEndGame().getChildByName("CoinCnt").getComponent(cc.Label).string = "$"+Helpers.user.Coins;
        Helpers.scheme.loadColors(this.node);
        Helpers.scheme.loadColors(this.getEndGame());
        Helpers.setAllVolume(this.node);
    }
    onPauseTouchEvent(e)
    {
        if(this.inSession)
        {
            this.pause();
        }
        else
        {
            this.unpause();
        }
    }
    addCoin(c:number)
    {
        Helpers.user.Coins += c;
        Helpers.user.NetWorth += c;
        this.curRoundCC += c;
        this.getEndGame().getChildByName("CoinCnt").getComponent(cc.Label).string = "$"+Helpers.user.Coins;
    }

    actions:Array<cc.Action> = null;
    getEndGame()
    {return this.node.getChildByName("Endgame");}
    pause()
    {
        this.freeze();
        this.getEndGame().getChildByName("Paused_Message").getComponent(cc.RichText).string = 
        "<color=#" + Helpers.scheme.toHex(Helpers.scheme.curScheme.Secondary) + ">Paused...</color>";
        this.getEndGame().getChildByName("HighScore").getComponent(cc.Label).string = "" + Helpers.user.HighScore.toFixed(2);
        this.fade(15);
        var Resume = this.getEndGame().getComponentInChildren("RestartControl");
        Resume.switchModes(1);
        Resume.node.runAction(cc.fadeIn(0.25));
        this.getEndGame().runAction(cc.fadeIn(0.25));
        this.node.getChildByName("Stopwatch").runAction(cc.fadeOut(0.125));
    }
    fade(o)
    {
        var chw = this.node.getComponentsInChildren("FadeElem");
        for(var i = 0; i < chw.length; i++)
        {
            chw[i].fade(o);
        }
        var ch = this.getEndGame().getComponentsInChildren("FadeElem");
        for(var i = 0; i < ch.length; i++)
        {
            ch[i].fade(o);
        }
    }

    unfade()
    {
        var chw = this.node.getComponentsInChildren("FadeElem");
        for(var i = 0; i < chw.length; i++)
        {
            chw[i].unFade();
        }
        var ch = this.getEndGame().getComponentsInChildren("FadeElem");
        for(var i = 0; i < ch.length; i++)
        {
            ch[i].unFade();
        }
    }
    unpause()
    {
        cc.director.getActionManager().resumeTargets(this.actions);
        this.inSession = true;
        this.getEndGame().getChildByName("Paused_Message").getComponent(cc.RichText).string = "";
        this.unfade();
        this.getEndGame().runAction(cc.fadeOut(0.125));
    }

    freeze()
    {
        this.actions = cc.director.getActionManager().pauseAllRunningActions();
        this.node.getChildByName("Ball").stopAllActions();
        this.inSession = false;
    }
    curRoundCC:number = 0;
    gameOver() {
        cc.log("Game End!");
        this.gameEnd = true;
        this.freeze();
        this.fade(0);
        this.getEndGame().getChildByName("Paused_Message").getComponent(cc.RichText).string = 
        "<color=#" + Helpers.scheme.toHex(Helpers.scheme.curScheme.Secondary) + ">Game Over</color>";
        Helpers.randomizeScheme();
        localStorage.setItem("lastScheme", (Math.floor(Math.random() * ColorScheme.numSchemes)) + "");
        if(cc.sys.isMobile)
        {
            var rand = ((Math.random() * 100) + 1);
            if(rand < 10)
            {
                Context.showAd("gameover");
            }
        }
        Helpers.user.Count = Helpers.user.Count + 1;
        Helpers.user.TotalTime = Helpers.user.TotalTime + this.sessionTimer;
        Helpers.user.AllTimes.push(this.sessionTimer);
        if(Helpers.getLootbox(this.sessionTimer))
        {
            Helpers.user.LootBoxes++;
            this.getEndGame().getChildByName("Plus").runAction(cc.fadeIn(0.25));
            this.getEndGame().getChildByName("Box").runAction(cc.fadeIn(0.25));
        }
        Helpers.updatePlayer();
        var Resume = this.getEndGame().getChildByName("Resume");
        Resume.getComponent("RestartControl").switchModes(0);
        Resume.runAction(cc.fadeIn(0.25));
        this.getEndGame().getChildByName("CoinCntRound").getComponent(cc.Label).string = "+$" + this.curRoundCC;
        this.getEndGame().getChildByName("HighScore").getComponent(cc.Label).string = "" + Helpers.user.HighScore.toFixed(2);
        this.getEndGame().runAction(cc.fadeIn(0.125));
        this.node.getChildByName("Stopwatch").opacity = 0;
    }
    restart()
    {
        Helpers.updatePlayer();
        cc.director.loadScene("PlayScene");
    }

    update (dt) {
        if(this.inSession)
        {
            this.sessionTimer += dt;
            this.node.getChildByName("Timer").getComponent(cc.Label).string = "" + this.sessionTimer.toFixed(1);
            
            this.getEndGame().getChildByName("PostTimer").getComponent(cc.Label).string = "" + this.sessionTimer.toFixed(2);
            
            if(this.sessionTimer > Helpers.user.HighScore)
            {
                Helpers.user.HighScore = this.sessionTimer;                
            }
        }
    }
}




