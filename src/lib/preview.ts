export type PreviewSection = {
  id: string;
  title: string;
  html: string;
  css: string;
  position: number;
  agent: string;
  version: number;
  updatedAt: string;
};

export const MAX_PREVIEW_SECTIONS = 40;
export const MAX_SECTION_HTML = 200_000;
export const MAX_SECTION_CSS = 50_000;

export function sortSections<T extends { position: number; id: string }>(sections: T[]) {
  return [...sections].sort((a, b) => a.position - b.position || a.id.localeCompare(b.id));
}

// Agents can publish any HTML here. It runs in an iframe with an opaque origin and this policy,
// so it cannot reach the user's session, call our API or send data anywhere.
export const PREVIEW_POLICY =
  "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com data:; img-src https: data: blob:; media-src https: data: blob:; form-action 'none'; base-uri 'none'";

const runtime = `
(function () {
  var root = document.getElementById("agentwe-root");
  var ghost = document.getElementById("agentwe-ghost");
  var known = {};
  var first = true;

  function runScripts(element) {
    element.querySelectorAll("script").forEach(function (old) {
      var script = document.createElement("script");
      for (var i = 0; i < old.attributes.length; i++) script.setAttribute(old.attributes[i].name, old.attributes[i].value);
      script.textContent = old.textContent;
      old.replaceWith(script);
    });
  }

  // scrollIntoView would also scroll the page around the frame.
  function reveal(element) {
    var top = element.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  function announce(element, label) {
    element.setAttribute("data-agentwe-label", label);
    element.classList.remove("agentwe-new");
    void element.offsetWidth;
    element.classList.add("agentwe-new");
    setTimeout(function () { element.classList.remove("agentwe-new"); }, 2600);
    reveal(element);
  }

  function setStyle(id, css) {
    var style = document.head.querySelector('style[data-agentwe="' + CSS.escape(id) + '"]');
    if (!css) { if (style) style.remove(); return; }
    if (!style) {
      style = document.createElement("style");
      style.setAttribute("data-agentwe", id);
      document.head.appendChild(style);
    }
    if (style.textContent !== css) style.textContent = css;
  }

  window.addEventListener("message", function (event) {
    if (event.source !== window.parent || !event.data || event.data.type !== "agentwe-sync") return;
    var sections = event.data.sections;
    var ids = {};
    var latest = null;

    sections.forEach(function (section, index) {
      ids[section.id] = true;
      setStyle(section.id, section.css);
      var current = known[section.id];
      if (!current) {
        current = { element: document.createElement("section"), version: 0 };
        current.element.setAttribute("data-agentwe-section", section.id);
        known[section.id] = current;
      }
      var changed = current.version !== section.version;
      if (changed) {
        current.element.innerHTML = section.html;
        runScripts(current.element);
        current.version = section.version;
        if (section.html) latest = { element: current.element, label: section.title + " · " + section.agent };
      }
      if (root.children[index] !== current.element) root.insertBefore(current.element, root.children[index] || null);
    });

    Object.keys(known).forEach(function (id) {
      if (ids[id]) return;
      known[id].element.remove();
      setStyle(id, "");
      delete known[id];
    });

    if (latest && !first) announce(latest.element, latest.label);
    first = false;

    ghost.hidden = !event.data.working;
    ghost.textContent = event.data.working || "";
    if (event.data.working && !latest && !first) reveal(ghost);
  });

  window.parent.postMessage({ type: "agentwe-ready" }, "*");
})();
`;

const chrome = `
html, body { margin: 0; min-height: 100%; }
body { font-family: system-ui, -apple-system, sans-serif; background: #fff; color: #111; }
section[data-agentwe-section] { position: relative; }
.agentwe-new { animation: agentwe-in 0.7s cubic-bezier(0.2, 0.8, 0.2, 1); outline: 2px solid #c8ff00; outline-offset: -2px; }
.agentwe-new::after {
  content: attr(data-agentwe-label); position: absolute; top: 8px; right: 8px; z-index: 9999;
  padding: 4px 10px; border-radius: 999px; background: #c8ff00; color: #111;
  font: 600 11px system-ui, sans-serif;
}
#agentwe-ghost {
  margin: 16px; padding: 28px; border: 1px dashed #c8cdd2; border-radius: 12px;
  color: #6b7280; font: 500 13px system-ui, sans-serif; text-align: center;
  animation: agentwe-pulse 1.6s ease-in-out infinite;
}
@keyframes agentwe-in { from { opacity: 0; transform: translateY(24px) scale(0.985); } }
@keyframes agentwe-pulse { 50% { opacity: 0.45; } }
@media (prefers-reduced-motion: reduce) { .agentwe-new, #agentwe-ghost { animation: none; } }
`;

export function previewDocument() {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="Content-Security-Policy" content="${PREVIEW_POLICY}"><style>${chrome}</style></head><body><div id="agentwe-root"></div><div id="agentwe-ghost" hidden></div><script>${runtime}</script></body></html>`;
}
