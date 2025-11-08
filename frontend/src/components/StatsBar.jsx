import { useEffect, useState } from "react";
import { api } from "../services/api";

const fmt = (s) =>
  s ? new Date(s).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "";

export default function StatsBar({ refreshKey = 0 }) {
  const [subjects, setSubjects] = useState(0);
  const [files, setFiles] = useState(0);
  const [next, setNext] = useState(null);

  const load = async () => {
    try {
      const [sc, fc] = await Promise.all([
        api.get("/subjects/count"),
        api.get("/files/count"),
      ]);
      setSubjects(Number(sc.data ?? 0));
      setFiles(Number(fc.data ?? 0));
    } catch {}
    try {
      const res = await api.get("/reminders/next");
      setNext(res?.data || null);
    } catch {
      setNext(null);
    }
  };

  useEffect(() => { load(); }, [refreshKey]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <div className="text-sm text-gray-500 dark:text-gray-400">Subjects</div>
        <div className="text-2xl font-semibold text-gray-900 dark:text-white">{subjects}</div>
      </div>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <div className="text-sm text-gray-500 dark:text-gray-400">Files</div>
        <div className="text-2xl font-semibold text-gray-900 dark:text-white">{files}</div>
      </div>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <div className="text-sm text-gray-500 dark:text-gray-400">Next reminder</div>
        {next ? (
          <div>
            <div className="font-medium text-gray-900 dark:text-white truncate" title={next.title}>{next.title}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{fmt(next.dueDate)}</div>
          </div>
        ) : (
          <div className="text-gray-500 dark:text-gray-400">None</div>
        )}
      </div>
    </div>
  );
}