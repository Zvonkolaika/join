let contacts = [
  {
    name: "Alice Adams",
    email: "alice@email.com",
    phone: "111111",
  },
  {
    name: "Bob Brown",
    email: "bob@email.com",
    phone: "222222",
  },
  {
    name: "Cindy Carter",
    email: "cindy@email.com",
    phone: "333333",
  },
  {
    name: "David Davis",
    email: "david@email.com",
    phone: "444444",
  },
  {
    name: "Eva Evans",
    email: "eva@email.com",
    phone: "555555",
  },
  {
    name: "Frank Fisher",
    email: "frank@email.com",
    phone: "666666",
  },
  {
    name: "Grace Gray",
    email: "grace@email.com",
    phone: "777777",
  },
  {
    name: "Hannah Hill",
    email: "hannah@email.com",
    phone: "888888",
  },
  {
    name: "Isaac Irwin",
    email: "isaac@email.com",
    phone: "999999",
  },
  {
    name: "Jack Johnson",
    email: "jack@email.com",
    phone: "101010",
  },
  {
    name: "Kelly King",
    email: "kelly@email.com",
    phone: "111111",
  },
  {
    name: "Lucy Lee",
    email: "lucy@email.com",
    phone: "121212",
  },
  {
    name: "Max Miller",
    email: "max@email.com",
    phone: "131313",
  },
  {
    name: "Nora Nelson",
    email: "nora@email.com",
    phone: "141414",
  },
  {
    name: "Oliver Olson",
    email: "oliver@email.com",
    phone: "151515",
  },
  {
    name: "Peter Parker",
    email: "peter@email.com",
    phone: "161616",
  },
  {
    name: "Quinn Quinn",
    email: "quinn@email.com",
    phone: "171717",
  },
  {
    name: "Rachel Ross",
    email: "rachel@email.com",
    phone: "181818",
  },
  {
    name: "Samuel Scott",
    email: "samuel@email.com",
    phone: "191919",
  },
  {
    name: "Tina Taylor",
    email: "tina@email.com",
    phone: "202020",
  },
  {
    name: "Ursula Underwood",
    email: "ursula@email.com",
    phone: "212121",
  },
  {
    name: "Victor Vaughn",
    email: "victor@email.com",
    phone: "222222",
  },
  {
    name: "Wendy Wilson",
    email: "wendy@email.com",
    phone: "232323",
  },
  {
    name: "Xander Xavier",
    email: "xander@email.com",
    phone: "242424",
  },
  {
    name: "Yvonne Young",
    email: "yvonne@email.com",
    phone: "252525",
  },
  {
    name: "Zoe Zane",
    email: "zoe@email.com",
    phone: "262626",
  },
];

function renderContactList() {
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
      <p>AM</p>
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
  document.getElementById("contact-name").innerHTML = contacts[id]["name"];
  document.getElementById("contact-email").innerHTML = contacts[id]["email"];
  document.getElementById("contact-phone").innerHTML = contacts[id]["phone"];
}
