# bsuir-iis-api showcase

Showcase npm-пакета [bsuir-iis-api](https://www.npmjs.com/package/bsuir-iis-api) на [Next.js](https://nextjs.org) (App Router) + [shadcn/ui](https://ui.shadcn.com) с архитектурой [Feature-Sliced Design](https://feature-sliced.design).

## Requirements

- Node.js >= 24 (or Bun >= 1.x)
- `bsuir-iis-api` >= 0.10.0

## Структура (FSD)

- `app/` — слой **app** в терминах Next.js App Router: маршруты (`layout`, `page`, `loading`, `error`, `not-found`), без тяжёлой бизнес-логики; данные для главной собираются в `src/views/home/model/load-home-page.ts`, страница импортирует `@/views/home`.
- `src/` — код по слоям FSD:
  - `root` — то же назначение, что **app**-слой FSD (провайдеры, тема): код вынесен из `app/`, чтобы не смешивать с файлами маршрутизации Next.js;
  - `shared` — ui (shadcn), lib, config, api; внешние импорты только через публичные `index.ts` сегментов (`@/shared/lib`, `@/shared/config`, `@/shared/ui`, `@/shared/api`);
  - `entities` — доменные сущности;
  - `features` — пользовательские сценарии;
  - `widgets` — композиция entities + features;
  - `views` — эквивалент слоя **pages** в каноничном FSD: композиция виджетов и фич в экраны (сейчас `views/home`).

Алиас `@/*` → `src/*`. Для файлов в `src/**` и `app/**` включено правило `eslint-plugin-boundaries` (зависимости только «сверху вниз» по слоям). Линтинг: ESLint + Prettier (интеграция в IDE через `.vscode/`).

## Getting Started

Установка зависимостей и запуск (используется [Bun](https://bun.sh)):

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Showcase `bsuir-iis-api`

#### Покрытие методов SDK (главная страница)

| Возможность                   | Метод SDK (через entities)                                  | Где в UI                                                                    | Query / условие                    |
| ----------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------- |
| Расписание группы             | `schedule.getGroup`                                         | Таблица после выбора группы в шапке                                         | `?group=<цифры>`                   |
| Расписание преподавателя      | `schedule.getEmployee`                                      | Таблица                                                                     | `?employee=<url-id>`               |
| Список групп                  | `groups.listAll`                                            | Шапка (поиск) и блок **Справочники SDK** внизу                              | —                                  |
| Список преподавателей         | `employees.listAll`                                         | Шапка и **Справочники SDK**                                                 | —                                  |
| Факультеты                    | `faculties.listAll`                                         | **Справочники SDK**                                                         | —                                  |
| Кафедры                       | `departments.listAll`                                       | **Справочники SDK**                                                         | —                                  |
| Специальности                 | `specialities.listAll`                                      | **Справочники SDK** (по выбранному факультету)                              | —                                  |
| Объявления преподавателя      | `announcements.byEmployee`                                  | Под таблицей; в паспорте кафедры при `announcements=1`                      | режим `employee`                   |
| Объявления кафедры            | `announcements.byDepartment`                                | Паспорт кафедры                                                             | `announcements=1` и `departmentId` |
| Аудитории                     | `auditories.listAll`                                        | **Справочники SDK**                                                         | —                                  |
| Последнее обновление (легаси) | `schedule.getLastUpdateByGroup` / `getLastUpdateByEmployee` | Только **SDK Insights** (сводка и JSON; в шапке расписания не показывается) | есть выбранное расписание          |
| Текущая неделя                | `schedule.getCurrentWeek`                                   | Переключатель недели; SDK Insights                                          | есть выбранное расписание          |

Сводка **SDK Insights** (включая счётчики `listAll` и last update) доступна только при открытом расписании группы или преподавателя.

- В **SDK Insights** (кнопка внизу слева на странице с выбранной группой/преподавателем) можно включить сырой ответ расписания: ссылка **«Включить rawSchedule=1»** или query `?rawSchedule=1` вместе с `group` / `employee`.
- Демо отмены запроса с пробросом `signal` в SDK: [http://localhost:3000/abort-demo](http://localhost:3000/abort-demo) (Route Handler `app/api/demo/group-schedule`).
- Демо `BsuirValidationError`: [http://localhost:3000/validation-demo](http://localhost:3000/validation-demo).
- Логирование исходящих запросов к ИИС в консоль сервера: `BSUIR_DEBUG_FETCH=1` (см. [src/shared/api/bsuir-client.ts](src/shared/api/bsuir-client.ts)).

#### Произвольные query-параметры (`ReadOptions.query`)

SDK принимает `query` в опциях чтения — удобно для недокументированных или будущих параметров ИИС:

```ts
await client.groups.listAll({
  query: { someFlag: "1" },
});
```

Имеет смысл проверять реальные ключи по ответу API; в showcase отдельный UI не вынесен — см. [npm](https://www.npmjs.com/package/bsuir-iis-api) и [репозиторий SDK](https://github.com/kotru21/bsuir-iis-api).

- На главной с выбранным расписанием: вкладки **основное**, **экзамены** (`get*Exams`), **сессия filtered** (`get*Filtered` с `source: "exams"` и `lessonTypeAbbrev`, по умолчанию как в README SDK); query `examTypes=Консультация,Экзамен` (через запятую) или чекбоксы + поле «другое» на вкладке. Панель **фильтра SDK** для занятий: `fDay`, `fSubject`, …
- Сравнение двух **групп**: `?group=…&compareGroup=…` (только цифры, как у `group`) — две колонки расписания; ошибки второй группы — тост, страница остаётся рабочей.
- Демо **mock-клиента** без сети: [http://localhost:3000/mock-demo](http://localhost:3000/mock-demo) (`createBsuirClient({ fetch })` + [src/shared/fixtures/mock-bsuir-schedule-wire.ts](src/shared/fixtures/mock-bsuir-schedule-wire.ts)).
- Подсказки по датам семестра из normalized-ответа, блок **объявлений преподавателя** (режим `employee`), внизу — **справочники SDK** (группы, преподаватели, факультет → специальности, кафедры, аудитории).

#### Типы TypeScript для SDK

Реэкспорт части публичных типов пакета: [src/shared/api/bsuir-types.ts](src/shared/api/bsuir-types.ts) и баррель [src/shared/api/index.ts](src/shared/api/index.ts) (`BsuirClient`, `BsuirClientOptions`, `EmployeeCatalogItem`, `StudentGroupCatalogItem`, `ReadOptions`, …).

```ts
import type { BsuirClient, EmployeeCatalogItem } from "@/shared/api";

function countEmployees(c: BsuirClient, _sample: EmployeeCatalogItem[]) {
  return c.employees.listAll();
}
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
