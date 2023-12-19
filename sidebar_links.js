let currentUrl = window.location.href;
let CurrentPageName;
let pageToDeactivate;


function goToPage(clickedLink) {
  localStorage.removeItem('clickedLink');
  window.open(`./${clickedLink}.html`, '_self');
  localStorage.setItem('clickedLink', clickedLink);
}


function getCurrentURL() {
  currentUrl = window.location.href;
  console.log(`${window.location.href}`);
}


function setCurrentPageActive() {
  CurrentPageName = localStorage.getItem('clickedLink');
  console.log(localStorage.getItem('clickedLink'));
  // checkIfLinkIsActive();
  // setMenuLinkActive();
  // changeMenuLinkImage();
}


function checkIfLinkIsActive() {
  if (!pageToDeactivate) {
    setMenuLinkActive();
  }
  else {
    removeMenuLinkActive();
    setMenuLinkActive();
  }
}


function setMenuLinkActive() {
  const menuLink = document.getElementById(`sidebar_link_${CurrentPageName}`);
  menuLink.classList.add('sidebar_link_active', 'sidebar_link_active:hover');
  pageToDeactivate = CurrentPageName;
}


function removeMenuLinkActive() {
  const menuLink = document.getElementById(`sidebar_link_${pageToDeactivate}`);
  menuLink.classList.remove('sidebar_link_active', 'sidebar_link_active:hover');
}


function changeMenuLinkImage() {
  const image = document.getElementById(`menu_icon_${CurrentPageName}`);
  image.src = `assets/img/icons/${CurrentPageName}_icon_white.svg`;
}