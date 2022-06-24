class Start extends Scene{
    setup(){
        super.setup();
        this.game.initData();// 初始化游戏的数据    
        this.event();

    }

    event(){
        const btn = $('#start-btn');
        on( btn,
            'click',
            ()=>{
                btn.setAttribute('disabled','disabled');
                res.loadAssets(()=>{
                    this.game.play();
                    btn.removeAttribute('disabled');
                })
            }
        )
    }

}