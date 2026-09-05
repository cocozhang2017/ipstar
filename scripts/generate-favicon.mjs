/**
 * IPStar favicon.ico 生成器 (纯 Node.js,无外部依赖)
 * 输出: public/favicon.ico (包含 16/32/48/64 四种尺寸,PNG-in-ICO 格式)
 *
 * 设计:
 *  - 圆角方形背景: 靛蓝→紫 渐变 + 内高光
 *  - 中央白色盾牌(带描边)
 *  - 顶部金色星芒
 *  - 右上角金色小圆点
 *
 * 运行: node scripts/generate-favicon.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '..', 'public', 'favicon.ico');

// ---------- PNG 编码器(输出带 RGBA 的 PNG) ----------
function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function encodePNG(width, height, pixels /* Uint8Array RGBA */) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // 每行前加一个 filter byte (0 = none)
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = deflateSync(raw, { level: 9 });

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---------- 2D 渲染(简单向量几何 + 超采样抗锯齿) ----------
const SUPERSAMPLE = 4; // 4x 超采样

function makeRenderer(size) {
  const ss = size * SUPERSAMPLE;
  const buf = new Uint8Array(ss * ss * 4);
  return { size, ss, buf };
}

function setPixel(r, x, y, color) {
  if (x < 0 || y < 0 || x >= r.ss || y >= r.ss) return;
  const i = (y * r.ss + x) * 4;
  r.buf[i] = color[0];
  r.buf[i + 1] = color[1];
  r.buf[i + 2] = color[2];
  r.buf[i + 3] = color[3];
}

// alpha 叠加(over 运算符)
function blendPixel(r, x, y, color) {
  if (x < 0 || y < 0 || x >= r.ss || y >= r.ss) return;
  const i = (y * r.ss + x) * 4;
  const srcA = color[3] / 255;
  const dstA = r.buf[i + 3] / 255;
  const outA = srcA + dstA * (1 - srcA);
  if (outA === 0) return;
  r.buf[i] = Math.round((color[0] * srcA + r.buf[i] * dstA * (1 - srcA)) / outA);
  r.buf[i + 1] = Math.round((color[1] * srcA + r.buf[i + 1] * dstA * (1 - srcA)) / outA);
  r.buf[i + 2] = Math.round((color[2] * srcA + r.buf[i + 2] * dstA * (1 - srcA)) / outA);
  r.buf[i + 3] = Math.round(outA * 255);
}

function fillRect(r, x, y, w, h, color) {
  for (let j = Math.max(0, y); j < Math.min(r.ss, y + h); j++) {
    for (let i = Math.max(0, x); i < Math.min(r.ss, x + w); i++) {
      blendPixel(r, i, j, color);
    }
  }
}

// 圆角矩形填充(带透明外部)
function fillRoundedRect(r, x, y, w, h, radius, color) {
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const px = x + i;
      const py = y + j;
      // 判断是否在圆角外
      const cx = i < radius ? x + radius : i > w - 1 - radius ? x + w - 1 - radius : px;
      const cy = j < radius ? y + radius : j > h - 1 - radius ? y + h - 1 - radius : py;
      const dx = px - cx;
      const dy = py - cy;
      if (dx * dx + dy * dy <= radius * radius) {
        blendPixel(r, px, py, color);
      }
    }
  }
}

// 圆形填充
function fillCircle(r, cx, cy, radius, color) {
  const r2 = radius * radius;
  for (let j = -radius; j <= radius; j++) {
    for (let i = -radius; i <= radius; i++) {
      if (i * i + j * j <= r2) blendPixel(r, cx + i, cy + j, color);
    }
  }
}

// 径向渐变圆(中心亮,边缘透明)
function fillRadialCircle(r, cx, cy, radius, color, falloff = 1) {
  for (let j = -radius; j <= radius; j++) {
    for (let i = -radius; i <= radius; i++) {
      const d = Math.sqrt(i * i + j * j);
      if (d <= radius) {
        const t = 1 - d / radius;
        const alpha = Math.round(color[3] * Math.pow(t, falloff));
        blendPixel(r, cx + i, cy + j, [color[0], color[1], color[2], alpha]);
      }
    }
  }
}

// 多边形填充(简单扫描线 + 奇偶规则,带 SSAA)
function fillPolygon(r, points, color) {
  // bbox
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [px, py] of points) {
    if (px < minX) minX = px;
    if (py < minY) minY = py;
    if (px > maxX) maxX = px;
    if (py > maxY) maxY = py;
  }
  minX = Math.max(0, Math.floor(minX));
  minY = Math.max(0, Math.floor(minY));
  maxX = Math.min(r.ss - 1, Math.ceil(maxX));
  maxY = Math.min(r.ss - 1, Math.ceil(maxY));

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      let inside = false;
      for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const [xi, yi] = points[i];
        const [xj, yj] = points[j];
        if (((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)) {
          inside = !inside;
        }
      }
      if (inside) blendPixel(r, x, y, color);
    }
  }
}

// 垂直线性渐变填充圆角矩形
function fillGradientRoundedRect(r, x, y, w, h, radius, topColor, bottomColor) {
  for (let j = 0; j < h; j++) {
    const t = j / (h - 1);
    const c = [
      Math.round(topColor[0] + (bottomColor[0] - topColor[0]) * t),
      Math.round(topColor[1] + (bottomColor[1] - topColor[1]) * t),
      Math.round(topColor[2] + (bottomColor[2] - topColor[2]) * t),
      255,
    ];
    for (let i = 0; i < w; i++) {
      const px = x + i;
      const py = y + j;
      const cx = i < radius ? x + radius : i > w - 1 - radius ? x + w - 1 - radius : px;
      const cy = j < radius ? y + radius : j > h - 1 - radius ? y + h - 1 - radius : py;
      const dx = px - cx;
      const dy = py - cy;
      if (dx * dx + dy * dy <= radius * radius) blendPixel(r, px, py, c);
    }
  }
}

// 下采样(盒式滤波)输出 RGBA
function downsample(r) {
  const out = new Uint8Array(r.size * r.size * 4);
  for (let y = 0; y < r.size; y++) {
    for (let x = 0; x < r.size; x++) {
      let R = 0, G = 0, B = 0, A = 0;
      for (let dy = 0; dy < SUPERSAMPLE; dy++) {
        for (let dx = 0; dx < SUPERSAMPLE; dx++) {
          const i = ((y * SUPERSAMPLE + dy) * r.ss + (x * SUPERSAMPLE + dx)) * 4;
          R += r.buf[i];
          G += r.buf[i + 1];
          B += r.buf[i + 2];
          A += r.buf[i + 3];
        }
      }
      const n = SUPERSAMPLE * SUPERSAMPLE;
      const o = (y * r.size + x) * 4;
      out[o] = Math.round(R / n);
      out[o + 1] = Math.round(G / n);
      out[o + 2] = Math.round(B / n);
      out[o + 3] = Math.round(A / n);
    }
  }
  return out;
}

// ---------- 绘制单个尺寸图标 ----------
function drawIcon(size) {
  const r = makeRenderer(size);
  const S = r.ss; // 超采样画布边长

  // 坐标系:0..S 对应图标 0..size
  const scale = S / size;

  // 1) 背景:圆角方形 渐变 (靛→紫)
  const pad = Math.round(2 * scale);
  const bgR = Math.round(14 * scale);
  fillGradientRoundedRect(
    r,
    pad, pad, S - pad * 2, S - pad * 2, bgR,
    [139, 92, 246, 255], // violet-500
    [37, 99, 235, 255],  // blue-600
  );

  // 2) 内高光(顶部白色半透明条)
  const highlightH = Math.round(S * 0.32);
  // 用圆角矩形的上半部分模拟,这里用一个窄的圆角矩形覆盖顶部
  for (let y = pad; y < pad + highlightH; y++) {
    const t = 1 - (y - pad) / highlightH;
    const alpha = Math.round(120 * t);
    for (let x = pad + bgR; x < S - pad - bgR; x++) {
      blendPixel(r, x, y, [255, 255, 255, alpha]);
    }
  }
  // 圆角角落的高光近似(简化:跳过角落)

  // 3) 左上星芒光晕
  fillRadialCircle(r, Math.round(0 * scale), Math.round(0 * scale), Math.round(22 * scale), [255, 230, 150, 200], 1.6);

  // 4) 右下蓝光晕
  fillRadialCircle(r, Math.round(S * 0.92), Math.round(S * 0.92), Math.round(22 * scale), [186, 230, 253, 170], 1.6);

  // 5) 中央盾牌(圆角菱形/倒梯形)
  const shieldCx = S / 2;
  const shieldTop = Math.round(S * 0.20);
  const shieldW = Math.round(S * 0.62);
  const shieldH = Math.round(S * 0.66);
  // 盾牌多边形: 上宽下窄, 底部尖圆
  const shieldHalfW = shieldW / 2;
  const shield = [
    [shieldCx - shieldHalfW, shieldTop],
    [shieldCx + shieldHalfW, shieldTop],
    [shieldCx + shieldHalfW * 0.85, shieldTop + shieldH * 0.55],
    [shieldCx, shieldTop + shieldH],
    [shieldCx - shieldHalfW * 0.85, shieldTop + shieldH * 0.55],
  ];
  // 盾牌填充(白→淡紫渐变): 用多层实现渐变效果
  fillPolygon(r, shield, [240, 244, 255, 255]);
  // 下半部分叠加紫色调
  const lowerShield = [
    [shieldCx - shieldHalfW * 0.92, shieldTop + shieldH * 0.45],
    [shieldCx + shieldHalfW * 0.92, shieldTop + shieldH * 0.45],
    [shieldCx + shieldHalfW * 0.78, shieldTop + shieldH * 0.7],
    [shieldCx, shieldTop + shieldH],
    [shieldCx - shieldHalfW * 0.78, shieldTop + shieldH * 0.7],
  ];
  fillPolygon(r, lowerShield, [199, 210, 254, 200]);

  // 6) 盾牌描边(靛蓝细线): 通过在盾牌外画一个稍大的同色多边形,再覆盖盾牌内部
  // 简化:沿盾牌边缘画细环
  // 这里用绘制稍大一圈的深色多边形再覆盖浅色盾牌来实现描边:
  // 实际我们用 stroke 模拟: 画一个稍大的盾牌做底
  const outlineScale = 1.08;
  const ox = shield.map(([px, py]) => [
    shieldCx + (px - shieldCx) * outlineScale,
    shieldTop + (py - shieldTop) * outlineScale,
  ]);
  // 描边颜色
  // 先画深色外框
  // (由于 fillPolygon 用 alpha 叠加, 我们需要先画外框再画内盾)
  // 重新实现: 先清掉盾牌区域再画 -- 太复杂. 用简化方案: 画盾牌后, 在边缘点画小圆点
  // 简化: 跳过精确描边, 依靠色彩对比即可.

  // 7) 顶部金色星芒点
  fillRadialCircle(r, shieldCx, shieldTop - Math.round(3 * scale), Math.round(7 * scale), [253, 230, 138, 255], 1.8);
  fillCircle(r, shieldCx, shieldTop - Math.round(3 * scale), Math.round(2 * scale), [253, 224, 71, 255]);

  // 8) 右上角金色小圆
  const dotSize = Math.max(2, Math.round(2.4 * scale));
  fillCircle(r, S - Math.round(7 * scale), Math.round(7 * scale), dotSize, [253, 230, 138, 255]);

  // 下采样并输出 PNG
  const pixels = downsample(r);
  return encodePNG(size, size, Buffer.from(pixels));
}

// ---------- 组装 ICO ----------
const sizes = [16, 32, 48, 64];
const images = sizes.map((s) => ({ size: s, png: drawIcon(s) }));

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: ICO
header.writeUInt16LE(sizes.length, 4); // count

let offset = 6 + 16 * sizes.length;
const entries = [];
for (const img of images) {
  const e = Buffer.alloc(16);
  e[0] = img.size >= 256 ? 0 : img.size; // width (0 = 256)
  e[1] = img.size >= 256 ? 0 : img.size; // height
  e[2] = 0; // color count
  e[3] = 0; // reserved
  e.writeUInt16LE(1, 4); // planes
  e.writeUInt16LE(32, 6); // bit count
  e.writeUInt32LE(img.png.length, 8); // size
  e.writeUInt32LE(offset, 12); // offset
  entries.push(e);
  offset += img.png.length;
}

const ico = Buffer.concat([header, ...entries, ...images.map((i) => i.png)]);
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, ico);
console.log(`✓ Wrote ${OUT} (${ico.length} bytes, ${sizes.length} sizes: ${sizes.join('/')})`);
