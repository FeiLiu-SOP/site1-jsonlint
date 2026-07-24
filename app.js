const input = document.getElementById("input");
const output = document.getElementById("output");

function showOk(message, formatted) {
  output.className = "ok";
  output.textContent = message + (formatted ? "\n\n" + formatted : "");
}

function showErr(message) {
  output.className = "err";
  output.textContent = message;
}

function parseJson(text) {
  try {
    return { value: JSON.parse(text), error: null };
  } catch (e) {
    return { value: null, error: e };
  }
}

document.getElementById("btn-validate").addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) {
    showErr("Paste JSON first.");
    return;
  }
  const { value, error } = parseJson(text);
  if (error) {
    showErr("Invalid JSON:\n" + error.message);
    return;
  }
  showOk("Valid JSON.", JSON.stringify(value, null, 2));
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
  showOk("Formatted.", formatted);
});

document.getElementById("btn-clear").addEventListener("click", () => {
  input.value = "";
  output.className = "";
  output.textContent = "Ready.";
});
