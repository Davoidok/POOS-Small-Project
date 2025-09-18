const urlBase = 'http://4lokofridays.com/LAMPAPI';
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

function createContact()
{
	let newFirstName = document.getElementByID("AddContactFirstNameField").value;
	let newLastName = document.getElementByID("AddContactLastNameField").value;
	let newPhoneNum = document.getElementByID("AddContactPhoneNumField").value;
	let newEmail = document.getElementByID("AddContactEmailField").value;

	let tmp = {
		firstName:newFirstName,
		lastName:newLastName,
		phone:newPhoneNum,
		email:newEmail,
		userId:userId
	};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/CreateContact.' + exstension; 
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("createContactResults").innerHTML = "Contact created!";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("createContactResults").innerHTML = err.message;
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


/**
 * Returns a string of the desired contact formatted as an HTML \<details\> element.
 * @param {integer} dbId The unique id of the contact from the database. 
 * @param {string} firstName Stored in HTML as \<h3\> \<span\> element
 * @param {string} lastName Stored in HTML as \<h3\> \<span\> element
 * @param {string} phone Stored in HTML as \<span\> element inside \<div class="contactDropdown"\>
 *                       container
 * @param {string} email Stored in HTML as \<span\> element inside \<div class="contactDropdown"\>
 *                       container
 * @returns 
 */
function getContactHTML(dbId, firstName, lastName, phone, email)
{
    return `
        <details class="contact" data-id=${dbId}>
          <summary class="contactName">
            <h3>
              <span id="contactFirstName">${firstName}</span> 
              <span id="contactLastName">${lastName}</span>
            </h3>
          </summary>
          <div class="contactDropdown">
            <div class="contactInfo">
              <span id="contactPhoneNumber">${formatPhoneNumber(phone)}</span>
              <span id="contactEmail">${email}</span>
            </div>
            <button id="updateContactButton" onclick="toggleUpdateContactFields(${dbId})">Update</button>
            <button id="deleteContactButton" onclick="toggleUpdateContactFields()">Delete</button>
          </div>
          <span class="updateContactBlock"></span>
        </details>
    `
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
 * Returns a 10-digit phone number in the format (XXX)-XXX-XXXX
 * @param {string} phone 
 */
function formatPhoneNumber(phone)
{
    let areaCode = phone.slice(0,3);
    let exchange = phone.slice(3,6);
    let subscriber = phone.slice(6, 10);
    return `(${areaCode})-${exchange}-${subscriber}`; 
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}


function doDeleteContact(dbId)
{
	let contactToDelete = {'ID': dbId}

	let contactFirstName = document.querySelector(`.contact[data-id="${dbId}"] #contactFirstName`).innerHTML;
	let contactLastName = document.querySelector(`.contact[data-id="${dbId}"] #contactLastName`).innerHTML;
	let contactPhoneNum = document.querySelector(`.contact[data-id="${dbId}"] #contactPhoneNumber`).innerHTML;
	let contactEmail = document.querySelector(`.contact[data-id="${dbId}"] #contactEmail`).innerHTML;

	if(confirm("Warning! You are about to delete:\n" + contactFirstName + " " + contactLastName + "\nPhone: " + contactPhoneNum + "\nEmail: " + contactEmail + "\nAre you sure you want to do this? This cannot be undone!"))
	{
		let jsonPayload = JSON.stringify(contactToDelete);
		let url = urlBase + '/DeleteContact.' + extension;

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
						document.querySelector(`.contactList .contact[data-id="${dbId}"]`).remove();
					}
					else{
						console.log("delete failed");
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

