// const urlBase = 'http://4lokofridays.com/LAMPAPI';
const urlBase = 'http://localhost:8000/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function goToCreateAccount()
{
    window.location.href = 'createaccount.html';
}

function goToLogin()
{
    window.location.href = 'index.html';
}

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	
	document.getElementById("loginError").innerHTML = "";

	let tmp = {login:login,password:password};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{console.log("ReadyState:", xhr.readyState, "Status:", xhr.status);
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if(!jsonObject.success)
				{		
					document.getElementById("loginError").innerHTML = jsonObject.error;
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "landingpage.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginError").innerHTML = err.message;
	}

}

function doRegister()
{
	let firstName = document.getElementById("registerFirstName").value;
	let lastName = document.getElementById("registerLastName").value;
	let login = document.getElementById("registerName").value;
	let password = document.getElementById("registerPassword").value;

	document.getElementById("registerError").innerHTML = "";
	let tmp = {firstName:firstName,lastName:lastName,login:login,password:password};
	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
	{
		xhr.onreadystatechange = function() 
		{console.log("ReadyState:", xhr.readyState, "Status:", xhr.status);
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if(!jsonObject.success)
				{		
					document.getElementById("registerError").innerHTML = jsonObject.error;
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "landingpage.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerError").innerHTML = err.message;
	}
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
}

function searchContact()
{
	let srch = document.getElementById("searchText").value;

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{

				let jsonObject = JSON.parse( xhr.responseText );
				let results = jsonObject.result;
                let contactList = "";
				if(results.length > 0){
					document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
					for( let i=0; i < results.length; i++ )
					{
						contactList += "<div>"+results[i]['firstName']+"</div>"+
                                       "<div>"+results[i]['lastName']+"</div>"+
                                       "<div>"+results[i]['phone']+"</div>"+
                                       "<div>"+results[i]['email']+"</div>";
					}
				}
				else{
					document.getElementById("contactSearchResult").innerHTML = "No contacts found";
                }
                document.getElementById("contactList").innerHTML = contactList;				
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}

}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}
