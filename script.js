let currentUrl;
let currentPageName;
let pageToDeactivate;
let currentUser = "Guest"; /* placeholder until logged in user is handed over from login */

/**
 * Loads the templates by including HTML and rendering the user icon.
 * @returns {Promise<void>} A promise that resolves when the templates are loaded.
 */
async function loadTemplates() {
  await includeHTML();
  renderUserIcon();
}

/**
 * Includes HTML content into elements with the attribute "w3-include-html".
 * @returns {Promise<void>} A promise that resolves when all HTML content is included.
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = "Page not found";
    }
  }
}

/**
 * Toggles the visibility of the submenu container.
 */
function showSubmenu() {
  document.getElementById("submenu_container").classList.toggle("show_submenu");
}

/**
 * Opens a new page based on the clicked link.
 * @param {string} clickedLink - The link that was clicked.
 */
function goToPage(clickedLink) {
  window.open(`./${clickedLink}.html`, "_self");
}

/**
 * Returns the current page name.
 * @param {string} pageName - The name of the current page.
 * @returns {string} The current page name.
 */
function getCurrentPageName(pageName) {
  currentPageName = pageName;
  return currentPageName;
}

/**
 * Sets the current page link as active.
 * @param {string} pageName - The name of the current page.
 */
function setCurrentPageLinkActive(pageName) {
  getCurrentPageName(pageName);
  checkIfLinkIsActive();
  setMenuLinkActive();
  changeMenuLinkImage();
}

/**
 * Checks if the link is active and updates the menu accordingly.
 */
function checkIfLinkIsActive() {
  if (!pageToDeactivate) {
    setMenuLinkActive();
  } else {
    removeMenuLinkActive();
    setMenuLinkActive();
  }
}

/**
 * Sets the menu link as active and updates the page to deactivate.
 */
function setMenuLinkActive() {
  const menuLink = document.getElementById(`sidebar_link_${currentPageName}`);
  menuLink.classList.add("sidebar_link_active", "sidebar_link_active:hover");
  pageToDeactivate = currentPageName;
}

/**
 * Removes the "sidebar_link_active" class from the menu link element.
 * @param {string} pageToDeactivate - The ID of the page to deactivate.
 */
function removeMenuLinkActive() {
  const menuLink = document.getElementById(`sidebar_link_${pageToDeactivate}`);
  menuLink.classList.remove("sidebar_link_active", "sidebar_link_active:hover");
}

/**
 * Changes the menu link image based on the current page name.
 */
function changeMenuLinkImage() {
  const image = document.getElementById(`menu_icon_${currentPageName}`);
  image.src = `assets/img/icons/${currentPageName}_icon_white.svg`;
}

/**
 * Opens a new site based on the provided parameter.
 * @param {string} p - The name of the site to open.
 */
function openNewSite(p) {
  window.location.href = `${p}.html`;
}

/**
 * Renders the user icon in the header.
 */
function renderUserIcon() {
  let element = document.getElementById("header_user_initials_container");
  if (sessionStorage.getItem("user"))
    currentUser = sessionStorage.getItem("user");

  element.innerHTML = `
      <div class="header_user_initials_box">
        ${returnInitials(currentUser)}
      </div>
`;
}

/**
 * Returns the initials of a given string.
 * @param {string} string - The input string.
 * @returns {string} - The initials of the input string.
 */
function returnInitials(string) {
  let words = string.split(" ");
  let innitials = "";

  for (let i = 0; i < words.length; i++) {
    innitials += words[i].charAt(0).toUpperCase();
  }

  return innitials;
}
