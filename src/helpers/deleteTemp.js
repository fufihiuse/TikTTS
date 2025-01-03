const fs = require('fs');

const deleteTemp = (path) => {
	try {
		fs.unlinkSync(path, (err) => {
			if (err) { throw err; }
			console.log('File was deleted!');
		});
	}
	catch (err) {
		// Will throw ENOENT if file doesn't exist, so do nothing
		if (err.code !== 'ENOENT') {
			console.log(err);
			return false;
		}
	}
	return true;
};

module.exports = { deleteTemp };