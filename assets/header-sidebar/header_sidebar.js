let nameOfPage = [
    "Summary",
    "Add-task",
    "Board",
    "Contacts",
    "help",
    "privacy-policy",
    "legal-notice",
];
let filterExcludePages = ["help", "privacy-policy", "legal-notice"];
let currentUser = {};
let anonymous = "false";
let dropDownIsOpen = false;


/**
 * automatic onload in HTML-Code
 * 
 */
async function init() {
    await loadCurrentUser();
    await loadAnonymous();
    await includeHTML();
    await getInitialsCurrentUser();
    await whichPageIsCurrent();
}


/**
 * load Template Header and Sidebar in some pages
 *
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll("[w3-include-html]");
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header_sidebar.html"

        await loadTemplateAndExecuteFunctions(file, element);
    }
}


/**
 * Asynchronously loads a template file and executes functions based on the fetched content.
 * 
 * @param {string} file - The URL of the template file.
 * @param {HTMLElement} element - The HTML element where the template content will be inserted.
 */
async function loadTemplateAndExecuteFunctions(file, element) {
    let resp = await fetch(file);
    if (resp.ok) {
        let templateHTML = await resp.text();
        element.innerHTML = templateHTML;

        if (!currentUser["token"] && (anonymous == "false")) {
            element.style = 'display:none';
            location.href = "index.html";
        }
        if (anonymous == "true") {
            partDisplayNone("sidebarMainButtons");
            backButtonClose();
        }
    } else {
        element.innerHTML = "Page not found";
    }
}


/**
 * Sets the back button to close the window
 */
function backButtonClose() {
    document.getElementById('back-button').href = 'javascript:window.close()';
}


/**
 * load CurrentUser from the Backend
 *
 */
async function loadCurrentUser() {
    try {
        currentUser = {
            "id": localStorage.getItem('id'),
            "token": localStorage.getItem('token'),
            "username": localStorage.getItem('username'),
            "email": localStorage.getItem('email'),
        }
    } catch (e) {
        return
    }
}


/**
 * Load the anonymous value from local storage
 */
function loadAnonymous() {
    anonymous = localStorage.getItem('anonymous');
}


/**
 * Find the currentpage with Url and Names of Content
 *
 */
async function whichPageIsCurrent() {
    let url = window.location.pathname;
    for (let i = 0; i < nameOfPage.length; i++) {
        const element = nameOfPage[i];
        let smalLetter = element.toLowerCase();
        if (url.includes(smalLetter)) {
            nameOfPages(smalLetter, element);
        }
    }
}


/**
 * requiroments from the name of pages
 * 
 * @param {string} smalLetter - the name from the page
 * @param {string} element - a Page from the Array nameOfPage
 */
function nameOfPages(smalLetter, element) {
    if (smalLetter === "help") {
        partDisplayNone("helpImageDefault");
    }
    if (smalLetter === "privacy-policy" || smalLetter === "legal-notice") {
        markEffects(smalLetter);
    }
    if (!filterExcludePages.includes(smalLetter)) {
        currentLinkUsed(element);
    }
}


/**
 * Add and Remove Attributes (Hovereffects) and parts hide
 *
 * @param {string} x - the string is the name of the page includes in the URL; the first letter is capitalized
 */
function currentLinkUsed(x) {
    let link = document.getElementById(`link${x}`);
    link.classList.remove("hover-menu-btn");
    link.classList.add("current-color-hover");
    document.getElementById(`text${x}`).style = "color: #FFF";
    let image = document.getElementById(`image${x}`);
    y = x.toLowerCase();
    image.src = `./assets/img/Desktop/general_elements/menu_symbols/${y}_light.svg`;
}


/**
 * This function hide same parts of the header and sidebar
 *
 * @param {string} x the string are the names of ID´s from the parts
 */
function partDisplayNone(x) {
    let xElement = document.getElementById(x);
    let dNone = 'display: none;';
    xElement.style = dNone;
    if ((window.matchMedia("(max-width: 1000px)").matches)) {
        xElement.parentNode.style = dNone;
        document.getElementById('content').style.margin = '4.9385rem 0 0 0';
    };
}


/**
 * This function designed same parts of the header and sidebar
 *
 * @param {string} x - the string are the names of the ID`s, who will designed
 */
function markEffects(x) {
    document.getElementById(`${x}`).classList.remove(`${x}-link`);
    document.getElementById(`${x}`).classList.add("current-color-hover");
}


/**
 * get the first letter of the names from Users
 *
 */
async function getInitialsCurrentUser() {
    let textArea = document.getElementById("headerIconText");
    let userName = currentUser["username"];
    if ((anonymous == "false") && !(currentUser.length === 0)) {
        let firstLastName = userName.split(" ");
        let firstLetter = firstLastName[0].charAt(0).toLocaleUpperCase();
        if (firstLastName[1]) {
            let secondLetter = firstLastName[1].charAt(0).toLocaleUpperCase();
            textArea.innerHTML = firstLetter + secondLetter;
        } else {
            textArea.innerHTML = firstLetter;
        }
    }
}


/**
 * open and close the dropdownmenu
 *
 */
function moveDropDownMenu() {
    let dropDownMenu = document.getElementById("dropDownMenu");
    let headerIcon = document.getElementById("headerIcon");
    let container = document.getElementById("containerDropDown");
    if (dropDownIsOpen === false) {
        dropDownMenu.style.display = "block";
        headerIcon.style.background = "#0C2E621F";
        container.style.display = "block";
        openDropDownAni();
        setTimeout(() => {            
            dropDownIsOpen = true;
        }, 50);
    } else {
        closeDropDownAni();
    }
}


/**
 * Starts open animation of the drop down menu IF its on mobile version
 * 
 */
function openDropDownAni() {
    if (window.matchMedia("(max-width: 1000px)").matches) {
        document.getElementById("dropDownMenu").style.animation = 'slideInDropdown 100ms ease-out';
    }
}


/**
 * Starts close animation of the drop down menu IF its on mobile version ELSE it just closes the menu
 * 
 */
function closeDropDownAni() {
    let dropDownMenu = document.getElementById("dropDownMenu");
    let headerIcon = document.getElementById("headerIcon");
    let container = document.getElementById("containerDropDown");
    if (window.matchMedia("(max-width: 1000px)").matches) {
        dropDownMenu.style.animation = 'slideOutDropdown 100ms ease-out';
        setTimeout(function () {
            setStyles(dropDownMenu, headerIcon, container);
        }, 100);
    } else {
        setStyles(dropDownMenu, headerIcon, container);
    }
}


/**
 * Sets styles for elements to close a dropdown animation.
 * 
 * @param {HTMLElement} dropDownMenu - The dropdown menu element.
 * @param {HTMLElement} headerIcon - The header icon element.
 * @param {HTMLElement} container - The container element.
 * @param {boolean} dropDownIsOpen - A boolean indicating whether the dropdown is open.
 */
function setStyles(dropDownMenu, headerIcon, container){
    dropDownMenu.style.display = "none";
    headerIcon.style.background = "#FFF";
    container.style.display = "none";
    dropDownIsOpen = false;
}


/**
 * add clickfunction about all the page
 *
 * @param {Event-Object} event - clickevent about the page, without dropdownmenu
 */
function stopPropagation(event) {
    event.stopPropagation();
}


/**
 * User logout and earse datas
 *
 */
async function logOut() {
    currentUser = [];
    localStorage.removeItem("greetingAniPlayed");
    removeCurrentUser()
    localStorage.removeItem("joinInputs");
}


/**
 * Deletes the user authentication from the local storage
 */
function removeCurrentUser() {
    localStorage.removeItem('id');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
}


/**
 * Eventlistener for JoinLogo. Check whether the JoinLogo is loaded and give the mouseover function
 * 
 */
document.addEventListener("DOMContentLoaded", function () {
    let joinLogo = null;
    let joinLogoMobile = null;
    const isMobile = window.innerWidth < 1000;
    let logoId = isMobile ? "joinLogoMobile" : "joinLogo";
    let intervalId = setInterval(function () {
        joinLogo = document.getElementById(logoId);
        if (joinLogo !== null) {
            clearInterval(intervalId);
            handleLogoState(joinLogo);
            joinLogo.addEventListener("mouseover", function () {
                handleLogoState(joinLogo);
            });
        }
    }, 400);
});


/**
 * depending on the user, an onclick function is added or removed
 * 
 * @param {HTMLElement} logo 
 */
function handleLogoState(logo) {
    if (anonymous == "false") {
        logo.style.cursor = "pointer";
        logo.addEventListener("click", handleLogoClick);
    } else {
        logo.style.cursor = "unset";
        logo.removeEventListener("click", handleLogoClick);
    }
}


/**
 * forwarding to the page
 * 
 */
function handleLogoClick() {
    location.href = "summary.html";
}


/**
 * Capitalizes the first letter of a string
 * @param {string} string 
 * @returns - edited string
 */
function capFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}