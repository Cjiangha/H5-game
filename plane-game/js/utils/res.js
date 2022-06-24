const res = (()=>{

    let o = {};

    let _images = null;
    let _audios = null;

    let call = (callback) =>{
        if(_images && _audios){
            callback();
            o.loop('bg');
        }
    }
  
    // imagelist
    o.imageBy = (key)=>{
        return _images[key];
    }

    o.loop = (key)=>{
        _audios[key].loop = true;
    }

    o.loadAssets = callback =>{
        loadImages(config.images,images =>{
            _images = images;
            call(callback);
            
        });
        loadAudios(config._audios,audios =>{
            _audios = audios;
            call(callback);
        })
    }

    return o;

})()