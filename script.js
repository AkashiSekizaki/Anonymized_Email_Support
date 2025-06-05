const nameMapping = [];
let nameId = 1;
let tokenizer = null;
let lastAnonymized = "";

document.getElementById("sendBtn").disabled = true;

document.addEventListener("selectionchange", () => {
  const selection = window.getSelection();
  const isSelecting =
    selection && selection.rangeCount > 0 && !selection.isCollapsed;

  document.body.classList.toggle("selecting", isSelecting);
});

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
  const prompt = `以下の文章を丁寧で自然な日本語に添削してください。\n[匿名X]は人名などを匿名化したものです。\nその形を絶対に変更せず、内容や敬語の添削のみ行ってください。\n変えてはいけない理由は，[匿名X]に対応する文字列を後の処理で代入するためです．[]の削除や，余計な記号をつけると，後の処理が適切に行うことができません．\n===\n${
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

function manualAnonymizeSelection() {
  const selection = window.getSelection();

  // 選択されていない場合 → 強調表示だけして終了
  if (!selection || selection.isCollapsed) {
    // 一時的に `selecting` を body に付けて強調
    document.body.classList.add("selecting");
    setTimeout(() => {
      document.body.classList.remove("selecting");
    }, 1000); // 1秒後に解除

    alert("テキストを選択してください。");
    return;
  }

  const range = selection.getRangeAt(0);

  // #anonymizedTextの中かチェック
  const container = document.getElementById("anonymizedText");
  if (!container.contains(range.commonAncestorContainer)) {
    alert("匿名化できるのは表示中の文章内のみです。");
    return;
  }

  const selectedText = selection.toString();
  if (!selectedText.trim()) return;

  const placeholder = `[匿名${nameId}]`;
  const index =
    nameMapping.push({ original: selectedText, placeholder, disabled: false }) -
    1;
  nameId++;

  const button = document.createElement("button");
  button.className = "toggle-name";
  button.setAttribute("data-id", index);
  button.textContent = placeholder;

  range.deleteContents();
  range.insertNode(button);

  selection.removeAllRanges();
  setupToggleButtons();
  renderNameMappingList();
}
