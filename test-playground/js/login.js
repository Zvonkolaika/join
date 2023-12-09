let display = document.getElementById('sign-in-up_card');
let frame = document.getElementById('sign-in-up-card_frame');
let card = document.getElementById('sign-in-up_card');

function renderLogIn() {
    frame.classList.add('login-card-frame');
    frame.classList.remove('signUp-card-frame');
    card.classList.add('login-card');
    card.classList.remove('signUp-card');
    display.innerHTML = generateLogInHTML();
}

function renderSignUp() {
    frame.classList.add('signUp-card-frame');
    frame.classList.remove('login-card-frame');
    card.classList.add('signUp-card');
    card.classList.remove('login-card');
    display.innerHTML = generateSignUpHTML();
}

function handleSignUpButton() {
    let button = document.getElementById('signUp-button');
    if (button.classList.contains('d-none')) {
        button.classList.remove('d-none');
    } else {
        button.classList.add('d-none');
    }
}

/* generate HTML */
function generateLogInHTML() {
    return `
    <!-- headline -->
    <div class="headline-frame dp-flex flex-column">
        <h1 style="text-align: center;">Log in</h1>
        <div class="headline-underline"></div>
    </div>
    

    <!-- login inputs -->
    <form style="gap: 32px;" class="dp-flex flex-column" action="#">
        <div style="width: 422px;" class="input-container">
            <input required class="input-field" type="email" placeholder="Email" />
            <img src="../assets/img/icons/mail.svg" alt="mail" />
        </div>
        <div style="width: 422px;" class="input-container">
            <input required type="password" class="input-field" type="email" placeholder="Password" />
            <img src="../assets/img/icons/lock.svg" alt="mail" />
        </div>
        <div class="rememberMe dp-flex">
            <input type="checkbox" id="remember" name="remember" value="remember-login">
            <label for="remember">remember me</label><br>
        </div>
        <div class="login-button_frame dp-flex">
            <button class="button">Log in</button>
            <button class="button-secondary">Guest Log in</button>
        </div>
    </form>
    `;
}

function generateSignUpHTML() {
    return `
    <div style="gap: 32px;" class="dp-flex flex-column">
        <!-- headline -->
        <div class="headline-frame dp-flex flex-column">
            <h1 style="text-align: center; margin: 0; margin-bottom: 16px;">Sign up</h1>
            <div class="headline-underline"></div>
        </div>

        <!-- form -->
        <form class="dp-flex flex-column" action="#">
            <div style="gap: 24px;" class="input-frame dp-flex flex-column">
                <!-- name -->
                <div style="width: 422px;" class="input-container">
                    <input required class="input-field" type="text" placeholder="name">
                    <img src="../assets/img/icons/mail.svg" alt="name">
                </div>
                <!-- email -->
                <div style="width: 422px;" class="input-container">
                    <input required class="input-field" type="email" placeholder="email">
                    <img src="../assets/img/icons/mail.svg" alt="mail">
                </div>
                <!-- password -->
                <div style="width: 422px;" class="input-container">
                    <input required class="input-field" type="password" placeholder="password">
                    <img src="../assets/img/icons/mail.svg" alt="password">
                </div>
                <!-- password confirm -->
                <div style="width: 422px;" class="input-container">
                    <input required class="input-field" type="password" placeholder="confirm password">
                    <img src="../assets/img/icons/mail.svg" alt="confirm password">
                </div>
            </div>

            <div class="dp-flex"><input style="margin-right: 6px;" type="checkbox" onclick="handleSignUpButton()">
                <p>I accept the <a class="link" href="#">Privacy policy</a></p>
            </div>

            <button id="signUp-button" class="button d-none" type="submit">Sign up</button>
        </form>
    </div>
    `;
}

/* eventlistener */
let animationsHelper = document.getElementById('animations-helper');

animationsHelper.addEventListener('animationend', () => {
    animationsHelper.classList.add('d-none');
});