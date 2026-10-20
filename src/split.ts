import { qsa } from "./utils.js";

/** Quebra [data-chars] em letras e [data-scrub] em palavras, para animar uma a uma. */
export function splitText(): void {
  qsa("[data-chars]").forEach((el) => {
    const text = el.textContent ?? "";
    el.textContent = "";
    [...text].forEach((ch, i) => {
      const span = document.createElement("span");
      span.className = "char";
      span.style.setProperty("--i", String(i));
      span.textContent = ch === " " ? " " : ch;
      el.append(span);
    });
  });

  qsa("[data-scrub]").forEach((el) => {
    const walk = (node: Node): void => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          (child.textContent ?? "").split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.append(part);
            } else {
              const w = document.createElement("span");
              w.className = "w";
              w.textContent = part;
              frag.append(w);
            }
          });
          child.replaceWith(frag);
        } else {
          walk(child);
        }
      });
    };
    walk(el);
  });

  // Atraso entre as linhas do título principal
  qsa(".hero__line").forEach((line, i) => line.style.setProperty("--d", `${i * 140}ms`));
}
