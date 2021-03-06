let T = {
    ONWINDOWS : false,
    id:'',
    subAddress:'AppController/',
    defaultEnemyData:{
        type: 3,
        level: 3,
        coin: 1,
        flag: 'meet',
        headUrl: '',
        fleeCounts: 0,
    },

    defaultUserData: {
        coin:0,
        energy:50,
        level:1,
        maxEnergy:50,
        fishIndex:1,
        zoom: 3,
        zoom_dt: 0.125,
    },

    incrementUserData: {
        coin_dt: 1,
        energy_dt: -1,
        level_dt: 0,
    },

    defaultFishPriceData: [0,0,20,50,100,200,500,1000,2000,5000,10000,20000,50000,100000,200000,500000,1000000,2000000,5000000,10000000,20000000],

    init(callback) {
        // on loading init user data
        T.rGet('getUserDataById',{
            id: T.id,
        },(res)=>{
            this.initUserData(res,true)
            T.submitLevel()
            if(callback) {
                callback()
            }
        })
    },

    initUserData(data,isLogin)
    {
        // init usr data
        let usr = T.defaultUserData
        usr.coin = Number(data.coin)
        usr.energy = Number(data.energy)
        usr.level = Number(data.level)
        usr.maxEnergy = Number(data.maxEnergy)
        usr.fishIndex = Number(data.fishIndex)
        usr.zoom = Number(data.zoom)

        // console.log('更新数据',isLogin,data)
        // init fish price
        if(isLogin) {
            T.defaultFishPriceData = data.fishPrice
        }
    },

    rEnemyData(callback){
        T.rGet('buildNewFish',{
            id: T.id,
        },(res)=>{
            if(res != '-1') {
                this.updateEnemyData(res)
            }
            if(callback) {
                callback()
            }
        })
    },

    updateEnemyData(data)
    {
        console.log('新敌人的数据',data)
        let ed = T.defaultEnemyData
        ed.level = Number(data.level)
        ed.coin = Number(data.coast_coin)
        ed.type = data.fish_index
        ed.flag = data.flag
        ed.headUrl = data.head_url
        ed.fleeCounts = data.flee_counts
        T.incrementUserData.energy_dt = Number(data.user.coast_energy)
        if(data.flag == 'eaten') {
            T.incrementUserData.coin_dt = 0
        } else {
            T.incrementUserData.coin_dt = Number(ed.coin)
        }
        
        T.initUserData(data.user)
    },

    rFinishEat(callback) {
        T.rGet('finishEat',{
            id: T.id,
        },(res)=>{
            console.log('吃鱼结束',res)
            // this.initUserData(res)
            if(callback) {
                callback()
            }
        })
    },

    rFlee(callback) {
        // let usr = T.defaultUserData
        // usr.coin += T.incrementUserData.coin_dt
        T.rGet('flee',{
            id: T.id,
        },(res)=>{
            // this.initUserData(res)
            console.log('逃跑',res)
            if(res == '-1') {
                callback(res)
                return
            }
            T.defaultUserData.energy --
            KUN.UserData.setEnergy(T.defaultUserData.energy)
            if(callback) {
                callback(res)
            }
        })
    },

    rflockEnergy(callback)
    {
        T.rGet('flockEnergy',{
            id: T.id,
        },(res)=>{
            let result = T.dealFlockEnergyData(res)
            // console.log('收集能',res, result)
            if(callback) {
                callback(result)
            }
        })
    },

    rUpgrade(callback){
        T.rGet('upgrade',{
            id: T.id,
        },(res)=>{
            if(callback) {
                callback(res)
            }
        })
    },

    dealFlockEnergyData(data) {
        if(data == '-1') {
            // 能量满格
            return data
        }
        else if(typeof(data) == 'number') {
            // 开始倒计时
            return {status:'1',time:data}
        } else if(typeof(data) == 'object'){
            // 收集能量
            T.defaultUserData.energy += data.add_energy
            return {status:'2',add_energy:data.add_energy}
        }
    },

    getEnemyData() {
        let data = T.defaultEnemyData
        T.incrementUserData.coin_dt = data.coin
        return data
    },

    getUserInfo() {
        return T.defaultUserData
    },

    _calcUserData() {
        let data = T.defaultUserData
        let data_dt = T.incrementUserData
        data.coin += data_dt.coin_dt
        data.energy += data_dt.energy_dt
        data.level += data_dt.level_dt
    },

    touchOnce() {
        T._calcUserData()
        T.updateUsrInfo()
    },

    updateUsrInfo() {
        let data = T.getUserInfo()
        KUN.UserData.setCoin(data.coin)
        KUN.UserData.setLevel(data.level)
        KUN.UserData.setEnergy(data.energy)
        KUN.UserData.setFishIndex(data.fishIndex)
    },

    getFishPrice() {
        return T.defaultFishPriceData
    },

    checkIsCanPlay() {
        if(T.defaultUserData.energy - 1 <= -1) {
            return false
        }
        return true
    },

    uploadUserData(data,callback) {
        // to do
        T.rGet('saveUserInfo',{
            id : T.id,
            userInfo: data,
        }, res =>{
            if(callback) {
                callback(res)
            }
        })
    },

    uploadWeChatData(type_,data_) {
        if(type_ == 'level') {
            KUN.GameTools.sendMessage(data_)
        }
    },

    submitLevel() {
        T.uploadWeChatData('level',{type:KUN.GameStatus.msgType.submitScore,scoreData:{score:T.defaultUserData.level, key: KUN.GameStatus.levelKeyList[0]}})
    },

    purchaseNewFish(price,callback) {
        KUN.Server.rUpgrade((res)=>{
            if(res == '1' && T.defaultUserData.coin >= price) {
                T.defaultUserData.coin -= price
                T.defaultUserData.level ++
                T.defaultUserData.fishIndex ++
                T.defaultUserData.zoom -= T.defaultUserData.zoom_dt
                T.updateUsrInfo() 
                T.submitLevel()
            } 
            if(callback){
                callback(res)
            }
        })
    },

    rFreeEnergy(energy_,callback) {
        KUN.Server.rGet('freeEnergy',{
            id: T.id,
            addEnergy: energy_,
        }, res => {
            if(res == '1') {
                let data = T.getUserInfo()
                data.energy += 3
                T.updateUsrInfo()
            } else if (res == '-1') {
                // fail
            }
            if(callback) {
                callback(res)
            }
        })
    },

    // require
    rGet(method, reqData, success){
        if(T.ONWINDOWS) {
            switch (method) {
                case 'getUserDataById':
                    let data = T.defaultUserData
                    data.fishPrice = T.defaultEnemyData
                    success(data)
                    break;
                case 'buildNewFish':
                    data = null
                    data = T.defaultEnemyData
                    data.fish_index = T.defaultEnemyData.type
                    data.coast_coin = data.coin
                    data.user = T.defaultUserData
                    data.user.coast_energy = -1
                    data.head_url = 'head/4'
                    data.flee_counts = 2
                    success(data)
                    break;
                case 'finishEat':
                    success('1')
                    break;
                case 'flockEnergy':
                    success('-1')
                    break;
                case 'upgrade':
                    success('1')
                    break;
                case 'flee':
                    success('1')
                    break;
                default:
                    break;
            }
        } else {
            KUN.GameTools.httpGet(T.subAddress+method,reqData,(res)=>{
                if(success) {
                    success(res)
                }
            })
        }
    },

    checkIsOnWindows(){
        return cc.sys.platform == 0 || cc.sys.platform == 101
    },

    lFreeFail() {
        T.defaultUserData.coin += T.defaultEnemyData.coin
        KUN.UserData.setCoin(T.defaultUserData.coin)
    }
}

export default T;