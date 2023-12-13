let contacts = [];
let sortedContacts = [];

const backgroundColors = [
  "#3498db",
  "#2ecc71",
  "#9b59b6",
  "#e74c3c",
  "#f39c12",
  "#1abc9c",
  "#34495e",
  "#95a5a6",
  "#d35400",
  "#27ae60",
  "#2980b9",
  "#8e44ad",
  "#c0392b",
  "#f1c40f",
  "#16a085",
  "#2c3e50",
  "#7f8c8d",
  "#e67e22",
  "#1abc9c",
  "#3498db",
  "#f39c12",
  "#d35400",
  "#2ecc71",
  "#8e44ad",
  "#34495e",
  "#e74c3c",
  "#2980b9",
  "#16a085",
  "#95a5a6",
  "#c0392b",
  "#f1c40f",
  "#27ae60",
  "#7f8c8d",
  "#e67e22",
  "#1abc9c",
  "#3498db",
  "#f39c12",
  "#d35400",
  "#2ecc71",
  "#8e44ad",
  "#34495e",
  "#e74c3c",
  "#2980b9",
  "#16a085",
  "#95a5a6",
  "#c0392b",
  "#f1c40f",
  "#27ae60",
  "#7f8c8d",
  "#e67e22",
];

async function init() {
  await includeHTML();
  await loadContacts();
  renderContactList();
}

async function loadContacts() {
  try {
    contacts = JSON.parse(await getItem("contacts"));
  } catch (e) {
    console.warn("no contacts found on server");
  }
}

function renderContactList() {
  document.getElementById("contact-list").innerHTML = "";

  sortContactsAtoZ();

  for (let i = 0; i < sortedContacts.length; i++) {
    let nameInitial = Array.from(sortedContacts[i]["name"])[0].toUpperCase();
    let contactListCategory = document.getElementById(
      `contact-category-${nameInitial}`
    );

    if (contactListCategory === null) {
      document.getElementById("contact-list").innerHTML +=
        returnContactListCategory(nameInitial) + returnContactListEntry([i]);
    } else {
      contactListCategory.innerHTML += returnContactListEntry([i]);
    }
  }
}

function returnContactListCategory(character) {
  return `
    <p class="contact-category" 
    id="contact-category-${character}">
      ${character.toUpperCase()}
    </p>
  `;
}

function returnContactListEntry(id) {
  let contact = contacts[id];

  return `
    <div class="contact-entry" onclick="renderContactDetails(${id})">
    ${renderContactInitials(returnInitials(contact["name"]))}
    <div>
      <name>${contact["name"]}</name>
      <email>${contact["email"]}</email>
    </div>
  </div>
`;
}

function renderContactInitials(initials) {
  const randomBgColorIndex = Math.floor(
    Math.random() * backgroundColors.length
  );
  const color = backgroundColors[randomBgColorIndex];

  return `
  <div class="acc-initials" style="background-color:${color}">
      <p>${initials}</p>
    </div>
  `;
}

function renderContactDetails(id) {
  document.getElementById("contact-details").classList.remove("d-none");
  document.getElementById("contact-innitials").innerHTML = returnInitials(
    contacts[id]["name"]
  );
  document.getElementById("contact-name").innerHTML = contacts[id]["name"];
  document.getElementById("contact-email").innerHTML = contacts[id]["email"];
  document.getElementById("contact-email").href = `
  mailto:${contacts[id]["email"]}`;
  document.getElementById("contact-phone").innerHTML = contacts[id]["phone"];
  document
    .getElementById("contact-delete")
    .setAttribute("onclick", `deleteContact(${id})`);
  document
    .getElementById("contact-edit")
    .setAttribute("onclick", `showEditContactForm(${id})`);
}

function showAddContactForm() {
  document
    .getElementById("add-contact-form-container")
    .classList.remove("fadeOut");
  document.getElementById("add-contact-bg").classList.remove("d-none");
  document.getElementById("add-contact-form-container").classList.add("fadeIn");
}

async function createNewContact() {
  contacts.push({
    id: contacts.length,
    name: document.getElementById("add-contact-name").value,
    email: document.getElementById("add-contact-email").value,
    phone: document.getElementById("add-contact-phone").value,
  });

  await setItem("contacts", JSON.stringify(contacts));

  closeAddContactForm();
  renderContactList();
}

function closeAddContactForm() {
  document
    .getElementById("add-contact-form-container")
    .classList.remove("fadeIn");
  document
    .getElementById("add-contact-form-container")
    .classList.add("fadeOut");
  setTimeout(resetAddContactForm, 950);
}

function resetAddContactForm() {
  document.getElementById("add-contact-bg").classList.add("d-none");
  document.getElementById("add-contact-name").value = "";
  document.getElementById("add-contact-email").value = "";
  document.getElementById("add-contact-phone").value = "";
}

async function deleteContact(id) {
  contacts.splice(id, 1);
  await sortAndPushContacts();
  document.getElementById("contact-details").classList.add("d-none");
  renderContactList();
}

function showEditContactForm(id) {
  loadEditContactValues(id);
  document
    .getElementById("edit-contact-form-container")
    .classList.remove("fadeOut");
  document.getElementById("edit-contact-bg").classList.remove("d-none");
  document
    .getElementById("edit-contact-form-container")
    .classList.add("fadeIn");
}

function loadEditContactValues(id) {
  const contact = contacts[id];
  document.getElementById("edit-contact-name").value = contact["name"];
  document.getElementById("edit-contact-phone").value = contact["phone"];
  document.getElementById("edit-contact-email").value = contact["email"];
  document
    .getElementById("edit-contact-form")
    .setAttribute("onsubmit", `editContact(${id}); return false`);
}

async function editContact(id) {
  contacts[id] = {
    name: document.getElementById("edit-contact-name").value,
    email: document.getElementById("edit-contact-email").value,
    phone: document.getElementById("edit-contact-phone").value,
  };

  await setItem("contacts", JSON.stringify(contacts));
  closeEditContactForm();
  renderContactList();
  renderContactDetails(id);
}

function resetEditContactForm() {
  document.getElementById("edit-contact-bg").classList.add("d-none");
  document.getElementById("edit-contact-name").value = "";
  document.getElementById("edit-contact-email").value = "";
  document.getElementById("edit-contact-phone").value = "";
}

function closeEditContactForm() {
  document
    .getElementById("edit-contact-form-container")
    .classList.remove("fadeIn");
  document
    .getElementById("edit-contact-form-container")
    .classList.add("fadeOut");
  setTimeout(resetEditContactForm, 950);
}

async function addTestContacts() {
  contacts = [
    {
      id: 0,
      name: "Eva Evans",
      email: "eva@email.com",
      phone: "555555",
    },
    {
      id: 1,
      name: "Peter Parker",
      email: "peter@email.com",
      phone: "161616",
    },
    {
      id: 2,
      name: "Zoe Zane",
      email: "zoe@email.com",
      phone: "262626",
    },
    {
      id: 3,
      name: "Alice Adams",
      email: "alice@email.com",
      phone: "111111",
    },
  ];
  await setItem("contacts", JSON.stringify(contacts));
  renderContactList();
}

function returnInitials(string) {
  let words = string.split(" ");
  let innitials = "";

  for (let i = 0; i < words.length; i++) {
    innitials += words[i].charAt(0).toUpperCase();
  }

  return innitials;
}

function sortContactsAtoZ() {
  sortedContacts = contacts;
  sortedContacts.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    let charsA = nameA.split("");
    let charsB = nameB.split("");

    for (let i = 0; i < charsA.length; i++) {
      if (charsA[i] < charsB[i]) return -1;
      if (charsA[i] > charsB[i]) return 1;
      return 0;
    }
  });
}
