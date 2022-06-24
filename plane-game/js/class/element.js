class Element{
    constructor(scene){
        this.scene = scene;  //场景
        this.run = true;      
        this.enter = false;
        this.isDeath = false;
        this.life = 1;
        this.deg = 0;// 程度
        this.rotateState = false;
        this.rotateSpeed = 2;
        this.textRise = 15;
        this.text = 'text';
    }

    // 启动
    setup(obj){
        const _obj = config[obj]; //config所有属性
        Object.keys[_obj].map((key)=>{
            if(key === 'img'){
                if(isArray(_obj[key])){
                    this.img = res.imageBy(randomArrayItem(_obj[key]));
                    return;
                }
                this.img = res.imageBy(_obj[key]);
                return;
            }
        })
    }
}