class Play extends Scene{
    constructor(el,game){
        super(el,game);
        this.created();
    }
    created(){
        this.raf_id = 'play_update';
        this.initCanvas();//初始化canvas
    }
    setup(){
        this.muteFlag = false;
        this.initData();//初始化数据
        this.initPlayer();//初始化播放器
        this.updateTime();//初始化更新的时间
        this.updateFuel();//初始化燃料
        this.updateScore();//初始化分数
        this.updateFontSize();//初始化字体大小
        $('#logo').classList.add('play-status') //logo变小
        this.event();//初始化事件
        this.start();//开始事件
    }

    start(){
        this.pauseFlag = false;
        raf.reg(this.raf_id,this.update.bind(this));
        res.play('bg');//播放背景音乐
        $('#game-pause-btn').classList.add('active');//添加className,暂停 -> 开始
    }

    // 暂停的
    pause(){
        this.pauseFlag = true;
        raf.remove(this.raf_id);
        res.pause('bg');
        $('#game-pause-btn').classList.remove('active');
    }

    // 无声的
    mute(){
        this.muteFlag = true; 
        res.mute();
        $('#game-mute-btn').classList.add('active');
    }

    // 谈话
    speak(){
        this.muteFlag = false;
        res.speak();
        $('#game-mute-btn').classList.remove('active');
    }

    // 卸载掉
    uninstall(){
        raf.remove(this.raf_id);
        res.end('bg');
        $("#logo").classList.remove('play-status');
    }

    // 初始化数据
    initData(){
        this.pauseFlag = false; //暂停标志
        this.timeCooldown = new Cooldown(fps,true);

        this.playerBullets = []; // 用户的子弹
        this.enemyBullets = []; // 敌人子弹
        this.allEnemys = []; //所有敌人们
        this.enemys = { //敌人
            arr : this.allEnemys,
            elem:Enemy,
            cooldown : new Cooldown(config.game.appendEnemyCooldown),
        }
        this.meteorites = {// 陨石
            arr: this.allEnemys,
            elem: Meteorite,
            cooldown: new Cooldown(config.game.appendEnemyCooldown),
        };
        this.friends = {// 朋友
            arr: [],
            elem: Friend,
            cooldown: new Cooldown(config.game.appendFriendCooldown),
        };
        this.fuels = {// 燃料
            arr: [],
            elem: Fuel,
            cooldown: new Cooldown(config.game.appendFriendCooldown),
        };
        this.stars = { // 星星
            arr: [],
            elem: Star,
            cooldown: new Cooldown(config.game.appendStarCooldown),
        };

    }

    // 相撞
    collision(a, b, callback) {
        if (!a.run || !b.run) {
            return;
        }
        var yCoolision = (a, b) => {
            return a.y > b.y && a.y < b.y + b.h;
        };
        var xCoolision = (a, b) => {
            return a.x > b.x && a.x < b.x + b.w;
        };
        if (yCoolision(a, b) || yCoolision(b, a)) {
            if (xCoolision(a, b) || xCoolision(b, a)) {
                callback(a, b);
            }
        }
    }

    // 子弹相撞
    bulletCollision(bullet, arr, callback) {
        arr.forEach(el => {
            this.collision(bullet, el, (a, b) => {
                a.reduceLife();
                b.reduceLife();
                if (!b.run) {
                    callback(b);
                }
            });
        });
    }

    // 用户相撞
    playerCollision(el, callback) {
        this.collision(this.player, el, () => {
            el.death();
            callback(el);
        });
    }

    // 工厂
    factory(elem) {
        const o = new elem(this);
        o.setup();
        return o;
    }

    // 追加
    append(obj) {
        obj.cooldown.update().active(() => {
            obj.arr.push(
                this.factory(obj.elem)
            )
        });
    }

    // 追加元素
    appendElement() {
        this.append(this.enemys);
        this.append(this.meteorites);
        this.append(this.friends);
        this.append(this.fuels);
        this.append(this.stars);
    }

    // 正在更新
    updateing(arr, callback) {
        const len = arr.length;
        for (let i = len - 1; i >= 0; i--) {
            const el = arr[i];
            if (el.isDeath) {
                arr.splice(i, 1);
                continue;
            }
            el.update();
            callback && callback(el);
        }
    }

    // 更新子弹
    updateBullets() {
        const {
            shootEnemy, // 射击的敌人
            shootMeteorite, //射击的陨石
            shootFriend //射击的好友
        } = config.scoreConfig; // 射击的分数配置
        const {
            beingHit
        } = config.fuelConfig; // 火药的配置
        this.updateing(this.playerBullets, bullet => {
            this.bulletCollision(bullet, this.enemyBullets, (el) => {
                el.death();
            });
            this.bulletCollision(bullet, this.enemys.arr, (el) => {
                this.updateScore(
                    el instanceof Meteorite ?
                    shootMeteorite : shootEnemy
                );
                this.updateshoot();
                this.shoot();
            });
            this.bulletCollision(bullet, this.friends.arr, (el) => {
                this.updateScore(shootFriend);
                this.shoot();
            });
        });
        this.updateing(this.enemyBullets, bullet => {
            this.playerCollision(bullet, () => {
                this.updateFuel(beingHit);
            })
        });
    }


    initCanvas(){
        this.canvas = $('#canvas');
        this.canvas.width = config.game.w;
        this.canvas.height = config.game.h;

        this.ctx = this.canvas.getContext('2d');
    }

    initPlayer(){
        this.player = this.factory(Player);
    }

    draw(data){
        this.ctx.drawImage.apply(this.ctx,data);
    }

    // 移动 translate x 和 y  旋转  rotate 角度 * PI /180 
    rotateDraw(conf){
        this.ctx.save(); //保存
        this.ctx.translate(conf.x,conf.y); //x 和 y
        this.ctx.rotate(conf.deg * Math.PI / 180);
        this.draw(conf.data);
        this.ctx.restore();
    }


    // 配置字体
    setFontStyle(font = "20px Arial",yellow = "yellow"){
        this.ctx.font = font;
        this.ctx.fillStyle = yellow;
    }

    // 画字 
    drawText(data){
        this.ctx.fillText(data.text,data.x,data.y)
    }

    // 事件
    event(){
        const togglePause = () =>{
            this.pauseFlag ? this.start() : this.pause();
        }

        const toggleMute = ()=>{
            this.muteFlag ? this.speak() : this.mute();
        }
        const fontSize = (status)=>{
            let {
                max,min,val
            } = config.game.fontSize;
            val += (status?1:-1);
            if(val <= min ||val >= max) return;
            config.game.fontSize.val = val;
            this.updateFontSize();
        }
        hotkey.reg('p',()=>{
            togglePause()
        },true);
        hotkey.reg('m',()=>{
            toggleMute();
        },true);
        on(
            $('')
        )
    }



}