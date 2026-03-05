const inputJson = document.getElementById("inputJson");
const outputJson = document.getElementById("outputJson");
const statusEl = document.getElementById("status");
const beautifyBtn = document.getElementById("beautifyBtn");
const minifyBtn = document.getElementById("minifyBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const indentSize = document.getElementById("indentSize");

function setStatus(message, type = "") {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`.trim();
}

function parseJson(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Invalid JSON";
    return { ok: false, error: msg };
  }
}

function formatJson(pretty) {
  const raw = inputJson.value.trim();
  if (!raw) {
    setStatus("Paste JSON in the input box first.", "error");
    outputJson.value = "";
    return;
  }

  const result = parseJson(raw);
  if (!result.ok) {
    setStatus(result.error, "error");
    outputJson.value = "";
    return;
  }

  const formatted = pretty
    ? JSON.stringify(result.value, null, Number(indentSize.value))
    : JSON.stringify(result.value);

  outputJson.value = formatted;
  setStatus(pretty ? "JSON beautified successfully." : "JSON minified successfully.", "ok");
}

async function copyOutput() {
  if (!outputJson.value.trim()) {
    setStatus("No output to copy.", "error");
    return;
  }

  try {
    await navigator.clipboard.writeText(outputJson.value);
    setStatus("Output copied to clipboard.", "ok");
  } catch {
    outputJson.select();
    document.execCommand("copy");
    setStatus("Output copied to clipboard.", "ok");
  }
}

function clearAll() {
  inputJson.value = "";
  outputJson.value = "";
  setStatus("Cleared.");
  inputJson.focus();
}

beautifyBtn.addEventListener("click", () => formatJson(true));
minifyBtn.addEventListener("click", () => formatJson(false));
clearBtn.addEventListener("click", clearAll);
copyBtn.addEventListener("click", copyOutput);

inputJson.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "Enter") {
    formatJson(true);
  }
});

setStatus("Ready.");
