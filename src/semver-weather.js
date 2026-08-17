#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const https = require("node:https");
const { spawn } = require("node:child_process");

const MAX_PACKUMENT_BYTES = 16 * 1024 * 1024;
const DEFAULT_OUTPUT_BYTES = 64 * 1024;
const STAGES = ["install", "build", "test"];
const VERSION = "0.1.0";

function sortJson(value) {
  if (Array.isArray(value)) return value.map(sortJson);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, sortJson(value[key])]),
    );
  }
  return value;
}

function canonicalStringify(value) {
  return `${JSON.stringify(sortJson(value), null, 2)}\n`;
}

function parseCutoff(raw) {
  if (typeof raw !== "string" || !raw.trim()) throw new Error("cutoff must be a date string");
  const text = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? `${raw}T23:59:59.999Z` : raw;
  const milliseconds = Date.parse(text);
  if (!Number.isFinite(milliseconds)) throw new Error(`invalid cutoff: ${raw}`);
  return { milliseconds, iso: new Date(milliseconds).toISOString() };
}

function filterPackument(packument, cutoffRaw) {
  if (!packument || typeof packument !== "object" || Array.isArray(packument)) {
    throw new Error("packument must be a JSON object");
  }
  const versions = packument.versions;
  const times = packument.time;
  if (!versions || typeof versions !== "object" || !times || typeof times !== "object") {
    throw new Error("packument must contain object-valued versions and time fields");
  }

  const cutoff = parseCutoff(cutoffRaw);
  const retained = [];
  for (const version of Object.keys(versions).sort()) {
    const published = Date.parse(times[version]);
    if (Number.isFinite(published) && published <= cutoff.milliseconds) {
      retained.push({ version, published });
    }
  }
  const retainedSet = new Set(retained.map(({ version }) => version));
  const filtered = { ...packument };
  filtered.versions = Object.fromEntries(
    Object.keys(versions).sort().filter((version) => retainedSet.has(version)).map((version) => [version, versions[version]]),
  );

  filtered.time = Object.fromEntries(
    Object.keys(times).sort().filter((key) => {
      if (retainedSet.has(key)) return true;
      if (key !== "created" && key !== "modified") return false;
      const timestamp = Date.parse(times[key]);
      return Number.isFinite(timestamp) && timestamp <= cutoff.milliseconds;
    }).map((key) => [key, times[key]]),
  );

  const tags = packument["dist-tags"] && typeof packument["dist-tags"] === "object"
    ? packument["dist-tags"]
    : {};
  filtered["dist-tags"] = Object.fromEntries(
    Object.keys(tags).sort().filter((tag) => retainedSet.has(tags[tag])).map((tag) => [tag, tags[tag]]),
  );
  if (retained.length && !filtered["dist-tags"].latest) {
    // ponytail: npm exposes publication times but not tag history; v0 uses the
    // newest retained publication until a registry with tag events is available.
    retained.sort((a, b) => a.published - b.published || a.version.localeCompare(b.version));
    filtered["dist-tags"].latest = retained.at(-1).version;
  }
  return sortJson(filtered);
}

function readJson(filename) {
  try {
    return JSON.parse(fs.readFileSync(filename, "utf8"));
  } catch (error) {
    throw new Error(`cannot read JSON ${filename}: ${error.message}`);
  }
}

function writeText(filename, text) {
  if (filename === "-") {
    process.stdout.write(text);
    return;
  }
  fs.mkdirSync(path.dirname(path.resolve(filename)), { recursive: true });
  fs.writeFileSync(filename, text, "utf8");
}

function requestBuffer(url, redirects = 3) {
  return new Promise((resolve, reject) => {
    const client = url.protocol === "https:" ? https : url.protocol === "http:" ? http : null;
    if (!client) return reject(new Error(`unsupported upstream protocol: ${url.protocol}`));
    const request = client.get(url, { headers: { accept: "application/json", "accept-encoding": "identity", "user-agent": "semver-weather/0" } }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        response.resume();
        if (!redirects) return reject(new Error("too many upstream redirects"));
        return requestBuffer(new URL(response.headers.location, url), redirects - 1).then(resolve, reject);
      }
      const chunks = [];
      let size = 0;
      response.on("data", (chunk) => {
        size += chunk.length;
        if (size > MAX_PACKUMENT_BYTES) {
          request.destroy(new Error("upstream response exceeds 16 MiB"));
          return;
        }
        chunks.push(chunk);
      });
      response.on("end", () => resolve({ status: response.statusCode || 502, headers: response.headers, body: Buffer.concat(chunks) }));
    });
    request.setTimeout(30_000, () => request.destroy(new Error("upstream request timed out")));
    request.on("error", reject);
  });
}

function createProxyServer({ upstream, getCutoff }) {
  const base = new URL(upstream);
  return http.createServer(async (request, response) => {
    try {
      if (request.method !== "GET" && request.method !== "HEAD") {
        response.writeHead(405, { allow: "GET, HEAD", "content-type": "application/json" });
        response.end('{"error":"only packument GET/HEAD requests are supported"}\n');
        return;
      }
      const target = new URL(request.url || "/", base);
      if (target.origin !== base.origin) throw new Error("invalid proxy target");
      const upstreamResponse = await requestBuffer(target);
      let body = upstreamResponse.body;
      let contentType = upstreamResponse.headers["content-type"] || "application/octet-stream";
      if (request.method === "GET" && upstreamResponse.status >= 200 && upstreamResponse.status < 300) {
        try {
          const parsed = JSON.parse(body.toString("utf8"));
          if (parsed && parsed.versions && parsed.time) {
            body = Buffer.from(canonicalStringify(filterPackument(parsed, getCutoff())), "utf8");
            contentType = "application/json; charset=utf-8";
          }
        } catch (error) {
          if (String(contentType).includes("json")) throw new Error(`invalid upstream packument: ${error.message}`);
        }
      }
      response.writeHead(upstreamResponse.status, {
        "content-type": contentType,
        "content-length": request.method === "HEAD" ? upstreamResponse.headers["content-length"] || 0 : body.length,
        "cache-control": "no-store",
      });
      response.end(request.method === "HEAD" ? undefined : body);
    } catch (error) {
      const body = Buffer.from(canonicalStringify({ error: error.message }), "utf8");
      response.writeHead(502, { "content-type": "application/json; charset=utf-8", "content-length": body.length });
      response.end(body);
    }
  });
}

function listen(server, port, host = "127.0.0.1") {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => {
      server.off("error", reject);
      resolve(server.address());
    });
  });
}

function close(server) {
  return new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}

function expandDates(config, onlyDate) {
  if (onlyDate) return [parseCutoff(onlyDate).iso.slice(0, 10)];
  if (Array.isArray(config.dates) && config.dates.length) {
    return [...new Set(config.dates.map((value) => parseCutoff(value).iso.slice(0, 10)))].sort();
  }
  const sampling = config.sampling;
  if (!sampling || !sampling.start || !sampling.end) throw new Error("manifest needs dates[] or sampling.start/end");
  const start = Date.parse(`${parseCutoff(sampling.start).iso.slice(0, 10)}T00:00:00.000Z`);
  const end = Date.parse(`${parseCutoff(sampling.end).iso.slice(0, 10)}T00:00:00.000Z`);
  const stepDays = Number(sampling.stepDays || 1);
  if (!Number.isInteger(stepDays) || stepDays < 1) throw new Error("sampling.stepDays must be a positive integer");
  if (start > end) throw new Error("sampling.start must not be after sampling.end");
  const dates = [];
  for (let cursor = start; cursor <= end; cursor += stepDays * 86_400_000) {
    dates.push(new Date(cursor).toISOString().slice(0, 10));
  }
  return dates;
}

function commandSpec(raw, stage) {
  if (raw === undefined || raw === null) return null;
  const spec = Array.isArray(raw) ? { argv: raw } : raw;
  if (!spec || !Array.isArray(spec.argv) || !spec.argv.length || spec.argv.some((value) => typeof value !== "string")) {
    throw new Error(`commands.${stage} must be an argv string array or { argv, timeoutMs }`);
  }
  const timeoutMs = Number(spec.timeoutMs || 120_000);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1) throw new Error(`commands.${stage}.timeoutMs must be positive`);
  return { argv: spec.argv, timeoutMs };
}

function substitute(argv, values) {
  return argv.map((part) => part.replaceAll("{date}", values.date).replaceAll("{registry}", values.registry || ""));
}

function capture(limit) {
  let value = Buffer.alloc(0);
  let truncated = false;
  return {
    add(chunk) {
      if (value.length >= limit) { truncated = true; return; }
      const remaining = limit - value.length;
      if (chunk.length > remaining) truncated = true;
      value = Buffer.concat([value, chunk.subarray(0, remaining)]);
    },
    result() { return { text: value.toString("utf8"), truncated }; },
  };
}

function runCommand(argv, options) {
  return new Promise((resolve) => {
    const stdout = capture(options.maxOutputBytes);
    const stderr = capture(options.maxOutputBytes);
    let timedOut = false;
    let spawnError = null;
    const child = spawn(argv[0], argv.slice(1), { cwd: options.cwd, env: options.env, shell: false, stdio: ["ignore", "pipe", "pipe"] });
    child.stdout.on("data", (chunk) => stdout.add(chunk));
    child.stderr.on("data", (chunk) => stderr.add(chunk));
    child.on("error", (error) => { spawnError = error.message; });
    let forceTimer = null;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
      forceTimer = setTimeout(() => child.kill("SIGKILL"), 2_000);
    }, options.timeoutMs);
    child.on("close", (code, signal) => {
      clearTimeout(timer);
      if (forceTimer) clearTimeout(forceTimer);
      const out = stdout.result();
      const err = stderr.result();
      resolve({
        status: spawnError || timedOut || code !== 0 ? "failed" : "passed",
        exitCode: code,
        signal,
        failureKind: spawnError ? "spawn" : timedOut ? "timeout" : code !== 0 ? "exit" : null,
        error: spawnError,
        stdout: out.text,
        stderr: err.text,
        outputTruncated: out.truncated || err.truncated,
      });
    });
  });
}

function shellQuote(value) {
  return /^[A-Za-z0-9_./:=+-]+$/.test(value) ? value : `'${value.replaceAll("'", `'\\''`)}'`;
}

async function runSampling(manifestPath, options = {}) {
  const absoluteManifest = path.resolve(manifestPath);
  const manifest = readJson(absoluteManifest);
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) throw new Error("manifest must be a JSON object");
  const baseDir = path.dirname(absoluteManifest);
  if (manifest.cwd !== undefined && typeof manifest.cwd !== "string") throw new Error("manifest.cwd must be a string");
  const cwd = path.resolve(baseDir, manifest.cwd || ".");
  const dates = expandDates(manifest, options.onlyDate);
  const rawCommands = manifest.commands || {};
  if (!rawCommands || typeof rawCommands !== "object" || Array.isArray(rawCommands)) throw new Error("manifest.commands must be an object");
  const commands = Object.fromEntries(STAGES.map((stage) => [stage, commandSpec(rawCommands[stage], stage)]));
  const extraEnv = manifest.env || {};
  if (!extraEnv || typeof extraEnv !== "object" || Array.isArray(extraEnv)) throw new Error("manifest.env must be an object");
  const maxOutputBytes = Number(manifest.maxOutputBytes || DEFAULT_OUTPUT_BYTES);
  if (!Number.isInteger(maxOutputBytes) || maxOutputBytes < 0 || maxOutputBytes > 1024 * 1024) {
    throw new Error("maxOutputBytes must be an integer between 0 and 1048576");
  }

  let activeCutoff = dates[0];
  let proxy = null;
  let registry = "";
  const upstream = manifest.registry && manifest.registry.upstream;
  if (upstream) {
    if (!options.allowNetwork) throw new Error("registry access is disabled; pass --allow-network explicitly");
    proxy = createProxyServer({ upstream, getCutoff: () => activeCutoff });
    const address = await listen(proxy, 0);
    registry = `http://127.0.0.1:${address.port}/`;
  }

  const samples = [];
  try {
    for (const date of dates) {
      activeCutoff = date;
      const stages = {};
      let failedStage = null;
      for (const stage of STAGES) {
        const spec = commands[stage];
        if (!spec || failedStage) {
          stages[stage] = { status: spec ? "blocked" : "skipped" };
          continue;
        }
        const argv = substitute(spec.argv, { date, registry });
        const env = {
          ...process.env,
          ...Object.fromEntries(Object.entries(extraEnv).map(([key, value]) => [key, String(value)])),
          SEMVER_WEATHER_DATE: date,
          SEMVER_WEATHER_NETWORK: options.allowNetwork ? "1" : "0",
          npm_config_audit: "false",
          npm_config_fund: "false",
        };
        if (registry) env.npm_config_registry = registry;
        if (!options.allowNetwork) env.npm_config_offline = "true";
        stages[stage] = { argv, ...await runCommand(argv, { cwd, env, timeoutMs: spec.timeoutMs, maxOutputBytes }) };
        if (stages[stage].status === "failed") failedStage = stage;
      }
      const command = `node src/semver-weather.js run ${shellQuote(path.relative(process.cwd(), absoluteManifest) || path.basename(absoluteManifest))} --date ${date}${options.allowNetwork ? " --allow-network" : ""}`;
      samples.push({ date, classification: failedStage ? `${failedStage}-failure` : "pass", failedStage, stages, reproCommand: command });
    }
  } finally {
    if (proxy) await close(proxy);
  }
  return sortJson({
    schemaVersion: 1,
    name: String(manifest.name || path.basename(absoluteManifest, path.extname(absoluteManifest))),
    runtime: { node: process.version },
    networkEnabled: Boolean(options.allowNetwork),
    samples,
  });
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function renderHtml(result) {
  if (!result || !Array.isArray(result.samples)) throw new Error("result JSON must contain samples[]");
  const cards = result.samples.map((sample, index) => {
    const pass = sample.classification === "pass";
    const stages = STAGES.map((stage) => `<li><strong>${stage}</strong>: ${escapeHtml((sample.stages[stage] || {}).status || "unknown")}</li>`).join("");
    const headingId = `sample-${index + 1}`;
    return `<article class="day ${pass ? "pass" : "fail"}" aria-labelledby="${headingId}"><h3 id="${headingId}"><span aria-hidden="true">${pass ? "☀" : "⛈"}</span><span class="sr-only">${pass ? "Passing" : "Failing"} sample:</span> ${escapeHtml(sample.date)}</h3><p class="classification"><span class="sr-only">Classification: </span>${escapeHtml(sample.classification)}</p><h4>Stages</h4><ul>${stages}</ul><h4>Reproduce</h4><pre tabindex="0" aria-label="Reproduction command for ${escapeHtml(sample.date)}"><code>${escapeHtml(sample.reproCommand || "")}</code></pre></article>`;
  }).join("\n");
  const passed = result.samples.filter((sample) => sample.classification === "pass").length;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'"><title>${escapeHtml(result.name)} — Semver Weather</title><style>
:root{font-family:ui-sans-serif,system-ui,sans-serif;color:#172033;background:#f4f7fb}body{max-width:1100px;margin:auto;padding:2rem;line-height:1.5}.skip-link{position:absolute;left:-9999px;top:auto}.skip-link:focus{left:1rem;top:1rem;background:#fff;color:#111827;padding:.75rem;z-index:1;outline:3px solid #174ea6}header{margin-bottom:1.5rem}.calendar{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1rem}.day{background:white;border:1px solid #9ca9ba;border-radius:12px;padding:1rem;box-shadow:0 2px 8px #2334}.pass{border-top:6px solid #087f5b}.fail{border-top:6px solid #b4233a}h1,h2,h3,h4{margin-top:0}.classification{font-weight:700}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#111827;color:#f9fafb;padding:.75rem;border-radius:8px}pre:focus-visible{outline:3px solid #f59e0b;outline-offset:3px}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}footer{margin-top:2rem;color:#435066}</style></head><body>
<a class="skip-link" href="#main-content">Skip to report</a><header><h1>${escapeHtml(result.name)} dependency weather</h1><p>${passed}/${result.samples.length} sampled dates passed install, build, and test.</p></header><main id="main-content"><section aria-labelledby="calendar-heading"><h2 id="calendar-heading">Sampled dates</h2><div class="calendar">${cards}</div></section></main><footer>Static report generated by Semver Weather. No remote assets or scripts.</footer></body></html>\n`;
}

function parseArgs(argv) {
  const positionals = [];
  const flags = {};
  const booleans = new Set(["allow-network", "help", "version"]);
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) { positionals.push(token); continue; }
    const key = token.slice(2);
    if (booleans.has(key)) { flags[key] = true; continue; }
    const value = argv[index + 1];
    if (value === undefined || value.startsWith("--")) throw new Error(`missing value for --${key}`);
    flags[key] = value;
    index += 1;
  }
  return { positionals, flags };
}

function usage() {
  return `Semver Weather (private MVP)

Usage:
  semver-weather filter PACKUMENT.json --cutoff DATE [--output FILE|-]
  semver-weather proxy --cutoff DATE --allow-network [--upstream URL] [--port PORT]
  semver-weather run MANIFEST.json [--date DATE] [--json FILE] [--html FILE] [--allow-network]
  semver-weather render RESULT.json --output REPORT.html

Network-backed proxying is refused unless --allow-network is present.\n`;
}

async function main(argv = process.argv.slice(2)) {
  const { positionals, flags } = parseArgs(argv);
  const command = positionals[0];
  if (flags.version) { process.stdout.write(`${VERSION}\n`); return; }
  if (!command || flags.help) { process.stdout.write(usage()); return; }
  if (command === "filter") {
    if (!positionals[1] || !flags.cutoff) throw new Error("filter needs PACKUMENT.json and --cutoff");
    writeText(flags.output || "-", canonicalStringify(filterPackument(readJson(positionals[1]), flags.cutoff)));
    return;
  }
  if (command === "proxy") {
    if (!flags["allow-network"]) throw new Error("proxy network access is disabled; pass --allow-network explicitly");
    if (!flags.cutoff) throw new Error("proxy needs --cutoff");
    parseCutoff(flags.cutoff);
    const port = Number(flags.port || 4873);
    if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error("--port must be 0..65535");
    const server = createProxyServer({ upstream: flags.upstream || "https://registry.npmjs.org/", getCutoff: () => flags.cutoff });
    const address = await listen(server, port);
    process.stdout.write(`Semver Weather proxy listening at http://127.0.0.1:${address.port}/ for cutoff ${parseCutoff(flags.cutoff).iso}\n`);
    return;
  }
  if (command === "run") {
    if (!positionals[1]) throw new Error("run needs MANIFEST.json");
    const result = await runSampling(positionals[1], { allowNetwork: Boolean(flags["allow-network"]), onlyDate: flags.date });
    writeText(flags.json || "weather.json", canonicalStringify(result));
    writeText(flags.html || "weather.html", renderHtml(result));
    return;
  }
  if (command === "render") {
    if (!positionals[1] || !flags.output) throw new Error("render needs RESULT.json and --output");
    writeText(flags.output, renderHtml(readJson(positionals[1])));
    return;
  }
  throw new Error(`unknown command: ${command}`);
}

if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(`semver-weather: ${error.message}\n`);
    process.exitCode = 1;
  });
}

module.exports = { canonicalStringify, expandDates, filterPackument, main, parseCutoff, renderHtml, runSampling };
