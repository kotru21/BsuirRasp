/**
 * Визуальное и семантическое разделение лендинга SDK и блока живого showcase.
 */
export function ApiShowcaseIntro() {
  return (
    <div
      id="api-showcase"
      className="scroll-mt-24 border-t-2 border-border bg-linear-to-b from-muted/40 to-background px-4 pt-14 pb-6 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 border-b border-border/80 pb-10">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Live demo
          </p>
          <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            Интерактивный showcase API
          </h2>
          <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            Всё ниже — реальные вызовы{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">bsuir-iis-api</code>{" "}
            к ИИС БГУИР: поиск группы, расписание, экзамены, фильтры и справочники. Наверху — только
            установка, ссылки и минимальный код.
          </p>
        </div>
      </div>
    </div>
  );
}
