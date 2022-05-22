const fs = require('fs');
const path = require('path');
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir); 



module.exports = (dir) => {
  
	return fs.readdirSync(dir)
		.flatMap(file => {
		const fullPath = path.join(dir, file);
      // console.log(fullPath)
		 if(fullPath.endsWith('.js')) {
        // console.log(fullPath)
				return path.resolve(fullPath);
			}
		})
		.filter(_ => _);
};