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
  llm: `\`\`\`json
{"title":"ChatGPT export","items":[1,2,3],}
\`\`\``,
  feed: `{
  "products": [
    {
      "id": "SKU-1001",
      "title": "Blue Widget",
      "description": "A great widget for your store",
      "link": "https://example.com/products/blue-widget",
      "price": "29.99 USD",
      "availability": "in stock",
      "brand": "Example Co",
    }
  ]
}`,
  shopify: `{
  "product": {
    "title": "Summer Tee",
    "variants": [
      {"sku": "TEE-S", "price": "24.00"},
      {"sku": "TEE-M", "price": "24.00"},
    ]
  }
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

function preprocessLlmJson(text) {
  const repairs = [];
  let s = text.trim();

  const fenced = s.match(/^```(?:json|JSON)?\s*\r?\n?([\s\S]*?)\r?\n?```\s*$/);
  if (fenced) {
    s = fenced[1].trim();
    repairs.push("removed markdown code fences");
  } else {
    const unfenced = s.replace(/^```(?:json|JSON)?\s*\r?\n?/, "").replace(/\r?\n?```\s*$/, "");
    if (unfenced !== s) {
      s = unfenced.trim();
      repairs.push("removed markdown code fences");
    }
  }

  const beforeQuotes = s;
  s = s.replace(/[\u201c\u201d]/g, '"').replace(/[\u2018\u2019]/g, "'");
  if (s !== beforeQuotes) repairs.push("replaced smart quotes");

  const beforeComma = s;
  s = s.replace(/,(\s*[}\]])/g, "$1");
  if (s !== beforeComma) repairs.push("removed trailing commas");

  return { text: s, repairs };
}

function parseJsonWithRepair(raw) {
  let result = parseJson(raw.trim());
  if (!result.error) {
    return { ...result, repairs: [], text: raw.trim() };
  }

  const { text, repairs } = preprocessLlmJson(raw);
  if (!repairs.length) {
    return { value: null, error: result.error, repairs: [], text: raw.trim() };
  }

  result = parseJson(text);
  if (!result.error) {
    return { ...result, repairs, text };
  }

  return { value: null, error: result.error, repairs, text };
}

function runValidate() {
  const text = input.value.trim();
  if (!text) {
    showErr("Paste JSON first.");
    return;
  }

  const { value, error, repairs, text: repairedText } = parseJsonWithRepair(text);
  if (error) {
    showErr("Invalid JSON:\n" + error.message);
    lastJson = "";
    return;
  }

  lastJson = JSON.stringify(value, null, 2);
  if (repairs.length) {
    input.value = repairedText;
    showOk("Valid JSON after repair (" + repairs.join(", ") + ").", lastJson);
    return;
  }

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

  const { value, error, repairs, text: repairedText } = parseJsonWithRepair(text);
  if (error) {
    showErr("Cannot format — invalid JSON:\n" + error.message);
    return;
  }

  const formatted = JSON.stringify(value, null, 2);
  input.value = formatted;
  lastJson = formatted;
  if (repairs.length) {
    showOk("Formatted after repair (" + repairs.join(", ") + ").", formatted);
    return;
  }

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

const autoExample = new URLSearchParams(window.location.search).get("example");
if (input && autoExample && EXAMPLES[autoExample]) {
  input.value = EXAMPLES[autoExample];
  const btn = document.querySelector('[data-example="' + autoExample + '"]');
  if (btn) btn.classList.add("active");
  runValidate();
}
