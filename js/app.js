const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const navLinks = document.querySelectorAll(".main-nav a");
const sections = document.querySelectorAll("section[id]");

const orderForm = document.getElementById("orderForm");
const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const eventDate = document.getElementById("eventDate");
const cakeType = document.getElementById("cakeType");
const servings = document.getElementById("servings");
const details = document.getElementById("details");
const formMessage = document.getElementById("formMessage");
const characterCount = document.getElementById("characterCount");

// Sticky header on scroll
window.addEventListener("scroll", function () {
  if (window.scrollY > 40) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  updateActiveSection();
});

// Mobile nav toggle
menuToggle.addEventListener("click", function () {
  const isOpen = mainNav.classList.toggle("nav-open");
  menuToggle.classList.toggle("active");
  menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

// Close mobile nav when a link is clicked
navLinks.forEach((link) => {
  link.addEventListener("click", function () {
    if (window.innerWidth <= 992) {
      mainNav.classList.remove("nav-open");
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});

// Active section highlighting
function updateActiveSection() {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop - 140 &&
      window.scrollY < sectionTop + sectionHeight - 140
    ) {
      currentSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active-link");

    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active-link");
    }
  });
}

window.addEventListener("load", updateActiveSection);

// Form setup
const today = new Date().toISOString().split("T")[0];
eventDate.min = today;

// Character counter
details.addEventListener("input", function () {
  const currentLength = details.value.length;
  characterCount.textContent = `${currentLength} / 300`;

  if (currentLength > 240) {
    characterCount.classList.add("limit-close");
  } else {
    characterCount.classList.remove("limit-close");
  }
});

// Utility functions
function showMessage(message, type) {
  formMessage.textContent = message;
  formMessage.classList.remove("error-message", "success-message");
  formMessage.classList.add(type);
}

function clearMessage() {
  formMessage.textContent = "";
  formMessage.classList.remove("error-message", "success-message");
}

function setError(field) {
  field.classList.remove("input-success");
  field.classList.add("input-error");
}

function setSuccess(field) {
  field.classList.remove("input-error");
  field.classList.add("input-success");
}

function clearFieldState(field) {
  field.classList.remove("input-error", "input-success");
}

function validateEmail(emailValue) {
  return emailValue.includes("@") && emailValue.includes(".");
}

function validatePhone(phoneValue) {
  if (phoneValue === "") return true;
  const cleanedPhone = phoneValue.replace(/\D/g, "");
  return cleanedPhone.length >= 10;
}

const allFields = [fullName, email, phone, eventDate, cakeType, servings, details];

allFields.forEach((field) => {
  field.addEventListener("input", function () {
    clearFieldState(field);
    clearMessage();
  });

  field.addEventListener("change", function () {
    clearFieldState(field);
    clearMessage();
  });
});

orderForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const nameValue = fullName.value.trim();
  const emailValue = email.value.trim();
  const phoneValue = phone.value.trim();
  const eventDateValue = eventDate.value;
  const cakeTypeValue = cakeType.value;
  const servingsValue = servings.value.trim();
  const detailsValue = details.value.trim();

  let isValid = true;

  clearMessage();
  allFields.forEach((field) => clearFieldState(field));

  if (nameValue === "") {
    setError(fullName);
    isValid = false;
  } else if (nameValue.length < 2) {
    setError(fullName);
    showMessage("Please enter a valid full name.", "error-message");
    isValid = false;
  } else {
    setSuccess(fullName);
  }

  if (emailValue === "") {
    setError(email);
    isValid = false;
  } else if (!validateEmail(emailValue)) {
    setError(email);
    showMessage("Please enter a valid email address.", "error-message");
    isValid = false;
  } else {
    setSuccess(email);
  }

  if (!validatePhone(phoneValue)) {
    setError(phone);
    showMessage("Please enter a valid phone number.", "error-message");
    isValid = false;
  } else if (phoneValue !== "") {
    setSuccess(phone);
  }

  if (eventDateValue === "") {
    setError(eventDate);
    isValid = false;
  } else {
    setSuccess(eventDate);
  }

  if (cakeTypeValue === "") {
    setError(cakeType);
    isValid = false;
  } else {
    setSuccess(cakeType);
  }

  if (servingsValue !== "" && Number(servingsValue) < 1) {
    setError(servings);
    showMessage("Estimated servings must be at least 1.", "error-message");
    isValid = false;
  } else if (servingsValue !== "") {
    setSuccess(servings);
  }

  if (detailsValue === "") {
    setError(details);
    isValid = false;
  } else if (detailsValue.length < 15) {
    setError(details);
    showMessage("Please provide a few more details about your order.", "error-message");
    isValid = false;
  } else {
    setSuccess(details);
  }

  if (
    nameValue === "" ||
    emailValue === "" ||
    eventDateValue === "" ||
    cakeTypeValue === "" ||
    detailsValue === ""
  ) {
    showMessage("Please complete all required fields before submitting.", "error-message");
    isValid = false;
  }

  if (!isValid) return;

  showMessage(
    `Thank you, ${nameValue}! Your cake inquiry has been submitted. We’ll reach out soon.`,
    "success-message"
  );

  orderForm.reset();
  eventDate.min = today;
  characterCount.textContent = "0 / 300";
  characterCount.classList.remove("limit-close");
  allFields.forEach((field) => clearFieldState(field));
});