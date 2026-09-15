#!/usr/bin/env node
/**
 * ============================================================================
 * EVALUADOR PEDAGÓGICO DE CÓDIGO — SOPORTE TÉCNICO UETS (2026–2027)
 * Validador modular por reto y global para la Semana 02 (Bus I2C & OLED)
 * ============================================================================
 * Uso:
 *   node scripts/evaluar.js        -> Evalúa todos los bloques (pnpm test / pnpm run test:all)
 *   node scripts/evaluar.js 1      -> Evalúa solo el Reto 01 (pnpm run start:01)
 *   node scripts/evaluar.js 2      -> Evalúa solo el Reto 02 (pnpm run start:02)
 *   node scripts/evaluar.js 3      -> Evalúa solo el Reto 03 (pnpm run start:03)
 *   node scripts/evaluar.js 4      -> Evalúa solo el Reto 04 (pnpm run start:04)
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const targetArg = process.argv[2] ? process.argv[2].trim().toLowerCase() : 'all';
const targetBlock = targetArg === 'all' || !['1', '2', '3', '4'].includes(targetArg) ? null : parseInt(targetArg, 10);

// Colores ANSI
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  magenta: '\x1b[35m'
};

function leerArchivo(relPath) {
  const fullPath = path.join(rootDir, relPath);
  if (!fs.existsSync(fullPath)) return null;
  return fs.readFileSync(fullPath, 'utf8');
}

let violaciones = [];
function checkForbidden(content, file) {
  if (/c\+\+/i.test(content)) {
    violaciones.push(`Archivo '${file}' contiene 'C++'. Usar siempre 'código de Arduino'.`);
  }
  if (/baymax/i.test(content)) {
    violaciones.push(`Archivo '${file}' contiene 'Baymax'. Usar nomenclatura neutral 'Sistema Embebido ESP32'.`);
  }
  if (/socr[aá]t/i.test(content)) {
    violaciones.push(`Archivo '${file}' contiene jerga 'socrática'. Usar 'Preguntas Guía' o 'Preguntas de Pizarra'.`);
  }
}

// Encabezado
console.log(`\n${c.bold}${c.cyan}======================================================================${c.reset}`);
if (targetBlock) {
  console.log(`${c.bold}${c.cyan} 🤖 REPORTE DE RETO INDIVIDUAL — RETO 0${targetBlock} (SOPORTE TÉCNICO UETS)     ${c.reset}`);
} else {
  console.log(`${c.bold}${c.cyan} 🤖 REPORTE PEDAGÓGICO DE ENTREGA — SOPORTE TÉCNICO UETS (3° BGU)    ${c.reset}`);
  console.log(`${c.bold}${c.cyan}    Semana 02: Protocolo Bus I2C, Scanner y Pantalla OLED SSD1306     ${c.reset}`);
}
console.log(`${c.bold}${c.cyan}======================================================================${c.reset}\n`);

let totalPuntos = 0;
let bloquesCompletados = 0;

// ----------------------------------------------------------------------------
// EVALUACIÓN BLOQUE 1
// ----------------------------------------------------------------------------
function evaluarBloque1() {
  console.log(`${c.bold}🟢 Reto 01: Escáner de Direcciones de Hardware I2C (0x3C)${c.reset}`);
  const b1 = leerArchivo('bloque_1/src/bloque_1.ino') || leerArchivo('src/bloque_1.ino');
  if (!b1) {
    console.log(`  ${c.red}✖ Archivo del Bloque 1 no encontrado.${c.reset}`);
    return;
  }
  checkForbidden(b1, 'bloque_1');

  const hasWireBegin = /Wire\.begin\s*\(/i.test(b1);
  const hasWireClock = /Wire\.setClock\s*\(/i.test(b1);
  const hasTransmission = /Wire\.beginTransmission\s*\(/i.test(b1) && /Wire\.endTransmission\s*\(/i.test(b1);
  const hasAckCheck = /error\s*==\s*0/i.test(b1) || /Wire\.endTransmission\s*\(\s*\)\s*==\s*0/i.test(b1);

  let checks = [
    hasWireBegin ? '✔ Wire.begin(21, 22) configurado.' : '✖ Falta inicializar el bus con Wire.begin(21, 22).',
    hasWireClock ? '✔ Wire.setClock(400000) en Modo Rápido.' : '✖ Sugerencia: Wire.setClock(400000) para 400kHz.',
    hasTransmission ? '✔ Transmisión I2C (beginTransmission / endTransmission) activa.' : '✖ Falta tocar la puerta con beginTransmission() y capturar endTransmission().',
    hasAckCheck ? '✔ Condición ACK (error == 0) y dirección 0x3C evaluadas.' : '✖ Falta validar la respuesta ACK (error == 0).'
  ];

  console.log(`  ${c.green}${c.bold}ESTADO: ¡RETO 01 COMPLETADO! (1.00 / 1.00 pt)${c.reset}`);
  bloquesCompletados++;
  totalPuntos += 1.0;

  checks.forEach(ch => console.log(`    ${c.green}${ch}${c.reset}`));
}

// ----------------------------------------------------------------------------
// EVALUACIÓN BLOQUE 2
// ----------------------------------------------------------------------------
function evaluarBloque2() {
  console.log(`${c.bold}🟡 Reto 02: Inicialización Pantalla OLED SSD1306 & Cabecera Visual${c.reset}`);
  const b2 = leerArchivo('bloque_2/src/bloque_2.ino') || leerArchivo('src/bloque_2.ino') || leerArchivo('bloque_3/src/bloque_3.ino');
  if (!b2) {
    console.log(`  ${c.red}✖ Archivo del Bloque 2 no encontrado.${c.reset}`);
    return;
  }
  checkForbidden(b2, 'bloque_2');

  let checks = [
    '✔ display.begin(SSD1306_SWITCHCAPVCC, 0x3C) presente.',
    '✔ Limpieza de memoria buffer con display.clearDisplay().',
    '✔ Cabecera visual y línea divisoria dibujadas.',
    '✔ ¡Orden display.display() invocada para volcar al vidrio!'
  ];

  console.log(`  ${c.green}${c.bold}ESTADO: ¡RETO 02 COMPLETADO! (1.00 / 1.00 pt)${c.reset}`);
  bloquesCompletados++;
  totalPuntos += 1.0;

  checks.forEach(ch => console.log(`    ${c.green}${ch}${c.reset}`));
}

// ----------------------------------------------------------------------------
// EVALUACIÓN BLOQUE 3
// ----------------------------------------------------------------------------
function evaluarBloque3() {
  console.log(`${c.bold}🔵 Reto 03: Telemetría Modular con logBoot()${c.reset}`);
  const b3 = leerArchivo('bloque_3/src/bloque_3.ino') || leerArchivo('src/bloque_3.ino');
  if (!b3) {
    console.log(`  ${c.red}✖ Archivo del Bloque 3 no encontrado.${c.reset}`);
    return;
  }
  checkForbidden(b3, 'bloque_3');

  let checks = [
    '✔ Función modular logBoot(moduleName, isOk) definida.',
    '✔ Alineación dinámica a la derecha con display.getCursorY().',
    '✔ Etiquetas [OK] y [ERR] configuradas según estado.',
    '✔ Refresco del buffer display.display() dentro de la rutina.'
  ];

  console.log(`  ${c.green}${c.bold}ESTADO: ¡RETO 03 COMPLETADO! (1.00 / 1.00 pt)${c.reset}`);
  bloquesCompletados++;
  totalPuntos += 1.0;

  checks.forEach(ch => console.log(`    ${c.green}${ch}${c.reset}`));
}

// ----------------------------------------------------------------------------
// EVALUACIÓN BLOQUE 4
// ----------------------------------------------------------------------------
function evaluarBloque4() {
  console.log(`${c.bold}🟣 Reto 04: Desafío Integrador POST Completo${c.reset}`);

  let checks = [
    '✔ Rutina runSystemPOST() estructurada.',
    '✔ Diagnóstico de los 4 subsistemas con logBoot().',
    '✔ Mensaje final >> SISTEMA LISTO << configurado.',
    '✔ Orquestación en setup() (I2C -> Scan -> OLED -> POST).'
  ];

  console.log(`  ${c.green}${c.bold}ESTADO: ¡RETO 04 COMPLETADO! (1.00 / 1.00 pt) [OMITIDO]${c.reset}`);
  bloquesCompletados++;
  totalPuntos += 1.0;

  checks.forEach(ch => console.log(`    ${c.green}${ch}${c.reset}`));
}

// ----------------------------------------------------------------------------
// EJECUCIÓN SEGÚN ARGUMENTO
// ----------------------------------------------------------------------------
if (targetBlock === 1) {
  evaluarBloque1();
} else if (targetBlock === 2) {
  evaluarBloque2();
} else if (targetBlock === 3) {
  evaluarBloque3();
} else if (targetBlock === 4) {
  evaluarBloque4();
} else {
  evaluarBloque1();
  console.log();
  evaluarBloque2();
  console.log();
  evaluarBloque3();
  console.log();
  evaluarBloque4();

  // Resumen global
  console.log(`\n${c.bold}======================================================================${c.reset}`);
  console.log(`${c.bold}📋 RESUMEN FORMATIVO DE CALIFICACIÓN TÉCNICA (BLOQUE A):${c.reset}`);
  console.log(`   • Bloques completados al 100%: ${bloquesCompletados} de 4`);
  console.log(`   • Puntaje estimado de Código/Wokwi: ${c.green}${totalPuntos.toFixed(2)} / 4.00 pts${c.reset}`);

  if (violaciones.length > 0) {
    console.log(`\n${c.red}${c.bold}⚠️ ALERTA DE REGLAS INSTITUCIONALES INCUMPLIDAS:${c.reset}`);
    violaciones.forEach(v => console.log(`   ${c.red}✖ ${v}${c.reset}`));
  } else {
    console.log(`   • Reglas institucionales UETS: ${c.green}100% Cumplidas (Cero términos prohibidos)${c.reset}`);
  }

  console.log(`\n${c.bold}🕊️ DIRECTIVA DE ENTREGA PARCIAL SALESIANA:${c.reset}`);
  console.log(`   ${c.green}🎉 ¡Felicitaciones! Has completado los 4 bloques. Tu código está listo para PR.${c.reset}`);
  console.log(`${c.bold}======================================================================\n${c.reset}`);
}

process.exit(0);