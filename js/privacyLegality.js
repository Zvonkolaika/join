/* init */
document.addEventListener('DOMContentLoaded', async () => {
    await loadTemplates();
    lookIfLoginParameterIsInLink();
    renderUsersMailAddressIntoLegalNotice()
});


/* functions to display visibility from privacy & legal note links, in the sidebar, depending from wich site you came */

/**
 * looks if a queryparameter is in link and searches after the value login in it.
 * if the value of the parameter is login then the href from the lins will be removed and new are added.
 */
function lookIfLoginParameterIsInLink() {
    const urlParams = new URLSearchParams(window.location.search);
    const login = urlParams.get('login');

    if (login === 'login') {
        hideLinks();
        removeHrefFromLinks();
        document.getElementById('privacy-link').removeAttribute('onclick');
        document.getElementById('legality-link').removeAttribute('onclick');
        document.getElementById('privacy-link').setAttribute('onclick', 'cameFromLogin(`privacy`)');
        document.getElementById('legality-link').setAttribute('onclick', 'cameFromLogin(`legality`)');
    }
}

/**
 * hides the link in the navbar
 */
function hideLinks() {
    document.getElementById('main-nav-links').classList.add('d-none');
}

/**
 * 
 * @param {html file} p 
 */
function cameFromLogin(p) {
    window.location.href = `${p}.html?login=login`;
}

/**
 * sets the href attribute to # 
 */
function removeHrefFromLinks() {
    document.getElementById('privacy-link').setAttribute('href', '#');
    document.getElementById('legality-link').setAttribute('href', '#');
}


/* Render the mail address from exploring user into legal notice */

/**
 * renders the email address from current user into the "explore the board" section.  
 */
function renderUsersMailAddressIntoLegalNotice() {
    document.getElementById('users-email').innerHTML = `email: ${sessionStorage.getItem('user-mail')}`;
}