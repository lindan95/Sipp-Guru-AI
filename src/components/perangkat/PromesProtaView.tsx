import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { CalendarRange, CalendarDays, Sparkles, Printer, Save, Check } from "lucide-react";
import { ContextFilterBanner } from "../common/ContextFilterBanner";

export const PromesProtaView: React.FC = () => {
  const {
    atpList,
    subjects,
    classes,
    activeSubjectId,
    setActiveSubjectId,
    activeClassId,
    setActiveClassId,
    settings,
    setPreviewDoc,
    schoolProfile,
    teacherProfile,
    addToast,
  } = useApp();
  const [filterSubjectId, setFilterSubjectId] = useState<string>(activeSubjectId || "all");
  const [filterClassId, setFilterClassId] = useState<string>(activeClassId || "all");
  const [activeTab, setActiveTab] = useState<"promes" | "prota">("promes");
  const [selectedSemester, setSelectedSemester] = useState<"1" | "2">(settings.activeSemester);

  const monthsSemester1 = ["Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const monthsSemester2 = ["Januari", "Februari", "Maret", "April", "Mei", "Juni"];
  const activeMonths = selectedSemester === "1" ? monthsSemester1 : monthsSemester2;

  const filteredATPList = atpList.filter((atp) => {
    if (filterSubjectId === "all") return true;
    return atp.subjectId === filterSubjectId;
  });

  const totalJP = filteredATPList.reduce((acc, curr) => acc + (curr.allocatedHours || 0), 0);

  const handlePrint = () => {
    setPreviewDoc({
      title: activeTab === "promes" ? "Program Semester (Promes)" : "Program Tahunan (Prota)",
      docType: activeTab === "promes" ? "PROMES_DOCUMENT" : "PROTA_DOCUMENT",
      dataObj: {
        type: activeTab,
        atpList: filteredATPList,
        subject: subjects.find((s) => s.id === (filterSubjectId !== "all" ? filterSubjectId : activeSubjectId)),
        classObj: classes.find((c) => c.id === (filterClassId !== "all" ? filterClassId : activeClassId)),
        months: activeMonths,
        semester: selectedSemester,
        academicYear: settings.activeAcademicYear,
        school: schoolProfile,
        teacher: teacherProfile,
        totalJP,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Program Semester (Promes) & Program Tahunan (Prota)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Perencanaan distribusi pokok bahasan dan alokasi jam tatap muka per pekan selama satu semester dan satu tahun ajaran.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <Printer className="h-4 w-4 text-blue-600" />
            Cetak {activeTab === "promes" ? "Promes" : "Prota"}
          </button>
        </div>
      </div>

      {/* Context Filter Banner */}
      <ContextFilterBanner
        selectedClassId={filterClassId}
        onClassChange={(id) => setFilterClassId(id)}
        selectedSubjectId={filterSubjectId}
        onSubjectChange={(id) => setFilterSubjectId(id)}
        extraControls={
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Total <b>{totalJP} JP</b> ({filteredATPList.length} Lingkup Materi)
          </span>
        }
      />

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("promes")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "promes"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <CalendarRange className="h-4 w-4" />
            Program Semester (Promes)
          </button>
          <button
            onClick={() => setActiveTab("prota")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === "prota"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <CalendarDays className="h-4 w-4" />
            Program Tahunan (Prota)
          </button>
        </div>

        {activeTab === "promes" && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Semester:</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value as "1" | "2")}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="1">Semester 1 (Ganjil)</option>
              <option value="2">Semester 2 (Genap)</option>
            </select>
          </div>
        )}
      </div>

      {/* Promes View */}
      {activeTab === "promes" ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
                <tr>
                  <th rowSpan={2} className="border-r border-slate-200 px-3 py-2 text-center dark:border-slate-800">
                    No
                  </th>
                  <th rowSpan={2} className="border-r border-slate-200 px-4 py-2 dark:border-slate-800">
                    Materi Pokok / Modul ATP
                  </th>
                  <th rowSpan={2} className="border-r border-slate-200 px-3 py-2 text-center dark:border-slate-800">
                    Alokasi (JP)
                  </th>
                  {activeMonths.map((m) => (
                    <th
                      key={m}
                      colSpan={4}
                      className="border-r border-slate-200 px-2 py-1 text-center font-bold dark:border-slate-800"
                    >
                      {m}
                    </th>
                  ))}
                </tr>
                <tr className="border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400">
                  {activeMonths.map((m) => (
                    <React.Fragment key={m}>
                      <th className="border-r border-slate-100 px-1 py-1 text-center dark:border-slate-800">1</th>
                      <th className="border-r border-slate-100 px-1 py-1 text-center dark:border-slate-800">2</th>
                      <th className="border-r border-slate-100 px-1 py-1 text-center dark:border-slate-800">3</th>
                      <th className="border-r border-slate-200 px-1 py-1 text-center dark:border-slate-800">4</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {atpList.map((atp, idx) => (
                  <tr key={atp.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                    <td className="border-r border-slate-100 px-3 py-2.5 text-center font-bold dark:border-slate-800">
                      {idx + 1}
                    </td>
                    <td className="border-r border-slate-100 px-4 py-2.5 font-medium dark:border-slate-800">
                      <div className="font-bold text-slate-900 dark:text-white">{atp.topic}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{atp.learningObjective}</div>
                    </td>
                    <td className="border-r border-slate-100 px-3 py-2.5 text-center font-bold text-blue-600 dark:border-slate-800">
                      {atp.allocatedHours} JP
                    </td>
                    {/* 24 Weeks tick columns */}
                    {Array.from({ length: 24 }).map((_, wIdx) => {
                      // Simulated distribution mark
                      const isMarked = wIdx >= idx * 3 && wIdx < idx * 3 + Math.ceil(atp.allocatedHours / 2);
                      return (
                        <td
                          key={wIdx}
                          className={`border-r border-slate-100 px-1 py-2.5 text-center dark:border-slate-800 ${
                            isMarked
                              ? "bg-blue-100 text-blue-800 font-bold dark:bg-blue-900/60 dark:text-blue-200"
                              : ""
                          }`}
                        >
                          {isMarked ? 2 : ""}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-slate-200 bg-slate-50 font-bold text-slate-900 dark:border-slate-800 dark:bg-slate-850 dark:text-white">
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-right">
                    Total Alokasi Waktu Efektif:
                  </td>
                  <td className="px-3 py-3 text-center text-blue-600">{totalJP} JP</td>
                  <td colSpan={24} className="px-4 py-3 text-xs text-slate-500">
                    Terdistribusi penuh dalam 24 pekan pembelajaran semester {selectedSemester}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        /* Prota View */
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-850 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 text-center">No</th>
                  <th className="px-4 py-3">Semester</th>
                  <th className="px-4 py-3">Elemen Capaian</th>
                  <th className="px-4 py-3">Materi Pokok / Tujuan Pembelajaran</th>
                  <th className="px-4 py-3 text-center">Alokasi Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {atpList.map((atp, idx) => (
                  <tr key={atp.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                    <td className="px-4 py-3 text-center font-bold">{idx + 1}</td>
                    <td className="px-4 py-3 font-semibold text-blue-600">
                      Semester {idx % 2 === 0 ? "1 (Ganjil)" : "2 (Genap)"}
                    </td>
                    <td className="px-4 py-3">{atp.element || "Elemen Utama"}</td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900 dark:text-white">{atp.topic}</div>
                      <p className="text-[11px] text-slate-500">{atp.learningObjective}</p>
                    </td>
                    <td className="px-4 py-3 text-center font-bold">{atp.allocatedHours} JP</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-slate-200 bg-slate-50 font-bold text-slate-900 dark:border-slate-800 dark:bg-slate-850 dark:text-white">
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-right">
                    Total Beban Belajar 1 Tahun Ajaran (Prota):
                  </td>
                  <td className="px-4 py-3 text-center text-blue-600">{totalJP} JP</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
