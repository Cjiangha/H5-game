class Animation{
    constructor(data,scene){
        this.img = isImage(data.img) ? data.img : res.imageBy(data.img);
        this.cooldown = new Cooldown(data.cooldown);
        this.col = data.col;
        this.row = data.row;
        this.loop = data.loop;
        this.w = this.img.width / this.row;
        this.h = this.img.height / this.col;
        this.index = 0;
        this.len = this.row * this.col;
        this.isEnd = false;
        this.scene = scene;
    }

    play(info){ //配置模式
        if(this.isEnd) return this;
        this.draw(info);
        this.cooldown.update().active(()=>{
            this.index++;
        });
        if(this.loop){
            if(this.index === this.len){
                this.index = 0;
            }
        }else{
            return this;
        }
    }
}