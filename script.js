const input = document.querySelector('input[type="text"]');
const button = document.querySelector('.searchBar button');
const gallery = document.querySelector('.gallery-grid');
const loader = document.getElementById("loader");
const validationMessage = document.getElementById("validation-message");
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
    validationMessage.textContent = "Введите поисковый запрос (минимум 3 символа, максимум 64).";
    validationMessage.style.display = "block";
    return false;
  }
  if (query.length < 3 || query.length > 64) {
    validationMessage.textContent = "Длина запроса должна быть от 3 до 64 символов.";
    validationMessage.style.display = "block";
    return false;
  }
  if (!allowedCharsRegex.test(query)) {
    validationMessage.textContent = "Допустимы только буквы, цифры и символы: ! $ & * - = ^ ` | ~ # % ' + / ? _ { }";
    validationMessage.style.display = "block";
    return false;
  }
  validationMessage.style.display = "none";
  return true;
}

function loadImages(query) {
  showLoader();
  fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=12&client_id=${accessKey}`)
    .then(response => response.json())
    .then(data => {
      gallery.innerHTML = "";
      if (data.results.length === 0) {
        gallery.innerHTML = "<p>Ничего не найдено.</p>";
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
      console.error("Ошибка при загрузке данных: ", error);
      hideLoader();
    });
}

function loadRandomImages() {
  showLoader();

  fetch(`https://api.unsplash.com/photos/random?count=12&client_id=${accessKey}`)
    .then(response => response.json())
    .then(data => {
      gallery.innerHTML = "";

      let loadedCount = 0;

      data.forEach(photo => {
        const img = document.createElement("img");
        img.src = photo.urls.small;
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
      console.error("Ошибка при загрузке случайных изображений: ", error);
      hideLoader();
    });
}

button.addEventListener("click", () => {
  const query = input.value.trim();
  if (!validateInput(query)) {
    return;
  }
  loadImages(query);
});

window.addEventListener("DOMContentLoaded", () => {
  loadRandomImages();
});
