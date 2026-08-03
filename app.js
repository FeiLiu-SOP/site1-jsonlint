const input = document.getElementById("input");
const output = document.getElementById("output");

const EXAMPLES = {
  valid: `{"name":"Alice","age":30,"active":true}`,
  invalid: `{"name":"Bob","age":30,}`,
  nested: `{
  "user": {"id": 1, "name": "Carol"},
  "tags": ["api", "json"],
  "meta": {"version": 2, "private": true}
}`,
};

function showOk(message, formatted) {
  output.className = "ok";
  output.textContent = message + (formatted ? "\n\n" + formatted : "");
}

function showErr(message) {
  output.className = "err";
  output.textContent = message;
}

let lastJson = "";

function getJsonPayload() {
  if (lastJson) return lastJson;
  const text = output.textContent.trim();
  if (!text || text === "Ready.") return "";
  const jsonStart = text.indexOf("\n\n");
  const body = jsonStart >= 0 ? text.slice(jsonStart + 2) : text;
  if (body.startsWith("{") || body.startsWith("[")) return body;
  return "";
}

function parseJson(text) {
  try {
    return { value: JSON.parse(text), error: null };
  } catch (e) {
    return { value: null, error: e };
  }
}

function runValidate() {
  const text = input.value.trim();
  if (!text) {
    showErr("Paste JSON first.");
    return;
  }
  const { value, error } = parseJson(text);
  if (error) {
    showErr("Invalid JSON:\n" + error.message);
    lastJson = "";
    return;
  }
  lastJson = JSON.stringify(value, null, 2);
  showOk("Valid JSON.", lastJson);
}

document.querySelectorAll("[data-example]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.getAttribute("data-example");
    const sample = EXAMPLES[key];
    if (!sample) return;

    input.value = sample;
    document.querySelectorAll("[data-example]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    runValidate();
  });
});

document.getElementById("btn-validate").addEventListener("click", () => {
  runValidate();
});

document.getElementById("btn-format").addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) {
    showErr("Paste JSON first.");
    return;
  }
  const { value, error } = parseJson(text);
  if (error) {
    showErr("Cannot format — invalid JSON:\n" + error.message);
    return;
  }
  const formatted = JSON.stringify(value, null, 2);
  input.value = formatted;
  lastJson = formatted;
  showOk("Formatted.", formatted);
});

document.getElementById("btn-download").addEventListener("click", () => {
  const payload = getJsonPayload();
  if (!payload) {
    showErr("Validate or format JSON first.");
    return;
  }

  const blob = new Blob([payload], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "formatted.json";
  link.click();
  URL.revokeObjectURL(url);
  showOk("Downloaded formatted.json", payload);
});

document.getElementById("btn-clear").addEventListener("click", () => {
  input.value = "";
  lastJson = "";
  output.className = "";
  output.textContent = "Ready.";
  document.querySelectorAll("[data-example]").forEach((b) => b.classList.remove("active"));
});
