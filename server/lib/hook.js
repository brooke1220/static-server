function Hook()
{
    this.tags = {};
}

Hook.prototype.get = function(tag){
    return this.tags[tag] || [];
}

Hook.prototype.add = function(tag, behavior){
    var tagName = tag[1],
        tag = tag[0];

    this.tags[tag] || (this.tags[tag] = {});

    if(! this.tags[tag][tagName]){
        this.tags[tag][tagName] = behavior;
    }
}

Hook.prototype.execTag = function(tagName, tag, args){
    var target = (typeof(tag) == 'object' ? tag : tag.prototype) || {};

    if(target[tagName] != undefined){
        return target[tagName](...args);
    }

    if(target.run != undefined){
        return target.run(...args);
    }

    return typeof(tag) == 'object' ? null : tag(...args);
}

Hook.prototype.listen = function(){
    var args = Object.values(arguments),
        tag = args.shift(),
        tags = this.get(tag);

    for(var i in tags){
        this.execTag(tag, tags[i], args);
    }
}

module.exports = new Hook
