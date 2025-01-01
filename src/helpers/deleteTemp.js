const fs = require('fs');

const deleteTemp = (path) => {
	try {
		fs.unlinkSync(path, (err) => {
			if (err) { throw err; }
			console.log('File was deleted!');
		});
	}
	catch (err) {
		if (err.code === 'ENOENT') {
			console.log('The file does not exist!');
		}
		else {
			console.log(err);
			return false;
		}
	}
	return true;
};

module.exports = { deleteTemp };