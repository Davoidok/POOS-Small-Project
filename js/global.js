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
        <details class="contact pirate-scrawl" data-id=${dbId}>
            <summary class="contactHeader">
                <h3 id="firstLastName">
                    <span id="contactFirstName">${firstName}</span> 
                    <span id="contactLastName">${lastName}</span>
                </h3>
                <h5 id="searchMatches">
                    ${contactInfoMatch}
                </h5>
            </summary>
            <div class="contactDropdown">
                <div class="contactInfo">
                    <span id="contactPhoneNumber">${formatPhoneNumber(phone)}</span>
                    <span id="contactEmail">${email}</span>
                </div>
                <div class="contactActions">
                    <button id="updateContactButton" onclick="toggleUpdateContactFields(${dbId})">Update</button>
                    <button id="deleteContactButton" onclick="doDeleteContact(${dbId})">Delete</button>
                </div>
            </div>
            <span class="updateContactBlock"></span>
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

function stripPhoneNumber(phone){
    phone = phone.replace(/\D/g, "");

    if(phone.length < 10)
        return 'XXXXXXXXXX';

    return phone;
}

function validEmail(email) {
    const regex = /^[a-zA-Z0-9.]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return regex.test(email);
}

function validPhone(phone) {
    const regex = /^(\d{10}|\d{3}-\d{3}-\d{4}|\(\d{3}\)-\d{3}-\d{4}|\(\d{3}\) \d{3}-\d{4})$/;
    return regex.test(phone);
}

