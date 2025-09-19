function switchContext(containerName){
    document.querySelectorAll('.frontpageContainer').forEach(container => {
        container.style.display = (container.id === containerName) ? "" : "none";
    });

    localStorage.setItem('lastPage', containerName);
}

function searchContact()
{
	let srch = document.getElementById("searchText").value;

    if(srch.trim() === ''){
        document.getElementById("contactSearchResult").innerHTML = "Arrr, ye forgot to type somethin', ye scallywag!";
    }
    else{
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
}

function searchContactWrapper()
{
	let contactBlock = document.querySelector(".contactBlock");
	let createContactBlock = document.querySelector(".createContactBlock");


	if (contactBlock.style["display"] === "none")
	{
		contactBlock.style = "display:block";
		createContactBlock.style = "display:none";
		searchContact();
	}
	else
	{
		searchContact();
	}
		
}

function createContact()
{
	let newFirstName = document.getElementById("newFirstName").value;
	let newLastName = document.getElementById("newLastName").value;
	let newPhoneNum = document.getElementById("newPhoneNumber").value;
	let newEmail = document.getElementById("newEmail").value;
	let err = false;
	
	let tmp = {
		firstName:newFirstName,
		lastName:newLastName,
		phone:newPhoneNum,
		email:newEmail,
		userId:userId
	};
	
	let jsonPayload = JSON.stringify(tmp);
	
	let url = urlBase + '/CreateContact.' + extension; 
	
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
				let databaseUserId = jsonObject.ID;
            
                    if(!jsonObject.success)
                    {		
                       // document.getElementById(".newContactGroup .inputError").innerHTML = err.message;
                        return;
                    }
				

			}
		};
		xhr.send(jsonPayload);
		alert("yep");
	}
	catch(err)
	{
		document.getElementById(".newContactGroup .inputError").innerHTML = err.message;
	}
	
}

function toggleCreateContact()
{
	// let contactBlock = document.querySelector(".contactBlock");
	// let createContactBlock = document.querySelector(".createContactBlock");

	
	// if (contactBlock.style["display"] === "none")
	// {
	// 	contactBlock.style = "display:block";
	// 	createContactBlock.style = "display:none";
	// }
	// else
	// {
	// 	contactBlock.style = "display:none";
	// 	createContactBlock.style = "display:block";
	// }

}

function updateContact(dbId){
    let update = {'ID': dbId}
    document.querySelectorAll(`.contact[data-id="${dbId}"] .updateContactInput[data-field]`).forEach(input => {
        update[input.dataset.field] = input.value;
    })
    update['userId'] = userId;

    // TODO: add HTML for this so it works
    // let fnameError = document.querySelector('.updateError.firstNameError');
    // let lnameError = document.querySelector(".updateError.passwordError");
    // let phoneError = document.querySelector('.updateError.phoneError');
    // let emailError = document.querySelector('.updateError.emailError');
    // let err = false;

    // if(update['fname'].trim() === ''){
    //     fnameError.innerHTML = 'First name cannot be blank';
    //     err = true;
    // }
    // else{
    //     fnameError.innerHTML = '';
    // }

    // if(update['lname'].trim() === ''){
    //     lnameError.innerHTML = 'Last name cannot be blank';
    //     err = true;
    // }
    // else{
    //     lnameError.innerHTML = '';
    // }

    // if(update['phone'].trim() === ''){
    //     phoneError.innerHTML = 'Phone number cannot be blank';
    //     err = true;
    // }
    // else if(!validPhone(update['phone'])){
    //     phoneError.innerHTML = 'Invalid phone number format.';
    //     /* Try:
    //        e.g. 1002003000 or
    //        e.g. 100-200-3000    or
    //        e.g. (100)-200-3000
    //     */
    //    err = true;
    // }
    // else{
    //     phoneError.innerHTML = '';
    // }

    // if(update['email'].trim() === ''){
    //     emailError.innerHTML = 'Email cannot be blank';
    //     err = true;
    // }
    // else if(!validEmail(update['email'])){
    //     emailError.innerHTML = 'Email'
    //     err = true;
    // }
    // else{
    //     emailError.innerHTML = '';
    // }

    // if(!err){
    //     Put backend stuff here
    // }

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

