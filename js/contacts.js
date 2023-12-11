let contacts = [];

async function init() {
  await includeHTML();
  await loadContacts();
  renderContactList();
}

function renderContactList() {
  document.getElementById("contact-list").innerHTML = "";

  for (let i = 0; i < contacts.length; i++) {
    let nameInitial = Array.from(contacts[i]["name"])[0];

    document.getElementById("contact-list").innerHTML +=
      returnContactListCategory(nameInitial) + returnContactListEntry([i]);
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
    <div class="acc-initials">
      <p>${returnInitials(contact["name"])}</p>
    </div>
    <div>
      <name>${contact["name"]}</name>
      <email>${contact["email"]}</email>
    </div>
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

function returnInitials(string) {
  let words = string.split(" ");
  let innitials = "";

  for (let i = 0; i < words.length; i++) {
    innitials += words[i].charAt(0).toUpperCase();
  }

  return innitials;
}

function showAddContactForm() {
  document.getElementById("add-contact-bg").classList.remove("d-none");
}

function showEditContactForm(id) {
  loadEditContactValues(id);
  document.getElementById("edit-contact-bg").classList.remove("d-none");
}

async function createNewContact() {
  contacts.push({
    name: document.getElementById("add-contact-name").value,
    email: document.getElementById("add-contact-email").value,
    phone: document.getElementById("add-contact-phone").value,
  });

  await setItem("contacts", JSON.stringify(contacts));
  closeAddContactForm();
  renderContactList();
}

async function deleteContact(id) {
  contacts.splice(id, 1);
  await setItem("contacts", JSON.stringify(contacts));
  document.getElementById("contact-details").classList.add("d-none");
  renderContactList();
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

function loadEditContactValues(id) {
  const contact = contacts[id];
  document.getElementById("edit-contact-name").value = contact["name"];
  document.getElementById("edit-contact-phone").value = contact["phone"];
  document.getElementById("edit-contact-email").value = contact["email"];
  document
    .getElementById("edit-contact-form")
    .setAttribute("onsubmit", `editContact(${id}); return false`);
}

async function loadContacts() {
  try {
    contacts = JSON.parse(await getItem("contacts"));
  } catch (e) {
    console.warn("no contacts found on server");
  }
}

function closeAddContactForm() {
  resetAddContactForm();
  document.getElementById("add-contact-bg").classList.add("d-none");
}

function closeEditContactForm() {
  document.getElementById("edit-contact-bg").classList.add("d-none");
}

function resetAddContactForm() {
  document.getElementById("add-contact-name").value = "";
  document.getElementById("add-contact-email").value = "";
  document.getElementById("add-contact-phone").value = "";
}

async function addTestContacts() {
  contacts = [
    {
      name: "Alice Adams",
      email: "alice@email.com",
      phone: "111111",
    },
    {
      name: "Eva Evans",
      email: "eva@email.com",
      phone: "555555",
    },
    {
      name: "Peter Parker",
      email: "peter@email.com",
      phone: "161616",
    },
    {
      name: "Zoe Zane",
      email: "zoe@email.com",
      phone: "262626",
    },
  ];
  await setItem("contacts", JSON.stringify(contacts));
  renderContactList();
}
