'use strict';

function intersection(arr1, arr2){
    return arr1
        .filter(item => arr2.indexOf(item) >= 0)
        .filter((item, index, arr) => arr.indexOf(item) === index);
}

function union(arr1, arr2){
    return arr1
        .concat(arr2)
        .filter((item, index, arr) => arr.indexOf(item) === index);
}

module.exports = config => {
    try{
        if(config.length === undefined){
            throw "Must be an array";
        }
    }
    catch(e){
        throw "Must be an array";
    }

    if(config.constructor !== Array){
        throw "Must be an array";
    }

   if(config.find(item => !item.name)){
       throw "Each item must have a name";
   }

   if(config.find(item => !item.libs || item.libs.constructor !== Object)){
       throw "Each item must have a libs object";
   }

   if(config.length === 0){
       return true;
   }

   let total = {
        intersection: config
            .map(item => Object.keys(item.libs))
            .reduce((prev, curr) => intersection(prev, curr)),
        union: config
            .map(item => Object.keys(item.libs))
            .reduce((prev, curr) => union(prev, curr))
   };

   if(total.intersection.length !== total.union.length){
       throw "Every entry must contain all the same libs";
   }

    return true;
};
