const input = document.querySelector('input[type="text"]');
const button = document.querySelector('.searchBar button');
const gallery = document.querySelector('.gallery-grid');
const loader = document.getElementById("loader");
const validationMessage = document.getElementById("validation-message");
const loadError = document.getElementById("load-error");
const accessKey = "nUEQriwypR86MLwDyS8Ef6beE0voT_1BjHFiJWKGBdU";

function showLoader() {
  loader.style.display = "block";
  gallery.style.display = "none";
}

function hideLoader() {
  loader.style.display = "none";
  gallery.style.display = "grid";
}

function validateInput(query) {
  const allowedCharsRegex = /^[a-zA-Z0-9 !$&*\-=\^`|~#%'\/?_{}+]+$/;

  if (!query) {
    validationMessage.textContent = "Please enter a search query (min 3, max 64 characters).";
    validationMessage.classList.add("active");
    return false;
  }

  if (query.length < 3 || query.length > 64) {
    validationMessage.textContent = "Query length must be between 3 and 64 characters.";
    validationMessage.classList.add("active");
    return false;
  }

  if (!allowedCharsRegex.test(query)) {
    validationMessage.textContent = "Only letters, numbers, and symbols ! $ & * - = ^ ` | ~ # % ' + / ? _ { } are allowed.";
    validationMessage.classList.add("active");
    return false;
  }

  validationMessage.classList.remove("active");
  return true;
}

function loadImages(query) {
  showLoader();
  loadError.style.display = "none";

  fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=12&client_id=${accessKey}`)
    .then(response => response.json())
    .then(data => {
      gallery.innerHTML = "";

      if (data.results.length === 0) {
        gallery.innerHTML = "<p>No results found.</p>";
        hideLoader();
        return;
      }

      let loadedCount = 0;
      data.results.forEach(photo => {
        const img = document.createElement("img");
        img.src = photo.urls.small;
        img.alt = photo.alt_description || "Unsplash Image";
        img.onload = () => {
          loadedCount++;
          if (loadedCount === data.results.length) {
            hideLoader();
          }
        };
        gallery.appendChild(img);
      });
    })
    .catch(error => {
      console.error("Error loading images:", error);
      loadError.style.display = "block";
      hideLoader();
    });
}

function loadRandomImages() {
  showLoader();
  loadError.style.display = "none";

  fetch(`https://api.unsplash.com/photos/random?count=12&client_id=${accessKey}`)
    .then(response => response.json())
    .then(data => {
      gallery.innerHTML = "";

      let loadedCount = 0;
      data.forEach(photo => {
        const img = document.createElement("img");
        img.src = photo.urls.regular;
        img.alt = photo.alt_description || "Random Unsplash Image";
        img.onload = () => {
          loadedCount++;
          if (loadedCount === data.length) {
            hideLoader();
          }
        };
        gallery.appendChild(img);
      });
    })
    .catch(error => {
      console.error("Error loading random images:", error);
      loadError.style.display = "block";
      hideLoader();
    });
}

button.addEventListener("click", () => {
  const query = input.value.trim();
  if (!validateInput(query)) return;
  loadImages(query);
});

window.addEventListener("DOMContentLoaded", () => {
  loadRandomImages();
});

let currentImageIndex = 0;
let currentImageList = [];

const modalOverlay = document.getElementById("modal-overlay");
const modalImage = document.querySelector(".modal-image");
const closeBtn = document.querySelector(".close-btn");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

gallery.addEventListener("click", function (e) {
  if (e.target.tagName === "IMG") {
    const images = Array.from(gallery.querySelectorAll("img"));
    currentImageList = images.map(img => img.src);
    currentImageIndex = images.indexOf(e.target);
    openModal(currentImageList[currentImageIndex]);
  }
});

function openModal(src) {
  modalImage.src = src;
  modalOverlay.style.display = "flex";
  document.body.style.overflow = "hidden";
}

modalOverlay.addEventListener("click", function (e) {
  if (e.target === modalOverlay || e.target === closeBtn) {
    modalOverlay.style.display = "none";
    document.body.style.overflow = "";
  }
});

nextBtn.addEventListener("click", () => {
  currentImageIndex = (currentImageIndex + 1) % currentImageList.length;
  modalImage.src = currentImageList[currentImageIndex];
});

prevBtn.addEventListener("click", () => {
  currentImageIndex = (currentImageIndex - 1 + currentImageList.length) % currentImageList.length;
  modalImage.src = currentImageList[currentImageIndex];
});
