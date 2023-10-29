const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const exchageIcon = document.querySelector(".exchange");
const selectTag = document.querySelectorAll("select");
const icons = document.querySelectorAll(".row i");
const translateBtn = document.querySelector("button");

function populateSelectTags() {
  selectTag.forEach((tag, id) => {
    for (let country_code in countries) {
      let selected =
        (id === 0 && country_code === "en-GB") ||
        (id === 1 && country_code === "hi-IN")
          ? "selected"
          : "";
      let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
      tag.insertAdjacentHTML("beforeend", option);
    }
  });
}

function swapLanguages() {
  let tempText = fromText.value;
  fromText.value = toText.value;
  toText.value = tempText;

  let tempLang = selectTag[0].value;
  selectTag[0].value = selectTag[1].value;
  selectTag[1].value = tempLang;
}

function translateText() {
  let text = fromText.value.trim();
  let translateFrom = selectTag[0].value;
  let translateTo = selectTag[1].value;

  if (!text) return;

  toText.setAttribute("placeholder", "Translating...");

  let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;

  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      toText.value = data.responseData.translatedText;
      data.matches.forEach((data) => {
        if (data.id === 0) {
          toText.value = data.translation;
        }
      });

      toText.setAttribute("placeholder", "Translation");
    });
}

function handleIconClick({ target }) {
  if (!fromText.value || !toText.value) return;

  if (target.classList.contains("fa-copy")) {
    if (target.id === "from") {
      navigator.clipboard.writeText(fromText.value);
    } else {
      navigator.clipboard.writeText(toText.value);
    }
  } else {
    let utterance;
    if (target.id === "from") {
      utterance = new SpeechSynthesisUtterance(fromText.value);
      utterance.lang = selectTag[0].value;
    } else {
      utterance = new SpeechSynthesisUtterance(toText.value);
      utterance.lang = selectTag[1].value;
    }

    speechSynthesis.speak(utterance);
  }
}

exchageIcon.addEventListener("click", swapLanguages);
fromText.addEventListener("keyup", () => {
  if (!fromText.value) {
    toText.value = "";
  }
});
translateBtn.addEventListener("click", translateText);
icons.forEach((icon) => {
  icon.addEventListener("click", handleIconClick);
});

populateSelectTags();
