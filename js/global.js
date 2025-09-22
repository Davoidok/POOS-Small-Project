const urlBase = 'http://4lokofridays.com/LAMPAPI';
//const urlBase = 'http://localhost:8000/LAMPAPI'
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

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
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

/**
 * Returns a string of the desired contact formatted as an HTML \<details\> element.
 * @param {integer} dbId The unique id of the contact from the database. 
 * @param {string} firstName Stored in HTML as \<h3\> \<span\> element
 * @param {string} lastName Stored in HTML as \<h3\> \<span\> element
 * @param {string} phone Stored in HTML as \<span\> element inside \<div class="contactDropdown"\>
 *                       container
 * @param {string} email Stored in HTML as \<span\> element inside \<div class="contactDropdown"\>
 *                       container
 * @param {array} matches (optional) A boolean array of the contact fields that matched a
 *                        search query. e.g. [false, false, true, false] corresponds to 
 *                        a match in the phone number only
 * @param {string} search (optional) The search query that produced the matches
 * @returns 
 */
function getContactHTML(dbId, firstName, lastName, phone, email, matches = [], search = "")
{
    let contactInfoMatch = '';
    if(matches.length == 4){
        // Tried to do partial bolding, but found it to be too complicated for time
        // if(matches[0] === true) { // firstName
        //     firstName = partialHTMLBold(firstName, search); 
        // }
        // if(matches[1] === true) { // lastName
        //     lastName = partialHTMLBold(lastName, search);
        // }
        // if(matches[2] === true) { // phone
        //     phoneMatch = `<span id="phoneSearchMatch">${partialHTMLBold(phone, search)}</span>`;
        // }

        
        if(matches[3] === true) { // email
            contactInfoMatch = `<span id="emailSearchMatch">${email}</span>`
        }
        if(matches[2] === true) { // phone
            contactInfoMatch = `<span id="phoneSearchMatch">${formatPhoneNumber(stripPhoneNumber(phone))}</span>`;
        }
    }

    return `
        <details class="contact" data-id=${dbId}>
            <div class="updateNameGroup hidden">
                <div class="firstNameGroup">
                    <input placeholder="First Name" id="firstNameUpdate" class="inputField pirate-scrawl updateInput" onkeydown="if(event.key=='Enter') updateContact(${dbId})
                                                                                                                                 else if(event.key=='Escape') toggleUpdateContactFields(${dbId})">
                    <div class="errorContainer firstNameError pirata-one"></div>
                </div>    
                <div class="lastNameGroup">
                    <input placeholder="Last Name" id="lastNameUpdate" class="inputField pirate-scrawl updateInput" onkeydown="if(event.key=='Enter') updateContact(${dbId})
                                                                                                                               else if(event.key=='Escape') toggleUpdateContactFields(${dbId})">
                    <div class="errorContainer lastNameError pirata-one"></div>
                </div>
            </div>
            <summary class="contactHeader" onclick="checkToggleUpdateContact(${dbId})">
                <h3 class="contactNameGroup">
                    <span class="chevron">&#9662;</span>
                    <span id="contactFirstName">${firstName}</span> 
                    <span id="contactLastName">${lastName}</span>
                </h3>
                <h5 class="searchMatches">
                    ${contactInfoMatch}
                </h5>
            </summary>
            <div class="contactDropdown">
                <div class="contactInfoGroup">
                    <span id="contactPhoneNumber">${formatPhoneNumber(phone)}</span>
                    <span id="contactEmail">${email}</span>
                </div>
                <div class="updateInfoGroup hidden">
                    <div class="phoneGroup">
                        <input placeholder="(000) 000-0000" id="phoneUpdate" class="inputField pirate-scrawl updateInput" onkeydown="if(event.key=='Enter') updateContact(${dbId})
                                                                                                                                     else if(event.key=='Escape') toggleUpdateContactFields(${dbId})">
                        <div class="errorContainer phoneError pirata-one"></div>
                    </div>
                    <div class="emailGroup">
                        <input placeholder="user@gmail.com" id="emailUpdate" class="inputField pirate-scrawl updateInput" onkeydown="if(event.key=='Enter') updateContact(${dbId})
                                                                                                                                     else if(event.key=='Escape') toggleUpdateContactFields(${dbId})">
                        <div class="errorContainer emailError pirata-one"></div>
                    </div>
                </div>
                <div class="contactActions">
                    <div class="updateDeleteButtons">
                        <button id="updateContactButton" title="Update Contact" onclick="toggleUpdateContactFields(${dbId})"></button>
                        <button id="deleteContactButton" title="Delete Contact" onclick="doDeleteContact(${dbId})"></button>
                    </div>
                    <div class="confirmCancelButtons hidden">
                        <button id="confirmUpdateButton" title="Confirm Update" onclick="updateContact(${dbId})"></button>
                        <button id="cancelUpdateButton" title="Cancel Update" onclick="toggleUpdateContactFields(${dbId})"></button>
                    </div>
                </div>
            </div>
        </details>
    `
}

/** TODO: Probably remove. The logic is a little overcomplicated for the time constraint
 * Formats a string in HTML so that the first occurrence of 'substr' is bolded with \<strong\>.
 * This is case-insensitive.
 * @param {string} str The whole string to be bolded
 * @param {string} substr The first occurrence of the substring in 'str' to bold
 * @param {boolean} isPhoneNumber Set to true if 'str' and 'substr' are part of a phone number
 * @returns 'str' with the first occurrence of 'substr' wrapped in the \<strong\> element
 */
// function partialHTMLBold(str, substr, isPhoneNumber=false) {
//     let tempstr = str.trim().toLowerCase();
//     let tempsubstr = substrtrim().toLowerCase();

//     if(isPhoneNumber){
//         let phone = stripPhoneNumber(tempstr);
//         let phoneSubstr = stripPhoneNumber(tempsubstr);
//         const start = phone.indexOf(phoneSubstr);
//         const end = phoneSubstr.length + start;
//         const width = phone.length - end;

//         if(start == -1 || !phoneSubstr)
//             return phone;
//         else{
//             let areaCode;
//             let exchange;
//             let subscriber;
//             if(start <= 2 && end >= 3){
//                 areaCode = `${phone.slice(0, start)}<strong>${phone.slice(start, 3)}</strong>${phone.slice(end, 3)}`;
//             }
//             if()
                
//         }
//     }

//     const start = tempstr.indexOf(tempsubstr);
//     if(start == -1 || !substr){
//         return str;
//     }
//     else{
//         const end = substr.length + start;

//         const bolded = `<strong>${str.slice(start, end)}</strong>`;
//         return `${str.slice(0,start)}${bolded}${str.slice(end)}`;
//     }
// }

/**
 * Returns a 10-digit phone number in the format XXX-XXX-XXXX
 * @param {string} phone 
 */
function formatPhoneNumber(phone)
{
    phone = phone.replace(/\D/g, "");

    if(phone.length < 10)
        return '(xxx) xxx-xxxx'

    let areaCode = phone.slice(0,3);
    let exchange = phone.slice(3,6);
    let subscriber = phone.slice(6, 10);
    return `(${areaCode}) ${exchange}-${subscriber}`; 
}

function stripPhoneNumber(phone, partial=false){
    phone = phone.replace(/\D/g, "");

    if(partial && phone.length <= 10)
        return phone;
    else if(phone.length < 10)
        return 'XXXXXXXXXX';


    return phone;
}

function validEmail(email) {
    const regex = /^[a-zA-Z0-9.]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return regex.test(email);
}

function validPhone(phone) {
    const regex = /^(\d{10}|\d{3}[- ]\d{3}[- ]\d{4}|\(\d{3}\)[- ]?\d{3}[- ]?\d{4})$/;
    return regex.test(phone);
}
function validPartialPhone(phone) {
    const regex = /^(?:\(\d{1,3}(?!.)|(?:\(\d{3}\)|\d{1,3}\)?))(?:\s*-?\s*\d{0,3})(?:\s*-?\s*\d{0,4})$/;
    return regex.test(phone);
}

