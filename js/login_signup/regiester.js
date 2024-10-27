let users = [];
let userEmailNotfound = true;

let userName = document.getElementById("userName");
let email = document.getElementById("email");
let password = document.getElementById("firstPassword");
let confirmPassword = document.getElementById("confirmPassword");
let registerBtn = document.getElementById("registerBtn");
let policyImage = document.getElementById("privacyPolicyImage");


/**
 * Initializes the register
 */
async function registerInit() {
    loadUsers();
}


/**
//  * Control the register and load User
//  *
//  * @param {string} ok - string from the function in the registry
//  */
// async function loadUsers(ok) {
//     try {
//         users = JSON.parse(await getItem("users"));
//         if (ok === "successfully") {
//             openRegistrationModal();
//         }
//     } catch (e) {
//         console.error("Loading error:", e);
//     }
// }


/**
 * Registers the user, checking if the password matches the confirm password.
 *
 */
async function register() {
    let failConfirmPassword = document.getElementById("fail-registration");
    if (password.value === confirmPassword.value) {
        registerBtn.disabled = true;
        // for (let user of users) {
        //     if (user.email === email.value) {
        //         userEmailNotfound = false;
        //     }
        // }
        proceedRegister(users);
    } else {
        failConfirmPassword.innerHTML = "Ups! Your password don’t match"
        failConfirmPassword.style.color = "#FF8190";
    }
}


/**
 *  Checks if the user's email is not found. If true, performs user registration steps; otherwise, sets the error message text color.
 * 
 * @param {Array} users - The Array of user data
 */
async function proceedRegister(){

    const user = {
        username: userName.value,
        email: email.value,
        password: password.value,
        repeated_password: confirmPassword.value,
        color: randomColor()
    };
    const userForRegistration = { ...user, username: user.username.replace(/\s+/g, '') };

    try {
        debugger
        await registerUser(userForRegistration);    
        await loadContacts();
        await addUserToContacts(user);
        openRegistrationModal();
        resetForm();
    } catch (error) {
        document.getElementById("fail-registration").innerHTML = Object.values(error)[0]
        document.getElementById("fail-registration").style.color = "#FF8190";
    }
}


/**
 * Make an Array with name, email and password
 * 
 * @returns - return an Array with register Datas
 */
function generateArrayUsers() {
    return users.push({
        name: userName.value,
        email: email.value,
        password: password.value,
    });
}


/**
 * Deletet the value of the inputfields
 *
 */
function resetForm() {
    userName.value = "";
    email.value = "";
    password.value = "";
    confirmPassword.value = "";
    registerBtn.disabled = false;
    policyImage.src = "assets/img/Desktop/login_signup/checkbox/empty.svg";
}


/**
 * HandleImageFocus of the two Inputfields
 *
 * @param {HTMLElement} passwordField - This is the ID for the respective passwordfield
 * @param {String} imageId - This is the ID for the Image
 */
function handleImageFocus(passwordField, imageId) {
    let passwordImage = document.getElementById(imageId);
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
handleImageFocus(password, "imagePassword");
handleImageFocus(confirmPassword, "imageConfirmPassword");


/**
 * Images of visibility - transfer with onclick
 *
 * @param {string} Which - the first letter is capitalized
 * @param {string} which - normaly string
 */
function visibilityOnOffImage(Which, which) {
    let passwordImage = document.getElementById(`image${Which}Password`);
    let password = document.getElementById(`${which}Password`);

    if (password.type === "password") {
        passwordImage.src = "./assets/img/Desktop/login_signup/visibility_on.svg";
        password.type = "text";
    } else {
        password.type = "password";
        passwordImage.src = "./assets/img/Desktop/login_signup/visibility_off.svg";
    }
}


/**
 * Checked the Passwords
 *
 */
function checkConfirmPassword() {
    let firstPassword = password.value.trim();
    let secondPassword = confirmPassword.value.trim();
    let failConfirmPassword = document.getElementById("fail-registration");

    if (!firstPassword.startsWith(secondPassword)) {
        failConfirmPassword.innerHTML = "Ups! Your password don’t match"
        failConfirmPassword.style.color = "#FF8190";
    } else {
        failConfirmPassword.style.color = "transparent";
    }
}


/**
 * Checked confirm Privacy Policy and enabled Button
 *
 */
function confirmPrivacyPolicy() {
    let emptyImagePath = "assets/img/Desktop/login_signup/checkbox/empty.svg";

    if (policyImage.src.endsWith(emptyImagePath)) {
        policyImage.src = "assets/img/Desktop/login_signup/checkbox/checked.svg";
        registerBtn.disabled = false;
    } else {
        policyImage.src = emptyImagePath;
        registerBtn.disabled = true;
    }
}


/**
 * Successfully Registration
 *
 */
function openRegistrationModal() {
    let modal = document.getElementById("registrationModal");
    modal.style.display = "block";

    setTimeout(function () {
        window.location.href = "index.html";
    }, 2000);
}


/**
 * legal-notice and privacy policy for everyone (without Login)
 * 
 */
async function withoutSidebarLinks(){
    currentUser = ['#everyone'];
    await setItem("currentUser", JSON.stringify(currentUser));
}


async function registerUser(user) {
    console.log(user)
    const url = 'http://127.0.0.1:8000/auth/register/';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw errorData
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
}
