export interface GASFile {
  filename: string;
  type: "server" | "html";
  description: string;
  content: string;
}

export const GAS_FILES_BUNDLE: GASFile[] = [
  {
    filename: "Code.gs",
    type: "server",
    description: "Router utama Web App & endpoint penghubung Google Apps Script",
    content: `/**
 * SIPP GURU AI - Google Apps Script Web App Controller
 * Single User Teacher Lesson Planning & Administration System
 */

function doGet(e) {
  var template = HtmlService.createTemplateFromFile('index');
  return template.evaluate()
    .setTitle('SIPP Guru AI - Perangkat Pembelajaran')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/** API Dispatcher for AJAX Requests */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;
    var payload = data.payload || {};
    var result = handleApiAction(action, payload);
    return ContentService.createTextOutput(JSON.stringify({ success: true, data: result }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function handleApiAction(action, payload) {
  switch (action) {
    case 'getDashboardData': return getDashboardData();
    case 'getSchoolProfile': return getSchoolProfile();
    case 'saveSchoolProfile': return saveSchoolProfile(payload);
    case 'getTeacherProfile': return getTeacherProfile();
    case 'saveTeacherProfile': return saveTeacherProfile(payload);
    case 'getClasses': return getTableData('KELAS');
    case 'saveClass': return saveTableRow('KELAS', payload);
    case 'getStudents': return getTableData('SISWA');
    case 'saveStudent': return saveTableRow('SISWA', payload);
    case 'getSubjects': return getTableData('MATA_PELAJARAN');
    case 'saveSubject': return saveTableRow('MATA_PELAJARAN', payload);
    case 'getSchedules': return getTableData('JADWAL');
    case 'saveSchedule': return saveTableRow('JADWAL', payload);
    case 'getCalendar': return getTableData('KALENDER_PENDIDIKAN');
    case 'saveCalendar': return saveTableRow('KALENDER_PENDIDIKAN', payload);
    case 'getCP': return getTableData('CP');
    case 'saveCP': return saveTableRow('CP', payload);
    case 'getATP': return getTableData('ATP');
    case 'saveATP': return saveTableRow('ATP', payload);
    case 'getModules': return getTableData('MODUL_AJAR');
    case 'saveModule': return saveTableRow('MODUL_AJAR', payload);
    case 'getLKPD': return getTableData('LKPD');
    case 'saveLKPD': return saveTableRow('LKPD', payload);
    case 'getQuestions': return getTableData('BANK_SOAL');
    case 'saveQuestion': return saveTableRow('BANK_SOAL', payload);
    case 'getAttendance': return getTableData('ABSENSI');
    case 'saveAttendance': return saveTableRow('ABSENSI', payload);
    case 'getGrades': return getTableData('PENILAIAN');
    case 'saveGrade': return saveTableRow('PENILAIAN', payload);
    case 'generateAI': return generateAIFromGAS(payload.prompt, payload.systemInstruction, payload.jsonMode);
    case 'generateGoogleDoc': return createGoogleDocFromDevice(payload.title, payload.type, payload.htmlContent);
    case 'initDatabase': return initializeAllSheets();
    default:
      throw new Error('Unknown action: ' + action);
  }
}
`,
  },
  {
    filename: "Config.gs",
    type: "server",
    description: "Konfigurasi ID Google Spreadsheet, Drive Folder, dan PropertiesService",
    content: `/**
 * Config & Constants
 */
var SPREADSHEET_ID_KEY = 'SPREADSHEET_ID';
var DRIVE_FOLDER_ID_KEY = 'DRIVE_FOLDER_ID';
var GEMINI_API_KEY = 'GEMINI_API_KEY';

function getSpreadsheet() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty(SPREADSHEET_ID_KEY);
  if (!id) {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
    throw new Error('Spreadsheet ID belum diatur. Jalankan setupDatabase() terlebih dahulu.');
  }
  return SpreadsheetApp.openById(id);
}

function getGeminiApiKey() {
  var props = PropertiesService.getScriptProperties();
  var key = props.getProperty(GEMINI_API_KEY);
  if (!key) {
    throw new Error('GEMINI_API_KEY belum disetel di Script Properties.');
  }
  return key;
}

function setAppConfig(spreadsheetId, driveFolderId, geminiKey) {
  var props = PropertiesService.getScriptProperties();
  if (spreadsheetId) props.setProperty(SPREADSHEET_ID_KEY, spreadsheetId);
  if (driveFolderId) props.setProperty(DRIVE_FOLDER_ID_KEY, driveFolderId);
  if (geminiKey) props.setProperty(GEMINI_API_KEY, geminiKey);
  return 'Konfigurasi berhasil disimpan.';
}
`,
  },
  {
    filename: "Database.gs",
    type: "server",
    description: "Inisialisasi 30 Tabel di Google Sheets dan fungsi CRUD seragam",
    content: `/**
 * 30 TABLES AUTOMATIC INITIALIZATION & CRUD
 */
var ALL_TABLE_DEFINITIONS = {
  SETTINGS: ['id', 'isPinLocked', 'pinCode', 'aiSystemPrompt', 'aiModel', 'aiTemperature', 'activeAcademicYear', 'activeSemester', 'updatedAt'],
  PROFIL_SEKOLAH: ['id', 'name', 'npsn', 'nss', 'level', 'status', 'address', 'village', 'district', 'regency', 'province', 'postalCode', 'email', 'website', 'phone', 'headmasterName', 'headmasterNip', 'vision', 'mission', 'logoKemdikbudUrl', 'logoSchoolUrl', 'updatedAt'],
  PROFIL_GURU: ['id', 'fullName', 'nip', 'nuptk', 'niPppk', 'nrg', 'birthPlace', 'birthDate', 'gender', 'lastEducation', 'rank', 'position', 'mainSubject', 'phone', 'email', 'address', 'photoUrl', 'signaturePlace', 'updatedAt'],
  KELAS: ['id', 'name', 'gradeLevel', 'phase', 'academicYear', 'homeroomTeacher', 'totalStudents', 'updatedAt'],
  SISWA: ['id', 'classId', 'nis', 'nisn', 'name', 'gender', 'phone', 'email', 'parentName', 'status', 'updatedAt'],
  MATA_PELAJARAN: ['id', 'name', 'code', 'phase', 'gradeLevel', 'hoursPerWeek', 'kktpStandard', 'updatedAt'],
  JADWAL: ['id', 'day', 'startTime', 'endTime', 'classId', 'subjectId', 'room', 'notes', 'updatedAt'],
  KALENDER_PENDIDIKAN: ['id', 'title', 'type', 'startDate', 'endDate', 'semester', 'academicYear', 'isEffectiveDay', 'description', 'updatedAt'],
  ASESMEN_DIAGNOSIS: ['id', 'title', 'subjectId', 'classId', 'phase', 'topic', 'learningObjectives', 'questionsCount', 'questionsJson', 'resultsSummary', 'updatedAt'],
  CP: ['id', 'subjectId', 'phase', 'element', 'description', 'academicYear', 'updatedAt'],
  ATP: ['id', 'cpId', 'subjectId', 'phase', 'element', 'learningObjective', 'topic', 'allocatedHours', 'orderNumber', 'updatedAt'],
  ALOKASI_WAKTU: ['id', 'subjectId', 'classId', 'academicYear', 'semester', 'totalEffectiveWeeks', 'hoursPerWeek', 'totalAllocatedHours', 'breakdownJson', 'updatedAt'],
  PROGRAM_SEMESTER: ['id', 'subjectId', 'classId', 'academicYear', 'semester', 'effectiveWeeks', 'itemsJson', 'updatedAt'],
  PROGRAM_TAHUNAN: ['id', 'subjectId', 'classId', 'academicYear', 'semester1Hours', 'semester2Hours', 'totalHours', 'itemsJson', 'updatedAt'],
  KKTP: ['id', 'subjectId', 'classId', 'phase', 'learningObjective', 'criteriaType', 'indicatorsJson', 'intervalsJson', 'updatedAt'],
  MODUL_AJAR: ['id', 'title', 'subjectId', 'classId', 'phase', 'allocatedHours', 'meetingCount', 'initialCompetency', 'pancasilaProfileJson', 'facilities', 'learningModel', 'learningMethodJson', 'learningObjectivesJson', 'meaningfulUnderstanding', 'triggerQuestionsJson', 'activitiesJson', 'assessmentPlanJson', 'enrichment', 'remedial', 'reflectionsJson', 'learningSourcesJson', 'updatedAt'],
  LKPD: ['id', 'title', 'subjectId', 'classId', 'topic', 'learningObjective', 'duration', 'groupType', 'instructionsJson', 'summaryMaterial', 'activitiesJson', 'tasksJson', 'questionsJson', 'reflection', 'updatedAt'],
  PROGRAM_PENILAIAN: ['id', 'subjectId', 'classId', 'academicYear', 'semester', 'plansJson', 'updatedAt'],
  BAHAN_AJAR: ['id', 'title', 'subjectId', 'classId', 'phase', 'topic', 'learningObjective', 'summary', 'fullContent', 'examplesJson', 'practiceProblemsJson', 'glossaryJson', 'conclusion', 'updatedAt'],
  MEDIA_AJAR: ['id', 'title', 'subjectId', 'classId', 'topic', 'mediaType', 'urlOrFile', 'description', 'updatedAt'],
  BANK_SOAL: ['id', 'subjectId', 'classId', 'phase', 'topic', 'learningObjective', 'questionType', 'difficulty', 'cognitiveLevel', 'indicator', 'questionText', 'optionsJson', 'correctAnswer', 'explanation', 'updatedAt'],
  PEMBAHASAN_SOAL: ['id', 'questionId', 'subjectId', 'topic', 'explanationText', 'tips', 'createdAt', 'updatedAt'],
  KISI_KISI: ['id', 'title', 'subjectId', 'classId', 'phase', 'academicYear', 'semester', 'testType', 'totalQuestions', 'itemsJson', 'updatedAt'],
  ANALISIS_SOAL: ['id', 'testTitle', 'subjectId', 'classId', 'totalStudents', 'analyzedQuestionsJson', 'updatedAt'],
  KARTU_SOAL: ['id', 'questionId', 'title', 'subjectId', 'classId', 'cardDetailsJson', 'updatedAt'],
  ABSENSI: ['id', 'date', 'classId', 'subjectId', 'entriesJson', 'updatedAt'],
  PENILAIAN: ['id', 'date', 'classId', 'subjectId', 'assessmentType', 'topic', 'kktpStandard', 'scoresJson', 'updatedAt'],
  REKAP_KEHADIRAN: ['id', 'classId', 'semester', 'academicYear', 'summaryJson', 'updatedAt'],
  REKAP_HASIL_BELAJAR: ['id', 'classId', 'semester', 'academicYear', 'summaryJson', 'updatedAt'],
  LOG_AKTIVITAS: ['id', 'action', 'module', 'details', 'timestamp']
};

function initializeAllSheets() {
  var ss = getSpreadsheet();
  for (var sheetName in ALL_TABLE_DEFINITIONS) {
    var sheet = ss.getSheetByName(sheetName);
    var headers = ALL_TABLE_DEFINITIONS[sheetName];
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#1e40af').setFontColor('#ffffff');
    }
  }
  return 'Seluruh 30 Sheet Berhasil Diinisialisasi!';
}

function getTableData(tableName) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(tableName);
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var headers = data[0];
  var rows = [];
  for (var i = 1; i < data.length; i++) {
    var rowObj = {};
    for (var j = 0; j < headers.length; j++) {
      var val = data[i][j];
      if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
        try { val = JSON.parse(val); } catch(e) {}
      }
      rowObj[headers[j]] = val;
    }
    rows.push(rowObj);
  }
  return rows;
}

function saveTableRow(tableName, item) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(tableName);
  if (!sheet) {
    initializeAllSheets();
    sheet = ss.getSheetByName(tableName);
  }
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var id = item.id || Utilities.getUuid();
  item.id = id;
  item.updatedAt = new Date().toISOString();

  var data = sheet.getDataRange().getValues();
  var existingRowIndex = -1;
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == id) {
      existingRowIndex = i + 1;
      break;
    }
  }

  var rowValues = headers.map(function(h) {
    var val = item[h];
    if (typeof val === 'object' && val !== null) {
      return JSON.stringify(val);
    }
    return val !== undefined ? val : '';
  });

  if (existingRowIndex > 0) {
    sheet.getRange(existingRowIndex, 1, 1, headers.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }
  return item;
}
`,
  },
  {
    filename: "AI.gs",
    type: "server",
    description: "Integrasi Gemini AI Server-Side melalui UrlFetchApp",
    content: `/**
 * Gemini AI Integration via Google Apps Script UrlFetchApp
 */
function generateAIFromGAS(prompt, systemInstruction, jsonMode) {
  var apiKey = getGeminiApiKey();
  var url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent?key=' + apiKey;

  var payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: jsonMode ? 'application/json' : 'text/plain'
    }
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(url, options);
  var json = JSON.parse(response.getContentText());

  if (json.error) {
    throw new Error('Gemini API Error: ' + json.error.message);
  }

  var text = json.candidates[0].content.parts[0].text;
  return {
    success: true,
    text: text,
    data: jsonMode ? JSON.parse(text) : null
  };
}
`,
  },
  {
    filename: "Drive.gs",
    type: "server",
    description: "Pembuatan Struktur Folder Google Drive Perangkat Pembelajaran",
    content: `/**
 * Google Drive Auto Folder Hierarchy
 */
function setupDriveFolderStructure() {
  var rootName = 'PERANGKAT PEMBELAJARAN GURU';
  var rootFolders = DriveApp.getFoldersByName(rootName);
  var root = rootFolders.hasNext() ? rootFolders.next() : DriveApp.createFolder(rootName);

  var subfolders = [
    'Modul Ajar', 'LKPD', 'Bahan Ajar', 'Media Ajar', 'Bank Soal',
    'Kisi-Kisi', 'Kartu Soal', 'Analisis Soal', 'Program Tahunan',
    'Program Semester', 'Rekap Siswa', 'Asesmen Diagnosis'
  ];

  subfolders.forEach(function(sub) {
    var existing = root.getFoldersByName(sub);
    if (!existing.hasNext()) {
      root.createFolder(sub);
    }
  });

  PropertiesService.getScriptProperties().setProperty('DRIVE_FOLDER_ID', root.getId());
  return { folderId: root.getId(), url: root.getUrl() };
}
`,
  },
  {
    filename: "Docs.gs",
    type: "server",
    description: "Ekspor Perangkat Pembelajaran ke Google Docs dengan Kop Sekolah",
    content: `/**
 * Export Documents to Google Docs
 */
function createGoogleDocFromDevice(title, deviceType, bodyContent) {
  var schoolProfile = getTableData('PROFIL_SEKOLAH')[0] || {};
  var teacherProfile = getTableData('PROFIL_GURU')[0] || {};

  var doc = DocumentApp.create(title + ' - ' + (schoolProfile.name || 'Sekolah'));
  var body = doc.getBody();

  // Header Kop Surat
  var header = body.insertParagraph(0, (schoolProfile.name || 'SEKOLAH').toUpperCase() + '\\n' +
    (schoolProfile.address || '') + '\\n' + 'Telp: ' + (schoolProfile.phone || '') + ' | Email: ' + (schoolProfile.email || ''));
  header.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  header.setHeading(DocumentApp.ParagraphHeading.HEADING2);

  body.appendHorizontalRule();
  body.appendParagraph('');

  var docTitle = body.appendParagraph(title.toUpperCase());
  docTitle.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  docTitle.setHeading(DocumentApp.ParagraphHeading.HEADING1);

  body.appendParagraph(bodyContent);

  body.appendParagraph('');
  body.appendParagraph('');

  // Tanda Tangan
  var place = teacherProfile.signaturePlace || 'Jakarta';
  var dateStr = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'd MMMM yyyy');
  var sigTable = body.appendTable([
    ['Mengetahui,\\nKepala Sekolah\\n\\n\\n\\n' + (schoolProfile.headmasterName || 'Kepala Sekolah') + '\\nNIP. ' + (schoolProfile.headmasterNip || '-'),
     place + ', ' + dateStr + '\\nGuru Mata Pelajaran\\n\\n\\n\\n' + (teacherProfile.fullName || 'Guru') + '\\nNIP. ' + (teacherProfile.nip || '-')]
  ]);
  sigTable.setBorderWidth(0);

  doc.saveAndClose();

  return {
    docId: doc.getId(),
    url: doc.getUrl()
  };
}
`,
  },
  {
    filename: "Pdf.gs",
    type: "server",
    description: "Konversi Google Docs atau HTML ke file PDF di Google Drive",
    content: `/**
 * Generate PDF from Google Doc ID
 */
function generatePDFFromDocId(docId) {
  var file = DriveApp.getFileById(docId);
  var pdfBlob = file.getAs('application/pdf');
  var pdfFile = DriveApp.createFile(pdfBlob).setName(file.getName() + '.pdf');
  return {
    pdfId: pdfFile.getId(),
    downloadUrl: pdfFile.getDownloadUrl(),
    viewUrl: pdfFile.getUrl()
  };
}
`,
  },
  {
    filename: "Utils.gs",
    type: "server",
    description: "Fungsi utilitas formatting tanggal, angka, dan validator",
    content: `/**
 * Helper Utilities
 */
function formatIndonesianDate(d) {
  var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  var date = new Date(d);
  return date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
}
`,
  }
];

export const FULL_GAS_CODE_BUNDLE: string = GAS_FILES_BUNDLE.map(
  (f) => `// ===================== [FILE: ${f.filename}] (${f.description}) =====================\n${f.content}`
).join("\n\n");
