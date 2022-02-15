export class Request{
	message: String;
    author: String;
    expire: Number;
    valid:Boolean;
    constructor(message: String, author:String, expire:Number, valid:Boolean){
		this.message = message;
		this.author = author;
		this.expire = expire;
        this.valid = valid;
	}
    
    isValid():Boolean
}

export function sendRequest(nextRequest: Request) : void
export function refreshQueue(queeFile: String, globalLoop: Number): Request