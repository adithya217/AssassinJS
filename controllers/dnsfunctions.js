var url = require('url');
var dns = require('dns');
var queryutil = require('querystring');
var common = require('./common');

function forwardRequest(request,response)
{	
	this.findip = function(request,response)
	{	
		var params = url.parse(request.url).query;	
		console.log('query = '+params);
		var qObj = queryutil.parse(params);		
						
		dns.lookup(qObj.query,function(err,ip){
				
			var result = 'HTTP - '+request.httpVersion+'\nMethod - '+request.method+'\nURL - '+request.url+'\nHeader - '+request.header;		
	
			if(err) 
			{			 
				 result += '\n'+'Encountered Error - '+err;
			}
			else
			{				
				 result += '\n'+qObj.query+' resolved to '+ip;	
			}
		
		 	console.log(result);		
			response.writeHead(200,{'content-type':'text/plain'});			
			response.write(result);				 
			response.end();		
			 		
		});	
		
		return;		
	};
	
	//actual calling part
	var pathname = url.parse(request.url).pathname;	
	console.log(pathname);
	console.log(this);
	var word = pathname.split('/')[2];
			
	if(typeof(this[word]) === 'function')
	{
		this[word](request,response);
	}
	else
	{
		common.errorEcho(request,response);
	}
}

exports.forwardRequest = forwardRequest;
