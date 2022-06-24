class Cooldown{
    //  cooldown->冷却 notImmediately-> 不能立即执行
    constructor(cooldown,notImmediately=false){
        this.cooldown = notImmediately ? this.getCooldown(cooldown) : 0;
        this.initCooldown = cooldown;
    }

    // 获取冷却的时间
    getCooldown(cooldown){
        if(isArray(this.initCooldown)){
            return random.apply(null,this.initCooldown);
        }
        return cooldown;
    }

    // 时间更新
    update(){
        this.cooldown--;
        return this;
    }

    // 活跃
    active(callback){
        if(this.cooldown <= 0){
            this.reset();
            callback();
        }
    }

    // 重置
    reset(){
        this.cooldown = this.getCooldown(this.initCooldown);
    }
}