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
                        document.getElementById("contactSearchResult").innerHTML = "Found yer mateys!";
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
                        document.getElementById("contactSearchResult").innerHTML = "No scallywags found...";
                    }
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
    let newFirstName = document.getElementById("newFirstName");
	let newLastName = document.getElementById("newLastName");
	let newPhoneNum = document.getElementById("newPhoneNumber");
	let newEmail = document.getElementById("newEmail");

    let result = validateContact(newFirstName.value, newLastName.value, newPhoneNum.value, newEmail.value);
    
    result.errors.forEach(err => {
        document.querySelector(`.newContactGroup .${err.field}Error`).innerHTML = err.err;
    });

    if(!result.hasError){
        let tmp = {
            firstName:newFirstName.value,
            lastName:newLastName.value,
            phone:stripPhoneNumber(newPhoneNum.value),
            email:newEmail.value,
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
                    if(!jsonObject.success)
                    {	
                        console.log(jsonObject.error);
                        return;
                    }
                    newFirstName.value = '';
                    newLastName.value = '';
                    newPhoneNum.value = '';
                    newEmail.value = '';
                }
            };
            xhr.send(jsonPayload);
        }
        catch(err)
        {
            document.getElementById(".newContactGroup .inputError").innerHTML = err.message;
        }
    }
	
}

function updateContact(dbId){
    let update = {'ID': dbId}
    document.querySelectorAll(`.contact[data-id="${dbId}"] .updateContactInput[data-field]`).forEach(input => {
        update[input.dataset.field] = input.value;
    })
    update['userId'] = userId;

    // Set the errors for each part of the update. Is blank if no errors for a field
    let result = validateContact(update['firstName'], update['lastName'], update['phone'], update['email']);
    result.errors.forEach(err => {
        document.querySelector(`.updateContactGroup .${err.field}Error`).innerHTML = err.err;
    });

    if(!result.hasError){
        update.phone = stripPhoneNumber(update.phone);

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
                        
                        // Update the contact entry with the updated details
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

function validateContact(firstName, lastName, phone, email){
    let errors = [
        {field:'firstName', err:''},
        {field:'lastName', err:''},
        {field:'phone', err:''},
        {field:'email', err:''},
    ];
    
    firstName = firstName.trim();
    lastName = lastName.trim();
    phone = phone.trim();
    email = email.trim();

    let hasError = false;

    if(!firstName){
        errors[0].err = 'First name cannot be blank';
        hasError = true;
    }
    if(!lastName){
        errors[1].err = 'Last name cannot be blank';
        hasError = true;
    }
    if(!phone){
        errors[2].err = 'Phone number cannot be blank';
        hasError = true;
    }
    else if(!validPhone(phone)){
        errors[2].err = 'Invalid phone number format.';
        /* Try:
           e.g. 1002003000 or
           e.g. 100-200-3000    or
           e.g. (100)-200-3000
        */
       hasError = true;
    }
    if(!email){
        errors[3].err = 'Email cannot be blank';
        hasError = true;
    }
    else if(!validEmail(email)){
        errors[3].err = 'Invalid email';
        hasError = true;
    }


    return {errors, hasError};
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

