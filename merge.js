'use strict';
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const co = require('co');

function mergePng(pngName, outputName)
{
    return co.wrap(function *(){
		var dir = path.dirname(pngName)
        var pngNameEn = path.basename(pngName, '.png') + '_en.png';
		pngNameEn = path.join(dir, pngNameEn);
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
                top: m1.height,
                left: 0,
            })
            .png()
        yield merge.toFile(outputName);
        return m1.height;
    })();
}

function mergeFnt(fntName, offsetH, ouputName)
{
    return co.wrap(function *(){
		var dir = path.dirname(fntName)
        var fntNameEn = path.basename(fntName, '.fnt') + '_en.fnt';
		fntNameEn = path.join(dir, fntNameEn);
        var data = fs.readFileSync(fntNameEn, 'utf-8');
        data = data.split('\n').slice(4).join('\n');
        var res = data.replace(/(y=)(\d+)/g, function(match, p1, p2) {
            var y = Number(p2) + offsetH;
            return p1 + y;
        })
		
		data = fs.readFileSync(fntName, 'utf-8');
		data += res;
		fs.writeFileSync(ouputName, data);
        return data;
    })();
}

exports.mergePng = mergePng;
exports.mergeFnt = mergeFnt;
