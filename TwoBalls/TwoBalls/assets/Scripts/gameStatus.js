
let T = cc.Class({
    name: "gameStatus",
    statics: {
        // version
        version:'1.08',
        // 加载资源的标签
        completeResFlag: false,
        // 手机型号
        model: '',
        panelBgDestroyFunc:null,
        // 赠送皮肤编号
        giftSkinIndex:'-1',
        giftSkinCfg: {
            '0': ['u1',2200],
        },
        // 记录礼物的分享券 ,,, 阻止重复 刷去道具
        giftShareTicketsList: [],
        defaultPlayerSpeed: 1800,
        // 第一次进入游戏
        firstEnterGameFlag: true,
        // 游戏是否结束
        gameOver: false,
        // 是否处于玩游戏的过程
        isPlaying: false,
        // 是否上传数据
        isUploadDataFlag: true,
        // score
        score: 0,
        // 每次启动游戏最高分数
        maxScore:0,
        // 最大连击数
        maxHitCounts:0,
        // 目标关卡
        targetCheckPoint: 680,
        // 关卡
        checkPoint: 0,
        // 变大等级
        bigLevel: 1,
        // 变快等级
        speedLevel: 1,
        // 连击图片
        hitPicCounts: 108,
        // 连击文字配置
        hitTextCfg: [
            '',
            '好准哦','太棒啦','太准了','正中靶心','666','狠准','扎靶心了老铁','太6了','开始你的表演','神准',
            '么么哒','我喜欢','演技派','捶你胸口','疯狂打call','会心一击','良心不痛','还有这种操作','发髻线','我觉得ok',
            '演员','明星','国际巨星','大美女','纯爷们','老司机','不忘初心','打的假靶心','尬舞之王','一箭中的',
            '百步穿杨','惊不惊喜','意不意外','神枪手','百发百中','今晚吃鸡','百里守约','百里解约','高手','百闻不如一见',
            '百见不如一闻','小李飞刀','甘拜下风','一阳指','吹刀断水','行云流水','九阴真经','九阳神功','降龙十八掌','人中吕布',
            '马中赤兔','过五关斩六将','一代宗师','武林盟主','神功盖世','天下无敌','独孤求败','东方不败','杨过','小龙女',
            '我是小迷妹','我是小迷弟','你是小姐姐','你是小哥哥','设计狮','程序猿','老板','孙悟空','国之栋梁','祖国未来',
            '老公大人','老婆大人','超人','绿巨人','钢铁侠','骨灰玩家','大法师','大师太','外星人','三生三世',
            '小猪佩奇','玉树临风','风流人物','勇者无惧','智者无惑','仁者无忧','科学家','艺术家','洲际导弹','航天飞机',
            '原子弹','氢弹','爱你一万年','只争朝夕','四书五经','论语','易经','金刚经','金箍棒','哪吒三太子',
            '李白','杜甫','本草纲目','秦皇汉武','唐宗宋祖','消防战士','太极拳','可造之才',
        ],
        // 玩家每级增加的尺寸
        playerAddSize: 10,
        // 玩家每级增加的速度
        playerAddSpeed: 200,
        //存储任务数据的key
        taskKey: 'taskClickData',
        // 敌人 大小尺寸
        enemySize: [4,3.5,3,2.5,2,1.7,1.5,1.3,1.2,1.1,1],
        enemyProbabilitySize: [
            [0.7,  0.2,   0.1,   0,     0,    0,    0,    0,    0,    0,    0],
            [0.5,  0.3,   0.15,  0.05,  0,    0,    0,    0,    0,    0,    0],
            [0.3,  0.3,   0.15,  0.1,   0.05, 0,    0,    0,    0,    0,    0],
            [0.2,  0.3,   0.2,   0.1,   0.1,  0,    0,    0,    0,    0,    0],
            [0.1,  0.3,   0.25,  0.2,   0.1,  0.05, 0,    0,    0,    0,    0],
            [0.1,  0.3,   0.2,   0.15,  0.1,  0.1,  0.05, 0,    0,    0,    0],
            [0.05, 0.25,  0.2,   0.2,   0.15, 0.1,  0.05, 0,    0,    0,    0],
            [0,    0.25,  0.2,   0.2,   0.15, 0.1,  0.05,  0.05, 0,    0,    0],
            [0,    0.15,  0.2,   0.2,   0.2,  0.1,  0.1,   0.05, 0,    0,    0],
            [0,    0.1,   0.2,   0.2,   0.2,  0.15, 0.1 ,  0.05, 0,    0,    0],

            [0,    0.15,  0.2,   0.2,   0.2,  0.1,  0.05,  0.05, 0.05, 0,    0],
            [0,    0.15,  0.15,  0.2,   0.2,  0.1,  0.1,   0.05, 0.05, 0,    0],
            [0,    0.15,  0.15,  0.2,   0.2,  0.1,  0.1 ,  0.05, 0.05, 0,    0],
            [0,    0.1,   0.15,  0.25,  0.2,  0.1,  0.1 ,  0.05, 0.05, 0,    0],
            [0,    0.1,   0.15,  0.2,   0.2,  0.15, 0.1,   0.05, 0.05, 0,    0],
            [0,    0.1,   0.1,   0.2,   0.2,  0.2,  0.1,   0.05, 0.05, 0,    0],
            [0,    0.05,  0.15,  0.2,   0.2,  0.15, 0.1,   0.1,  0.05, 0,    0],
            [0,    0.05,  0.15,  0.15,  0.2,  0.2,  0.1 ,  0.1,  0.05, 0,    0],
            [0,    0.05,  0.15,  0.15,  0.2,  0.2,  0.05,  0.1,  0.05, 0.05, 0],
            [0,    0,     0.15,  0.2,   0.2,  0.2,  0.05,  0.1,  0.05, 0.05, 0],

            [0,    0,     0.15,  0.2,   0.2,  0.2,  0.1,  0.1,   0.05, 0,    0],
            [0,    0,     0.15,  0.2,   0.2,  0.2,  0.1,   0.1,  0.05, 0,    0],
            [0,    0,     0.1,   0.15,  0.25, 0.2,  0.1,   0.1,  0.1,  0,    0],
            [0,    0,     0.1,   0.15,  0.2,  0.2,  0.1,   0.1,  0.1,  0.05, 0],
            [0,    0,     0.1,   0.15,  0.2,  0.2,  0.1,   0.1,  0.1,  0.05, 0],
            [0,    0,     0.05,  0.10,  0.2,  0.2,  0.15,  0.1,  0.1,  0.1,  0],
            [0,    0,     0.05,  0.10,  0.2,  0.2,  0.15,  0.1,  0.1,  0.1,  0],
            [0,    0,     0.05,  0.10,  0.15, 0.2,  0.15,  0.1,  0.1,  0.1,  0.05],
            [0,    0,     0.05,  0.10,  0.1,  0.25, 0.15,  0.1,  0.1,  0.1,  0.05],
            [0,    0,     0,     0.10,  0.1,  0.2,  0.2,   0.1,  0.1,  0.1,  0.1],

            [0,    0,     0,     0.10,  0.2,  0.2,  0.1,   0.1,  0.1,  0.1,  0.1],
            [0,    0,     0,     0.10,  0.2,  0.2,  0.1,   0.1,  0.1,  0.1,  0.1],
            [0,    0,     0,     0.05,  0.15, 0.2,  0.2,   0.1,  0.1,  0.1,  0.1],
            [0,    0,     0,     0,     0.1,  0.25,  0.2,  0.15, 0.1,  0.1,  0.1],   
        ],
        enemySpeed: [400,550,700],
        enemyProbabilitySpeed:[
            [0.7,  0.3,   0   ],
            [0.65, 0.35,  0   ],
            [0.6,  0.35,  0.05],
            [0.55, 0.4,   0.05],
            [0.5,  0.4,   0.1 ],
            [0.45, 0.45,  0.1],
            [0.4,  0.45,  0.15],
            [0.35, 0.5,   0.15],
            [0.3,  0.5,   0.2 ],
            [0.3,  0.5,   0.2 ],

            [0.45, 0.35,  0.2],
            [0.4,  0.35,  0.25],
            [0.35, 0.4,   0.25],
            [0.3,  0.45,  0.25],
            [0.25, 0.45,  0.3],
            [0.25, 0.4,   0.35],
            [0.2,  0.4,   0.4],
            [0.3,  0.3,   0.4],
            [0.2,  0.35,  0.45],
            [0.15, 0.4,   0.45],
    
            [0.25, 0.4,   0.35],
            [0.2,  0.4,   0.4],
            [0.3,  0.3,   0.4],
            [0.2,  0.35,  0.45],
            [0.15, 0.4,   0.45],
            [0.3,  0.3,   0.4],
            [0.2,  0.35,  0.45],
            [0.15, 0.4,   0.45],
            [0.1,  0.4,   0.5],
            [0.15, 0.35,  0.5],

            [0.1,  0.4,   0.5],
            [0.15, 0.35,  0.5],
            [0.1,  0.3,   0.6],
            [0.1,  0.3,   0.6],
        ],
        enemyDis: [130,290,450],
        enemyProbabilityDis: [
            [0.7,  0.2,   0.1],
            [0.65, 0.25,  0.1],
            [0.6,  0.3,   0.1],
            [0.55, 0.3,   0.15],
            [0.5,  0.3,   0.2],
            [0.45, 0.35,  0.2],
            [0.4,  0.35,  0.25],
            [0.35, 0.4,   0.25],
            [0.3,  0.45,  0.25],
            [0.25, 0.45,  0.3],

            [0.45, 0.35,  0.2],
            [0.4,  0.35,  0.25],
            [0.35, 0.4,   0.25],
            [0.3,  0.45,  0.25],
            [0.25, 0.45,  0.3],
            [0.25, 0.4,   0.35],
            [0.2,  0.4,   0.4],
            [0.3,  0.3,   0.4],
            [0.2,  0.35,  0.45],
            [0.15, 0.4,   0.45],
    
            [0.25, 0.4,   0.35],
            [0.2,  0.4,   0.4],
            [0.3,  0.3,   0.4],
            [0.2,  0.35,  0.45],
            [0.15, 0.4,   0.45],
            [0.3,  0.3,   0.4],
            [0.2,  0.35,  0.45],
            [0.15, 0.4,   0.45],
            [0.1,  0.4,   0.5],
            [0.15, 0.35,  0.5],

            [0.1,  0.4,   0.5],
            [0.15, 0.35,  0.5],
            [0.1,  0.3,   0.6],
            [0.1,  0.3,   0.6],
        ],
        // 敌人图片的个数
        enemyPicCounts: 11,
        // 敌人每张图片触发的概率
        enemyProbabilityPic:[0.04,0.05,0.06,0.07,0.08,0.09,0.1,0.11,0.12,0.13,0.15],
        // 敌人中心点显示的时间
        enemyCenterShowTime: 0.3,
        // 敌人出现的缩放时间
        enemyShowScaleTime: 0.2,
        // 敌人透明的时间
        enemyFadeTime: 0.2,
        // 敌人出现开始的倍数
        enemyStartScaleMul: 0.7,
        // 礼物在游戏总出现的概率表
        giftAutoShowProbability: [0.95,0.05],
        ///////////////// 背景数据 //////////////////
        bgCfgData: {
            // 背景改变的时间
            bgChangeTime:30,
            // 背景的个数
            bgCounts: 6,
            // 背景渐变的时间
            bgFadeTime: 3,
        },
        weChatData: {
            isLogin: false,
            //appSecret: "4512c39c66615628c91cc49b89",
            appId: "wxdfc7eb71a7ad9df6",
            code: "",
            keyList: ["wxdata",'hitCountsData'],
            shareTicket: "",
        },
        // local variable
        _probaList: {},
        ///////// func /////////
        getDesignSize() {
            return cc.size(720,1280);
        },
        // 一个概率表
        getRandom(arr, arrName) {
            // fix 概率 不为1的问题
            let random = function(tv) {
                let randomC = cc.random0To1();
                let randomCount = Math.round(tv * randomC *100);
                // cc.log('最大值 ',tv, "||  真实", randomC, '||  *', randomCount);
                // 移除 递归循环的风险
                if(randomCount === tv*1*100) {
                    return randomCount - 1;
                }
                return randomCount;
            }
            let tmpArr = T._probaList[arrName] ? T._probaList[arrName][0] : [];
            let totalValue = T._probaList[arrName] ? T._probaList[arrName][1] : 0;
            if(!(tmpArr.length != 0 && totalValue != 0)) {
                for (let i = 0; i < arr.length; i++) {
                    totalValue += (arr[i]*100);
                    for (let count = 0; count < arr[i]*100; count++) {
                        tmpArr.push(i);
                    }
                }
                // 概率表缓存
                T._probaList[arrName] = [tmpArr,totalValue]
            }
            totalValue/=100;
            let index = random((totalValue));
            return tmpArr[index];
        },
        
        checkIsWeChat() {
            // CC_WECHATGAME
            return cc.sys.platform === cc.sys.WECHAT_GAME;
        },

        getShowScoreVal(counts) {
            return counts * 2;
        },

        initStartData() {
            T.score = 0
            T.checkPoint = 0
        },

        checkIsOldShareTicket(ticket) {
            if(T.giftShareTicketsList.indexOf(ticket) > -1) {
                return true
            }
            T.giftShareTicketsList.push(ticket)
            return false
        }
    },
});
