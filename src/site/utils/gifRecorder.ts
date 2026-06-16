import { GIFEncoder, quantize } from 'gifenc'

export interface CapturedFrame {
  data: Uint8Array
  width: number
  height: number
}

// WebGL readPixels produces bottom-up rows; GIF expects top-down
function flipVertical(data: Uint8Array, width: number, height: number): Uint8Array {
  const flipped = new Uint8Array(data.length)
  const rowBytes = width * 4
  for (let y = 0; y < height; y++) {
    const src = (height - 1 - y) * rowBytes
    const dst = y * rowBytes
    flipped.set(data.subarray(src, src + rowBytes), dst)
  }
  return flipped
}

// Nearest-neighbor 2x upscale — preserves pixel art look
function scale2x(data: Uint8Array, w: number, h: number): Uint8Array {
  const w2 = w * 2
  const out = new Uint8Array(w2 * h * 2 * 4)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const si = (y * w + x) * 4
      const r = data[si], g = data[si + 1], b = data[si + 2], a = data[si + 3]
      const dy = y * 2, dx = x * 2
      let di = (dy * w2 + dx) * 4
      out[di] = r; out[di + 1] = g; out[di + 2] = b; out[di + 3] = a
      di += 4
      out[di] = r; out[di + 1] = g; out[di + 2] = b; out[di + 3] = a
      di = ((dy + 1) * w2 + dx) * 4
      out[di] = r; out[di + 1] = g; out[di + 2] = b; out[di + 3] = a
      di += 4
      out[di] = r; out[di + 1] = g; out[di + 2] = b; out[di + 3] = a
    }
  }
  return out
}

// Build a 5-bit-per-channel (32³ = 32768 entry) LUT mapping quantized color → palette index.
// Building once per GIF (vs. per-frame linear search) makes 2x-resolution dithering fast.
function buildLUT(palette: number[][]): Uint8Array {
  const lut = new Uint8Array(32 * 32 * 32)
  const pLen = palette.length
  const pR = new Int32Array(pLen)
  const pG = new Int32Array(pLen)
  const pB = new Int32Array(pLen)
  for (let i = 0; i < pLen; i++) {
    pR[i] = palette[i][0]; pG[i] = palette[i][1]; pB[i] = palette[i][2]
  }
  for (let ri = 0; ri < 32; ri++) {
    const r = (ri * 255 / 31 + 0.5) | 0
    for (let gi = 0; gi < 32; gi++) {
      const g = (gi * 255 / 31 + 0.5) | 0
      for (let bi = 0; bi < 32; bi++) {
        const b = (bi * 255 / 31 + 0.5) | 0
        let best = 0, bestDist = 0x7fffffff
        for (let p = 0; p < pLen; p++) {
          const dr = r - pR[p], dg = g - pG[p], db = b - pB[p]
          const d = dr * dr + dg * dg + db * db
          if (d < bestDist) { bestDist = d; best = p }
        }
        lut[(ri << 10) | (gi << 5) | bi] = best
      }
    }
  }
  return lut
}

// Floyd-Steinberg dithering with O(1) LUT lookup per pixel
function ditherWithLUT(
  rgba: Uint8Array,
  palette: number[][],
  lut: Uint8Array,
  width: number,
  height: number
): Uint8Array {
  const indices = new Uint8Array(width * height)
  const err = new Float32Array(rgba.length)

  const pLen = palette.length
  const pR = new Float32Array(pLen)
  const pG = new Float32Array(pLen)
  const pB = new Float32Array(pLen)
  for (let i = 0; i < pLen; i++) {
    pR[i] = palette[i][0]; pG[i] = palette[i][1]; pB[i] = palette[i][2]
  }

  const row = width * 4
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pi = (y * width + x) * 4
      const r = Math.max(0, Math.min(255, rgba[pi]     + err[pi]))
      const g = Math.max(0, Math.min(255, rgba[pi + 1] + err[pi + 1]))
      const b = Math.max(0, Math.min(255, rgba[pi + 2] + err[pi + 2]))

      const best = lut[(r >> 3 << 10) | (g >> 3 << 5) | (b >> 3)]
      indices[y * width + x] = best

      const er = r - pR[best], eg = g - pG[best], eb = b - pB[best]

      if (x + 1 < width) {
        err[pi + 4]     += er * 0.4375
        err[pi + 5]     += eg * 0.4375
        err[pi + 6]     += eb * 0.4375
      }
      if (y + 1 < height) {
        if (x > 0) {
          err[pi + row - 4] += er * 0.1875
          err[pi + row - 3] += eg * 0.1875
          err[pi + row - 2] += eb * 0.1875
        }
        err[pi + row]     += er * 0.3125
        err[pi + row + 1] += eg * 0.3125
        err[pi + row + 2] += eb * 0.3125
        if (x + 1 < width) {
          err[pi + row + 4] += er * 0.0625
          err[pi + row + 5] += eg * 0.0625
          err[pi + row + 6] += eb * 0.0625
        }
      }
    }
  }
  return indices
}

// Sample up to ~10 frames evenly spaced to build a representative global palette
function buildGlobalPalette(frames: CapturedFrame[]): number[][] {
  const step = Math.max(1, Math.ceil(frames.length / 10))
  const { width, height } = frames[0]
  const sampleCount = Math.ceil(frames.length / step)
  const combined = new Uint8Array(sampleCount * width * height * 4)
  let offset = 0
  for (let i = 0; i < frames.length; i += step) {
    const flipped = flipVertical(frames[i].data, width, height)
    combined.set(flipped, offset)
    offset += flipped.length
  }
  return quantize(combined, 256)
}

function sanitizeShaderName(name: string): string {
  return name.trim().replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').toLowerCase() || 'untitled'
}

function buildFilename(shaderName: string): string {
  const safe = sanitizeShaderName(shaderName)
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
  const time = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`
  return `iss_${safe}_${date}_${time}.gif`
}

export function encodeAndDownloadGif(frames: CapturedFrame[], shaderName: string): void {
  if (frames.length === 0) return

  const { width, height } = frames[0]
  const w2 = width * 2, h2 = height * 2

  // One global palette + one LUT for the entire GIF — avoids per-frame rebuild cost
  const palette = buildGlobalPalette(frames)
  const lut = buildLUT(palette)

  const encoder = GIFEncoder()

  for (const frame of frames) {
    const rgba = scale2x(flipVertical(frame.data, width, height), width, height)
    const index = ditherWithLUT(rgba, palette, lut, w2, h2)
    encoder.writeFrame(index, w2, h2, { palette, delay: 50 })
  }

  encoder.finish()

  const bytes = encoder.bytes()
  const blob = new Blob([bytes], { type: 'image/gif' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = buildFilename(shaderName)
  a.click()

  setTimeout(() => URL.revokeObjectURL(url), 5000)
}
