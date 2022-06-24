const config = {};
const fps = 60;

(() => {

    //common
    const plane = (callback = false) => {
        const o = {
            w: 70,
            h: 70,
            x: 0,
            y: 0,
            img: 'player',
            speed: 4,
            bulletCooldown: 5 * fps,
        }
        if (!callback) {
            return o;
        }
        const data = callback(o);
        for (let key of Object.keys(data)) {
            o[key] = data[key];
        }
        return o;
    }

    //飞机动画
    const planeAnimation = () => {
        return {
            loop: true,
            col: 1,
            row: 4,
            cooldown: 0.1 * fps
        }
    }

    const bullet = (() => {
        return {
            w: 20,
            h: 10,
            x: 0,
            y: 0,
            speed: 4,
        }
    })


    const batchAdd = (url, name, count, ext) => {
        let images = {};
        for (let i = 1; i <= count; i++) {
            images[name + i] = url + name + i + '.' + ext;
        }
        return images;
    }

    // name -> 名称 + count -> 多少张
    const batchImport = (name, count) => {
        let images = [];
        for (let i = 1; i <= count; i++) {
            images.push(name + i)
        }
        return images;
    }

    //config
    config.game = {
        w: 960, 
        h: 480,
        fontSize: {
            min: 12,  //最小
            max: 30,  //最大
            val: 16,  //值
        },
        // random cooldown index 0 - index 1
        appendEnemyCooldown: [2 * fps, 5 * fps],// 添加的敌人冷却时间
        appendFriendCooldown: [2 * fps, 5 * fps],//所添加的Friend冷却时间
        appendFuelCooldown: [2 * fps, 5 * fps],//添加的燃料的冷却时间
        appendStarCooldown: [1 * fps, 2 * fps],//星星的冷却时间
    }

    // fuel -> 燃料
    config.fuelConfig = {
        fuelLoseSpeed: -1,
        fuelRaiseSpeed: 15,
        fuelMax: 30,
        beingHit : -15,
    }

    config.scoreConfig = {
        shootEnemy: 5,
        shootMeteorite: 10,
        shootFriend: -10,
    }

    config.data = ()=>{
        return{
            fuel: 15,
            score: 0,
            shoot: 0,
            time : 0,
            name : '',
        }
    }

    // 播放
    config.player = (()=>{
    
        const {h} = config.game;

        const o = plane(o=>{
            return{
                y:h / 2 ,//高/2
                bulletCooldown:0.5 * fps,//子弹发射时间 
                animation:planeAnimation(),
            }
        })

        return o;
    })();

    //敌人
    config.enemy = (()=>{

        const {w} = config.game;
        
        const o = plane(o=>{
            return {
                x: w + o.w,
                speed:-3,
                img:'ememy',
                animation: planeAnimation(),
            }
        })

        return o;
    })();

    config.meteorite = (()=>{

        const {w} = config.game;

        const o = plane(o=>{
            return{
                w: 85,
                h : 85,
                x: w + o.w,
                speed: -3,
                img : batchImport('meteorites_', 4),
                life : 2,
            }
        })

        return o;

    })

    //friend  好友？
    config.friend = (()=>{
    
        const {w} = config.game;

        const o = plane(o=>{
            return{
                x:w + o.w,
                speed:-3,
                img:'friend',
                animation:planeAnimation(),
            }
        })

        return o;
    })

    // 燃料
    config.fuel = (()=>{
        
        const o = {
            w:40,
            h:40,
        };
        o.x = 0;
        o.y = -o.h;

        o.speed = -1;

        o.img = 'fuel';
        
        return o;
    })();

    // 星星
    config.star = (()=>{

        const o ={};

        o.img = batchImport('star_',12);

        return o;
    })()

    // 游戏的子弹
    config.playerBullet = (()=>{

        let o = bullet();
        o.img = 'playerBullet';

        return o;
    })();

    // 飞机死亡动画
    config.planeDeathAnimation = {
        img:'boom',
        loop:false,
        row:4,
        col:4,
        cooldown:0.05 * fps,
    }

    // 图片
    config.images = (()=>{
        
        const path = './img/';

        let images ={
            boom: path + 'boom.png',
            player: path + 'plane/player.png',
            friend: path + 'plane/friend.png',
            enemy: path + 'plane/enemy.png',
            playerBullet: path + 'playerBullet.png',
            enemyBullet: path + 'enemyBullet.png',
            fuel: path + 'fuel2.png',
        }
        
        let imagesreturn = Object.assign(
            batchAdd(path+'/star/','star_',12,'png'),
            batchAdd(path+'/meteorites/','meteorites_',4,'png'),
            images,
        )

        return  imagesreturn;
        
    })();


    // 音频
    config.audios = (()=>{
        const path = './sounds/';
        return{
            bg : path + 'background.mp3',
            destroyed : path + 'destroyed.mp3',
            shoot : path + 'shoot.mp3',
        }
    })();
})();







