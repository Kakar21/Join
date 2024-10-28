let users = [];
let userEmailNotfound = true;
let userName = document.getElementById("userName");
let email = document.getElementById("email");
let password = document.getElementById("firstPassword");
let confirmPassword = document.getElementById("confirmPassword");
let registerBtn = document.getElementById("registerBtn");
let policyImage = document.getElementById("privacyPolicyImage");
let emptyPolicyImagePath = "assets/img/Desktop/login_signup/checkbox/empty.svg";
let errorMessage = document.getElementById("fail-registration");
let token = '';


/**
 * Registers the user, checking if the password matches the confirm password.
 *
 */
async function register() {
    if (password.value === confirmPassword.value) {
        proceedRegister(users);
    } else {
        errorMessage.innerHTML = "Ups! Your passwords don’t match.";
        errorMessage.style.color = "#FF8190";
    }
}


/**
 * Checks the form for validity and empty inputs then activates/disables the submit button
 */
function checkFormCompletion() {
    const form = document.getElementById('registerForm');
    if (checkPrivacyPolicy() && form.checkValidity()) {
        registerBtn.disabled = false;
    } else {
        registerBtn.disabled = true;
    }
}
document.querySelectorAll('#registerForm input').forEach(element => {
    element.addEventListener('input', checkFormCompletion);
});


/**
 *  Checks if the user's email is not found. If true, performs user registration steps; otherwise, sets the error message text color.
 * 
 * @param {Array} users - The Array of user data
 */
async function proceedRegister() {

    const user = {
        username: userName.value,
        email: email.value,
        password: password.value,
        repeated_password: confirmPassword.value,
        color: randomColor()
    };
    const userForRegistration = { ...user, username: user.username.replace(/\s+/g, '') };

    try {
        const registeredUser = await registerUser(userForRegistration);
        token = registeredUser.token;
        await loadContacts();
        await addUserToContacts(user);
        openRegistrationModal();
        resetForm();
    } catch (error) {
        registrationError(error);
    }
}


/**
 * Show the error message in the registration interface
 * @param {error} error 
 */
function registrationError(error) {
    errorMessage.innerHTML = Object.values(error)[0];
    errorMessage.style.color = "#FF8190";
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
    policyImage.src = "assets/img/Desktop/login_signup/checkbox/empty.svg";
    errorMessage.innerHTML = "";
    checkFormCompletion();
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

    if (!firstPassword.startsWith(secondPassword) || !secondPassword.startsWith(firstPassword)) {
        errorMessage.innerHTML = "Ups! Your passwords don’t match.";
        errorMessage.style.color = "#FF8190";
    } else {
        errorMessage.style.color = "transparent";
    }
}


/**
 * Checked confirm Privacy Policy and enabled Button
 *
 */
function confirmPrivacyPolicy() {
    if (policyImage.src.endsWith(emptyPolicyImagePath)) {
        policyImage.src = "assets/img/Desktop/login_signup/checkbox/checked.svg";
    } else {
        policyImage.src = emptyPolicyImagePath;
    }
    checkFormCompletion();
}

/**
 * Checks if privacy policy is ticked 
 * @returns - boolean
 */
function checkPrivacyPolicy() {
    if (policyImage.src.endsWith(emptyPolicyImagePath)) {
        return false;
    } else {
        return true;
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
async function withoutSidebarLinks() {
    localStorage.setItem('anonymous', true);
}


/**
 * Registers a new user by sending user data to the backend.
 * @param {Object} user - User data to be registered.
 * @returns {Promise<Object>} - Registration response data or throws error on failure.
 */
async function registerUser(user) {
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
            throw errorData;
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error during registration:', error);
        throw error;
    }
}
