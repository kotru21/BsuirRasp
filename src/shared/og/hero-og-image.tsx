import { ImageResponse } from "next/og";
import { loadInterOgFonts } from "./load-og-fonts";

export interface HeroOgImageProps {
  eyebrow: string;
  title: string;
  monoLine: string;
  subtitle: string;
  footer: string;
}

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

const defaultHomeOg: HeroOgImageProps = {
  eyebrow: "npm package",
  title: "Типобезопасный клиент",
  monoLine: "bsuir-iis-api",
  subtitle: "Живой showcase API ИИС БГУИР: расписание, справочники, фильтры.",
  footer: "bsuir-iis-api showcase",
};

export async function buildHeroOgImage(props: Partial<HeroOgImageProps> = {}): Promise<ImageResponse> {
  const p = { ...defaultHomeOg, ...props };
  const fonts = await loadInterOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#0c0c12",
          color: "#fafafa",
        }}
      >
        {/* Градиенты через backgroundImage — поддерживаются Satori (см. /vercel/satori: radial-gradient, linear-gradient). */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            backgroundImage:
              "linear-gradient(165deg, #14141f 0%, #0a0a10 38%, #060609 72%, #030305 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              "radial-gradient(ellipse 100% 70% at 50% -8%, rgba(120, 119, 198, 0.52) 0%, rgba(120, 119, 198, 0.2) 32%, rgba(120, 119, 198, 0) 68%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              "radial-gradient(ellipse 58% 58% at 88% 32%, rgba(139, 92, 246, 0.38) 0%, rgba(99, 102, 241, 0.14) 42%, rgba(99, 102, 241, 0) 72%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0.5,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, rgba(0,0,0,0) 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, rgba(0,0,0,0) 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 240,
            backgroundImage:
              "linear-gradient(to bottom, rgba(6,6,9,0), rgba(6,6,9,0.78), rgba(6,6,9,1))",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            flex: 1,
            padding: 72,
            paddingTop: 64,
            maxWidth: OG_WIDTH,
          }}
        >
          <p
            style={{
              margin: 0,
              marginBottom: 20,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#a1a1aa",
              fontFamily: "Inter",
            }}
          >
            {p.eyebrow}
          </p>

          <h1
            style={{
              margin: 0,
              marginBottom: 12,
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: "#fafafa",
              fontFamily: "Inter",
              maxWidth: 900,
            }}
          >
            {p.title}
          </h1>

          <p
            style={{
              margin: 0,
              marginBottom: 28,
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#d4d4d8",
              fontFamily: "Inter",
            }}
          >
            {p.monoLine}
          </p>

          <p
            style={{
              margin: 0,
              fontSize: 22,
              lineHeight: 1.45,
              color: "#a1a1aa",
              fontFamily: "Inter",
              fontWeight: 400,
              maxWidth: 820,
            }}
          >
            {p.subtitle}
          </p>

          <p
            style={{
              margin: 0,
              marginTop: 48,
              fontSize: 14,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#71717a",
              fontFamily: "Inter",
              fontWeight: 400,
            }}
          >
            {p.footer}
          </p>
        </div>
      </div>
    ),
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts,
    }
  );
}
