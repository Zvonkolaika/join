//--- global variables ---//

// global variables for "password login visibility"
let imgs = document.querySelectorAll('.password-eye');
let imgsAsArray = Array.from(imgs);
let pwImgs = document.querySelectorAll('.pw-img');
let visibleImgs = document.querySelectorAll('.visible-img');
let pwInputs = document.querySelectorAll('.password-input');

// global variables for "remember me "
let rememberedUser = [];

// global variables for "register new user" 
let password = document.getElementById('register_password-input');
let confirm = document.getElementById('register_confirm-input');
let name = document.getElementById('register_name-input');
let email = document.getElementById('register_email-input');

// global variables for "After new user is registrated"
const urlParams = new URLSearchParams(window.location.search);
const message = urlParams.get('msg');


/**
 * user array 
 * 
 * This is the Array, new registred Accounts will push into this array. 
 */
let users = [
    {
        name: 'hubertus',
        email: 'test123@test.de',
        password: 'test123'
    },
];


//--- init ---//
/**
 * this function is used to initialize the data of index.html.
 * its checking the windows width. If its 670px the start animation of the logo will be switched to mobile version.
 * Its loading the data from the remote Storage and converts it into an array.
 * Then its loocking if user comes from register and if thats true a message box will appear, that user had a success in register.
 * if its not the case, the remembered data from localstorage will be load.
 * 
 */
document.addEventListener('DOMContentLoaded', async function () {
    lookIfWindowIs670pxToOptimizeMobileVersion();
    await mobileAnimationsPreparing();
    await convertData();
    if (lookIfMSGParameterIsInLink() === true) {
        displayRegisterSuccessMSG();
    } else {
        loadRememberedLoginData();
    }
});


//--- load user data ---//
/**
 * this function requests the data from remote storage and converts it to an array.
 */
async function convertData() {
    users = await getItem('users');
    parsedData = JSON.parse(users);
    users = parsedData;
}


//--- mobile logo ---//
/**
 * this function handles the insert of the mobilelogo. 
 */
async function mobileAnimationsPreparing() {
    if (window.location.href.includes('index.html')) {
        await insertMobileLogo();
        document.querySelector('.login-logo').classList.add('animate-logo');
        document.querySelector('#animations-helper').classList.add('animate-helper');
        ifMobileLogoExistsAddAnimation();
    }
}

/**
 *  inserts the mobileLogo if window-width is smaller or equal to 670px
 */
async function insertMobileLogo() {
    if (window.innerWidth <= 670) {
        document.querySelector('.content').innerHTML += generateMobileLogo();
    }
}

/**
 * adds the animation to the mobile logo if the mobile logo exists.
 */
function ifMobileLogoExistsAddAnimation() {
    if (document.getElementById('mobile-login-logo')) {
        document.getElementById('mobile-login-logo').classList.add('animate-logo')
    }
}

/**
 * generates the mobile logo and adds also the fill animation for the mobile logo
 */
function generateMobileLogo() {
    return `
    <svg id="mobile-login-logo" class="login-logo" width="101" height="122" viewBox="0 0 101 122" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
    #Vector, #Vector_2, #Vector_4, #Vector_5, #Vector_6 {
        animation: join-login-logo_animation 0.75s ease-in-out 0.23s forwards;
    }
    
    @keyframes join-login-logo_animation {
        0% {
            fill: white;
        }
        100% {
            fill: #2A3647;
        }
    }
    </style>
    <g id="Capa-2">
    <g id="Capa-1">
    <path id="Vector" d="M71.6721 0H49.5143V25.4923H71.6721V0Z" fill="white"/>
    <path id="Vector_2" d="M49.5142 46.2251H71.6721V82.1779C71.7733 90.8292 69.3112 99.3153 64.5986 106.557C59.9455 113.594 50.963 121.966 34.3446 121.966C16.2434 121.966 5.69286 113.406 0 108.715L13.9765 91.4743C19.533 96.0112 24.885 99.7435 34.4299 99.7435C41.6567 99.7435 44.5372 96.7988 46.2247 94.2307C48.5186 90.6637 49.7052 86.4923 49.6335 82.2464L49.5142 46.2251Z" fill="white"/>
    <path id="Vector_3" d="M38.2137 30.1318H16.0559V52.3884H38.2137V30.1318Z" fill="#29ABE2"/>
    <path id="Vector_4" d="M83.2793 111.522C83.2793 116.265 80.8761 118.815 77.5183 118.815C74.1605 118.815 71.9618 115.785 71.9618 111.762C71.9618 107.739 74.2287 104.554 77.7058 104.554C81.1829 104.554 83.2793 107.687 83.2793 111.522ZM74.5355 111.711C74.5355 114.57 75.6775 116.675 77.6376 116.675C79.5977 116.675 80.7056 114.45 80.7056 111.539C80.7056 108.988 79.6829 106.592 77.6376 106.592C75.5923 106.592 74.5355 108.903 74.5355 111.711Z" fill="white"/>
    <path id="Vector_5" d="M87.6768 104.76V118.593H85.2224V104.76H87.6768Z" fill="white"/>
    <path id="Vector_6" d="M90.3358 118.593V104.76H93.0629L95.9946 110.461C96.7493 111.952 97.4207 113.483 98.0058 115.049C97.8524 113.337 97.7843 111.368 97.7843 109.177V104.76H100.034V118.593H97.4945L94.5288 112.772C93.7436 111.243 93.0437 109.671 92.4323 108.064C92.4323 109.776 92.5516 111.711 92.5516 114.09V118.576L90.3358 118.593Z" fill="white"/>
    </g>
    </g>
    </svg>
    `;
}


//--- password login visibility ---//

/**
 * executes if you put the focus in an input field.
 * there are 3 images: password | eye | eye canceled
 * if you focus an pwinput then the password img will dissapear and the "eye canceled" will be added
 */
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

/** 
 * executes if you leave the focus of a pwinput
 * if the input is empty: the "eye img" will be replaced with the password img
 * */
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

//--- Password Visibility & Password eye Visibility ---//
/**
 * this function will remove or add the class visibillity-off if an img in a pwinput sontains the class visibillity-off.
 */
function handleVisibility() {
    if (imgsAsArray.some(img => img.classList.contains('visibility-off'))) {
        addVisibility();
    } else {
        removeVisibility();
    }
}

/**
 * this function will remove the class visibillity-off from an "eye" img in a pwinput and will change the source of the img.
 * after that, it toggles the passwordvsibillity
 */
function addVisibility() {
    imgsAsArray.forEach(img => {
        img.classList.remove('visibility-off');
        img.src = './assets/img/icons/visibility.svg';
    })
    togglePasswordVisibility();
}

/**
 * this function will add the class visibillity-off from an "eye" img in a pwinput and will change the source of the img.
 * after that, it toggles the passwordvsibillity
 */
function removeVisibility() {
    imgsAsArray.forEach(img => {
        img.classList.add('visibility-off');
        img.src = './assets/img/icons/visibility_off.svg';
    })
    togglePasswordVisibility();
}

/**
 * this function toggles the input type of a pwinput from password to text and from text to password when is called
 */
function togglePasswordVisibility() {
    pwInputs.forEach(input => {
        if (input.type === 'password') {
            input.type = 'text';
        } else {
            input.type = 'password';
        }
    });
}

//--- login as existing user ---//
/**
 * this function executes if you press the login button.
 * it finds a user wich email && password is the same as in the input fields text is written.
 * if a user was found, the users name and email will be saved in the session storage.
 * after a success with the login it refers to the summary.html.
 * else a loginWarning will appear.
 */
function logIn() {
    let email = document.getElementById('login-email').value;
    let password = document.getElementById('login-password').value;

    let foundUser = users.find(user => {
        return user.email === email && user.password === password;
    });

    if (foundUser) {
        rememberMe();
        sessionStorage.setItem('user', foundUser.name);
        sessionStorage.setItem('user-mail', foundUser.email)
        window.location.href = 'summary.html';
    } else {
        logInWarning();
    }
}

/**
 * this function will set the currentUser wich is saved in the session Storage, to guest.
 * it refers after user is setted to geust, to summary.html
 */
function logInAsGuest() {
    sessionStorage.setItem('user', 'guest');
    window.location.href = 'summary.html';
}

/**
 * if the function is called, the class d-none will be removed from the #warning div.
 * the forgot password? section will appear
 * the text in the #warning div, will be changed into "Incorrect email address or incorrect password".
 */
function logInWarning() {
    document.querySelector('#warning').classList.remove('d-none');
    document.querySelector('.forgot-password').classList.remove('d-none');
    document.querySelector('#warning').innerHTML = `Incorrect email address or incorrect password`;
}

/**
 * looks if the checkbox on rememberme is cklicked.
 * if true the email and the password wich is written in the login options will be pushed into an JSON wich stores the information.
 * the JSON will be added to the local storage.
 * if the checkbox is not checked, the rememberMe-entry in the localStorage will be removed.
 */
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

/**
 * looks if the rememberMe-entry in localStorage exists.
 * if true: the checkbox will be checked, the rememberMe-entry will be parsed and saved into a vartiable.
 * the emailsInput and passwordsValue will be replaced with the data from parsed localstorage-entry
 */
function loadRememberedLoginData() {
    if (window.location.href.includes('index.html') && localStorage.getItem('rememberMe')) {
        document.getElementById('remember').checked = true;
        let emailInput = document.getElementById('login-email');
        let passwordInput = document.getElementById('login-password');


        rememberedUser = JSON.parse(localStorage.getItem('rememberMe'));
        emailInput.value = rememberedUser[0].email;
        passwordInput.value = rememberedUser[0].password;
    }
}


//--- register new user ---//

/**
 * this funktion looks if the new users mail is in user array if not,
 * it looks if the password.value === the value of the confirmed passwort,
 * if this is true a new user will be created as a JSON attached to a variable,
 * this JSON variable will be pushed into the user array,
 * the user array will be uoloaded to remote storage,
 * if user is successfully created, the windows href will be refer to index.html with a queryparameter wich displays a message,
 * the message will be displayed at the refered index.html
 */
async function registerNewUser() {
    if (await lookIfUsersAllreadyExists(email.value) === true) {
        document.querySelector('#register_warning').innerHTML = `A user with this email allready exists`;
    } else {
        if (password.value === confirm.value) {
            let newUser = generateNewUserArray(name.value, email.value, password.value);
            users.push(newUser);
            await setItem('users', users);
            window.location.href = 'index.html?msg=You have registered successfully';
        } else {
            document.querySelector('#register_warning').innerHTML = `Ups! Your password don't match, try again`;
        }
    }
}

/**
 * 
 * @param {users name} name 
 * @param {users email} email 
 * @param {users password} password 
 * @returns a JSON object wich after will be pushed into user array
 */
function generateNewUserArray(name, email, password) {
    return {
        name: `${name}`,
        email: `${email}`,
        password: `${password}`
    }
}

/**
 * 
 * @param {user email} email 
 * @returns true if the searched user was find
 * this function, downloads the user array from remote storage and searches for the email if it allready exists in the user array.
 */
async function lookIfUsersAllreadyExists(email) {
    await convertData();
    let foundUser = users.find(user => user.email.toLowerCase() === `${email}`.toLowerCase());
    if (foundUser) {
        return true;
    } else {
        return false;
    }
}

// After new user is registrated

/**
 * 
 * @returns true if the index.html link includes 'You have registered successfully'
 */
function lookIfMSGParameterIsInLink() {
    if (message === 'You have registered successfully') {
        return true;
    }
}

/**
 * removes the d-none class from the index.html registermessage div to display the register message wich is given through the queryparameter in the link
 */
function displayRegisterSuccessMSG() {
    document.querySelector('.registerWasASuccess').classList.remove('d-none')
    document.querySelector('.registerWasASuccess').innerHTML += `${message}`;
}


/*-- handle signIn signUp display --*/

/**
 * 
 * @param {1 or 2} p
 * refers to the chosen site. if you call the funktion with 1 then index.html will be the refer,
 * if you call the function with 2 the refer will be register.html 
 */
function goToSite(p) {
    if (p == 1) {
        window.location.href = 'index.html';
    } else {
        if (p == 2) {
            window.location.href = 'register.html';
        }
    }
}

/**
 * handles the visibillity of the signup button
 */
function handleSignUpButton() {
    let button = document.getElementById('signUp-button');
    if (button.classList.contains('d-none')) {
        button.classList.remove('d-none');
    } else {
        button.classList.add('d-none');
    }
}

/**
 * looks if the window is 670px, if true the class d-none will be added to the switch-to-sign-up_frame, 
 * otherwise the class will be removed.
 */
function lookIfWindowIs670pxToOptimizeMobileVersion() {
    if (window.innerWidth <= 670 && document.querySelector('.switch-to-sign-up_frame').hasAttribute("signupframe")) {
        document.querySelector('.switch-to-sign-up_frame').classList.add('d-none');
    } else {
        document.querySelector('.switch-to-sign-up_frame').classList.remove('d-none');
    }
}


/*-- if privacy and legal note is open from login --*/

/**
 * 
 * @param {html file wich you want to refer} p 
 * this function is used to refer to privacy or legal note site and it gives a queryparameter that the refered file can
 *  read if you came from the lgoin page or if you came from another page.
 */
function cameFromLogin(p) {
    window.location.href = `${p}.html?login=login`;
}
