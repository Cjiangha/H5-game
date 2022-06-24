class Game{
    constructor(){
        this.setup();
    }

    setup(){
        this.initSize();
        this.initScenes();// 启动
    }

    initData(){
        this.data = config.data();
        this.data.end = false;
    }

    initSize(){
        const el = $('#app');
        style(el,{
            width: config.game.w + 'px',
            height: config.game.h + 'px',
        })
    }

    initScenes(){
        this.scenes = {
            start : new Start('#start',this),
        }
    }

    toggleScene(scene){
        if(this.scene === this.scenes[scene]){
            return;
        }
        Object.keys(this.scenes).map(key=>{
            this.scenes[key].hidden();
        })
        this.scene && this.scene.uninstall();
        this.scene = this.scenes[scene];
        this.scene.show(); // 添加className
        this.scene.setup(); //启动 未配置
    }

    start(){
        this.toggleScene('start');
    }

    play(){
        this.toggleScene('play');
    }

    over(){
        this.toggleScene('over');
    }

    rank(){
        this.toggleScene('rank');
    }

}