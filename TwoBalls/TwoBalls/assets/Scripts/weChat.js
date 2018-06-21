
let GameTools = require('GameTools');
cc.Class({

    ctor() {
        if(CC_WECHATGAME){
            // 开启shareTicket
            this.openShareTicketSetting();
            // 绑定启动监听函数
            this.bandingOnShowFunc();
            // 打开被动转发 并监听
            this.openShareSetting();
        }
        
    },

    checkIsLogin(func) {
        if(!this.checkIsWeChat()) {return;}
        this.callfunc = func;
        let self = this;
        wx.checkSession({
            success: function() {
                self.login();
                //self.getUserInfo();
            },
            fail: function() {
                self.login();
            }
        });
    },

    login() {
        if(!this.checkIsWeChat()) {return;}
        let weChatData = cc.TB.GAME.weChatData;
        let self = this;
        wx.login({
            success: function(res) {
                // weChatData.code = res.code;
                // let curUrl = "https://api.weixin.qq.com/sns/jscode2session";
                // wx.request({
                //     url: curUrl,
                //     data: {
                //         appid: weChatData.appId,
                //         secret: weChatData.appSecret,
                //         grant_type: 'authorization_code',
                //         js_code: res.code,
                //     },
                //     header: {
                //         'content-type': 'application/json' 
                //     },
                //     success: function(res) {
                //         console.log(res.data)
                //         if (res.data.openid != null & res.data.openid != undefined) {
                //             weChatData.openid = res.data.openid;
                //             weChatData.session_key = res.data.session_key;
                //         }
                //         self.getUserInfo();
                //     }
                // });
                self.getUserInfo();
            }
        });
    },

    getUserInfo() {
        if(!this.checkIsWeChat()) {return;}
        let weChatData = cc.TB.GAME.weChatData;
        let self = this;
        wx.getUserInfo({
            success: function(res) {
                let userInfo = res.userInfo;
                weChatData.userInfo = userInfo;
                // avatarUrl
                // nickName
                // gender //性别 0：未知、1：男、2：女
                // province 省
                // city
                // country
                if (self.callfunc) {
                    self.callfunc();
                }
            }
        });
    },

    checkIsWeChat() {
        // CC_WECHATGAME 这个宏 也可以判断是否在 微信小游戏的环境
        return cc.TB.GAME.checkIsWeChat();
    },

    loadImagByUrl(imageUrl, node) {
        if(!this.checkIsWeChat()) {return;}
        cc.loader.load({url: imageUrl, type: 'jpg'}, function(err, texture){
            node.spriteFrame = new cc.SpriteFrame(texture);
        });
    },

    uploadScore(score_){
        if(!this.checkIsWeChat()) {return;}
        // let data = new Array();
        // let dataFormat = {
        //     "wxgame": {
        //         "score": score_,
        //         "update_time": new Date().getTime()
        //     },
        //     //value: score_,
        // }
        // data.push({
        //     key: "xwxdata",
        //     value: JSON.stringify(dataFormat),
        // });
        GameTools.sendMessage({
            type: GameTools.msgType.submitScore,
            scoreData: {
                key: cc.TB.GAME.weChatData.keyList[0],
                score: score_,
            },
        });
        // wx.setUserCloudStorage({
        //     KVDataList: data,
        //     success: function (res) {
        //         console.log('setUserCloudStorage', 'success', res)
        //     },
        //     fail: function (res) {
        //         console.log('setUserCloudStorage', 'fail')
        //     },
        //     complete: function (res) {
        //         console.log('setUserCloudStorage', 'ok')
        //     }
        // });
    },

    // 群分享
    groupShare(type, prefab_) {
        if(CC_WECHATGAME) {
            let address = 'https://vdgames.vdongchina.com/TB/1.0/share/'
            if(type === 'share') {
                // let canvas = wx.createCanvas();
                // let context = canvas.getContext('2d');
                // let image = wx.createImage();
                // image.onload = function () {
                //     console.log(image.width, image.height);
                //     context.drawImage(image, 0, 0);
                // }
                // image.src = address + 'share.jpg';

                // 分享 app
                wx.shareAppMessage({
                    title: '跟我一起玩',
                    query: cc.TB.GAME.weChatData.keyList[0],
                    imageUrl: address + 'share.jpg',
                    success: (res) => {
                        console.log('分享 成功 ', res);
                        if (res.shareTickets != undefined && res.shareTickets.length > 0) {
                            cc.TB.GAME.weChatData.shareTicket = res.shareTickets[0];
                            //this.onGroupShareFunc();
                        }
                    }
                });
            } else if (type === 'dare') {
                // 发起挑战
                wx.shareAppMessage({
                    title: '来与我一战',
                    imageUrl: address + 'share2.jpg',
                });
            }
            
        }
    },

    openShareTicketSetting() {
        wx.updateShareMenu({
            withShareTicket: true,
            success: (res)=>{
                //console.log('分享券设置成成功', res);
            },
        });
    },

    bandingOnShowFunc() {
        // 启动
        let option = wx.getLaunchOptionsSync();
        if(option.shareTicket) {
            cc.TB.GAME.weChatData.shareTicket = res.shareTicket;
        }
        console.log('小游戏启动设置',option);
        // 显示
        wx.onShow((res)=>{
            // shareTicket
            console.log('游戏启动',res);
            if(res.shareTicket){
                cc.TB.GAME.weChatData.shareTicket = res.shareTicket;
                // 显示群排行
                this.onGroupShareFunc();
            }
        });
    },

    openShareSetting() {
        wx.showShareMenu({
            withShareTicket: true,
        });
        wx.onShareAppMessage(
            () => {
                return {
                    title: '来与我一战',
                }
            }
        );
    },

    showAD() {
        // 插屏广告接入
    },

    adjustBgScaleY(node) {
        if(CC_WECHATGAME){
            wx.getSystemInfo({
                success: (res) => {
                    let desginSize = cc.TB.GAME.getDesignSize();
                    let ratio = res.screenWidth / desginSize.width;
                    let curRatio = res.screenHeight / node.height * ratio * node.scaleY;
                    node.scaleY *= curRatio;
                },
            });
        }
    },

    registerOnGroupShareFunc(func) {
        this._onGroupShareFunc = func;
    },

    onGroupShareFunc() {
        if(this._onGroupShareFunc) {
            this._onGroupShareFunc(cc.TB.GAME.weChatData.shareTicket);
        }
    }
});
