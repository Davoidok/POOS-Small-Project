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
						contactList += getContactHTML(
                            results[i]['ID'],
                            results[i]['firstName'],                     
                            results[i]['lastName'],
                            results[i]['phone'],
                            results[i]['email']
                        );
					}
				}
				else{
					document.getElementById("contactSearchResult").innerHTML = "No contacts found";
                }
                // console.log(contactList);
                document.querySelector(".contactList").innerHTML = contactList;				
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}



function updateContact(dbId){
    let update = {'ID': dbId}
    document.querySelectorAll(`.contact[data-id="${dbId}"] .updateContactInput[data-field]`).forEach(input => {
        update[input.dataset.field] = input.value;
    })
    update['userId'] = userId;

    let jsonPayload = JSON.stringify(update);
    let url = urlBase + '/UpdateContact.' + extension;

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
                if(jsonObject.success){
                    document.getElementById("contactSearchResult").innerHTML = "Contact updated successfully!";
                    if(update['firstName'] !== '')
                        document.querySelector(`.contact[data-id="${dbId}"] #contactFirstName`).innerHTML = update['firstName']; 
                    if(update['lastName'] !== '')
                        document.querySelector(`.contact[data-id="${dbId}"] #contactLastName`).innerHTML = update['lastName'];
                    if(update['phone'] !== '')
                        document.querySelector(`.contact[data-id="${dbId}"] #contactPhoneNumber`).innerHTML = formatPhoneNumber(update['phone']);
                    if(update['email'] !== '')
                        document.querySelector(`.contact[data-id="${dbId}"] #contactEmail`).innerHTML = update['email'];

                    document.querySelector(`.contact[data-id="${dbId}"] .updateContactBlock`).innerHTML = '';
                }
				else{
					document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
                }
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

/**
 * 
 * @param {integer} dbId  The unique id of the contact from the database. 
 */
function toggleUpdateContactFields(dbId){
    const updateBlock = document.querySelector(`.contact[data-id="${dbId}"] .updateContactBlock`);
    if(updateBlock.innerHTML.trim() === ''){
        updateBlock.innerHTML = `
            <input class="updateContactInput" data-field="firstName" placeholder="First Name" onkeydown="if(event.key=='Enter') updateContact(${dbId});"/>
            <input class="updateContactInput" data-field="lastName" placeholder="Last Name" onkeydown="if(event.key=='Enter') updateContact(${dbId});"/>
            <input class="updateContactInput" data-field="phone" placeholder="Phone Number" onkeydown="if(event.key=='Enter') updateContact(${dbId});"/>
            <input class="updateContactInput" data-field="email" placeholder="Email" onkeydown="if(event.key=='Enter') updateContact(${dbId});"/>
        `;
    }else{
        updateBlock.innerHTML = '';
    }
}