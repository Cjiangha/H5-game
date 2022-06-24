class Scene{
    constructor(el,game){
        this.el = $(el);
        this.game = game;
    }

    created(){

    }

    // 启动
    setup(){
    }

    // 未配置
    uninstall(){

    }

    show(){
        this.el.classList.add('action');
    }

    hidden(){
        this.el.classList.remove('action');
    }

}
