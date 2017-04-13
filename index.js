'use strict';
const fs = require('fs-extra');
const path = require('path');
const co = require('co');
const program = require('commander');

const merge = require('./merge');
const folder = require('./folder');

program
    .version('0.0.1')
    .usage('[options]')
    .option('-i, --input <value>', 'The input directory.')
    .option('-o, --output <value>', 'The output directory.')
    .parse(process.argv);




if (program.input && program.output )
{
	if(!fs.existsSync(program.output))
	{
		fs.mkdirsSync(program.output);
	}
	if(fs.existsSync(program.input))
	{
		folder.scan(program.input, function(file){
			var fn = path.basename(file, '.fnt');
			if (!fn.endsWith('_en'))
			{
				co(function* (){
                    console.log(`${fn} begin`);
					var height = yield merge.mergePng(path.join(program.input, `${fn}.png`), path.join(program.output, `${fn}.png`));
					yield merge.mergeFnt(path.join(program.input, `${fn}.fnt`), height, path.join(program.output, `${fn}.fnt`));
					console.log(`${fn} done`);
				}).then(function (value) {
                    
                }, function (err) {
                  console.error(err.stack);
                });
			}
		}, 'fnt')
	}
	else
	{
		console.error(`${program.input} does not exist!`);
	}
}
else
{
	program.outputHelp();
}
