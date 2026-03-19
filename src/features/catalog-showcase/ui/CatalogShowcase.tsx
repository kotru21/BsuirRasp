"use client";

import type { Auditory, Department, Faculty, Speciality } from "@/entities";
import { useMemo, useState } from "react";

interface CatalogShowcaseProps {
  faculties: Faculty[];
  departments: Department[];
  specialities: Speciality[];
  auditories: Auditory[];
}

function norm(s: string): string {
  return s.toLowerCase().trim();
}

export function CatalogShowcase({
  faculties,
  departments,
  specialities,
  auditories,
}: CatalogShowcaseProps) {
  const [facultyId, setFacultyId] = useState<string>("");
  const [deptQuery, setDeptQuery] = useState("");
  const [audQuery, setAudQuery] = useState("");

  const fid = facultyId ? Number.parseInt(facultyId, 10) : NaN;
  const specsOnFaculty = useMemo(() => {
    if (!Number.isInteger(fid)) return [];
    return specialities.filter((s) => s.facultyId === fid);
  }, [fid, specialities]);

  const deptsFiltered = useMemo(() => {
    const q = norm(deptQuery);
    if (!q) return departments;
    return departments.filter(
      (d) =>
        norm(d.name).includes(q) ||
        norm(d.abbrev).includes(q) ||
        String(d.id).includes(q)
    );
  }, [departments, deptQuery]);

  const audsFiltered = useMemo(() => {
    const q = norm(audQuery);
    if (!q) return auditories.slice(0, 80);
    return auditories
      .filter(
        (a) =>
          norm(a.name).includes(q) ||
          norm(a.note).includes(q) ||
          norm(a.buildingNumber.name).includes(q) ||
          norm(a.auditoryType.name).includes(q) ||
          norm(a.auditoryType.abbrev).includes(q)
      )
      .slice(0, 120);
  }, [auditories, audQuery]);

  return (
    <section className="mx-auto w-full max-w-7xl space-y-8 border-t border-border px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Справочники SDK</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Данные с <code className="rounded bg-muted px-1">faculties.listAll</code>,{" "}
          <code className="rounded bg-muted px-1">departments.listAll</code>,{" "}
          <code className="rounded bg-muted px-1">specialities.listAll</code>,{" "}
          <code className="rounded bg-muted px-1">auditories.listAll</code>. Фильтрация на
          клиенте.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-3 rounded-xl border bg-card p-4">
          <h3 className="text-sm font-medium">Факультет → специальности</h3>
          <p className="text-xs text-muted-foreground">
            У <code className="rounded bg-muted px-1">Speciality</code> есть{" "}
            <code className="rounded bg-muted px-1">facultyId</code>; кафедры в API без
            привязки к факультету — отдельный список ниже.
          </p>
          <select
            className="h-9 w-full max-w-md rounded-md border bg-background px-2 text-sm"
            value={facultyId}
            onChange={(e) => setFacultyId(e.target.value)}
          >
            <option value="">Выберите факультет</option>
            {faculties.map((f) => (
              <option key={f.id} value={f.id}>
                {f.abbrev} — {f.name}
              </option>
            ))}
          </select>
          {Number.isInteger(fid) && (
            <ul className="max-h-48 overflow-auto text-xs">
              {specsOnFaculty.length === 0 ? (
                <li className="text-muted-foreground">Нет специальностей в данных</li>
              ) : (
                specsOnFaculty.map((s) => (
                  <li key={s.id} className="border-b border-border/60 py-1.5">
                    <span className="font-medium">{s.abbrev}</span> {s.name}
                    <span className="text-muted-foreground"> · код {s.code}</span>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        <div className="space-y-3 rounded-xl border bg-card p-4">
          <h3 className="text-sm font-medium">Кафедры</h3>
          <input
            type="search"
            placeholder="Поиск по названию, аббревиатуре…"
            className="h-9 w-full rounded-md border bg-background px-2 text-sm"
            value={deptQuery}
            onChange={(e) => setDeptQuery(e.target.value)}
          />
          <ul className="max-h-48 overflow-auto text-xs">
            {deptsFiltered.slice(0, 100).map((d) => (
              <li key={d.id} className="border-b border-border/60 py-1.5">
                <span className="font-medium">{d.abbrev}</span> {d.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-3 rounded-xl border bg-card p-4">
        <h3 className="text-sm font-medium">Аудитории</h3>
        <input
          type="search"
          placeholder="Корпус, тип, название…"
          className="h-9 w-full max-w-lg rounded-md border bg-background px-2 text-sm"
          value={audQuery}
          onChange={(e) => setAudQuery(e.target.value)}
        />
        <ul className="max-h-56 overflow-auto text-xs">
          {audsFiltered.map((a) => (
            <li key={a.id} className="border-b border-border/60 py-1.5">
              <span className="font-medium">{a.name}</span>
              <span className="text-muted-foreground">
                {" "}
                · {a.buildingNumber.name} · {a.auditoryType.abbrev} · вместимость{" "}
                {a.capacity ?? "—"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
