import rootPackage from "../../../package.json";

function bsuirIisApiVersionFromDeps(): string {
  const v = rootPackage.dependencies?.["bsuir-iis-api"];
  return typeof v === "string" ? v.replace(/^[\^~]/, "") : "0.0.0";
}

/** Версия `bsuir-iis-api` из корневого `package.json` (диапазон без префикса ^ / ~). */
export const BSUIR_IIS_API_VERSION = bsuirIisApiVersionFromDeps();

export const BSUIR_IIS_API_REPO_URL = "https://github.com/kotru21/bsuir-iis-api";

/** Страница пакета на npm. */
export const BSUIR_IIS_API_NPM_URL = "https://www.npmjs.com/package/bsuir-iis-api";

/** README в репозитории (стабильный якорь для ссылки «Документация»). */
export const BSUIR_IIS_API_README_URL = `${BSUIR_IIS_API_REPO_URL}#readme`;
