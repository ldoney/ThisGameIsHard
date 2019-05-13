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
    static signin()
    {
        if (sdkbox.PluginSdkboxPlay.isSignedIn()) {
            sdkbox.PluginSdkboxPlay.signout();
        } else {
            sdkbox.PluginSdkboxPlay.signin(true);
        }
    }
    static saveData(database:string, data:object)
    {
        if (sdkbox.PluginSdkboxPlay.isSignedIn()) {
            sdkbox.PluginSdkboxPlay.saveGameDataBinary(database,data, JSON.stringify(data).length);
        }
    }
    static loadData()
    {
        if(sdkbox.PluginSdkboxPlay.isSignedIn())
        {
            sdkbox.PluginSdkboxPlay.loadAllGameData();
        }
    }
    static setupPlay()
    {
        if ('undefined' == typeof sdkbox) {
            cc.log('sdkbox is undefined');
            return;
        }

        if ('undefined' == typeof sdkbox.PluginSdkboxPlay) {
            cc.log('sdkbox.PluginAdMob is undefined');
            return;
        }
        sdkbox.PluginSdkboxPlay.setListener({
            onConnectionStatusChanged: function(connection_status) {
                cc.log("onConnectionStatusChanged: " + connection_status);
                if (connection_status == 1000) {
                    cc.log('Player id: ' + sdkbox.PluginSdkboxPlay.getPlayerId());
                    cc.log('Player name: ' + sdkbox.PluginSdkboxPlay.getPlayerAccountField("name"));
                }
            },
            onScoreSubmitted: function(leaderboard_name, score, maxScoreAllTime, maxScoreWeek, maxScoreToday) {
                cc.log('onScoreSubmitted' + leaderboard_name + ':' + score + ':' + maxScoreAllTime + ':' + maxScoreWeek + ':' + maxScoreToday);
            },
            onMyScore: function(leaderboard_name, time_span, collection_type, score) {
                cc.log('onMyScore:' + leaderboard_name + ':' + time_span + ':' + collection_type + ':' + score);
            },
            onMyScoreError: function(leaderboard_name, time_span, collection_type, error_code, error_description) {
                cc.log('onMyScoreError:' + leaderboard_name + ':' + time_span + ':' + collection_type + ':' + error_code + ':' + error_description);
            },
            onPlayerCenteredScores: function(leaderboard_name, time_span, collection_type, json_with_score_entries) {
                cc.log('onPlayerCenteredScores:' + leaderboard_name + ':' + time_span + ':' + collection_type + ':' + json_with_score_entries);
            },
            onPlayerCenteredScoresError: function(leaderboard_name, time_span, collection_type, error_code, error_description) {
                cc.log('onPlayerCenteredScoresError:' + leaderboard_name + ':' + time_span + ':' + collection_type + ':' + error_code + ':' + error_description);
            },
            onIncrementalAchievementUnlocked: function(achievement_name) {
                cc.log("onIncrementalAchievementUnlocked:" + achievement_name);
            },
            onIncrementalAchievementStep: function(achievement_name, step) {
                cc.log("onIncrementalAchievementStep:" + achievement_name + ":" + step);
            },
            onIncrementalAchievementStepError: function(name, steps, error_code, error_description) {
                cc.log('onIncrementalAchievementStepError:' + name + ':' + steps + ':' + error_code + ':' + error_description);
            },
            onAchievementUnlocked: function(achievement_name, newlyUnlocked) {
                cc.log('onAchievementUnlocked:' + achievement_name + ':' + newlyUnlocked);
            },
            onAchievementUnlockError: function(achievement_name, error_code, error_description) {
                cc.log('onAchievementUnlockError:' + achievement_name + ':' + error_code + ':' + error_description);
            },
            onAchievementsLoaded: function(reload_forced, json_achievements_info) {
                cc.log('onAchievementsLoaded:' + reload_forced + ':' + json_achievements_info);
            },
            onSetSteps: function(name, steps) {
                cc.log('onSetSteps:' + name + ':' + steps);
            },
            onSetStepsError: function(name, steps, error_code, error_description) {
                cc.log('onSetStepsError:' + name + ':' + steps + ':' + error_code + ':' + error_description);
            },
            onReveal: function(name) {
                cc.log('onReveal:' + name);
            },
            onRevealError: function(name, error_code, error_description) {
                cc.log('onRevealError:' + name + ':' + error_code + ':' + error_description);
            },
            onGameData: function(action, name, data, error) {
                if (error) {
                    cc.log('onGameData failed:' + error);
                } else {
                    if ('load' == action) {
                        cc.log('onGameData load:' + name + ':' + data);
                    } else if ('save' == action) {
                        cc.log('onGameData save:' + name + ':' + data);
                    } else {
                        cc.log('onGameData unknown action:' + action);
                    }
                }
            },
            onSaveGameData: function(success, error) {
                if (error) {
                    cc.log('onSaveGameData failed:' + error);
                } else {
                    cc.log('onSaveGameData success');
                }
            },
            onLoadGameData: function(savedData, error) {
                if (error) {
                    cc.log('onLoadGameData failed:' + error);
                } else {
                    if (savedData) {
                        console.log(JSON.stringify(savedData));
                        cc.log('onLoadGameData:' + savedData.name);
                    } else {
                        cc.log('Load Game Data Finish');
                    }
                }
            },
            onGameDataNames: function(names, error) {
                if (error) {
                    cc.log('onGameDataNames failed:' + error);
                } else {
                    console.log(JSON.stringify(names));
                    cc.log('onGameDataNames count:' + names.length);
                }
            }
        });
        sdkbox.PluginSdkboxPlay.init();
    }
    
    static uploadPlayer()
    {
        sdkbox.PluginSdkboxPlay.saveGameDataBinary("user", Helpers.user, 50);
        sdkbox.PluginSdkboxPlay.saveGameDataBinary("schemeList", Helpers.schemeList, 50);
        sdkbox.PluginSdkboxPlay.saveGameDataBinary("skinDB", Helpers.skinDB, 50);
        sdkbox.PluginSdkboxPlay.saveGameDataBinary("skins", Helpers.skins, 50);
    }
    static uploadTime(time:number)
    {
        this.uploadScore("Score", {time});
    }
    static uploadScore(leaderboard:string, score:object)
    {
        if(sdkbox.PluginSdkboxPlay.isSignedIn())
        {
            sdkbox.PluginSdkboxPlay.submitScore(
                leaderboard,
                score
            );
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
