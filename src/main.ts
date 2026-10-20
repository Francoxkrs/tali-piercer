import { splitText } from "./split.js";
import { runLoader } from "./loader.js";
import { initFairyDust } from "./fairy.js";
import { initNav } from "./nav.js";
import { initFaq, initServices } from "./services.js";
import {
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
initServices();
initFaq();
initScrub();
initParallax();
initMagnetic();
initHorizontalGallery();
initFairyDust();

qsa("[data-year]").forEach((el) => (el.textContent = String(new Date().getFullYear())));

runLoader().then(initReveal);
