import { splitText } from "./split.js";
import { runLoader } from "./loader.js";
import { initFairyDust } from "./fairy.js";
import { initNav } from "./nav.js";
import { initFaq } from "./faq.js";
import { initHours } from "./hours.js";
import { initExplorer } from "./catalog/explorer.js";
import {
  initFab,
  initHorizontalGallery,
  initMagnetic,
  initMarquee,
  initParallax,
  initReveal,
  initScrub,
} from "./motion.js";
import { qsa } from "./utils.js";

document.documentElement.classList.remove("no-js");

splitText();
initMarquee();
initNav();
initExplorer();
initFaq();
initHours();
initScrub();
initParallax();
initMagnetic();
initHorizontalGallery();
initFab();
initFairyDust();

qsa("[data-year]").forEach((el) => (el.textContent = String(new Date().getFullYear())));

runLoader().then(initReveal);
