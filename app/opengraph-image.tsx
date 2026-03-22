import {
  OPEN_GRAPH_DEFAULT_IMAGE_ALT as alt,
  OPEN_GRAPH_DEFAULT_IMAGE_SIZE as size,
} from "@/shared/config";
import { buildHeroOgImage } from "@/shared/og";

export { alt, size };

export const contentType = "image/png";

export default async function OpenGraphImage() {
  return buildHeroOgImage();
}
