'use strict';
const co = require('co');

const merge = require('./merge');

merge.mergePng('FZZY_Size48_darkblue.png', 'ttt.png').then(function(val){
    console.log(val)
}, function(err) {
    console.error(err);
})

merge.mergeFnt('FZZY_Size48_darkblue.fnt', 256, 'ccc.fnt').then(function(val){
    
})