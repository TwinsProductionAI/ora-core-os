import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const CANON_ORDER = ["IDX", "TAG", "HASH", "MAP", "ROUTE", "PACK", "STAT", "LINK"];
const STATE_RISK_UQ_RE = /\bSTATE\s*\((?=[^)]*\brisk\b)(?=[^)]*\buq\b)[^)]*\)/i;
const PRIMITIVE_RE = /^\s*([A-Z_]+)\s*\(/;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modulePath = path.resolve(__dirname, "../modules/M21_GL_G.gpv2.json");

function loadM21() {
  const raw = fs.readFileSync(modulePath, "utf8").replace(/^\uFEFF/, "");
  return JSON.parse(raw).GPV2;
}

function walkPayloadStrings(value, currentPath = []) {
  if (Array.isArray(value)) {
    return value.flatMap((nested, index) => walkPayloadStrings(nested, [...currentPath, String(index)]));
  }

  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, nested]) => {
      const keyUpper = key.toUpperCase();
      if (keyUpper.includes("POLICY") || keyUpper.includes("DEPRECATED")) {
        return [];
      }
      return walkPayloadStrings(nested, [...currentPath, key]);
    });
  }

  return typeof value === "string" ? [[currentPath, value]] : [];
}

function primitiveName(token) {
  const match = PRIMITIVE_RE.exec(token);
  return match ? match[1] : null;
}

function assertNoDeprecatedState(module) {
  const errors = [];
  for (const [payloadPath, text] of walkPayloadStrings(module)) {
    if (STATE_RISK_UQ_RE.test(text)) {
      errors.push(`Deprecated STATE(risk,uq) in GL_G payload at ${payloadPath.join(".")}`);
    }
  }
  return errors;
}

function assertCanonOrder(module) {
  const errors = [];
  const canon = module.MODULE.CANON.GL_G_PRIMITIVE_ORDER;
  if (JSON.stringify(canon) !== JSON.stringify(CANON_ORDER)) {
    errors.push(`GL_G_PRIMITIVE_ORDER is ${JSON.stringify(canon)}, expected ${JSON.stringify(CANON_ORDER)}`);
  }

  const rank = new Map(CANON_ORDER.map((name, index) => [name, index]));
  for (const payload of module.MODULE.GL_G_CANON_PAYLOADS ?? []) {
    const known = (payload.ITEMS ?? []).map(primitiveName).filter((name) => rank.has(name));
    const sorted = [...known].sort((a, b) => rank.get(a) - rank.get(b));
    if (JSON.stringify(known) !== JSON.stringify(sorted)) {
      errors.push(`${payload.NAME ?? "<unnamed>"} order is ${JSON.stringify(known)}, expected canon order`);
    }
  }
  return errors;
}

function assertHashForStableCache(module) {
  const errors = [];
  for (const payload of module.MODULE.GL_G_CANON_PAYLOADS ?? []) {
    if (payload.CACHE !== "STABLE") {
      continue;
    }
    const primitives = new Set((payload.ITEMS ?? []).map(primitiveName));
    if (!primitives.has("HASH")) {
      errors.push(`Stable cache payload ${payload.NAME ?? "<unnamed>"} has no HASH`);
    }
  }
  return errors;
}

const m21 = loadM21();
const errors = [
  ...assertNoDeprecatedState(m21),
  ...assertCanonOrder(m21),
  ...assertHashForStableCache(m21),
];

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`FAIL: ${error}`);
  }
  process.exit(1);
}

console.log("OK: M21 GL_G canon validation passed");
