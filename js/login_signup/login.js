let ArrayToSave = [];
let registerUsers = [];
let currentUser = [];
let registerUser = false;
let saveRememberMe = "false";
let guest = {
    name: "Guest",
    email: "guest@gmail.com",
    password: "mypassword123",
};
let loginBtn = document.getElementById("btn-login");
let guestBtn = document.getElementById("btn-guest");
let loginEmail = document.getElementById("loginEmail");
let passwordLogin = document.getElementById("loginPassword");


/**
 * add Fokus/ blur Fokus - Passwordfield change Image
 *
 */
function handleImageFocus() {
    let passwordImage = document.getElementById("passwordImage");
    let passwordField = passwordLogin;
    passwordField.addEventListener("click", function () {
        if (passwordField.value === "") {
            passwordImage.src = "./assets/img/Desktop/login_signup/visibility_off.svg";
        }
    });
    passwordField.addEventListener("blur", function () {
        if (passwordField.value === "") {
            passwordImage.src = "./assets/img/Desktop/login_signup/lock.svg";
        }
    });
}
handleImageFocus();


/**
 * Images of visibility and password as text
 *
 */
function visibilityOnOffImage() {
    let passwordImage = document.getElementById(`passwordImage`);
    let password = document.getElementById(`loginPassword`);

    if (password.type === "password") {
        passwordImage.src = "./assets/img/Desktop/login_signup/visibility_on.svg";
        password.type = "text";
    } else {
        password.type = "password";
        passwordImage.src = "./assets/img/Desktop/login_signup/visibility_off.svg";
    }
}


/**
 * Handles user login, validates input, and manages login flow.
 * Checks if input fields are filled, attempts login, and saves user data
 * if "Remember Me" is selected.
 * @returns {Promise<void>} - Executes login flow or shows error message on failure.
 */
async function login() {
    if (loginEmail.value === "" || passwordLogin.value === "") {
        showTextFailLogin();
    } else {
        try {
            await loginUser();
            if (saveRememberMe === "true") {
                RememberMeSaveToLocalStorage();
            }
            
            emailAndPasswordIsValid();
            abledDisabledBtn(true);    
            registerUser = false;
        } catch (error) {
            showTextFailLogin();
        }
    }
}


/**
 * Logs in a user by sending credentials to the backend.
 * @returns {Promise<void>} - Saves user data on success or throws an error on failure.
 */
async function loginUser() {
    const url = 'http://127.0.0.1:8000/auth/login/';

    const userData = {
        email: loginEmail.value,
        password: passwordLogin.value
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw errorData
        }

        const data = await response.json()
        saveUser(data)

    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}


/**
 * Saves the user auth object in the local storage
 * @param {Object} data 
 */
function saveUser(data) {
    localStorage.setItem('id', data.id);
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('email', data.email);
}


/**
 * Button Login und Guestlogin abled/ disabled
 *
 * @param {Boolean} boolean - boolean true or false
 */
function abledDisabledBtn(boolean) {
    loginBtn.disabled = boolean;
    guestBtn.disabled = boolean;
}
abledDisabledBtn(false);


/**
 * is the User in the Array of RegisterUser; save currentUser in Backend
 *
 * @param {string} email - string from the inputfield email
 * @param {string} password - sting from the inputfield password
 */
async function isUserOfRegisertUser(email, password) {
    abledDisabledBtn(true);
    for (let user of registerUsers) {
        if (user.email !== email || user.password !== password) 
        continue;
            registerUser = true;
            currentUser = user;
            await setItem("currentUser", JSON.stringify(currentUser));
            if (saveRememberMe === "true") {
                RememberMeSaveToLocalStorage();
            }
            emailAndPasswordIsValid();     
    }
}


/**
 * Forward to the next Page, if the email and password are valid
 *
 */
async function emailAndPasswordIsValid() {
    loginEmail.value = "";
    passwordLogin.value = "";
    localStorage.setItem('anonymous', false);
    await loadAnonymous();
    document.getElementById("rememberMeEmptyImageBox").src =
        "assets/img/Desktop/login_signup/checkbox/empty.svg";
    window.location.href = "summary.html";
}


/**
 * Gets the anonymous value from local storage
 */
function loadAnonymous() {
    anonymous = localStorage.getItem('anonymous');
}


/**
 * Shows the fail login message
 */
function showTextFailLogin() {
    document.getElementById("fail-login").style.color = "#FF8190";
}


/**
 * Hides the fail login message
 */
function changeShowTextFailLogin() {
    document.getElementById("fail-login").style.color = "transparent";
}


/**
 * Imagebox Remember me
 *
 */
function addRememberMe() {
    let emptyImagebox = "assets/img/Desktop/login_signup/checkbox/empty.svg";
    let currentImagebox = document.getElementById("rememberMeEmptyImageBox");
    if (currentImagebox.src.endsWith(emptyImagebox)) {
        currentImagebox.src = "assets/img/Desktop/login_signup/checkbox/checked.svg";
        saveRememberMe = "true";
    } else {
        currentImagebox.src = emptyImagebox;
        saveRememberMe = "false";
        deleteJoinInputs();
    }
}


/**
 * Remember me - save in LocalStorage for the next Login
 *
 */
function RememberMeSaveToLocalStorage() {
    let email = loginEmail.value;
    let password = passwordLogin.value;

    ArrayToSave = {
        email: email,
        password: password,
        save: saveRememberMe,
    };

    let ArrayAsText = JSON.stringify(ArrayToSave);
    localStorage.setItem("joinInputs", ArrayAsText);
}


/**
 * Load from LocalStorage
 *
 */
function loadStorage() {
    let ArrayAsText = localStorage.getItem("joinInputs");
    if (ArrayAsText === null) {
        return
    } else {
        ArrayToSave = JSON.parse(ArrayAsText);
        loadFillInput();
    }
}


/**
 * Delete from LocalStorage
 *
 */
function deleteJoinInputs() {
    localStorage.removeItem("joinInputs");
}


/**
 * Automaic fillout from LocalStorage
 *
 */
function loadFillInput() {
    loginEmail.value = ArrayToSave["email"];
    passwordLogin.value = ArrayToSave["password"];
    document.getElementById("rememberMeEmptyImageBox").src =
        "assets/img/Desktop/login_signup/checkbox/checked.svg";
}


/**
 * Login Guest
 *
 */
async function guestAccount() {
    loginEmail.value = guest["email"];
    passwordLogin.value = guest["password"];
    currentUser = guest;
    await login();

    setTimeout(function () {
        loginEmail.value = "";
        passwordLogin.value = "";
        window.location.href = "summary.html";
    }, 300);
}


/**
 * legal-notice and privacy policy for everyone (without Login)
 * 
 */
async function withoutSidebarLinks(){
    localStorage.setItem('anonymous', true);
}