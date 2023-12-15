

async function init() {
  await includeHTML();
  setCurrentPageActive();
}


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


function showSubmenu() {
  document.getElementById('submenu_container').classList.toggle('show_submenu');
}

// let currentUrl;
// let CurrentPageName;
// let pageToDeactivate;


// function goToPage(clickedLink) {
//   localStorage.removeItem('clickedLink');
//   window.open(`./${clickedLink}.html`, '_self');
//   localStorage.setItem('clickedLink', clickedLink);
// }


// function getCurrentURL() {
//   currentUrl = window.location.href;
//   console.log(`${window.location.href}`);
// }


// function setCurrentPageActive() {
//   CurrentPageName = localStorage.getItem('clickedLink');
//   console.log(localStorage.getItem('clickedLink'));
//   // checkIfLinkIsActive();
//   // setMenuLinkActive();
//   // changeMenuLinkImage();
// }


// function checkIfLinkIsActive() {
//   if (!pageToDeactivate) {
//     setMenuLinkActive();
//   }
//   else {
//     removeMenuLinkActive();
//     setMenuLinkActive();
//   }
// }


// function setMenuLinkActive() {
//   const menuLink = document.getElementById(`sidebar_link_${CurrentPageName}`);
//   menuLink.classList.add('sidebar_link_active', 'sidebar_link_active:hover');
//   pageToDeactivate = CurrentPageName;
// }


// function removeMenuLinkActive() {
//   const menuLink = document.getElementById(`sidebar_link_${pageToDeactivate}`);
//   menuLink.classList.remove('sidebar_link_active', 'sidebar_link_active:hover');
// }


// function changeMenuLinkImage() {
//   const image = document.getElementById(`menu_icon_${CurrentPageName}`);
//   image.src = `assets/img/icons/${CurrentPageName}_icon_white.svg`;
// }