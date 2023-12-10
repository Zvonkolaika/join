/* user array */
let users = [
    {
        name: 'Hubertus',
        email: 'test123@test.de',
        password: 'test123'
    },
];


/* register */
function registerNewUser() {
    let password = document.getElementById('register_password-input');
    let confirm = document.getElementById('register_confirm-input');
    let name = document.getElementById('register_name-input');
    let email = document.getElementById('register_email-input');

    if (password.value === confirm.value && lookIfUsersAllreadyExists(email) === false) {
        let newUser = generateNewUserArray(name.value, email.value, password.value);
        users.push(newUser);
    } else {
        alert('das nicht funktionieren funktioniert');
    }
}

function generateNewUserArray(name, email, password) {
    return {
        name: `${name}`,
        email: `${email}`,
        password: `${password}`
    }
}

function lookIfUsersAllreadyExists(email) {
    const foundUser = users.find(user => user.email.toLowerCase() === `${email}`.toLowerCase());
    if (foundUser) {
        console.log('found:' + foundUser);
        return true;
    } else {
        console.log(foundUser);
        return false;
    }
}

/* handle signIn signUp */
let signInDisplay = document.getElementById('login-card_frame');
let signUpDisplay = document.getElementById('sign-up-card_frame');
let paragraph = document.getElementById('switch-signIn-signUp_paragraph');
let button = document.getElementById('handle-signIn-signUp_button');

function handleSignInSignUp() {
    if (!signInDisplay.classList.contains('d-none')) {
        switchToSignUp();
    } else {
        switchToLogIn();
        document.getElementById('accaptPolicy').checked = false;
    }
}

function switchToSignUp() {
    signInDisplay.classList.add('d-none');
    signUpDisplay.classList.remove('d-none');
    paragraph.innerHTML = `Allready have an Account?`;
    button.innerHTML = `Log in`;
}

function switchToLogIn() {
    signInDisplay.classList.remove('d-none');
    signUpDisplay.classList.add('d-none');
    paragraph.innerHTML = `Not a Join user?`;
    button.innerHTML = `Sign up`;
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

