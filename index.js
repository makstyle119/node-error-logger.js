const fs = require('fs');
const dir = 'log';

if (!fs.existsSync(dir)) {
	fs.mkdirSync(dir);
}

const date = new Date().toJSON().slice(0, 10);
const time = new Date().toJSON();

const Logger = (data) => {
	const body = time + ' ' + data + '\n';
	fs.appendFile(`${dir}/${date}` + '.txt', body, 'utf8', function (err) {
		if (err) throw err;
	});
};

module.exports = Logger;
