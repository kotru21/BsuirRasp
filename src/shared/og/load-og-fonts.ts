import { readFile } from "node:fs/promises";
import path from "node:path";

const interFilesDir = path.join(process.cwd(), "node_modules/@fontsource/inter/files");

/** Статические woff из @fontsource/inter (latin + cyrillic). WOFF2 даёт «Unsupported OpenType signature wOF2» в next/og на текущем стеке. */
export async function loadInterOgFonts(): Promise<
  Array<{ name: string; data: ArrayBuffer; style: "normal"; weight: 400 | 700 }>
> {
  const [latin400, cyrillic400, latin700, cyrillic700] = await Promise.all([
    readFile(path.join(interFilesDir, "inter-latin-400-normal.woff")),
    readFile(path.join(interFilesDir, "inter-cyrillic-400-normal.woff")),
    readFile(path.join(interFilesDir, "inter-latin-700-normal.woff")),
    readFile(path.join(interFilesDir, "inter-cyrillic-700-normal.woff")),
  ]);

  const toArrayBuffer = (b: Buffer): ArrayBuffer => {
    const ab = new ArrayBuffer(b.byteLength);
    new Uint8Array(ab).set(b);
    return ab;
  };

  return [
    { name: "Inter", data: toArrayBuffer(latin400), style: "normal", weight: 400 },
    { name: "Inter", data: toArrayBuffer(cyrillic400), style: "normal", weight: 400 },
    { name: "Inter", data: toArrayBuffer(latin700), style: "normal", weight: 700 },
    { name: "Inter", data: toArrayBuffer(cyrillic700), style: "normal", weight: 700 },
  ];
}
