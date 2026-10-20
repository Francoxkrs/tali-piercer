import { qs } from "./utils.js";

// Horário da Tali (fuso de Campo Grande/MS). Cada dia: [abre entre, fecha entre] em minutos.
// Ex.: seg a sex abre entre 10h e 11h e fecha entre 18h e 20h.
type Faixa = { abre: [number, number]; fecha: [number, number] };
const h = (n: number): number => n * 60;
const SEMANA: Faixa = { abre: [h(10), h(11)], fecha: [h(18), h(20)] };
const SABADO: Faixa = { abre: [h(10), h(12)], fecha: [h(14), h(18)] };
const HORARIO: Record<number, Faixa | null> = { 0: null, 1: SEMANA, 2: SEMANA, 3: SEMANA, 4: SEMANA, 5: SEMANA, 6: SABADO };

/** Selo "aberto agora?" calculado no horário de Campo Grande. */
export function initHours(): void {
  const el = qs("[data-status]");
  if (!el) return;

  const update = (): void => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Campo_Grande",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h23",
    }).formatToParts(new Date());
    const get = (t: string): string => parts.find((p) => p.type === t)?.value ?? "0";
    const dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    const agora = Number(get("hour")) * 60 + Number(get("minute"));
    const faixa = HORARIO[dia];

    let estado: "aberto" | "talvez" | "fechado" = "fechado";
    if (faixa) {
      if (agora >= faixa.abre[1] && agora < faixa.fecha[0]) estado = "aberto";
      else if (agora >= faixa.abre[0] && agora < faixa.fecha[1]) estado = "talvez";
    }
    const textos = {
      aberto: "atendendo agora",
      talvez: "pode estar atendendo agora, confirma no whats",
      fechado: "fora do horário agora, mas pode mandar mensagem",
    };
    el.dataset.state = estado;
    el.textContent = textos[estado];
  };
  update();
  window.setInterval(update, 60_000);
}
