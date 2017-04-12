'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const co = require('co');

function mergePng(pngName, outputName)
{
    return co.wrap(function *(){
        var pngNameEn = path.basename(pngName, '.png') + '_en.png';
        var input = sharp(pngName);
        var inputEn = sharp(pngNameEn);
        
        var m1 = yield input.metadata();
        var m2 = yield inputEn.metadata();
        var merge = input
            .clone()
            .background({r: 0, g: 0, b: 0, alpha: 0})
            .extend({top: 0, bottom: m2.height, left: 0, right: 0});
        merge
            .overlayWith(pngNameEn, {
                top: m2.height,
                left: 0,
            })
            .png()
        yield merge.toFile(outputName);
        return m2.height;
    })();
}

function mergeFnt(fntName, offsetH, ouputName)
{
    return co.wrap(function *(){
        var fntNameEn = path.basename(fntName, '.fnt') + '_en.fnt';
        var data = fs.readFileSync(fntNameEn, 'utf-8');
        data = data.split('\n').slice(4).join('\n');
        var res = data.replace(/(y=)(\d+)/g, function(match, p1, p2) {
            var y = Number(p2) + offsetH;
            return p1 + y;
        })
        console.log(res);
        return data;
    })();
}

exports.mergePng = mergePng;
exports.mergeFnt = mergeFnt;
