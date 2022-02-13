function sendLines(msg1, msg2) {
	const reqFirstLine = http.request(`http://192.168.1.140:3000/?text=[${msg1}]&line=0`, _ => { });
	const reqSecondLine = http.request(`http://192.168.1.140:3000/?text=${msg2}&line=1`, _ => { });
	reqFirstLine.on('error', e => console.error(`problem with ${e.message}`));
	reqSecondLine.on('error', e => console.error(`problem with ${e.message}`));
	reqFirstLine.end();
	reqSecondLine.end();
}

module.exports ={
    sendLines
}