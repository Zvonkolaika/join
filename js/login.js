/* user array */
let users = [
    {
        name: 'hubertus',
        email: 'test123@test.de',
        password: 'test123'
    },
];

/* load user data */
document.addEventListener('DOMContentLoaded', async function () {
    await convertData();
    if (lookIfMSGParameterIsInLink() === true) {
        displayRegisterSuccessMSG();
    } else {
        loadRememberedLoginData();
    }
});

async function convertData() {
    users = await getItem('users');
    parsedData = JSON.parse(users.data.value);
    users = parsedData;
}

/* After registration */
const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('msg');

function lookIfMSGParameterIsInLink() {
    if (message === 'You have registered successfully') {
        return true;
    }
}

function displayRegisterSuccessMSG() {
    document.querySelector('.registerWasASuccess').classList.remove('d-none')
    document.querySelector('.registerWasASuccess').innerHTML += `${message}`;
}

/* login as existing user */
function logIn() {
    let email = document.getElementById('login-email').value;
    let password = document.getElementById('login-password').value;

    let foundUser = users.find(user => {
        return user.email === email && user.password === password;
    });

    if (foundUser) {
        rememberMe();
        // code zum weiterleiten in die app
        console.log('Successfully logged in')
    } else {
        logInWarning();
    }
}

function logInWarning() {
    document.querySelector('#warning').classList.remove('d-none');
    document.querySelector('.forgot-password').classList.remove('d-none');
    document.querySelector('#warning').innerHTML = `Incorrect email address or incorrect password`;
}

/* remember me */
let rememberedUser = [];

function rememberMe() {
    let checkbox = document.getElementById('remember');
    if (checkbox.checked) {
        rememberedUser.push({
            email: `${document.getElementById('login-email').value}`,
            password: `${document.getElementById('login-password').value}`
        });
        localStorage.setItem('rememberMe', JSON.stringify(rememberedUser));
    } else {
        localStorage.removeItem('rememberMe');
    }
}

function loadRememberedLoginData() {
    if (localStorage.getItem('rememberMe')) {
        document.getElementById('remember').checked = true;
        let emailInput = document.getElementById('login-email');
        let passwordInput = document.getElementById('login-password');


        rememberedUser = JSON.parse(localStorage.getItem('rememberMe'));
        emailInput.value = rememberedUser[0].email;
        passwordInput.value = rememberedUser[0].password;
    }
}

/* register new user */
async function registerNewUser() {
    let password = document.getElementById('register_password-input');
    let confirm = document.getElementById('register_confirm-input');
    let name = document.getElementById('register_name-input');
    let email = document.getElementById('register_email-input');

    if (await lookIfUsersAllreadyExists(email.value) === true) {
        document.querySelector('#register_warning').innerHTML = `A user with this email allready exists`;
    } else {
        if (password.value === confirm.value) {
            let newUser = generateNewUserArray(name.value, email.value, password.value);
            users.push(newUser);
            await setItem('users', users);
            window.location.href = 'login.html?msg=You have registered successfully';
        } else {
            document.querySelector('#register_warning').innerHTML = `Ups! Your password don't match, try again`;
        }
    }
}

function generateNewUserArray(name, email, password) {
    return {
        name: `${name}`,
        email: `${email}`,
        password: `${password}`
    }
}

async function lookIfUsersAllreadyExists(email) {
    await convertData();
    let foundUser = users.find(user => user.email.toLowerCase() === `${email}`.toLowerCase());
    if (foundUser) {
        return true;
    } else {
        return false;
    }
}

/* handle signIn signUp display */
let signInDisplay = document.getElementById('login-card_frame');
let signUpDisplay = document.getElementById('sign-up-card_frame');
let paragraph = document.getElementById('switch-signIn-signUp_paragraph');
let button = document.getElementById('handle-signIn-signUp_button');

function handleSignInSignUp() {
    if (!signInDisplay.classList.contains('d-none')) {
        switchToSignUp();
    } else {
        window.location.href = 'login.html'
    }
}

function switchToSignUp() {
    signInDisplay.classList.add('d-none');
    signUpDisplay.classList.remove('d-none');
    paragraph.innerHTML = `Allready have an Account?`;
    button.innerHTML = `Log in`;
}

function handleSignUpButton() {
    let button = document.getElementById('signUp-button');
    if (button.classList.contains('d-none')) {
        button.classList.remove('d-none');
    } else {
        button.classList.add('d-none');
    }
}

/* eventlistener for animation */
let animationsHelper = document.getElementById('animations-helper');

animationsHelper.addEventListener('animationend', () => {
    animationsHelper.classList.add('d-none');
});

/* password login visibility */
let pwImgs = document.querySelectorAll('.pw-img');
let visibleImgs = document.querySelectorAll('.visible-img');
let pwInputs = document.querySelectorAll('.password-input');

// while focus
pwInputs.forEach(input => {
    input.addEventListener('focus', () => {
        pwImgs.forEach(img => {
            img.classList.add('d-none');
        });
        visibleImgs.forEach(img => {
            img.classList.remove('d-none');
        });
    });
});

// if you leave focus
pwInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value === ``) {
            pwImgs.forEach(img => {
                img.classList.remove('d-none');
            });
            visibleImgs.forEach(img => {
                img.classList.add('d-none');
            });
        }
    });
});

function handleVisibility() {
    const isVisible = Array.from(visibleImgs).some(img => img.classList.contains('visibility-off'));

    if (isVisible) {
        visibleImgs.forEach(img => {
            img.classList.remove('visibility-off');
            img.src = './assets/img/icons/visibility.svg';
            togglePasswordVisibility();
        });
    } else {
        visibleImgs.forEach(img => {
            img.classList.add('visibility-off');
            img.src = './assets/img/icons/visibility_off.svg';
            togglePasswordVisibility();
        });
    }
}

// password visibility
let passwordInputs = document.querySelectorAll('input[type="password"]');


function togglePasswordVisibility() {
    passwordInputs.forEach(input => {
        if (input.type === 'password') {
            input.type = 'text';
        } else {
            input.type = 'password';
        }
    });
}
