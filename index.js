import fs from 'fs';

let date = new Date().toJSON().slice(0, 10);
let time = new Date().toJSON();

const Logger = (data) => {
	let body = time + ' ' + data + '\n';
	fs.appendFile(`log/${date}` + '.txt', body, 'utf8', function (err) {
		if (err) throw err;
	});
};

export default Logger;
