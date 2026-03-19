# Расписание БГУИР

Сайт-расписание на [Next.js](https://nextjs.org) (App Router) + [shadcn/ui](https://ui.shadcn.com) с архитектурой [Feature-Sliced Design](https://feature-sliced.design).

## Структура (FSD)

- `app/` — маршруты Next.js (layout, page, loading, error, not-found).
- `src/` — бизнес-код по слоям:
  - `root` — провайдеры приложения;
  - `shared` — ui (shadcn), lib, config, api;
  - `entities` — доменные сущности;
  - `features` — сценарии;
  - `widgets` — составные блоки;
  - `views` — страницы (композиция виджетов). Импорт в `app/page.tsx` из `@/views/...`.

Алиас `@/*` → `src/*`. Линтинг: ESLint + Prettier (интеграция в IDE через `.vscode/`).

## Getting Started

Установка зависимостей и запуск (используется [Bun](https://bun.sh)):

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Showcase `bsuir-iis-api`

- В **SDK Insights** (кнопка внизу слева на странице с выбранной группой/преподавателем) можно включить сырой ответ расписания: ссылка **«Включить rawSchedule=1»** или query `?rawSchedule=1` вместе с `group` / `employee`.
- Демо отмены запроса с пробросом `signal` в SDK: [http://localhost:3000/abort-demo](http://localhost:3000/abort-demo) (Route Handler `app/api/demo/group-schedule`).
- Демо `BsuirValidationError`: [http://localhost:3000/validation-demo](http://localhost:3000/validation-demo).
- Логирование исходящих запросов к ИИС в консоль сервера: `BSUIR_DEBUG_FETCH=1` (см. [src/shared/api/bsuir-client.ts](src/shared/api/bsuir-client.ts)).
- На главной с выбранным расписанием: вкладки **основное / экзамены** (`get*Exams`), панель **фильтра SDK** (`get*Filtered` + query `fDay`, `fSubject`, …), подсказки по датам семестра из normalized-ответа, блок **объявлений преподавателя** (режим `employee`), внизу страницы — **справочники** (факультет → специальности, кафедры, аудитории).

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
