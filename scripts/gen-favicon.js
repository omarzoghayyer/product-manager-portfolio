/**
 * Generates public/favicon.png — pure Node.js, no dependencies.
 * Draws an OZ monogram: O as an ellipse ring (left), Z geometric (right/overlapping).
 */
const zlib = require("zlib");
const fs = require("fs");
const path = require("path");

const W = 128, H = 128;
const px = new Uint8Array(W * H * 4); // RGBA, default 0 (transparent)

const BLUE = [59, 130, 246]; // #3b82f6

function setPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const i = (y * W + x) * 4;
  // alpha-blend over existing pixel
  const srcA = a / 255, dstA = px[i + 3] / 255;
  const outA = srcA + dstA * (1 - srcA);
  if (outA === 0) return;
  px[i]     = (r * srcA + px[i]     * dstA * (1 - srcA)) / outA;
  px[i + 1] = (g * srcA + px[i + 1] * dstA * (1 - srcA)) / outA;
  px[i + 2] = (b * srcA + px[i + 2] * dstA * (1 - srcA)) / outA;
  px[i + 3] = outA * 255;
}

// --- Draw O as an anti-aliased ellipse ring ---
// Center (40, 62), outer radii (33, 44), stroke 10
const oCx = 40, oCy = 62, oRxOut = 33, oRyOut = 44, oStroke = 10;
const oRxIn = oRxOut - oStroke, oRyIn = oRyOut - oStroke;

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const dx = x - oCx, dy = y - oCy;
    const outerD = Math.sqrt((dx / oRxOut) ** 2 + (dy / oRyOut) ** 2);
    const innerD = Math.sqrt((dx / oRxIn)  ** 2 + (dy / oRyIn)  ** 2);
    // Smooth coverage within ~1px of each edge
    const outerA = Math.max(0, Math.min(1, (1 - outerD) * (oRxOut + oRyOut) / 2));
    const innerA = Math.max(0, Math.min(1, (innerD - 1) * (oRxIn  + oRyIn)  / 2));
    const alpha  = Math.min(outerA, innerA);
    if (alpha > 0.01) setPixel(x, y, ...BLUE, Math.round(alpha * 255));
  }
}

// --- Draw Z as geometric shapes ---
// Z occupies x: 52..120, y: 18..110  (overlaps O on the right)
const zX1 = 52, zX2 = 120;
const zTop1 = 18, zTop2 = 31;   // top bar
const zBot1 = 97, zBot2 = 110;  // bottom bar

function fillRect(x1, y1, x2, y2, [r, g, b]) {
  for (let y = y1; y <= y2; y++)
    for (let x = x1; x <= x2; x++)
      setPixel(x, y, r, g, b);
}

// Top bar
fillRect(zX1, zTop1, zX2, zTop2, BLUE);
// Bottom bar
fillRect(zX1, zBot1, zX2, zBot2, BLUE);

// Diagonal: from (zX2, zTop2) to (zX1, zBot1), thickness 7
const dX1 = zX2, dY1 = zTop2, dX2 = zX1, dY2 = zBot1;
const dLen = Math.hypot(dX2 - dX1, dY2 - dY1);
const thick = 7;
for (let y = Math.min(dY1, dY2); y <= Math.max(dY1, dY2); y++) {
  for (let x = Math.min(dX1, dX2) - thick; x <= Math.max(dX1, dX2) + thick; x++) {
    const t = Math.max(0, Math.min(1, ((x - dX1) * (dX2 - dX1) + (y - dY1) * (dY2 - dY1)) / (dLen * dLen)));
    const projX = dX1 + t * (dX2 - dX1), projY = dY1 + t * (dY2 - dY1);
    const dist = Math.hypot(x - projX, y - projY);
    const alpha = Math.max(0, Math.min(1, thick + 0.5 - dist));
    if (alpha > 0.01) setPixel(x, y, ...BLUE, Math.round(alpha * 255));
  }
}

// --- Encode as PNG ---
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (const b of buf) crc = crcTable[(crc ^ b) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function mkChunk(type, data) {
  const t = Buffer.from(type, "ascii");
  const d = Buffer.isBuffer(data) ? data : Buffer.from(data);
  const len = Buffer.alloc(4); len.writeUInt32BE(d.length);
  const crcBuf = Buffer.alloc(4); crcBuf.writeUInt32BE(crc32(Buffer.concat([t, d])));
  return Buffer.concat([len, t, d, crcBuf]);
}

const rows = Buffer.alloc(H * (1 + W * 4));
for (let y = 0; y < H; y++) {
  rows[y * (1 + W * 4)] = 0;
  for (let x = 0; x < W; x++) {
    const src = (y * W + x) * 4, dst = y * (1 + W * 4) + 1 + x * 4;
    rows[dst] = px[src]; rows[dst+1] = px[src+1];
    rows[dst+2] = px[src+2]; rows[dst+3] = px[src+3];
  }
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; ihdr[9] = 6; // bit depth=8, RGBA

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
  mkChunk("IHDR", ihdr),
  mkChunk("IDAT", zlib.deflateSync(rows)),
  mkChunk("IEND", Buffer.alloc(0)),
]);

const out = path.join(__dirname, "../public/favicon.png");
fs.writeFileSync(out, png);
console.log(`favicon.png written (${png.length} bytes)`);
