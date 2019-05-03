import {Helpers} from "./Helpers"
export class Context {
    static showAd(adName:string)
    {
        if (sdkbox.PluginAdMob.isAvailable(adName)) {
            sdkbox.PluginAdMob.show(adName);
        } else {
            cc.log(adName + ' is not available');
            sdkbox.PluginAdMob.cache(adName);
        }
    }
    static setupAds()
    {
        if ('undefined' == typeof sdkbox) {
            cc.log('sdkbox is undefined');
            return;
        }

        if ('undefined' == typeof sdkbox.PluginAdMob) {
            cc.log('sdkbox.PluginAdMob is undefined');
            return;
        }

        sdkbox.PluginAdMob.setListener({
            adViewDidReceiveAd: function(name) {
                cc.log('adViewDidReceiveAd:'+name);
            },
            adViewDidFailToReceiveAdWithError: function(name, msg) {
                cc.log('adViewDidFailToReceiveAdWithError:'+name+':'+msg);
            },
            adViewWillPresentScreen: function(name) {
                cc.log('adViewWillPresentScreen:'+name);
            },
            adViewDidDismissScreen: function(name) {
                cc.log('adViewDidDismissScreen:'+name);
            },
            adViewWillDismissScreen: function(name) {
                cc.log('adViewWillDismissScreen:'+name);
            },
            adViewWillLeaveApplication: function(name) {
                cc.log('adViewWillLeaveApplication:'+name);
            },
            reward: function(name, currency, amount) {
                cc.log('reward:'+name+':'+currency+':'+amount);
            }
        });
        sdkbox.PluginAdMob.init();
    }

    static resetCharacter()
    {
        localStorage.clear();
        Helpers.clearAll();
    }
}
