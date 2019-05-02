import {ColorScheme} from "./ColorScheme"
import {jsOBJs} from "./jsOBJs"
export class Helpers {
    static schemeList = jsOBJs.schemeList;    
    static skinDB     = jsOBJs.skinDB;
    static skins      = jsOBJs.skins;
    static user       = jsOBJs.user;
    static scheme:ColorScheme = null;
    static songPos    = 0;
    static toHex(col)
    {
        return col.toHEX(col);
    }
    static fromHex(hex) {
        var temp = cc.Color.BLACK;
        return temp.fromHEX("#" + hex);
    }
    static clearAll()
    {
        this.schemeList = jsOBJs.schemeList;    
        this.skinDB     = jsOBJs.skinDB;
        this.skins      = jsOBJs.skins;
        this.user       = jsOBJs.user;
        this.scheme     = null;
    }
    static setUpAll()
    {
        this.checkForDBUpdates();
        this.setUpLastScheme();
        this.setUpSkinDB();
        this.setUpSkins();
        this.setUpUsers();
        this.scheme.checkForSchemeUpdates();
        this.setUpSchemes();
    }   
    static setUpLastScheme()
    {
        this.scheme = new ColorScheme();
        this.randomizeScheme();
    }
    static updateMusicTime(canvas:cc.Node)
    {
        if(canvas.getComponent(cc.AudioSource) != null)
        {
            Helpers.songPos = canvas.getComponent(cc.AudioSource).getCurrentTime();
        }
    }
    static setUpSounds(canvas:cc.Node)
    {
        Helpers.updateSongTime(canvas);
        Helpers.setAllVolume(canvas);
    }
    static updateSongTime(canvas:cc.Node)
    {
        this.changeSongTimeTo(this.songPos, canvas);
    }
    static changeSongTimeTo(value:number, canvas:cc.Node)
    {
        if(canvas.getComponent(cc.AudioSource) != null)
        {
            canvas.getComponent(cc.AudioSource).setCurrentTime(value);
        }
    }
    static setUpSkinDB()
    {
        if(localStorage.getItem("skinDB") != null)
        {
            this.skinDB = JSON.parse(localStorage.getItem("skinDB"));
        }else
        {
            this.updateSkins();
        }
    } 
    static setUpUsers()
    {
        if(localStorage.getItem("userData") != null)
        {
            this.user = JSON.parse(localStorage.getItem("userData"));
        }
        else
        {
            this.updatePlayer();
        }
    }
    static setUpSchemes()
    {
        if(localStorage.getItem("schemeDB") != null)
        {
            this.schemeList = JSON.parse(localStorage.getItem("schemeDB"));
        }
        else
        {
            this.updateSchemes();
        }
    }
    static getLootbox(time:number)
    {
        var rand = ((Math.random() * 100) + 1);
        if((time > 100 && rand <= 25) || 
           (time > 50 && rand <= 15)  ||
           (time > 25 && rand <= 10)  ||
           (time > 10 && rand <= 1))
        {
            return true;
        }
        return false;
    }
    static setUpSkins()
    { 
        if(localStorage.getItem("skins") != null)
        {
            this.skins = JSON.parse(localStorage.getItem("skins"));
        }else
        {
            this.updateSkins();
        }
    }
    static updateDB()
    {
        localStorage.setItem("skinDB", JSON.stringify(this.skinDB));
    }
    static updateSchemes()
    {
        localStorage.setItem("schemeDB", JSON.stringify(this.schemeList));
    }
    static updateSkins()
    {
        this.updateDB();
        this.updateUsrSkins();
    }
    static updateUsrSkins()
    {
        localStorage.setItem("skins", JSON.stringify(this.skins));
    }
    static updatePlayer()
    {
        localStorage.setItem("userData", JSON.stringify(this.user));
    }
    static checkForDBUpdates()
    {
        if(localStorage.getItem("skinDB") != null)
        {
        var old = JSON.parse(localStorage.getItem("skinDB"));
        this.skinDB.Balls.forEach(element => {
            if(!old.Balls.some(e => e.ID === element.ID))
            {
                old.Balls.push(element);
            }
        });
        localStorage.setItem("skinDB", JSON.stringify(old));
        }
    }
    static randomizeScheme()
    {
        this.scheme.loadRandomScheme();
    }
    static setScheme(val)
    {
        localStorage.setItem("lastScheme", val + "");
        this.scheme.loadSchemeFromInt(val);
    }
    static returnToMenu(node:cc.Node)
    {
        this.switchScenes("MainMenu", node);
    }
    static setFrame(sprite:cc.Sprite, path:string)
    {
        cc.loader.loadRes(path, function (err, res) {
            if(!err)
            {
                sprite.spriteFrame = new cc.SpriteFrame(res);
            }else
            {
                cc.log(err.message);
            }
        });
    }
    static setAllVolume(canvas:cc.Node)
    {
        var elems = canvas.getComponentsInChildren(cc.AudioSource);
        if(canvas.getComponent(cc.AudioSource) != null)
        {
            canvas.getComponent(cc.AudioSource).volume = Helpers.user.sound;
        }
        for(var i = 0; i < elems.length; i++)
        {
            elems[i].volume = Helpers.user.sound;
        }
    }
    static turnOffSound(canvas:cc.Node)
    {
        var elems = canvas.getComponentsInChildren(cc.AudioSource);
        if(canvas.getComponent(cc.AudioSource) != null)
        {
            canvas.getComponent(cc.AudioSource).volume = Helpers.user.sound;
        }
        for(var i = 0; i < elems.length; i++)
        {
            elems[i].volume = 0;
        }
        Helpers.user.sound = 0;
        Helpers.updatePlayer();
    }
    static turnOnSound(n:number, canvas:cc.Node)
    {
        var elems = canvas.getComponentsInChildren(cc.AudioSource);
        if(canvas.getComponent(cc.AudioSource) != null)
        {
            canvas.getComponent(cc.AudioSource).volume = Helpers.user.sound;
        }
        for(var i = 0; i < elems.length; i++)
        {
            elems[i].volume = n;
        }
        Helpers.user.sound = n;
        Helpers.updatePlayer();
    }
    static switchScenes(scene:string, node:cc.Node)
    {
        if(cc.sys.isMobile)
        {
            sdkbox.PluginAdMob.show("gameover");
        }
        node.runAction(cc.sequence( 
            cc.fadeOut(0.25), 
            cc.callFunc(function () {
                Helpers.updateMusicTime(node);
                cc.director.loadScene(scene);
            })
        )); 
    }
    static getDistance(n1:cc.Node, n2:cc.Node)
    {
        var distX = Math.abs(n2.getPosition().x - n1.getPosition().x);
        var distY = Math.abs(n2.getPosition().y - n1.getPosition().y);
        var distZ = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
        return distZ;
    }
    static getRndInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
}
