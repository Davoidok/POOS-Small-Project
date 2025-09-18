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
	firstName = document.getElementById("registerFirstName").value;
	lastName = document.getElementById("registerLastName").value;
	let login = document.getElementById("registerUsername").value;
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