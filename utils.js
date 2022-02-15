const {http,request} = require('http');
const fs = require('fs');

class Request{
	constructor(message,author,expire,valid=true){
		this.message = message;
		this.author = author;
		this.expire = expire;
		this.valid = valid;
	}

	isValid(){
		return this.valid;
	}
}

function sendRequest(nextRequest) {
	const reqAuthor = request(`http://192.168.1.140:3000/?text=[${nextRequest.author}]&line=0`);
	const reqMessage = request(`http://192.168.1.140:3000/?text=${nextRequest.message}&line=1`);
	reqAuthor.on('error', e => console.error(`problem with ${e.message}`));
	reqMessage.on('error', e => console.error(`problem with ${e.message}`));
	reqAuthor.end();
	reqMessage.end();
}

function refreshQueue(queeFile, globalLoop){
	const obj = JSON.parse(fs.readFileSync(queeFile)); 
	if(obj.array == '') return new Request('','',0,false);
	
	const freshRequest = new Request(obj.array[0].message,obj.array[0].author,obj.array[0].expire);
		
	obj.array.forEach(elem => elem.expire = parseInt(elem.expire)-globalLoop);
	obj.array.push(obj.array.shift());
	obj.array = obj.array.filter(el => el.expire > 0);
	fs.writeFileSync(queeFile,JSON.stringify(obj));
		
	return freshRequest;
}

module.exports ={
    sendRequest,
	refreshQueue,
	Request
}