const nameMapping = [];
let nameId = 1;
let tokenizer = null;
let lastAnonymized = "";

document.getElementById("sendBtn").disabled = true;

// kuromojiの初期化のみ
kuromoji.builder({ dicPath: "./dict" }).build((err, _tokenizer) => {
  if (err) {
    console.error("形態素解析初期化エラー:", err);
    return;
  }
  tokenizer = _tokenizer;
  document.getElementById("sendBtn").disabled = false;
});

function anonymizeNames(text) {
  const tokens = tokenizer.tokenize(text);
  nameMapping.length = 0;
  nameId = 1;

  const fragments = tokens.map((token) => {
    const surface = token.surface_form;

    // 固有名詞のみを匿名化
    if (token.pos === "名詞" && token.pos_detail_1 === "固有名詞") {
      const placeholder = `[匿名${nameId}]`;
      const index =
        nameMapping.push({ original: surface, placeholder, disabled: false }) -
        1;
      nameId++;

      return `<button class="toggle-name" data-id="${index}">${placeholder}</button>`;
    }

    return surface;
  });

  return fragments.join("");
}

function reverseAnonymize(text) {
  let restored = text;
  nameMapping.forEach(({ original, placeholder }) => {
    restored = restored.replaceAll(placeholder, original);
  });
  return restored;
}

function generateAnonymizedText() {
  const input = document.getElementById("inputText").value;
  lastAnonymized = anonymizeNames(input);
  const outputDiv = document.getElementById("anonymizedText");
  outputDiv.innerHTML = lastAnonymized;
  setupToggleButtons();
  renderNameMappingList();
  document.getElementById("step2").style.display = "block";
  document.getElementById("step2").scrollIntoView({ behavior: "smooth" });
}

function setupToggleButtons() {
  document.querySelectorAll(".toggle-name").forEach((btn) => {
    const id = +btn.dataset.id;
    const entry = nameMapping[id];
    if (!entry) return;

    let toggled = entry.disabled;

    btn.addEventListener("click", () => {
      toggled = !toggled;
      entry.disabled = toggled;
      btn.textContent = toggled ? entry.original : entry.placeholder;

      const checkbox = document.querySelector(
        `.name-toggle-checkbox[data-id="${id}"]`
      );
      if (checkbox) checkbox.checked = !toggled;

      renderNameMappingList();
    });
  });
}

function renderNameMappingList() {
  const listDiv = document.getElementById("nameMappingList");
  if (!listDiv) return;
  listDiv.innerHTML =
    "<h4>置換リスト</h4><ul>" +
    nameMapping
      .map(
        (m, idx) =>
          `<li style="${
            m.disabled ? "text-decoration: line-through; color: gray;" : ""
          }">` +
          `<label><input type='checkbox' data-id='${idx}' ${
            m.disabled ? "" : "checked"
          } onchange='onToggleFromList(${idx}, this.checked)'/> ${
            m.placeholder
          } → ${m.original}</label></li>`
      )
      .join("") +
    "</ul>";
}

function onToggleFromList(id, checked) {
  const entry = nameMapping[id];
  entry.disabled = !checked;
  const btn = document.querySelector(`.toggle-name[data-id='${id}']`);
  if (btn) btn.textContent = checked ? entry.placeholder : entry.original;
  renderNameMappingList();
}

function generatePrompt() {
  const prompt = `以下の文章を丁寧で自然な日本語に添削してください。\n[匿名X]は人名を匿名化したものです。\nその形は変更せず、内容や敬語の添削のみ行ってください。\n===\n${
    document.getElementById("anonymizedText").innerText
  }`;
  document.getElementById("promptArea").innerText = prompt;
  document.getElementById("step3").style.display = "block";
  document.getElementById("step4").style.display = "block";
  document.getElementById("step3").scrollIntoView({ behavior: "smooth" });
}

function copyPrompt() {
  const text = document.getElementById("promptArea").innerText;
  const button = document.querySelector("button[onclick='copyPrompt()']");

  navigator.clipboard.writeText(text).then(() => {
    const original = button.textContent;
    button.textContent = "✅ コピーしました！";
    setTimeout(() => (button.textContent = original), 1500);
  });
}

function restoreOriginalNames() {
  const revised = document.getElementById("revisedText").value;
  const restored = reverseAnonymize(revised);
  document.getElementById("responseArea").innerText = restored;
  document.getElementById("step5").style.display = "block";
  document.getElementById("step5").scrollIntoView({ behavior: "smooth" });
}

function copyRestoredText() {
  const text = document.getElementById("responseArea").innerText;
  const button = document.getElementById("copyRestoredBtn");

  navigator.clipboard.writeText(text).then(() => {
    const original = button.textContent;
    button.textContent = "✅ コピーしました！";
    setTimeout(() => (button.textContent = original), 1500);
  });
}
