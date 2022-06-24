const log = console.log.bind(console);

const $ = elem => document.querySelector(elem);

const $el = elem => document.querySelectorAll(elem);

const style = (el,styleObj) =>{
    for(let i in styleObj){
        el.style[i] = styleObj[i]
    }
}

const on = (el, type, callback) => {
    el.addEventListener(type, callback);
}

const numberFormat = (num)=>{
    const isPlus = num >= 0;
    const n = Math.abs(num);
    const res = n >9 ? n :'0' + n;
    return isPlus ? res : `-${res}`;
}

const random = (end,start)=>{
    return Math.floor(Math.random() * (end - start)) + start;
}

//  事件的执行判断
const raf = (()=>{
    let events = {};
    const reg = (id,callback)=>{
        if(events[id]){
            return console.error('id 已经存在')
        }
        events[id] = callback;
    }

    const remove = (id) =>{
        if(!events[id]) return;
        delete events[id];
    }

    const clearAll = () =>{
        events ={};
    }

    const update = () =>{
        for(const fn of Object.values(events)){
            fn();
        }
        requestAnimationFrame(update);
    }

    update();

    return {
        reg : reg,
        remove:remove,
        clearAll:clearAll
    }
})();

const hotkey = (()=>{
    let data = {};
    
    const regKeyCode = (keyCode)=>{
        data[keyCode] = {
            active:false,
            events:[]
        }
    }

    const loop = ()=>{
        for(let key of Object.keys(data)){
            let event = data[key];
            if(!event.active){
                continue;
            }
            event.events.forEach(el =>{
                if(el.enable){
                    el.callback();
                }
                if(el.once){
                    el.enable = false;
                }
            })
        }
    }

    raf.reg('HotKey_loop', loop);

    on(window, 'keydown',e=>{
        let keyCode = e.key.toLocaleUpperCase();
        if(!data[keyCode]){
            return;
        }
        e.preventDefault();
        data[keyCode].active = true;
    })

    on(window,'keyup',e=>{
        let keyCode = e.key.toLocaleUpperCase();
        if(!data[keyCode]){
            return;
        }
        data[keyCode].active = false;
        data[keyCode].events
            .filter(el => el.once)
            .forEach(el=>el.enable = true)
    })

    loop();

    return{
        reg:(keyCode,callback,once = false) =>{
            keyCode = "" + keyCode;
            keycode = keycode.toLocaleUpperCase();
            if(!data[keycode]){
                regKeyCode(keyCode);
            }
            data[keycode].events.push({
                once,
                callback,
                enable:true
            })
        },
        clearAll: () => {
            data = {};
        }
    }
})()

// 加载图片资源   list->键list obj->image callback
const loadResource = (list, Obj, callback)=>{
    const keys = Object.keys(list);
    const result = {};
    const len = keys.length;
    // Obj Type is Image or Audio 
    const load = Obj === Image ?'onload' : 'onloadedmetadata';
    let count = 0;
    const call = (obj,key)=>{
        count++;
        result[key] = obj;//把图片传进去
        if(len === count){
            callback(result)
        }
    }
    keys.map(key=>{
        const obj = new Obj();
        obj.src = list[key];
        obj[load] = ()=>{
            call(obj,key)
        }
    })
}

const loadImages = (images,callback)=>{
    return loadResource(images,Image,callback);
}

const loadAudios = (audios, callback) => {
    return loadResource(audios, Audio, callback);
};