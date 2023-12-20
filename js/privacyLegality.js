document.addEventListener('DOMContentLoaded', async () => {
    await init();
    lookIfLoginParameterIsInLink();
});



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

function hideLinks() {
    document.getElementById('main-nav-links').classList.add('d-none');
}

function cameFromLogin(p) {
    window.location.href = `${p}.html?login=login`;
}

function removeHrefFromLinks() {
    document.getElementById('privacy-link').setAttribute('href', '#');
    document.getElementById('legality-link').setAttribute('href', '#');
}