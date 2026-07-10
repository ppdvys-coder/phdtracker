// PhD Journey Tracker — component (runs in the browser via Babel standalone; see index.html)
const { useState, useEffect, useMemo } = React;

// ---- UCL palette ----
const AUB="#2B1241", AUB2="#6B4E8C", CARD="#F3EEF8", OFF="#FAFAFA", BORDER="#E5E5E5",
      GREEN="#2E7D32", AMBER="#ED6C02", GREY="#9E9E9E", RED="#DC2626", INK="#1f2430";

// ---- i18n ----
const TXT = {
  en: {
    started:"PhD started 25 Sep 2023", domain:"digital transformation readiness in university EFM",
    savedAuto:"Edits save automatically", saved:"Saved", loading:"Loading…", toVerify:"red fields to verify",
    addRow:"+ Add row", exportCSV:"Export CSV", reset:"Reset to seed data", clickEdit:"Click any cell to edit · saves automatically",
    addEntry:"+ Add entry", save:"Save", cancel:"Cancel", del:"Delete", addPart:"+ Add participant",
    list:"List", calendar:"Calendar", folder:"Folder", vault:"Obsidian vault", today:"Today",
    calHint:"Double-click a day to add an entry · click a chip to edit", undated:"Undated / partial-date entries",
    openObs:"Open in Obsidian", legend:"Red text = an assumption / estimate — edit it to confirm and it turns black.",
    newRec:"New activity record", editRec:"Edit activity record", journey:"Jump along your journey",
    dragHint:"Drag a card between stages — or use the ‹ › arrows (works on touch). Stage placements are my reading of your sheet; correct freely.",
    entries:"entries · saves automatically", saves:"saves automatically",
    kOverall:"Overall progress", kMile:"Milestones done", kIntv:"Interviews done", kCont:"Contacts",
    kEv:"Events logged", kPap:"Papers in pipeline", kAct:"Activities logged",
    byPhase:"Progress by phase", pubPipe:"Publication pipeline", evBox:"Events",
    avg:"avg of timeline", fu:"follow-ups due", att:"attended", editPart:"Edit participant", newPart:"New participant",
    placeholder_date:"YYYY-MM-DD", placeholder_obs:"note name, or obsidian:// / https link", placeholder_person:"type or pick a person",
    vaultHint:"Set an Obsidian vault name (top of tab) to make this clickable", note:"note",
    actSummary:"Activity summary — from your log", actSummarySub:"Add an activity in the Activity Log and everything here updates automatically.",
    last30:"Last 30 days", recent:"Recent activity", logged:"logged", hoursShort:"h", allRoles:"All roles", noAct:"No activities logged yet.",
    cvDownMd:"Download · Markdown", cvDownHtml:"Download · HTML (print to PDF)", cvManual:"Editable details", cvNote:"Auto-built from your tabs. Edit the fields on the left; the rest updates as you log activities.",
    rpCaption:"Your research plan as presented at the MPhil→PhD upgrade (14 May 2025).",
    rpNote:"Plan of record — your live progress lives on the Timeline and Activity tabs.",
    rfGap:"Research Gap", rfAcademic:"Academic gap", rfPractical:"Practical gap", rfContribution:"Contribution",
    rfAim:"Research Aim", rfObj:"Objectives", rfRQ:"Research Questions", rfOutcome:"intended outcome",
    rfHistory:"Version history", rfSaveVer:"Save version", rfVerNote:"note what changed (optional)",
    rfViewing:"Viewing a saved version", rfRestore:"Restore this version", rfBackCurrent:"Back to current",
    rfUpdated:"last edited", rfView:"View", rfNoVersions:"No saved versions yet.", rfAddObj:"+ objective", rfAddRQ:"+ question",
    rfSavedHint:"Save a version whenever your framing shifts — you'll be able to look back over your journey.",
  },
  th: {
    started:"เริ่มปริญญาเอก 25 ก.ย. 2023", domain:"ความพร้อมการเปลี่ยนผ่านดิจิทัลในงานบริหารอาคารสถานที่มหาวิทยาลัย",
    savedAuto:"บันทึกอัตโนมัติ", saved:"บันทึกเมื่อ", loading:"กำลังโหลด…", toVerify:"ช่องสีแดงที่ต้องตรวจสอบ",
    addRow:"+ เพิ่มแถว", exportCSV:"ส่งออก CSV", reset:"รีเซ็ตเป็นข้อมูลตั้งต้น", clickEdit:"คลิกช่องใดก็ได้เพื่อแก้ไข · บันทึกอัตโนมัติ",
    addEntry:"+ เพิ่มรายการ", save:"บันทึก", cancel:"ยกเลิก", del:"ลบ", addPart:"+ เพิ่มผู้เข้าร่วม",
    list:"รายการ", calendar:"ปฏิทิน", folder:"โฟลเดอร์", vault:"วอลต์ Obsidian", today:"วันนี้",
    calHint:"ดับเบิลคลิกที่วันเพื่อเพิ่มรายการ · คลิกป้ายเพื่อแก้ไข", undated:"รายการที่ไม่มีวันที่ / วันที่ไม่ครบ",
    openObs:"เปิดใน Obsidian", legend:"ข้อความสีแดง = ข้อสันนิษฐาน/ประมาณการ — แก้ไขเพื่อยืนยัน แล้วจะเปลี่ยนเป็นสีดำ",
    newRec:"บันทึกกิจกรรมใหม่", editRec:"แก้ไขบันทึกกิจกรรม", journey:"เลื่อนดูเส้นทางของคุณ",
    dragHint:"ลากการ์ดเพื่อย้ายขั้นตอน หรือใช้ลูกศร ‹ › (ใช้ได้บนจอสัมผัส) · ตำแหน่งเป็นการอ่านจากชีตของคุณ แก้ไขได้ตามจริง",
    entries:"รายการ · บันทึกอัตโนมัติ", saves:"บันทึกอัตโนมัติ",
    kOverall:"ความก้าวหน้ารวม", kMile:"หมุดหมายที่เสร็จ", kIntv:"สัมภาษณ์เสร็จ", kCont:"ผู้ติดต่อ",
    kEv:"กิจกรรมที่บันทึก", kPap:"บทความที่กำลังทำ", kAct:"กิจกรรมที่บันทึก",
    byPhase:"ความก้าวหน้าตามระยะ", pubPipe:"สถานะบทความ", evBox:"กิจกรรม",
    avg:"เฉลี่ยจากไทม์ไลน์", fu:"ต้องติดตาม", att:"เข้าร่วมแล้ว", editPart:"แก้ไขผู้เข้าร่วม", newPart:"เพิ่มผู้เข้าร่วม",
    placeholder_date:"ปปปป-ดด-วว", placeholder_obs:"ชื่อโน้ต หรือ obsidian:// / ลิงก์ https", placeholder_person:"พิมพ์หรือเลือกบุคคล",
    vaultHint:"ตั้งชื่อวอลต์ Obsidian (ด้านบนแท็บ) เพื่อให้คลิกเปิดได้", note:"โน้ต",
    actSummary:"สรุปกิจกรรม — จากบันทึกของคุณ", actSummarySub:"เพิ่มกิจกรรมในบันทึกกิจกรรม แล้วทุกอย่างที่นี่จะอัปเดตอัตโนมัติ",
    last30:"30 วันล่าสุด", recent:"กิจกรรมล่าสุด", logged:"บันทึกแล้ว", hoursShort:"ชม.", allRoles:"ทุกบทบาท", noAct:"ยังไม่มีบันทึกกิจกรรม",
    cvDownMd:"ดาวน์โหลด · Markdown", cvDownHtml:"ดาวน์โหลด · HTML (พิมพ์เป็น PDF)", cvManual:"ข้อมูลที่แก้ไขได้", cvNote:"สร้างอัตโนมัติจากแท็บต่าง ๆ แก้ไขช่องด้านซ้ายได้ ส่วนที่เหลืออัปเดตตามที่คุณบันทึกกิจกรรม",
    rpCaption:"แผนการวิจัยที่นำเสนอตอนสอบอัปเกรด MPhil→PhD (14 พ.ค. 2025)",
    rpNote:"แผนตั้งต้น — ความคืบหน้าจริงอยู่ในแท็บไทม์ไลน์และบันทึกกิจกรรม",
    rfGap:"ช่องว่างงานวิจัย", rfAcademic:"ช่องว่างเชิงวิชาการ", rfPractical:"ช่องว่างเชิงปฏิบัติ", rfContribution:"คุณูปการ",
    rfAim:"เป้าหมายงานวิจัย", rfObj:"วัตถุประสงค์", rfRQ:"คำถามวิจัย", rfOutcome:"ผลลัพธ์ที่ตั้งใจ",
    rfHistory:"ประวัติเวอร์ชัน", rfSaveVer:"บันทึกเวอร์ชัน", rfVerNote:"บันทึกสิ่งที่เปลี่ยน (ไม่บังคับ)",
    rfViewing:"กำลังดูเวอร์ชันที่บันทึกไว้", rfRestore:"กู้คืนเวอร์ชันนี้", rfBackCurrent:"กลับไปเวอร์ชันปัจจุบัน",
    rfUpdated:"แก้ไขล่าสุด", rfView:"ดู", rfNoVersions:"ยังไม่มีเวอร์ชันที่บันทึก", rfAddObj:"+ วัตถุประสงค์", rfAddRQ:"+ คำถาม",
    rfSavedHint:"บันทึกเวอร์ชันทุกครั้งที่กรอบความคิดเปลี่ยน — คุณจะย้อนดูการเดินทางของตัวเองได้",
  },
};
const t = (lang,k) => (TXT[lang] && TXT[lang][k]!=null) ? TXT[lang][k] : (TXT.en[k]!=null?TXT.en[k]:k);

const COL_I18N = {
  "Phase":"ระยะ","Milestone / Task":"หมุดหมาย / งาน","Owner":"ผู้รับผิดชอบ","Planned start":"เริ่ม (แผน)","Planned end":"สิ้นสุด (แผน)",
  "Actual start":"เริ่มจริง","Actual end":"สิ้นสุดจริง","Status":"สถานะ","%":"%","Notes":"หมายเหตุ",
  "Name":"ชื่อ","Role / Title":"ตำแหน่ง","Organisation":"หน่วยงาน","Category":"หมวดหมู่","Relevance":"ความเกี่ยวข้อง",
  "First contact":"ติดต่อครั้งแรก","Last contact":"ติดต่อล่าสุด","Follow-up?":"ติดตาม?","Next action":"สิ่งที่ต้องทำต่อ",
  "Event":"กิจกรรม","Type":"ประเภท","Date":"วันที่","Location":"สถานที่","Role":"บทบาท",
  "Abstract / reg. deadline":"กำหนดส่งบทคัดย่อ / ลงทะเบียน","Output produced":"ผลงานที่ได้","Output location / link":"ที่จัดเก็บ / ลิงก์",
  "Cost":"ค่าใช้จ่าย","Funding":"แหล่งทุน","Paper (working title)":"บทความ (ชื่อชั่วคราว)","Series #":"ลำดับชุด",
  "Target journal":"วารสารเป้าหมาย","Co-authors":"ผู้เขียนร่วม","Submission type":"ประเภทการส่ง","Window opens":"เปิดรับ",
  "Deadline":"กำหนดส่ง","Submitted":"ส่งแล้ว","Decision":"ผลพิจารณา","Meeting type":"ประเภทการประชุม","Met with (people)":"พบกับใคร (แท็กคน)","Project":"โปรเจกต์","Target / end":"เป้าหมาย / สิ้นสุด","Area / type":"ด้าน / ประเภท","Collaborators":"ผู้ร่วมงาน","Start":"เริ่ม",
  "Agenda item / topic":"วาระ / หัวข้อ","Decision / discussion":"ข้อสรุป / การอภิปราย","Action item":"สิ่งที่ต้องทำ","Due":"กำหนด",
  "Activity / record":"กิจกรรม / บันทึก","Linked to (person)":"เชื่อมโยงกับ (บุคคล)","Summary / notes":"สรุป / บันทึก",
  "Obsidian note":"โน้ต Obsidian","Other output / link":"ผลงาน / ลิงก์อื่น","Hours":"ชั่วโมง","Tag":"แท็ก","Role (job)":"บทบาท (งาน)",
  "Task / action":"งาน / การกระทำ","Project / category":"โครงการ / หมวด","Due / deadline":"กำหนดส่ง","Hat":"หมวกงาน","Author(s)":"ผู้แต่ง","Link / DOI":"ลิงก์ / DOI","Tags / themes":"แท็ก / ธีม","Notes / annotation":"บันทึก / หมายเหตุ","Output":"ผลงาน","Link / location":"ลิงก์ / ที่จัดเก็บ","Project / module":"โครงการ / รายวิชา","Idea":"ไอเดีย","Area":"ด้าน","Captured":"บันทึกเมื่อ","Context / activity":"บริบท / กิจกรรม","Reflection":"บันทึกสะท้อน","Linked to":"เชื่อมโยงกับ","Activity type":"ประเภทกิจกรรม","Evidence":"หลักฐาน","Impact":"ผลกระทบ","Relationship type":"ประเภทความสัมพันธ์","Project connection":"เชื่อมโยงโครงการ","Topics discussed":"หัวข้อที่คุย","Importance":"ความสำคัญ","Related files / links":"ไฟล์ / ลิงก์ที่เกี่ยวข้อง","Year":"ปี","Privacy":"ระดับความเป็นส่วนตัว",
  "Academic year":"ปีการศึกษา","Institution":"สถาบัน","Programme / module":"หลักสูตร / รายวิชา","My role":"บทบาทของฉัน","Topic / theme":"หัวข้อ / ธีม",
  "No. students":"จำนวนนักศึกษา","No. scripts":"จำนวนชิ้นงาน","Duration (h)":"ระยะเวลา (ชม.)","Evidence link":"ลิงก์หลักฐาน","Reflection / note":"บันทึกสะท้อน / โน้ต",
  "Privacy level":"ระดับความเป็นส่วนตัว","Use for":"ใช้สำหรับ","Host institution":"สถาบันเจ้าภาพ","Audience":"ผู้ฟัง","Audience size":"จำนวนผู้ฟัง","Possible CV wording":"ถ้อยคำสำหรับ CV",
  "Student (name / ID)":"นักศึกษา (ชื่อ / รหัส)","Level":"ระดับ","Supervision topic / theme":"หัวข้อการควบคุม","Outcome":"ผลลัพธ์",
  "Assessment":"การประเมิน","Assessment type":"ประเภทการประเมิน","Feedback notes":"บันทึกฟีดแบ็ก","Moderation notes":"บันทึกการทวนสอบ","Related record":"บันทึกที่เกี่ยวข้อง","Evidence link / location":"ลิงก์ / ที่จัดเก็บหลักฐาน","People involved":"ผู้เกี่ยวข้อง",
  "Code":"รหัส","First name":"ชื่อ","Last name":"นามสกุล","Interview date":"วันสัมภาษณ์","PIS":"PIS","Consent":"ยินยอม",
  "Signed":"เซ็นแล้ว","Questions sent":"ส่งคำถาม","Interviewed":"สัมภาษณ์แล้ว","Transcribed":"ถอดเทปแล้ว",
};
const colLab = (lang,l) => lang==="th" ? (COL_I18N[l]||l) : l;

const PHASE = ["Lit Review","Methodology","Data Collection","Transcription","Analysis","Findings","Writing","Papers","Milestones","Dissemination"];
const PHASE_TH = {"Lit Review":"ทบทวนวรรณกรรม","Methodology":"ระเบียบวิธีวิจัย","Data Collection":"เก็บข้อมูล","Transcription":"ถอดเทป","Analysis":"วิเคราะห์","Findings":"ผลการศึกษา","Writing":"การเขียน","Papers":"บทความ","Milestones":"หมุดหมาย","Dissemination":"เผยแพร่"};
const TSTAT = ["Not started","In progress","Completed","Blocked"];
const STAT_COLOR = { "Completed":GREEN,"In progress":AMBER,"Not started":GREY,"Blocked":RED,"Attended":GREEN,"Presented":GREEN,
  "Registered":AMBER,"Abstract submitted":AMBER,"Idea":GREY,"Accepted":GREEN,"Under review":AMBER,"Submitted":AMBER,
  "Drafting":GREY,"Outline":GREY,"Planned":GREY,"Revisions":AMBER,"Rejected":RED,"Yes":AMBER,"No":GREY,
  "Done":GREEN,"Awaiting":AMBER,"New":GREY,"Exploring":AMBER,"Parked":GREY,"Using":GREEN,"Dropped":RED,"Active":GREEN,"On hold":AMBER };

const ACT_CATS = ["Meeting","Interview","Note","Reading","Writing","Data Collection","Analysis","Teaching – prep","Teaching – delivery","Marking","Student support","Training / Event","Paper","Admin","Milestone","Other"];
const ACT_COLOR = { "Meeting":"#ED6C02","Interview":"#0277BD","Note":"#455A64","Reading":"#6B4E8C","Writing":"#2B1241",
  "Data Collection":"#1565C0","Analysis":"#00796B","Training / Event":"#7B1FA2","Paper":"#C2185B","Admin":"#5D7079",
  "Teaching – prep":"#0288D1","Teaching – delivery":"#0277BD","Marking":"#01579B","Student support":"#039BE5",
  "Milestone":"#2E7D32","Other":"#9E9E9E","Uncategorised":"#9E9E9E" };

// ---- Roles (timeline-based) ----
const ROLES = ["PhD","Chula Lecturer","BSSC Lecturer","BSSC PGTA","Service/Admin","Personal","Unassigned"];
const ROLE_META = {
  "Unassigned":{th:"ยังไม่จัดหมวด", c:"#9E9E9E", period:"", start:""},
  "PhD":{th:"ปริญญาเอก", c:"#2B1241", period:"Sep 2023 – present", start:"2023-09-25"},
  "Chula Lecturer":{th:"อาจารย์ จุฬาฯ", c:"#C2185B", period:"Sep 2024 – present", start:"2024-09-01"},
  "BSSC Lecturer":{th:"อาจารย์ BSSC", c:"#00796B", period:"Nov 2025 – present", start:"2025-11-01"},
  "BSSC PGTA":{th:"ผู้ช่วยสอน BSSC (PGTA)", c:"#0277BD", period:"Jan 2025 – present", start:"2025-01-13"},
  "Service/Admin":{th:"บริการ / ธุรการ", c:"#5D7079", period:"", start:""},
  "Personal":{th:"ส่วนตัว", c:"#ED6C02", period:"", start:""},
  // legacy aliases so pre-migration data still resolves labels/colours
  "Lecturer":{th:"อาจารย์ BSSC", c:"#00796B", period:"Nov 2025 – present"},
  "PGTA":{th:"ผู้ช่วยสอน BSSC (PGTA)", c:"#0277BD", period:"Jan 2025 – present"},
  "Teaching":{th:"งานสอน", c:"#0277BD", period:""},
};
const roleStart = r => ROLE_META[r] ? (ROLE_META[r].start || "") : "";
function elapsedLabel(startStr, lang) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startStr || "")) return "";
  const s = new Date(startStr), n = new Date();
  let mo = (n.getFullYear() - s.getFullYear()) * 12 + (n.getMonth() - s.getMonth());
  if (n.getDate() < s.getDate()) mo--;
  if (mo < 0) return "";
  const y = Math.floor(mo / 12), m = mo % 12;
  return lang === "th" ? `${y} ปี ${m} เดือน` : `${y}y ${m}m`;
}
const roleLab = (lang,r) => lang==="th" ? (ROLE_META[r] ? ROLE_META[r].th : r) : r;
const roleColor = r => ROLE_META[r] ? ROLE_META[r].c : GREY;
const rolePeriod = r => ROLE_META[r] ? (ROLE_META[r].period || "") : "";
const roleOf = r => (r && r.role) ? r.role : "PhD";
const TEACH_SPLIT = "2025-11-01"; // teaching before = PGTA, on/after = Lecturer

const ACTIVITY_TYPES = ["Attended seminar","Gave lecture","Marked assignments","Committee meeting","Organised event","Reviewed paper","Attended conference","Supported student","Met collaborator","Prepared teaching material","Interview (fieldwork)","Supervision meeting","Reading","Writing","Other"];
const CONTACT_CATS = ["Supervisor","UCL Estates contact","Academic collaborator","Teaching colleague","Student-related contact","Conference contact","Potential examiner","Potential co-author","External stakeholder","Interviewee","Visiting host","Network – workshop","Other"];
const PRIVACY = ["Private","Internal","Shareable"];
const SUP_TEAM_SEED = [
  { role:"Primary supervisor", name:"Prof. Michael Pitt", org:"UCL Bartlett (BSSC)", link:"https://profiles.ucl.ac.uk/29458-michael-pitt" },
  { role:"Secondary supervisor", name:"Prof. Qiuchen Lu (Vivi)", org:"UCL Bartlett (BSSC)", link:"https://www.linkedin.com/in/qiuchen-lu-930621171/" },
  { role:"Third supervisor", name:"Junpeng Lyu", org:"UCL Bartlett (BSSC)", link:"https://profiles.ucl.ac.uk/79102-junpeng-lyu" },
  { role:"Funder — UCL Estates", name:"Adrien Cooper", org:"UCL Estates", link:"https://www.linkedin.com/in/adrien-cooper-00745929/" },
];
const PRIVACY_L = ["Public","Internal","Private","Confidential","Anonymised student data","Sensitive student data"];
const USE_FOR = ["CV","Annual review","HEA Fellowship","Promotion","Teaching portfolio","Workload evidence","Academic career evidence","Not for export"];
const TS_TYPES = ["Lecture","Tutorial","Seminar","Workshop","Studio","Lab","Other"];
const TS_ROLES = ["Lecturer","PGTA","Tutor","Demonstrator","Co-teacher"];
const GL_TYPES = ["Guest lecture","Invited talk","Keynote","Panel","Masterclass","Seminar"];
const GL_ROLES = ["Guest lecturer","Invited speaker","Keynote speaker","Panellist"];
const SUP_LEVELS = ["Undergraduate","Masters","MPhil","PhD","Other"];
const SUP_ROLES = ["Supervisor","Primary supervisor","Secondary supervisor","Co-supervisor","Informal supervisor","Advisor"];
const SUP_STATUS = ["Active","Completed","Paused","Withdrawn"];
const MK_TYPES = ["Coursework","Exam","Report","Presentation","Dissertation","Portfolio","Practical","Other"];
const MK_ROLES = ["Marker","Second marker","Moderator","Internal examiner"];
const TE_TYPES = ["Slides","Feedback","Peer observation","Certificate","Teaching material","Module contribution","Student engagement","Other"];

// unified teaching records across the lecturer stores (title normalised to `activity`)
function teachRecs(data) {
  const out = [];
  (data.teachingSessions || []).forEach(r => out.push({ role: r.role || "Lecturer", activity: r.title || "", date: r.date || "", topic: r.topic || "" }));
  (data.marking || []).forEach(r => out.push({ role: r.role && /marker|examiner|moderat/i.test(r.role) ? "Lecturer" : (r.role || "Lecturer"), activity: `Marking: ${r.title || ""}`, date: r.date || "", topic: "" }));
  (data.guestLectures || []).forEach(r => out.push({ role: "Lecturer", activity: `Guest lecture: ${r.title || ""}`, date: r.date || "", topic: r.topic || "" }));
  return out;
}
// unified role-tagged records for workload (activity + lecturer stores)
function roleRecords(data) {
  const out = [];
  const teachHat = r => /pgta/i.test(r || "") ? "BSSC PGTA" : "BSSC Lecturer";
  (data.activity || []).forEach(r => out.push({ role: roleOf(r), hours: Number(r.hours) || 0, date: r.date || "", activity: r.activity || "", category: r.category || "" }));
  (data.teachingSessions || []).forEach(r => out.push({ role: teachHat(r.role), hours: Number(r.hours) || 0, date: r.date || "", activity: r.title || "", category: "Teaching session" }));
  (data.marking || []).forEach(r => out.push({ role: "BSSC Lecturer", hours: Number(r.hours) || 0, date: r.date || "", activity: `Marking: ${r.title || ""}`, category: "Marking" }));
  (data.guestLectures || []).forEach(r => out.push({ role: "BSSC Lecturer", hours: Number(r.hours) || 0, date: r.date || "", activity: `Guest lecture: ${r.title || ""}`, category: "Guest lecture" }));
  return out;
}

const PHASES_IV = [
  {k:"Invited", en:"Invited", th:"เชิญแล้ว", c:"#9E9E9E"},
  {k:"Scheduled", en:"Scheduled", th:"นัดแล้ว", c:"#5D7079"},
  {k:"Consent", en:"Consent signed", th:"เซ็นยินยอมแล้ว", c:"#6B4E8C"},
  {k:"Questions", en:"Questions sent", th:"ส่งคำถามแล้ว", c:"#0277BD"},
  {k:"Interviewed", en:"Interviewed", th:"สัมภาษณ์แล้ว", c:"#ED6C02"},
  {k:"Transcribed", en:"Transcribed", th:"ถอดเทปแล้ว", c:"#2E7D32"},
  {k:"Parked", en:"On hold / parked", th:"พัก / รอ", c:"#C2185B"},
];
const IV_STAGES = [["pis","PIS"],["consent","Consent"],["signed","Signed"],["qsent","Q"],["interviewed","Int"],["transcribed","Tx"]];

const navBtn = { width:30, height:30, border:`1px solid ${BORDER}`, background:"#fff", color:AUB, borderRadius:6, cursor:"pointer", fontSize:16, lineHeight:1 };

function obsHref(val, vault) {
  if (!val) return null;
  const v = String(val).trim();
  if (/^(obsidian:|https?:|file:)/i.test(v)) return v;
  if (vault) return `obsidian://open?vault=${encodeURIComponent(vault)}&file=${encodeURIComponent(v)}`;
  return null;
}

const cols = {
  timeline: [
    {k:"phase",l:"Phase",w:130,type:"select",opts:PHASE},
    {k:"task",l:"Milestone / Task",w:260},{k:"owner",l:"Owner",w:80},
    {k:"pStart",l:"Planned start",w:104},{k:"pEnd",l:"Planned end",w:104},
    {k:"aStart",l:"Actual start",w:104},{k:"aEnd",l:"Actual end",w:104},
    {k:"status",l:"Status",w:120,type:"select",opts:TSTAT},{k:"pct",l:"%",w:60,type:"number"},{k:"notes",l:"Notes",w:240},
  ],
  contacts: [
    {k:"name",l:"Name",w:180},{k:"role",l:"Role / Title",w:180},{k:"org",l:"Organisation",w:150},
    {k:"category",l:"Category",w:170,type:"select",opts:CONTACT_CATS},
    {k:"relevance",l:"Relevance",w:220},{k:"first",l:"First contact",w:104},{k:"last",l:"Last contact",w:104},
    {k:"follow",l:"Follow-up?",w:96,type:"select",opts:["Yes","No"]},{k:"next",l:"Next action",w:160},{k:"notes",l:"Notes",w:180},
    {k:"reltype",l:"Relationship type",w:150},{k:"projconn",l:"Project connection",w:150},{k:"topics",l:"Topics discussed",w:200},
    {k:"importance",l:"Importance",w:110,type:"select",opts:["High","Medium","Low"]},{k:"relfiles",l:"Related files / links",w:180},
  ],
  events: [
    {k:"event",l:"Event",w:200},{k:"etype",l:"Type",w:110,type:"select",opts:["Conference","Workshop","Seminar","Networking","Training","Symposium","Other"]},
    {k:"date",l:"Date",w:104},{k:"location",l:"Location",w:140},{k:"erole",l:"Role",w:100},
    {k:"status",l:"Status",w:140,type:"select",opts:["Idea","Abstract submitted","Registered","Attended","Presented","Not started"]},
    {k:"deadline",l:"Abstract / reg. deadline",w:120},{k:"output",l:"Output produced",w:150},
    {k:"link",l:"Output location / link",w:200},{k:"cost",l:"Cost",w:70},{k:"funding",l:"Funding",w:100},{k:"notes",l:"Notes",w:200},
  ],
  publications: [
    {k:"paper",l:"Paper (working title)",w:240},{k:"series",l:"Series #",w:70},{k:"ptype",l:"Type",w:140},
    {k:"journal",l:"Target journal",w:200},{k:"coauthors",l:"Co-authors",w:130},
    {k:"status",l:"Status",w:120,type:"select",opts:["Idea","Planned","Outline","Drafting","Submitted","Under review","Revisions","Accepted","Rejected"]},
    {k:"subtype",l:"Submission type",w:130},{k:"opens",l:"Window opens",w:110},{k:"deadline",l:"Deadline",w:104},
    {k:"submitted",l:"Submitted",w:100},{k:"decision",l:"Decision",w:100},{k:"notes",l:"Notes",w:200},
  ],
  supervisor: [
    {k:"date",l:"Date",w:90},{k:"mtype",l:"Meeting type",w:120},{k:"with",l:"Met with (people)",w:180},{k:"agenda",l:"Agenda item / topic",w:280},
    {k:"decision",l:"Decision / discussion",w:220},{k:"action",l:"Action item",w:220},{k:"owner",l:"Owner",w:80},
    {k:"due",l:"Due",w:90},{k:"status",l:"Status",w:120,type:"select",opts:TSTAT},
  ],
  activity: [
    {k:"date",l:"Date",w:104},{k:"category",l:"Category",w:140,type:"select",opts:ACT_CATS},
    {k:"activity",l:"Activity / record",w:230},{k:"linked",l:"Linked to (person)",w:160},
    {k:"detail",l:"Summary / notes",w:280},{k:"obsidian",l:"Obsidian note",w:180},
    {k:"output",l:"Other output / link",w:180},{k:"hours",l:"Hours",w:66,type:"number"},{k:"tag",l:"Tag",w:110},
    {k:"role",l:"Role (job)",w:120,type:"select",opts:ROLES},
    {k:"acttype",l:"Activity type",w:160,type:"select",opts:ACTIVITY_TYPES},
    {k:"evidence",l:"Evidence",w:160},{k:"reflection",l:"Reflection",w:220},{k:"impact",l:"Impact",w:200},
    {k:"privacy",l:"Privacy",w:110,type:"select",opts:PRIVACY},
  ],
  interviews: [
    {k:"code",l:"Code",w:60},{k:"first",l:"First name",w:120},{k:"last",l:"Last name",w:120},
    {k:"date",l:"Interview date",w:120},{k:"phase",l:"Phase",w:130},
    {k:"pis",l:"PIS",w:60},{k:"consent",l:"Consent",w:70},{k:"signed",l:"Signed",w:70},
    {k:"qsent",l:"Questions sent",w:90},{k:"interviewed",l:"Interviewed",w:90},{k:"transcribed",l:"Transcribed",w:90},{k:"note",l:"Notes",w:220},
  ],
  tasks: [
    {k:"title",l:"Task / action",w:300},{k:"status",l:"Status",w:130,type:"select",opts:["Not started","In progress","Awaiting","Done"]},
    {k:"role",l:"Hat",w:110,type:"select",opts:ROLES},{k:"category",l:"Project / category",w:160},{k:"due",l:"Due / deadline",w:120},{k:"notes",l:"Notes",w:240},
  ],
  sources: [
    {k:"title",l:"Title",w:280},{k:"authors",l:"Author(s)",w:160},{k:"stype",l:"Type",w:130,type:"select",opts:["Journal article","Book","Report","Conference","Thesis","Web","Standard","Other"]},
    {k:"year",l:"Year",w:70},{k:"link",l:"Link / DOI",w:180},{k:"role",l:"Hat",w:100,type:"select",opts:ROLES},{k:"tags",l:"Tags / themes",w:160},{k:"notes",l:"Notes / annotation",w:260},
  ],
  outputs: [
    {k:"title",l:"Output",w:280},{k:"otype",l:"Type",w:150,type:"select",opts:["Paper","Presentation","Slide deck","Teaching material","Report","Poster","Dataset","Software / tool","Blog","Other"]},
    {k:"date",l:"Date",w:110},{k:"role",l:"Hat",w:100,type:"select",opts:ROLES},{k:"link",l:"Link / location",w:200},{k:"category",l:"Project / module",w:150},{k:"notes",l:"Notes",w:200},{k:"privacy",l:"Privacy",w:110,type:"select",opts:PRIVACY},
  ],
  ideas: [
    {k:"idea",l:"Idea",w:340},{k:"category",l:"Area",w:150},{k:"role",l:"Hat",w:100,type:"select",opts:ROLES},{k:"date",l:"Captured",w:110},
    {k:"status",l:"Status",w:130,type:"select",opts:["New","Exploring","Parked","Using","Dropped"]},{k:"notes",l:"Notes",w:240},
  ],
  projects: [
    {k:"title",l:"Project",w:250},{k:"role",l:"Role",w:130,type:"select",opts:ROLES},
    {k:"status",l:"Status",w:130,type:"select",opts:["Idea","Planned","Active","On hold","Completed","Dropped"]},
    {k:"start",l:"Start",w:104},{k:"end",l:"Target / end",w:104},{k:"category",l:"Area / type",w:150},
    {k:"people",l:"Collaborators",w:170},{k:"link",l:"Link / location",w:190},{k:"notes",l:"Notes",w:280},
  ],
  reflections: [
    {k:"date",l:"Date",w:110},{k:"role",l:"Hat",w:100,type:"select",opts:ROLES},{k:"context",l:"Context / activity",w:200},{k:"reflection",l:"Reflection",w:360},{k:"linked",l:"Linked to",w:150},{k:"privacy",l:"Privacy",w:110,type:"select",opts:PRIVACY},
  ],
  teachingSessions: [
    {k:"title",l:"Title",w:240},{k:"date",l:"Date",w:104},{k:"ay",l:"Academic year",w:110},{k:"institution",l:"Institution",w:150},
    {k:"programme",l:"Programme / module",w:150},{k:"type",l:"Type",w:120,type:"select",opts:TS_TYPES},{k:"role",l:"My role",w:120,type:"select",opts:TS_ROLES},
    {k:"topic",l:"Topic / theme",w:200},{k:"nstudents",l:"No. students",w:90,type:"number"},{k:"hours",l:"Duration (h)",w:90,type:"number"},
    {k:"evidence",l:"Evidence link",w:170},{k:"note",l:"Reflection / note",w:220},{k:"tags",l:"Tags",w:120},
    {k:"privacy",l:"Privacy level",w:150,type:"select",opts:PRIVACY_L},{k:"usefor",l:"Use for",w:150,type:"select",opts:USE_FOR},
  ],
  guestLectures: [
    {k:"title",l:"Title",w:240},{k:"date",l:"Date",w:104},{k:"ay",l:"Academic year",w:110},{k:"institution",l:"Host institution",w:170},
    {k:"programme",l:"Programme / module",w:150},{k:"type",l:"Type",w:130,type:"select",opts:GL_TYPES},{k:"role",l:"My role",w:130,type:"select",opts:GL_ROLES},
    {k:"topic",l:"Topic / theme",w:200},{k:"audience",l:"Audience",w:150},{k:"nstudents",l:"Audience size",w:100,type:"number"},
    {k:"evidence",l:"Evidence link",w:170},{k:"cvwording",l:"Possible CV wording",w:260},{k:"note",l:"Reflection / note",w:200},{k:"tags",l:"Tags",w:120},
    {k:"privacy",l:"Privacy level",w:150,type:"select",opts:PRIVACY_L},{k:"usefor",l:"Use for",w:150,type:"select",opts:USE_FOR},
  ],
  supervision: [
    {k:"title",l:"Student (name / ID)",w:220},{k:"level",l:"Level",w:130,type:"select",opts:SUP_LEVELS},{k:"programme",l:"Programme",w:180},
    {k:"institution",l:"Institution",w:160},{k:"ay",l:"Academic year",w:110},{k:"topic",l:"Supervision topic / theme",w:240},
    {k:"role",l:"My role",w:150,type:"select",opts:SUP_ROLES},{k:"status",l:"Status",w:120,type:"select",opts:SUP_STATUS},{k:"outcome",l:"Outcome",w:160},
    {k:"nstudents",l:"No. students",w:90,type:"number"},{k:"evidence",l:"Evidence link",w:160},{k:"note",l:"Reflection / note",w:200},{k:"tags",l:"Tags",w:120},
    {k:"privacy",l:"Privacy level",w:160,type:"select",opts:PRIVACY_L},{k:"usefor",l:"Use for",w:150,type:"select",opts:USE_FOR},
  ],
  marking: [
    {k:"title",l:"Assessment",w:220},{k:"date",l:"Date",w:104},{k:"ay",l:"Academic year",w:110},{k:"institution",l:"Institution",w:150},
    {k:"programme",l:"Programme / module",w:150},{k:"type",l:"Assessment type",w:140,type:"select",opts:MK_TYPES},{k:"role",l:"My role",w:130,type:"select",opts:MK_ROLES},
    {k:"nstudents",l:"No. scripts",w:90,type:"number"},{k:"hours",l:"Duration (h)",w:90,type:"number"},{k:"feedback",l:"Feedback notes",w:220},{k:"moderation",l:"Moderation notes",w:200},
    {k:"evidence",l:"Evidence link",w:160},{k:"note",l:"Reflection / note",w:180},{k:"tags",l:"Tags",w:120},
    {k:"privacy",l:"Privacy level",w:160,type:"select",opts:PRIVACY_L},{k:"usefor",l:"Use for",w:150,type:"select",opts:USE_FOR},
  ],
  teachingEvidence: [
    {k:"title",l:"Title",w:240},{k:"date",l:"Date",w:104},{k:"ay",l:"Academic year",w:110},{k:"type",l:"Type",w:160,type:"select",opts:TE_TYPES},
    {k:"programme",l:"Programme / module",w:150},{k:"evidence",l:"Evidence link / location",w:220},{k:"related",l:"Related record",w:180},
    {k:"note",l:"Reflection / note",w:220},{k:"tags",l:"Tags",w:120},{k:"privacy",l:"Privacy level",w:160,type:"select",opts:PRIVACY_L},{k:"usefor",l:"Use for",w:150,type:"select",opts:USE_FOR},
  ],
};

const row = (keys, vals, a=[]) => { const o={_a:a}; keys.forEach((k,i)=>o[k]=vals[i]??""); return o; };
const tk=cols.timeline.map(c=>c.k), ck=cols.contacts.map(c=>c.k), ek=cols.events.map(c=>c.k),
      pk=cols.publications.map(c=>c.k), sk=cols.supervisor.map(c=>c.k), ak=cols.activity.map(c=>c.k);
const iv = (code,first,last,date,phase,f,note="") => ({_a:[],code,first,last,date,phase,
  pis:!!f[0],consent:!!f[1],signed:!!f[2],qsent:!!f[3],interviewed:!!f[4],transcribed:!!f[5],note});

const STARTER_PROJECTS = [
  { _a:[], title:"MyCampus — UCL Estates IWMS transformation", role:"PhD", status:"Active", start:"2024-01", end:"", category:"Fieldwork / applied research", people:"UCL Estates; Adrien Cooper", link:"", notes:"Embedded doctoral research; benefits realisation + readiness case" },
  { _a:[], title:"Smart Campus Readiness Framework (thesis)", role:"PhD", status:"Active", start:"2023-10", end:"2027", category:"Thesis", people:"Michael Pitt; Vivi (Qiuchen Lu); Junpeng Lyu", link:"", notes:"Core PhD framework" },
  { _a:[], title:"TU Delft paper series (4 papers)", role:"PhD", status:"Active", start:"2025-07", end:"", category:"Publications", people:"TU Delft; Sanjana", link:"", notes:"See Publications tab" },
  { _a:[], title:"Urban Digital Twins — KTU Spring School", role:"PhD", status:"Completed", start:"2026-05-11", end:"2026-05-15", category:"Workshop", people:"4 PhD peers", link:"https://fcea.ktu.edu/spring-school-2026/", notes:"Digital-twin platform pitch + demo" },
  { _a:[], title:"BIDI0002 / BIDI0005 tutorials & marking", role:"BSSC PGTA", status:"Active", start:"2025-01", end:"", category:"Teaching", people:"Michael Pitt; Vivi (Qiuchen Lu); Karim Farghaly", link:"", notes:"PGTA modules" },
];
const seed = () => { const S = ({
  meta: { lang:"en", vault:"" },
  timeline: [
    row(tk,["Milestones","PhD registration / start","Pun","2023-09-25","","2023-09-25","","Completed",100,"Start of programme"]),
    row(tk,["Lit Review","Systematic literature review (CREM / EFM / digital readiness)","Pun","2023-10","2025-09","2023-10","","In progress",70,"Ongoing; feeds framework"],["pStart","pEnd","aStart","pct"]),
    row(tk,["Lit Review","Six-pillar readiness framework — conceptual build","Pun","2024-01","2025-06","2024-01","","In progress",60,"Six pillars"],["pStart","pEnd","aStart","pct"]),
    row(tk,["Methodology","Research design & qualitative strategy","Pun","2024-01","2025-02","2024-01","2025-02","Completed",100,"Case study: UCL MyCampus"],["pStart","pEnd","aStart","aEnd"]),
    row(tk,["Milestones","Pre-upgrade review","Pun","2025-02-25","","2025-02-25","","Completed",100,""]),
    row(tk,["Milestones","Upgrade viva","Pun","2025-05-14","","2025-05-14","","Completed",100,""]),
    row(tk,["Milestones","Upgrade confirmed — successful","Pun","2025-05-21","","2025-05-21","","Completed",100,"Passed"]),
    row(tk,["Methodology","Ethics approval","Pun","","2025-06-05","","2025-06-05","Completed",100,"Granted 5 Jun 2025"]),
    row(tk,["Data Collection","Interviews P1–P12 (UCL Estates)","Pun","2026-03","2026-05","2026-03","2026-05","Completed",100,"Mar–May 2026 — see Interview Progress"]),
    row(tk,["Data Collection","Interviews P14–P19 (second cohort)","Pun","2026-06","2026-07","2026-06","","In progress",60,"Jun–Jul 2026"]),
    row(tk,["Transcription","Clean .vtt transcripts (intelligent verbatim)","Pun","2026-06","","2026-06","","In progress",30,"Flag domain-term errors"],["pct"]),
    row(tk,["Analysis","Build anchor codebook (Ian Dancy + Max Lee)","Pun","","","","","Not started",0,"NVivo 15 — first priority"]),
    row(tk,["Analysis","Hybrid deductive–inductive coding (all transcripts)","Pun","","","","","Not started",0,""]),
    row(tk,["Analysis","Cross-level matrix (pillars × interviewee level)","Pun","","","","","Not started",0,"Analytical centrepiece"]),
    row(tk,["Findings","Write findings: decision-ownership vacuum","Pun","","","","","Not started",0,"Governance-as-primary-constraint headline"]),
    row(tk,["Writing","Thesis chapters (intro / lit / method / findings / disc)","Pun","","","","","Not started",0,""]),
    row(tk,["Papers","TU Delft series — see Publications tab","Pun+Collab","2025-07","2026-06","","","Not started",0,"4 linked papers"],["pStart","pEnd"]),
    row(tk,["Dissemination","Urban Digital Twin Spring School (KTU)","Pun","2026-05-11","2026-05-15","2026-05-11","2026-05-15","Completed",100,"Teamed with 4 PhD students"]),
    row(tk,["Milestones","Thesis submission & viva","Pun","","","","","Not started",0,"Target date TBC"]),
  ],
  contacts: [
    row(ck,["Emma Shirbon","Asst Dir, Compliance & Performance","UCL Estates","Interviewee","P1","","2026-03-13","No","",""]),
    row(ck,["Monte Jacob","IWMS/MyCampus Implementation Mgr","UCL Estates","Interviewee","P2","","2026-03-23","No","",""]),
    row(ck,["Mohammed Aufogul (Mo)","Dir, Digital Campus Delivery","UCL Estates","Interviewee","P3","","","No","",""]),
    row(ck,["Eleanor O'Reilly","Head of Estates PMO","UCL Estates","Interviewee","P4","","2026-03-25","No","",""]),
    row(ck,["Nafisa Bhamji-Patel","IT / Digital Transformation","UCL Estates","Interviewee","P5","","2026-04-28","No","",""]),
    row(ck,["Michelle Smidak","Head of Maintenance Operations","UCL Estates","Interviewee","P6","","2026-04-30","No","",""]),
    row(ck,["Darren Perry","Customer Help Desk Manager","UCL Estates","Interviewee","P7","","2026-05-08","No","",""]),
    row(ck,["Aisling Phillips-Smith (Ash)","MyCampus Change Lead","UCL Estates","Interviewee","P8","","2026-05-01","No","",""]),
    row(ck,["Lloyd Naylor","Head of Digital Transformation","UCL Estates","Interviewee","P9","","2026-05-05","No","",""]),
    row(ck,["Simon Lockhart","Estates Manager, IWMS/CDE","UCL Estates","Interviewee","P10","","2026-05-22","No","",""]),
    row(ck,["Ian Dancy","Director of Estates","UCL Estates","Interviewee","P11","","2026-05-29","No","",""]),
    row(ck,["Max Lee","Estates Information Mgr, BIM/CDE","UCL Estates","Interviewee","P12 — governance-gap anchor","","2026-05-29","No","Use as codebook anchor",""]),
    row(ck,["Joe Jones","Data Strategy / Prioritisation","UCL Estates Division","Interviewee","P16 — built joint Estates+ISD pipeline","","2026-06-23","Yes","Follow-up call",""]),
    row(ck,["Anoop Valiyaveliyil Babu","Assoc. Solution Architect","UCL R&I Operation","Interviewee","P14","","2026-06-23","No","",""]),
    row(ck,["Prof. Alexandra den Heijer","Professor, Mgmt in the Built Environment","TU Delft","Visiting host","Disciplinary home (4-perspective model); potential host","2025-05-20","","Yes","Maintain contact; scope visit","First reached out 20 May 2025"]),
    row(ck,["Sanjana","PhD researcher","TU Delft (MBE)","Collaborator","TU Delft relationship; likely co-author, 4-paper series","2025-05","","Yes","Log meeting notes / dates","Met online a few times"],["relevance","first"]),
    row(ck,["Michael Pitt","Professor · Primary supervisor","UCL Bartlett (BSSC)","Supervisor","Primary PhD supervisor","","2026-06-10","Yes","Book next meeting","michael.pitt@ucl.ac.uk · https://profiles.ucl.ac.uk/29458-michael-pitt"]),
    row(ck,["Vivi (Qiuchen Lu)","Professor · Secondary supervisor","UCL Bartlett (BSSC)","Supervisor","Secondary PhD supervisor","","2025-07-18","Yes","Book next meeting","qiuchen.lu@ucl.ac.uk · https://www.linkedin.com/in/qiuchen-lu-930621171/"]),
    row(ck,["Junpeng Lyu","Third supervisor","UCL Bartlett (BSSC)","Supervisor","Third PhD supervisor","","","Yes","Introduce / book meeting","https://profiles.ucl.ac.uk/79102-junpeng-lyu"]),
    row(ck,["Adrien Cooper","UCL Estates — funder / gatekeeper","UCL Estates","UCL Estates contact","Project funder (UCL Estates); fieldwork gatekeeper","","","Yes","Keep funder updated","https://www.linkedin.com/in/adrien-cooper-00745929/"]),
    row(ck,["[Cornell AAP contact]","Academic","Cornell AAP","Visiting host","Closest US fit","","","No","Scope visiting scholar",""],["name"]),
    row(ck,["[MIT Building Tech contact]","Academic","MIT Building Technology","Visiting host","Closest US fit","","","No","Scope visiting scholar",""],["name"]),
    row(ck,["[Spring School peer 1]","PhD researcher","[institution]","Network – workshop","Urban Digital Twin Spring School 2026 team","2026-05","","No","Add name + contact","KTU, Kaunas"],["name","org"]),
    row(ck,["[Spring School peer 2]","PhD researcher","[institution]","Network – workshop","Urban Digital Twin Spring School 2026 team","2026-05","","No","Add name + contact","KTU, Kaunas"],["name","org"]),
    row(ck,["[Spring School peer 3]","PhD researcher","[institution]","Network – workshop","Urban Digital Twin Spring School 2026 team","2026-05","","No","Add name + contact","KTU, Kaunas"],["name","org"]),
    row(ck,["[Spring School peer 4]","PhD researcher","[institution]","Network – workshop","Urban Digital Twin Spring School 2026 team","2026-05","","No","Add name + contact","KTU, Kaunas"],["name","org"]),
  ],
  events: [
    row(ek,["Urban Digital Twin Spring School","Workshop","2026-05-11","KTU, Kaunas (LT)","Attendee","Attended","","Skills + network (4 PhD peers)","https://fcea.ktu.edu/spring-school-2026/","","","11–15 May 2026"]),
    row(ek,["NVivo 15 training","Training","","UCL (online)","Attendee","Not started","","Skills / certificate","","Free","UCL licence","Institutional support available"]),
    row(ek,["[Add target conference]","Conference","","","Presenter","Idea","","Abstract / paper","","","","e.g. CIB, EuroFM, ARCOM"],["event"]),
  ],
  publications: [
    row(pk,["Defining digital readiness in university EFM","1","Conceptual / definitional","J. of Corporate Real Estate","Pun + TU Delft","Drafting","Rolling","","","","","Series opener"],["paper"]),
    row(pk,["Integrating campus-mgmt theory & readiness pillars","2","Theory-integrating","Property Management","Pun + TU Delft","Outline","Rolling","","","","","Den Heijer 4-perspective link"],["paper"]),
    row(pk,["Governance vacuum: empirical case (UCL MyCampus)","3","Empirical","Facilities","Pun + TU Delft","Planned","Rolling","","","","","Core empirical finding"],["paper"]),
    row(pk,["Readiness across organisational levels","4","Empirical variant","Int. J. Strategic Property Mgmt","Pun + TU Delft","Planned","Rolling","","","","","Cross-level matrix"],["paper"]),
    row(pk,["[Reserve target]","—","—","Buildings (MDPI)","Pun","Idea","Check special issues","","","","","Faster turnaround; APC applies"],["paper"]),
    row(pk,["PhD thesis","—","Thesis","UCL Bartlett (BSSC)","Pun","Drafting","N/A","","2027-01","","","Thesis-first priority"]),
  ],
  supervisor: [
    row(sk,["[next]","Supervision","Defend governance-as-primary-constraint headline","","Prepare evidence summary","Pun","","Not started"],["date","action"]),
    row(sk,["[next]","Supervision","Assess data sufficiency / saturation","","Map themes vs new info from second cohort","Pun","","Not started"],["date","action"]),
    row(sk,["[next]","Supervision","TU Delft paper timeline vs thesis-first","","Confirm sequencing","Pun","","Not started"],["date","action"]),
    row(sk,["[next]","Supervision","Visiting scholar options (TU Delft / Cornell / MIT)","","Draft enquiry emails","Pun","","Not started"],["date","action"]),
    row(sk,["[next]","Supervision","Thai comparative case — viable or mission creep?","","Decide scope","Pun","","Not started"],["date","action"]),
  ],
  activity: [
    row(ak,["2023-09-25","Milestone","PhD programme started","","Registration at UCL Bartlett (BSSC)","","","",""]),
    row(ak,["2025-02-25","Milestone","Pre-upgrade review","","","","","",""]),
    row(ak,["2025-05-14","Milestone","Upgrade viva","","","","","",""]),
    row(ak,["2025-05-20","Meeting","First outreach to Prof. Alexandra den Heijer","Prof. Alexandra den Heijer","TU Delft MBE — disciplinary home","","","",""]),
    row(ak,["2025-05-21","Milestone","Upgrade confirmed (successful)","","Passed","","","",""]),
    row(ak,["2025-06-05","Milestone","Ethics approval granted","","","","","",""]),
    row(ak,["2026-03-13","Interview","Interview — Emma Shirbon (P1)","Emma Shirbon","Answered incompletely (ตอบไม่ครบ)","","","",""]),
    row(ak,["2026-03-17","Interview","Interview — Monte Jacob (P2), round 1","Monte Jacob","Two rounds (17 & 23 Mar)","","","",""]),
    row(ak,["2026-03-23","Interview","Interview — Monte Jacob (P2), round 2","Monte Jacob","Two rounds (17 & 23 Mar)","","","",""]),
    row(ak,["2026-03-25","Interview","Interview — Eleanor O'Reilly (P4)","Eleanor O'Reilly","Consent not returned","","","",""]),
    row(ak,["2026-04-28","Interview","Interview — Nafisa Bhamji-Patel (P5)","Nafisa Bhamji-Patel","Two rounds; consent not returned","","","",""]),
    row(ak,["2026-04-30","Interview","Interview — Michelle Smidak (P6)","Michelle Smidak","Consent not returned","","","",""]),
    row(ak,["2026-05-01","Interview","Interview — Aisling Phillips-Smith (P8)","Aisling Phillips-Smith","","","","",""]),
    row(ak,["2026-05-05","Interview","Interview — Lloyd Naylor (P9)","Lloyd Naylor","Two rounds","","","",""]),
    row(ak,["2026-05-08","Interview","Interview — Darren Perry (P7)","Darren Perry","Consent not returned","","","",""]),
    row(ak,["2026-05-22","Interview","Interview — Simon Lockhart (P10)","Simon Lockhart","","","","",""]),
    row(ak,["2026-05-29","Interview","Interview — Ian Dancy (P11)","Ian Dancy","Director of Estates","","","",""]),
    row(ak,["2026-05-29","Interview","Interview — Max Lee (P12)","Max Lee","Governance-gap anchor; two rounds","","","",""]),
    row(ak,["2026-05-11","Training / Event","Urban Digital Twin Spring School begins","","KTU, Kaunas — 11–15 May; teamed with 4 PhD peers","","https://fcea.ktu.edu/spring-school-2026/","",""]),
    row(ak,["2026-06-23","Interview","Interview — Anoop Babu (P14)","Anoop Valiyaveliyil Babu","Solution architect","","","",""]),
    row(ak,["2026-06-23","Interview","Interview — Joe Jones (P16)","Joe Jones","Data-strategy / pipeline architect","","","",""]),
    row(ak,["2026-06-24","Interview","Interview — Emilia Olsen (P17)","Emilia Olsen","","","","",""]),
    row(ak,["2026-06-26","Interview","Interview — Laura Skinner (P15)","Laura Skinner","","","","",""]),
    row(ak,["2026-07-09","Interview","Interview — Pip Jackson (P19)","Pip Jackson","Scheduled","","","",""]),
  ],
  interviews: [
    iv("P1","Emma","Shirbon","2026-03-13","Transcribed",[1,1,1,0,1,1],"Answered incompletely (ตอบไม่ครบ)"),
    iv("P2","Monte","Jacob","2026-03-17","Transcribed",[1,1,1,1,1,1],"Two rounds: 17 & 23 Mar (นัดสองรอบ)"),
    iv("P3","Mohammed","Aufogul","","Transcribed",[1,1,1,1,1,1],"No interview date recorded in sheet"),
    iv("P4","Eleanor","O'Reilly","2026-03-25","Transcribed",[1,1,0,1,1,1],"Consent not returned (ไม่ได้เซ็นกลับมา)"),
    iv("P5","Nafisa","Bhamji-Patel","2026-04-28","Transcribed",[1,1,0,1,1,1],"Consent not returned; two rounds"),
    iv("P6","Michelle","Smidak","2026-04-30","Transcribed",[1,1,0,1,1,1],"Consent not returned"),
    iv("P7","Darren","Perry","2026-05-08","Interviewed",[1,1,0,1,1,0],"Consent not returned; transcription pending"),
    iv("P8","Aisling","Phillips-Smith","2026-05-01","Transcribed",[1,1,1,1,1,1],""),
    iv("P9","Lloyd","Naylor","2026-05-05","Interviewed",[1,1,1,1,1,0],"Two rounds; transcription pending"),
    iv("P10","Simon","Lockhart","2026-05-22","Transcribed",[1,1,1,0,1,1],""),
    iv("P11","Ian","Dancy","2026-05-29","Transcribed",[1,1,1,0,1,1],""),
    iv("P12","Max","Lee","2026-05-29","Transcribed",[1,1,0,0,1,1],"Governance-gap anchor; two rounds"),
    iv("P13","Rod","Green","","Invited",[0,0,0,0,0,0],"Highlighted in sheet — status to confirm"),
    iv("P14","Anoop","Valiyaveliyil Babu","2026-06-23","Interviewed",[1,1,0,1,1,0],"Solution architect"),
    iv("P15","Laura","Skinner","2026-06-26","Scheduled",[1,1,0,0,0,0],""),
    iv("P16","Joe","Jones","2026-06-23","Interviewed",[1,1,0,1,1,0],"Data-strategy / pipeline architect; follow-up call offered"),
    iv("P17","Emilia","Olsen","2026-06-24","Interviewed",[1,1,1,1,1,0],""),
    iv("P18","Anna","Clover","","Invited",[1,0,0,0,0,0],""),
    iv("P19","Pip","Jackson","2026-07-09","Scheduled",[1,0,0,0,0,0],""),
    iv("","Emma","Day","","Invited",[0,0,0,0,0,0],"Reserve list — highlighted"),
    iv("","Adrien","Cooper","","Invited",[0,0,0,0,0,0],"Reserve list"),
    iv("","Jumana","Shamma","","Invited",[0,0,0,0,0,0],"Reserve list — invited twice"),
    iv("","Katie","Plews","","Invited",[0,0,0,0,0,0],"Reserve list"),
    iv("","Aaron","Crompton","","Invited",[0,0,0,0,0,0],"Reserve list"),
    iv("","Naomi","Newton-Fisher","","Invited",[0,0,0,0,0,0],"Reserve list"),
    iv("","Bowie","Chu","","Invited",[0,0,0,0,0,0],"Reserve list"),
  ],
  research: {
    title: "Smart Campus Readiness and Strategic Decision-Making for Smart Campus Transformation",
    gapAcademic: "Prior studies have examined smart campus models and technology integration, often focusing on digital applications while giving less consideration to the operational, physical, and managerial aspects of university estates. There is a lack of research framing the smart campus from an estates-management perspective, particularly in assessing the readiness of existing university estates for digital transformation.",
    gapPractical: "In practice, university estates lack a structured decision-making framework to guide their transformation into smart campuses. Decision-makers struggle with prioritisation, resource allocation, and implementation strategies due to unclear readiness indicators and transformation criteria. This results in fragmented adoption of digital technologies without a clear roadmap for achieving smart campus objectives.",
    gapContribution: "By developing a Smart Campus Readiness Assessment Framework, the study contributes to academic discourse by integrating Corporate Real Estate Management (CREM) principles into the evaluation of smart campus readiness. The framework is proposed to support strategic decision-making in university estates — a practical tool enabling prioritisation of resources and evidence-based planning for digital transformation.",
    aim: "Develop a Smart Campus Readiness Assessment Framework to assess the capabilities of university estates in implementing digital technology solutions that enable smart campus transformation. The framework will support university estates in assessing their readiness and guide university estate management through sustainable and future-proof smart campus development.",
    objectives: [
      { o: "Investigate key factors influencing smart campus transformation in university estates.", outcome: "Support the creation of a readiness assessment framework for universities to navigate this transformation." },
      { o: "Identify critical indicators for readiness assessment.", outcome: "Drawing on data-driven insights and theoretical synthesis." },
      { o: "Develop and validate a readiness assessment framework for smart campus transformation.", outcome: "Ensure the framework is validated for usability, relevance, and practicality through empirical validation." },
    ],
    questions: [
      "RQ1. What are the factors influencing the smart campus transformation process in university estates, and how do they inform the development of a readiness assessment framework?",
      "RQ2. Which critical indicators can effectively assess the smart readiness of university estates, and how can data-driven insights and theoretical synthesis contribute to their identification?",
      "RQ3. How can the Smart Campus Readiness Assessment Framework evaluate university estates' readiness for digital technology implementation, and how can it be validated to ensure its usability and relevance for strategic decision-making in smart campus transformation?",
    ],
    updated: "2025-05-14",
  },
  researchHistory: [],
  tasks: [
    { _a:[], title:"Build anchor codebook (Ian Dancy + Max Lee) in NVivo", status:"Not started", role:"PhD", category:"Analysis", due:"", notes:"First coding priority" },
    { _a:[], title:"Clean & export interview transcripts (intelligent verbatim)", status:"In progress", role:"PhD", category:"Transcription", due:"", notes:"Flag domain-term errors" },
    { _a:[], title:"Draft TU Delft paper 1 (definitional)", status:"In progress", role:"PhD", category:"Publications", due:"", notes:"" },
    { _a:[], title:"Confirm supervisory team (Vivi vs Andrew Cooper)", status:"Awaiting", role:"PhD", category:"Admin", due:"", notes:"" },
    { _a:[], title:"BIDI0002 assessment marking", status:"Done", role:"Lecturer", category:"Teaching", due:"2026-04-22", notes:"" },
  ],
  sources: [],
  outputs: [
    { _a:[], title:"PRRES 2025 conference paper (Hobart)", otype:"Paper", date:"2025", role:"PhD", link:"", category:"MyCampus", notes:"Viryasiri, Pitt & Cooper (2025)" },
    { _a:[], title:"Urban Digital Twins — demo + presentation deck", otype:"Software / tool", date:"2026-05", role:"PhD", link:"", category:"Spring School", notes:"Team output" },
  ],
  ideas: [
    { _a:[], idea:"Thai comparative case as an optional third case", category:"Scope", role:"PhD", date:"", status:"Parked", notes:"Confirm with supervisor — viable or mission creep" },
    { _a:[], idea:"Treat the perception-gap pattern as a standalone finding", category:"Analysis", role:"PhD", date:"", status:"Exploring", notes:"Seniority/seat predicts pillar rankings" },
  ],
  reflections: [],
  projects: STARTER_PROJECTS.map(p => ({ ...p })),
  teachingSessions: [],
  guestLectures: [
    { _a:[], title:"Digitalising Estates", date:"", ay:"", institution:"UCL Bartlett (BSSC)", programme:"", type:"Guest lecture", role:"Guest lecturer", topic:"Digital transformation of university estates", audience:"BSSC students", nstudents:0, evidence:"", cvwording:"Delivered guest lecture 'Digitalising Estates', The Bartlett School of Sustainable Construction, UCL.", note:"", tags:"guest-lecture", privacy:"Public", usefor:"CV" },
    { _a:[], title:"Innovation in Facilities Management", date:"", ay:"", institution:"UCL Bartlett (BSSC)", programme:"", type:"Guest lecture", role:"Guest lecturer", topic:"Innovation in FM", audience:"BSSC students", nstudents:0, evidence:"", cvwording:"Delivered guest lecture 'Innovation in Facilities Management', The Bartlett School of Sustainable Construction, UCL.", note:"", tags:"guest-lecture", privacy:"Public", usefor:"CV" },
  ],
  supervision: [
    { _a:[], title:"Design thesis students (×5)", level:"Undergraduate", programme:"B.Arch — Design Thesis", institution:"Chulalongkorn University", ay:"2022/23", topic:"Architectural design thesis", role:"Primary supervisor", status:"Completed", outcome:"Completed", nstudents:5, evidence:"", note:"Cohort of 5 — can split into individual students if needed", tags:"supervision,chula", privacy:"Internal", usefor:"CV" },
    { _a:[], title:"MSc DIBAM dissertation students (×5)", level:"Masters", programme:"MSc Digital Innovation in Built Asset Management", institution:"UCL Bartlett (BSSC)", ay:"2025/26", topic:"e.g. BIM communication efficiency in SMEs (PRISMA)", role:"Supervisor", status:"Active", outcome:"", nstudents:5, evidence:"", note:"Cohort of 5 — add individual topics as they firm up", tags:"supervision,dibam", privacy:"Anonymised student data", usefor:"Teaching portfolio" },
    { _a:[], title:"PhD student (informal)", level:"PhD", programme:"", institution:"", ay:"2025/26", topic:"", role:"Informal supervisor", status:"Active", outcome:"", nstudents:1, evidence:"", note:"Informal supervision", tags:"supervision,informal", privacy:"Confidential", usefor:"Academic career evidence" },
  ],
  marking: [],
  teachingEvidence: [],
  supervisorTeam: SUP_TEAM_SEED,
});
S.activity = S.activity.map(r => ({ ...r, role: r.role || "PhD" }));
S.researchHistory = [{ ts: "2025-05-14", note: "Baseline — as presented at the MPhil→PhD upgrade", snapshot: JSON.parse(JSON.stringify(S.research)) }];
S.researchPlan = RP_PHASES.map(ph => ({ h: ph.h, tasks: ph.tasks.map(tk => ({ t: tk.t, indent: !!tk.indent, star: !!tk.star, base: Array.from({ length: tk.b - tk.a + 1 }, (_, i) => tk.a + i), manual: [] })) }));
return S; };

const TABS = [
  {k:"dashboard", group:"overview", ic:"📊", en:"Dashboard", th:"แดชบอร์ด"},
  {k:"add", group:"overview", ic:"➕", en:"Add", th:"เพิ่ม"},
  {k:"activity", group:"overview", ic:"📝", en:"Activity Log", th:"บันทึกกิจกรรม"},
  {k:"calendar", group:"overview", ic:"📅", en:"Calendar", th:"ปฏิทิน"},
  {k:"tasks", group:"overview", ic:"✅", en:"Tasks", th:"งานที่ต้องทำ"},
  {k:"reflections", group:"overview", ic:"💭", en:"Reflections", th:"บันทึกสะท้อน"},
  {k:"outputs", group:"overview", ic:"📦", en:"Outputs", th:"ผลงาน"},
  {k:"ideas", group:"overview", ic:"💡", en:"Ideas", th:"ไอเดีย"},
  {k:"projects", group:"overview", ic:"📁", en:"Projects", th:"โปรเจกต์"},
  {k:"contacts", group:"overview", ic:"👥", en:"Contacts", th:"ผู้ติดต่อ"},
  {k:"reports", group:"overview", ic:"📤", en:"Reports", th:"รายงาน"},
  {k:"framing", group:"phd", ic:"🧭", en:"Research Framing", th:"กรอบงานวิจัย"},
  {k:"plan", group:"phd", ic:"🗓️", en:"Research Plan", th:"แผนการวิจัย"},
  {k:"timeline", group:"phd", ic:"⏳", en:"Timeline", th:"ไทม์ไลน์"},
  {k:"interviews", group:"phd", ic:"🎙️", en:"Interview Progress", th:"ความคืบหน้าสัมภาษณ์"},
  {k:"sources", group:"phd", ic:"📚", en:"Sources", th:"แหล่งอ้างอิง"},
  {k:"publications", group:"phd", ic:"📄", en:"Publications", th:"ผลงานตีพิมพ์"},
  {k:"supervisor", group:"phd", ic:"🧑‍🏫", en:"Supervisor", th:"อาจารย์ที่ปรึกษา"},
  {k:"events", group:"phd", ic:"🎓", en:"Events & Training", th:"กิจกรรม & อบรม"},
  {k:"lecdash", group:"bssc", ic:"🍎", en:"Lecturer Dashboard", th:"แดชบอร์ดอาจารย์"},
  {k:"teachingSessions", group:"bssc", ic:"📚", en:"Teaching Sessions", th:"คาบสอน"},
  {k:"guestLectures", group:"bssc", ic:"🎤", en:"Guest Lectures", th:"บรรยายรับเชิญ"},
  {k:"supervision", group:"bssc", ic:"🧑‍🎓", en:"Supervision", th:"การควบคุมนักศึกษา"},
  {k:"marking", group:"bssc", ic:"✍️", en:"Assessment & Marking", th:"ตรวจงาน"},
  {k:"teachingEvidence", group:"bssc", ic:"🗂️", en:"Teaching Evidence", th:"หลักฐานการสอน"},
  {k:"lecexport", group:"bssc", ic:"📤", en:"Export Centre", th:"ศูนย์ส่งออก"},
  {k:"chula", group:"chula", ic:"🏛️", en:"Chula Lecturer", th:"อาจารย์ จุฬาฯ"},
  {k:"personal", group:"personal", ic:"🌱", en:"Personal", th:"ส่วนตัว"},
  {k:"pgta", group:"pgta", ic:"🎒", en:"PGTA", th:"ผู้ช่วยสอน (PGTA)"},
  {k:"cv", group:"cv", ic:"📋", en:"CV", th:"ประวัติย่อ (CV)"},
];
const GROUPS = [
  {k:"overview", ic:"🗂️", en:"Overview", th:"ภาพรวม"},
  {k:"phd", ic:"🎓", en:"PhD", th:"ปริญญาเอก"},
  {k:"bssc", ic:"🍎", en:"BSSC Lecturer", th:"อาจารย์ BSSC"},
  {k:"chula", ic:"🏛️", en:"Chula Lecturer", th:"อาจารย์ จุฬาฯ"},
  {k:"personal", ic:"🌱", en:"Personal", th:"ส่วนตัว"},
  {k:"pgta", ic:"🎒", en:"BSSC PGTA", th:"ผู้ช่วยสอน (PGTA)"},
];
// ---- One-time import from Outlook archives (michael/vivi/researchlog) ----
const IMPORT_ACTIVITIES = [
  { _id:"imp-69a1034b", _a:["date"], date:"2023-10-20", category:"Meeting", activity:"Supervision — Supervision meeting (logged in UCL Student Log)", linked:"Michael Pitt; Vivi (Qiuchen Lu)", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-ddb1d6ec", _a:["date"], date:"2023-11-09", category:"Meeting", activity:"Supervision — Supervision meeting", linked:"Michael Pitt; Vivi (Qiuchen Lu)", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-7e8ede3e", _a:["date"], date:"2023-11-17", category:"Meeting", activity:"Supervision — Supervision meeting (logged in UCL Student Log)", linked:"Michael Pitt; Vivi (Qiuchen Lu)", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-fd5099f3", _a:["date"], date:"2023-11-29", category:"Meeting", activity:"Supervision — Supervision meeting", linked:"Michael Pitt", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-02272bac", _a:[], date:"2023-12-15", category:"Meeting", activity:"Supervision — Supervision meeting", linked:"Michael Pitt; Vivi (Qiuchen Lu)", detail:"From Outlook archive", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-48887951", _a:["date"], date:"2024-01-16", category:"Meeting", activity:"Supervision — Supervision meeting", linked:"Michael Pitt; Vivi (Qiuchen Lu)", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-c01eba82", _a:["date"], date:"2024-02-18", category:"Meeting", activity:"Supervision — Supervision meeting (logged in UCL Student Log)", linked:"Michael Pitt; Vivi (Qiuchen Lu)", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-6b4b7f91", _a:["date"], date:"2024-03-13", category:"Meeting", activity:"Supervision — Supervision meeting", linked:"Vivi (Qiuchen Lu)", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-709e5944", _a:["date"], date:"2024-03-21", category:"Meeting", activity:"Supervision — Supervision meeting", linked:"Vivi (Qiuchen Lu)", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-13b72beb", _a:["date"], date:"2024-05-09", category:"Meeting", activity:"Supervision — Supervision meeting (logged in UCL Student Log)", linked:"Michael Pitt; Vivi (Qiuchen Lu)", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-e6a90547", _a:["date"], date:"2024-05-16", category:"Meeting", activity:"Supervision — Supervision meeting (logged in UCL Student Log)", linked:"Michael Pitt; Vivi (Qiuchen Lu)", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-8302ced3", _a:["date"], date:"2024-07-01", category:"Meeting", activity:"Supervision — Supervision meeting (logged in UCL Student Log)", linked:"Michael Pitt; Vivi (Qiuchen Lu)", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-a8b47d25", _a:["date"], date:"2024-07-25", category:"Meeting", activity:"Supervision — Supervision meeting (logged in UCL Student Log)", linked:"Michael Pitt; Vivi (Qiuchen Lu)", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-1665d410", _a:["date"], date:"2024-08-11", category:"Meeting", activity:"Supervision — Upgrade discussion", linked:"Michael Pitt; Vivi (Qiuchen Lu)", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-382de5a8", _a:["date"], date:"2024-08-26", category:"Meeting", activity:"Supervision — Upgrade discussion", linked:"Vivi (Qiuchen Lu)", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-3e23c0da", _a:["date"], date:"2024-09-27", category:"Meeting", activity:"Supervision — Upgrade discussion", linked:"Michael Pitt; Vivi (Qiuchen Lu)", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-89facf0f", _a:["date"], date:"2024-10-24", category:"Meeting", activity:"Supervision — Upgrade discussion", linked:"Michael Pitt; Vivi (Qiuchen Lu)", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-fbe87a4e", _a:["date"], date:"2024-11-05", category:"Meeting", activity:"Supervision — Upgrade discussion", linked:"Michael Pitt; Vivi (Qiuchen Lu)", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-beecb724", _a:["date"], date:"2024-12-03", category:"Meeting", activity:"Supervision — Upgrade discussion", linked:"Vivi (Qiuchen Lu)", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-ad3b97a2", _a:["date"], date:"2025-01-08", category:"Meeting", activity:"Supervision — Upgrade discussion", linked:"Michael Pitt; Vivi (Qiuchen Lu)", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-fd5eb0d8", _a:["date"], date:"2025-01-28", category:"Meeting", activity:"Supervision — Supervision meeting (logged in UCL Student Log)", linked:"Michael Pitt; Vivi (Qiuchen Lu)", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-79dac700", _a:["date"], date:"2025-02-11", category:"Meeting", activity:"Supervision — Upgrade discussion", linked:"Michael Pitt; Vivi (Qiuchen Lu)", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-53e5fe44", _a:["date"], date:"2025-03-03", category:"Meeting", activity:"Supervision — Supervision meeting", linked:"Michael Pitt; Vivi (Qiuchen Lu)", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-98e8b5f7", _a:["date"], date:"2025-03-10", category:"Meeting", activity:"Supervision — Supervision meeting (logged in UCL Student Log)", linked:"Michael Pitt; Vivi (Qiuchen Lu)", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-1aa3ea0c", _a:["date"], date:"2025-04-28", category:"Meeting", activity:"Supervision — Supervision meeting (logged in UCL Student Log)", linked:"Michael Pitt; Vivi (Qiuchen Lu)", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-ae355ede", _a:["date"], date:"2025-05-17", category:"Meeting", activity:"Supervision — Progress update", linked:"Michael Pitt; Vivi (Qiuchen Lu)", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-bb7d466f", _a:["date"], date:"2025-07-18", category:"Meeting", activity:"Supervision — Paper discussion", linked:"Vivi (Qiuchen Lu)", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-21cad6dc", _a:["date"], date:"2025-11-25", category:"Meeting", activity:"Supervision — Meeting w/ line manager (fieldwork access)", linked:"Michael Pitt", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-e9ff7971", _a:["date"], date:"2026-03-14", category:"Meeting", activity:"Supervision — Catch-up", linked:"Michael Pitt", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-003a4d84", _a:["date"], date:"2026-06-10", category:"Meeting", activity:"Supervision — Catch-up", linked:"Michael Pitt", detail:"From Outlook archive; date approximate — confirm", obsidian:"", output:"", hours:0, tag:"supervision", role:"PhD" },
  { _id:"imp-40b6718a", _a:[], date:"2025-07-24", category:"Student support", activity:"Supervision meeting w/ own student (logged)", linked:"BIDI0002 / students", detail:"Lecturer-role student supervision", obsidian:"", output:"", hours:0, tag:"teaching", role:"Teaching" },
  { _id:"imp-31d94f2c", _a:[], date:"2025-11-05", category:"Student support", activity:"Supervision meeting w/ own student (logged)", linked:"BIDI0002 / students", detail:"Lecturer-role student supervision", obsidian:"", output:"", hours:0, tag:"teaching", role:"Teaching" },
  { _id:"imp-f8de5dd7", _a:[], date:"2025-12-04", category:"Student support", activity:"Supervision meeting w/ own student (logged)", linked:"BIDI0002 / students", detail:"Lecturer-role student supervision", obsidian:"", output:"", hours:0, tag:"teaching", role:"Teaching" },
  { _id:"imp-115142f0", _a:[], date:"2026-01-08", category:"Teaching – delivery", activity:"BIDI0002 tutorial — week 1", linked:"BIDI0002 / students", detail:"Weekly tutorial (module BIDI0002)", obsidian:"", output:"", hours:0, tag:"teaching", role:"Teaching" },
  { _id:"imp-83f7fdda", _a:[], date:"2026-01-27", category:"Teaching – delivery", activity:"BIDI0002 tutorial — week 4", linked:"BIDI0002 / students", detail:"Weekly tutorial (module BIDI0002)", obsidian:"", output:"", hours:0, tag:"teaching", role:"Teaching" },
  { _id:"imp-8dc27a2c", _a:[], date:"2026-02-16", category:"Teaching – delivery", activity:"BIDI0002 tutorial — week 6", linked:"BIDI0002 / students", detail:"Weekly tutorial (module BIDI0002)", obsidian:"", output:"", hours:0, tag:"teaching", role:"Teaching" },
  { _id:"imp-f5b41858", _a:[], date:"2026-02-23", category:"Teaching – delivery", activity:"BIDI0002 tutorial — week 7", linked:"BIDI0002 / students", detail:"Weekly tutorial (module BIDI0002)", obsidian:"", output:"", hours:0, tag:"teaching", role:"Teaching" },
  { _id:"imp-29f36f9c", _a:[], date:"2026-02-23", category:"Student support", activity:"Supervision meeting w/ own student (logged)", linked:"BIDI0002 / students", detail:"Lecturer-role student supervision", obsidian:"", output:"", hours:0, tag:"teaching", role:"Teaching" },
  { _id:"imp-6fd15099", _a:[], date:"2026-03-03", category:"Teaching – delivery", activity:"BIDI0002 tutorial — week 8", linked:"BIDI0002 / students", detail:"Weekly tutorial (module BIDI0002)", obsidian:"", output:"", hours:0, tag:"teaching", role:"Teaching" },
  { _id:"imp-f1434fa8", _a:[], date:"2026-03-11", category:"Teaching – delivery", activity:"BIDI0002 tutorial — week 9", linked:"BIDI0002 / students", detail:"Weekly tutorial (module BIDI0002)", obsidian:"", output:"", hours:0, tag:"teaching", role:"Teaching" },
  { _id:"imp-90ba259c", _a:[], date:"2026-03-17", category:"Teaching – delivery", activity:"BIDI0002 tutorial — week 10", linked:"BIDI0002 / students", detail:"Weekly tutorial (module BIDI0002)", obsidian:"", output:"", hours:0, tag:"teaching", role:"Teaching" },
  { _id:"imp-427bc412", _a:[], date:"2026-03-23", category:"Teaching – delivery", activity:"BIDI0002 lecture (Mon 23 Mar)", linked:"BIDI0002 / students", detail:"Guest/module lecture", obsidian:"", output:"", hours:0, tag:"teaching", role:"Teaching" },
  { _id:"imp-0616fcaa", _a:[], date:"2026-03-23", category:"Student support", activity:"BIDI0002 office hours — assignment Q&A", linked:"BIDI0002 / students", detail:"Student support", obsidian:"", output:"", hours:0, tag:"teaching", role:"Teaching" },
  { _id:"imp-93699639", _a:[], date:"2026-03-25", category:"Student support", activity:"Supervision meeting w/ own student (logged)", linked:"BIDI0002 / students", detail:"Lecturer-role student supervision", obsidian:"", output:"", hours:0, tag:"teaching", role:"Teaching" },
  { _id:"imp-ef38f41c", _a:[], date:"2026-03-25", category:"Student support", activity:"Student review submitted (own supervisee)", linked:"BIDI0002 / students", detail:"Research student review", obsidian:"", output:"", hours:0, tag:"teaching", role:"Teaching" },
  { _id:"imp-9505a191", _a:[], date:"2026-04-22", category:"Marking", activity:"BIDI0002 assessment marking", linked:"BIDI0002 / students", detail:"Marking (deadline 22 Apr 2026; later delayed)", obsidian:"", output:"", hours:0, tag:"teaching", role:"Teaching" },
];
const IMPORT_SUPERVISION = [
  { _id:"imp-43b743dd", _a:["date"], date:"2023-10-20", mtype:"Supervision", agenda:"Supervision meeting (logged in UCL Student Log)", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-bfb0cadc", _a:["date"], date:"2023-11-09", mtype:"Supervision", agenda:"Supervision meeting", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-23c2588e", _a:["date"], date:"2023-11-17", mtype:"Supervision", agenda:"Supervision meeting (logged in UCL Student Log)", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-96d4052e", _a:["date"], date:"2023-11-29", mtype:"Supervision", agenda:"Supervision meeting", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-dc7fdcf2", _a:[], date:"2023-12-15", mtype:"Supervision", agenda:"Supervision meeting", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-7d286fe4", _a:["date"], date:"2024-01-16", mtype:"Supervision", agenda:"Supervision meeting", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-dee05087", _a:["date"], date:"2024-02-18", mtype:"Supervision", agenda:"Supervision meeting (logged in UCL Student Log)", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-06ccb08a", _a:["date"], date:"2024-03-13", mtype:"Supervision", agenda:"Supervision meeting", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-ffaac529", _a:["date"], date:"2024-03-21", mtype:"Supervision", agenda:"Supervision meeting", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-82fc86b6", _a:["date"], date:"2024-05-09", mtype:"Supervision", agenda:"Supervision meeting (logged in UCL Student Log)", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-347a2a6c", _a:["date"], date:"2024-05-16", mtype:"Supervision", agenda:"Supervision meeting (logged in UCL Student Log)", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-9b426069", _a:["date"], date:"2024-07-01", mtype:"Supervision", agenda:"Supervision meeting (logged in UCL Student Log)", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-54d48cd7", _a:["date"], date:"2024-07-25", mtype:"Supervision", agenda:"Supervision meeting (logged in UCL Student Log)", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-5e45e161", _a:["date"], date:"2024-08-11", mtype:"Upgrade", agenda:"Upgrade discussion", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-de938ce4", _a:["date"], date:"2024-08-26", mtype:"Upgrade", agenda:"Upgrade discussion", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-33a55b45", _a:["date"], date:"2024-09-27", mtype:"Upgrade", agenda:"Upgrade discussion", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-7e7c7683", _a:["date"], date:"2024-10-24", mtype:"Upgrade", agenda:"Upgrade discussion", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-20f56b20", _a:["date"], date:"2024-11-05", mtype:"Upgrade", agenda:"Upgrade discussion", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-caa0dbee", _a:["date"], date:"2024-12-03", mtype:"Upgrade", agenda:"Upgrade discussion", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-a2173821", _a:["date"], date:"2025-01-08", mtype:"Upgrade", agenda:"Upgrade discussion", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-3a0491c4", _a:["date"], date:"2025-01-28", mtype:"Supervision", agenda:"Supervision meeting (logged in UCL Student Log)", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-75b041e7", _a:["date"], date:"2025-02-11", mtype:"Upgrade", agenda:"Upgrade discussion", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-8756cfbf", _a:["date"], date:"2025-03-03", mtype:"Supervision", agenda:"Supervision meeting", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-c0aed7ce", _a:["date"], date:"2025-03-10", mtype:"Supervision", agenda:"Supervision meeting (logged in UCL Student Log)", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-15b17b15", _a:["date"], date:"2025-04-28", mtype:"Supervision", agenda:"Supervision meeting (logged in UCL Student Log)", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-4a772e15", _a:["date"], date:"2025-05-17", mtype:"Supervision", agenda:"Progress update", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-a1e2e491", _a:["date"], date:"2025-07-18", mtype:"Paper", agenda:"Paper discussion", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-92724ee2", _a:["date"], date:"2025-11-25", mtype:"Supervision", agenda:"Meeting w/ line manager (fieldwork access)", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-2d95622b", _a:["date"], date:"2026-03-14", mtype:"Supervision", agenda:"Catch-up", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
  { _id:"imp-147c89d1", _a:["date"], date:"2026-06-10", mtype:"Supervision", agenda:"Catch-up", decision:"", action:"", owner:"Pun", due:"", status:"Completed" },
];

function applyImports(d) {
  const meta = d.meta || {};
  if (meta.importedCommsV1) return d;
  const haveA = new Set((d.activity || []).map(r => r._id).filter(Boolean));
  const addA = IMPORT_ACTIVITIES.filter(r => !haveA.has(r._id));
  const haveS = new Set((d.supervisor || []).map(r => r._id).filter(Boolean));
  const addS = IMPORT_SUPERVISION.filter(r => !haveS.has(r._id));
  const contacts = (d.contacts || []).map(c => {
    if (c.name === "Michael") return { ...c, name: "Michael Pitt", role: "Professor · Primary supervisor", relevance: "Primary PhD supervisor", last: "2026-06-10", notes: "michael.pitt@ucl.ac.uk" };
    if (c.name === "Vivi") return { ...c, name: "Vivi (Qiuchen Lu)", role: "Secondary supervisor", relevance: "Secondary PhD supervisor", last: "2025-07-18", notes: "qiuchen.lu@ucl.ac.uk" };
    return c;
  });
  return { ...d, activity: [...(d.activity || []), ...addA], supervisor: [...(d.supervisor || []), ...addS], contacts, meta: { ...meta, importedCommsV1: true } };
}

const IMPORT_TEACHING = [
  { _id:"tb-bidi0002-w1", _a:["date"], date:"2026-01-12", category:"Teaching – delivery", activity:"BIDI0002 tutorial — week 1 (Mon AM)", linked:"BIDI0002 students", detail:"Weekly tutorial, Monday morning (25/26 Term 2)", hours:1, tag:"teaching", role:"Lecturer" },
  { _id:"tb-bidi0002-w2", _a:["date"], date:"2026-01-19", category:"Teaching – delivery", activity:"BIDI0002 tutorial — week 2 (Mon AM)", linked:"BIDI0002 students", detail:"Weekly tutorial, Monday morning (25/26 Term 2)", hours:1, tag:"teaching", role:"Lecturer" },
  { _id:"tb-bidi0002-w3", _a:["date"], date:"2026-01-26", category:"Teaching – delivery", activity:"BIDI0002 tutorial — week 3 (Mon AM)", linked:"BIDI0002 students", detail:"Weekly tutorial, Monday morning (25/26 Term 2)", hours:1, tag:"teaching", role:"Lecturer" },
  { _id:"tb-bidi0002-w4", _a:["date"], date:"2026-02-02", category:"Teaching – delivery", activity:"BIDI0002 tutorial — week 4 (Mon AM)", linked:"BIDI0002 students", detail:"Weekly tutorial, Monday morning (25/26 Term 2)", hours:1, tag:"teaching", role:"Lecturer" },
  { _id:"tb-bidi0002-w5", _a:["date"], date:"2026-02-09", category:"Teaching – delivery", activity:"BIDI0002 tutorial — week 5 (Mon AM)", linked:"BIDI0002 students", detail:"Weekly tutorial, Monday morning (25/26 Term 2)", hours:1, tag:"teaching", role:"Lecturer" },
  { _id:"tb-bidi0002-w6", _a:["date"], date:"2026-02-23", category:"Teaching – delivery", activity:"BIDI0002 tutorial — week 6 (Mon AM)", linked:"BIDI0002 students", detail:"Weekly tutorial, Monday morning (25/26 Term 2)", hours:1, tag:"teaching", role:"Lecturer" },
  { _id:"tb-bidi0002-w7", _a:["date"], date:"2026-03-02", category:"Teaching – delivery", activity:"BIDI0002 tutorial — week 7 (Mon AM)", linked:"BIDI0002 students", detail:"Weekly tutorial, Monday morning (25/26 Term 2)", hours:1, tag:"teaching", role:"Lecturer" },
  { _id:"tb-bidi0002-w8", _a:["date"], date:"2026-03-09", category:"Teaching – delivery", activity:"BIDI0002 tutorial — week 8 (Mon AM)", linked:"BIDI0002 students", detail:"Weekly tutorial, Monday morning (25/26 Term 2)", hours:1, tag:"teaching", role:"Lecturer" },
  { _id:"tb-bidi0002-w9", _a:["date"], date:"2026-03-16", category:"Teaching – delivery", activity:"BIDI0002 tutorial — week 9 (Mon AM)", linked:"BIDI0002 students", detail:"Weekly tutorial, Monday morning (25/26 Term 2)", hours:1, tag:"teaching", role:"Lecturer" },
  { _id:"tb-bidi0002-w10", _a:["date"], date:"2026-03-23", category:"Teaching – delivery", activity:"BIDI0002 tutorial — week 10 (Mon AM)", linked:"BIDI0002 students", detail:"Weekly tutorial, Monday morning (25/26 Term 2)", hours:1, tag:"teaching", role:"Lecturer" },
  { _id:"tb-bidi0005-w1", _a:["date"], date:"2025-10-03", category:"Teaching – delivery", activity:"BIDI0005 tutorial — week 1 (Fri PM)", linked:"BIDI0005 students", detail:"Weekly tutorial, Friday afternoon (25/26 Term 1)", hours:1, tag:"teaching", role:"PGTA" },
  { _id:"tb-bidi0005-w2", _a:["date"], date:"2025-10-10", category:"Teaching – delivery", activity:"BIDI0005 tutorial — week 2 (Fri PM)", linked:"BIDI0005 students", detail:"Weekly tutorial, Friday afternoon (25/26 Term 1)", hours:1, tag:"teaching", role:"PGTA" },
  { _id:"tb-bidi0005-w3", _a:["date"], date:"2025-10-17", category:"Teaching – delivery", activity:"BIDI0005 tutorial — week 3 (Fri PM)", linked:"BIDI0005 students", detail:"Weekly tutorial, Friday afternoon (25/26 Term 1)", hours:1, tag:"teaching", role:"PGTA" },
  { _id:"tb-bidi0005-w4", _a:["date"], date:"2025-10-24", category:"Teaching – delivery", activity:"BIDI0005 tutorial — week 4 (Fri PM)", linked:"BIDI0005 students", detail:"Weekly tutorial, Friday afternoon (25/26 Term 1)", hours:1, tag:"teaching", role:"PGTA" },
  { _id:"tb-bidi0005-w5", _a:["date"], date:"2025-10-31", category:"Teaching – delivery", activity:"BIDI0005 tutorial — week 5 (Fri PM)", linked:"BIDI0005 students", detail:"Weekly tutorial, Friday afternoon (25/26 Term 1)", hours:1, tag:"teaching", role:"PGTA" },
  { _id:"tb-bidi0005-w6", _a:["date"], date:"2025-11-14", category:"Teaching – delivery", activity:"BIDI0005 tutorial — week 6 (Fri PM)", linked:"BIDI0005 students", detail:"Weekly tutorial, Friday afternoon (25/26 Term 1)", hours:1, tag:"teaching", role:"PGTA" },
  { _id:"tb-bidi0005-w7", _a:["date"], date:"2025-11-21", category:"Teaching – delivery", activity:"BIDI0005 tutorial — week 7 (Fri PM)", linked:"BIDI0005 students", detail:"Weekly tutorial, Friday afternoon (25/26 Term 1)", hours:1, tag:"teaching", role:"PGTA" },
  { _id:"tb-bidi0005-w8", _a:["date"], date:"2025-11-28", category:"Teaching – delivery", activity:"BIDI0005 tutorial — week 8 (Fri PM)", linked:"BIDI0005 students", detail:"Weekly tutorial, Friday afternoon (25/26 Term 1)", hours:1, tag:"teaching", role:"PGTA" },
  { _id:"tb-bidi0005-w9", _a:["date"], date:"2025-12-05", category:"Teaching – delivery", activity:"BIDI0005 tutorial — week 9 (Fri PM)", linked:"BIDI0005 students", detail:"Weekly tutorial, Friday afternoon (25/26 Term 1)", hours:1, tag:"teaching", role:"PGTA" },
  { _id:"tb-bidi0005-w10", _a:["date"], date:"2025-12-12", category:"Teaching – delivery", activity:"BIDI0005 tutorial — week 10 (Fri PM)", linked:"BIDI0005 students", detail:"Weekly tutorial, Friday afternoon (25/26 Term 1)", hours:1, tag:"teaching", role:"PGTA" },
  { _id:"tb-bidi0007-w3", _a:["date"], date:"2025-01-27", category:"Teaching – delivery", activity:"BIDI0007 tutorial — week 3 (approx)", linked:"BIDI0007 students", detail:"Service Operations Management (24/25); exact date uncertain (~Jan–Feb 2025)", hours:1, tag:"teaching", role:"PGTA" },
  { _id:"tb-bidi0007-w4", _a:["date"], date:"2025-02-03", category:"Teaching – delivery", activity:"BIDI0007 tutorial — week 4 (approx)", linked:"BIDI0007 students", detail:"Service Operations Management (24/25); exact date uncertain (~Jan–Feb 2025)", hours:1, tag:"teaching", role:"PGTA" },
  { _id:"tb-bidi0007-w5", _a:["date"], date:"2025-02-10", category:"Teaching – delivery", activity:"BIDI0007 tutorial — week 5 (approx)", linked:"BIDI0007 students", detail:"Service Operations Management (24/25); exact date uncertain (~Jan–Feb 2025)", hours:1, tag:"teaching", role:"PGTA" },
];

function applyMigrations(d) {
  d = applyImports(d);
  const meta = d.meta || {};
  if (!meta.roleSplitV1) {
    const split = r => r.role === "Teaching" ? { ...r, role: (r.date && r.date < TEACH_SPLIT) ? "PGTA" : "Lecturer" } : r;
    d = { ...d, activity: (d.activity || []).map(split), meta: { ...(d.meta || {}), roleSplitV1: true } };
  }
  if (!(d.meta || {}).teachingBatchV1) {
    let acts = (d.activity || []).filter(r => !(/^BIDI0002 tutorial — week/.test(r.activity || "") && r._id));
    const have = new Set(acts.map(r => r._id).filter(Boolean));
    const add = IMPORT_TEACHING.filter(r => !have.has(r._id));
    d = { ...d, activity: [...acts, ...add], meta: { ...(d.meta || {}), teachingBatchV1: true } };
  }
  if (!(d.meta || {}).lecturerRecordV1) {
    const ayOf = dt => { const m = (dt || "").match(/^(\d{4})-(\d{2})/); if (!m) return ""; let y = +m[1]; if (+m[2] < 9) y -= 1; return `${y}/${String((y + 1) % 100).padStart(2, "0")}`; };
    const prog = s => { const m = (s || "").match(/(BIDI|BCPM|BENV)\s?\d+/i); return m ? m[0].toUpperCase().replace(/\s/g, "") : ""; };
    const ts = [], mk = [], keep = [];
    (d.activity || []).forEach(r => {
      if (r.category === "Teaching – delivery") {
        ts.push({ _a: (r._a && r._a.includes("date")) ? ["date"] : [], _id: r._id, title: r.activity, date: r.date, ay: ayOf(r.date), institution: "UCL Bartlett (BSSC)", programme: prog(r.activity), type: /tutorial/i.test(r.activity) ? "Tutorial" : /lecture/i.test(r.activity) ? "Lecture" : "Other", role: roleOf(r), topic: r.detail || "", nstudents: "", hours: r.hours || "", evidence: "", note: "", tags: "teaching", privacy: "Internal", usefor: "Teaching portfolio" });
      } else if (r.category === "Marking") {
        mk.push({ _a: [], _id: r._id, title: r.activity, date: r.date, ay: ayOf(r.date), institution: "UCL Bartlett (BSSC)", programme: prog(r.activity), type: "Coursework", role: "Marker", nstudents: "", hours: r.hours || "", feedback: "", moderation: "", evidence: "", note: r.detail || "", tags: "teaching", privacy: "Internal", usefor: "Workload evidence" });
      } else keep.push(r);
    });
    d = { ...d, activity: keep, teachingSessions: [...(d.teachingSessions || []), ...ts], marking: [...(d.marking || []), ...mk], meta: { ...(d.meta || {}), lecturerRecordV1: true } };
  }
  if (!(d.meta || {}).planLayersV1 && d.researchPlan) {
    const baseLookup = {}; RP_PHASES.forEach(ph => ph.tasks.forEach(tk => { baseLookup[tk.t] = Array.from({ length: tk.b - tk.a + 1 }, (_, i) => tk.a + i); }));
    const rp = d.researchPlan.map(ph => ({ ...ph, tasks: ph.tasks.map(tk => {
      if (tk.base) return tk;
      const base = baseLookup[tk.t] || [];
      const cells = tk.cells || base;
      return { t: tk.t, indent: tk.indent, star: tk.star, base, manual: cells.filter(c => !base.includes(c)) };
    }) }));
    d = { ...d, researchPlan: rp, meta: { ...(d.meta || {}), planLayersV1: true } };
  }
  if (!(d.meta || {}).supTeamV1) {
    let contacts = (d.contacts || []).map(c => {
      if (/^(Andrew|Adrien) Cooper/i.test(c.name || "")) return { ...c, name: "Adrien Cooper", role: "UCL Estates — funder / gatekeeper", org: "UCL Estates", category: "UCL Estates contact", relevance: "Project funder (UCL Estates); fieldwork gatekeeper", next: "Keep funder updated", notes: "https://www.linkedin.com/in/adrien-cooper-00745929/" };
      if (/^Michael Pitt/i.test(c.name || "")) return { ...c, notes: /profiles\.ucl/.test(c.notes || "") ? c.notes : "michael.pitt@ucl.ac.uk · https://profiles.ucl.ac.uk/29458-michael-pitt" };
      if (/Qiuchen Lu|Vivi/i.test(c.name || "")) return { ...c, notes: /linkedin/.test(c.notes || "") ? c.notes : "qiuchen.lu@ucl.ac.uk · https://www.linkedin.com/in/qiuchen-lu-930621171/" };
      return c;
    });
    if (!contacts.some(c => /Junpeng Lyu/i.test(c.name || ""))) contacts = [...contacts, { _a: [], name: "Junpeng Lyu", role: "Third supervisor", org: "UCL Bartlett (BSSC)", category: "Supervisor", relevance: "Third PhD supervisor", first: "", last: "", follow: "Yes", next: "Introduce / book meeting", notes: "https://profiles.ucl.ac.uk/79102-junpeng-lyu" }];
    d = { ...d, contacts, supervisorTeam: d.supervisorTeam || SUP_TEAM_SEED, meta: { ...(d.meta || {}), supTeamV1: true } };
  }
  // rename hats: PGTA → BSSC PGTA, Lecturer/Teaching → BSSC Lecturer (Chula Lecturer is new; existing data had no Chula tag)
  if (!(d.meta || {}).rolesV2) {
    const map = { "PGTA": "BSSC PGTA", "Lecturer": "BSSC Lecturer", "Teaching": "BSSC Lecturer" };
    const remap = arr => (arr || []).map(r => (r && map[r.role]) ? { ...r, role: map[r.role] } : r);
    d = { ...d, activity: remap(d.activity), tasks: remap(d.tasks), sources: remap(d.sources), outputs: remap(d.outputs), ideas: remap(d.ideas), reflections: remap(d.reflections), meta: { ...(d.meta || {}), rolesV2: true } };
  }
  // new Projects store — seed starters for existing users who don't have it yet
  if (!(d.meta || {}).projectsV1) {
    d = { ...d, projects: Array.isArray(d.projects) ? d.projects : STARTER_PROJECTS.map(p => ({ ...p })), meta: { ...(d.meta || {}), projectsV1: true } };
  }
  // one-time recovery: re-add any accidentally-deleted IMPORTED supervision meetings (matched by stable _id)
  if (!(d.meta || {}).recoverMeetingsV1) {
    const haveA = new Set((d.activity || []).map(r => r._id).filter(Boolean));
    const addA = IMPORT_ACTIVITIES.filter(r => r.category === "Meeting" && !haveA.has(r._id));
    const haveS = new Set((d.supervisor || []).map(r => r._id).filter(Boolean));
    const addS = IMPORT_SUPERVISION.filter(r => !haveS.has(r._id));
    d = { ...d, activity: [...(d.activity || []), ...addA], supervisor: [...(d.supervisor || []), ...addS], meta: { ...(d.meta || {}), recoverMeetingsV1: true } };
  }
  // auto-fill the supervision log's "with" (people) field from the imported email history, matched by date
  if (!(d.meta || {}).supWithV1) {
    const datePeople = {};
    IMPORT_ACTIVITIES.forEach(a => { if (a.tag === "supervision" && a.linked && a.date) datePeople[a.date] = a.linked; });
    const sup = (d.supervisor || []).map(r => (!r.with && r.date && datePeople[r.date]) ? { ...r, with: datePeople[r.date] } : r);
    d = { ...d, supervisor: sup, meta: { ...(d.meta || {}), supWithV1: true } };
  }
  return d;
}

const STORE_KEY = "phd_dashboard_v3";

function App() {
  const [data, setData] = useState(seed());
  const [tab, setTab] = useState("dashboard");
  const [group, setGroup] = useState("overview");
  const [loaded, setLoaded] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [live, setLive] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const deviceId = React.useRef(Math.random().toString(36).slice(2, 8));
  const lastContent = React.useRef("");
  const contentOf = d => { try { return JSON.stringify({ ...d, meta: { ...(d.meta || {}), savedAt: 0, device: 0 } }); } catch (e) { return Math.random() + ""; } };

  // ---- Undo: snapshot before destructive actions (delete / reset / restore), restore on demand ----
  const dataRef = React.useRef(data);
  useEffect(() => { dataRef.current = data; }, [data]);
  const undoStack = React.useRef([]);
  const [undoN, setUndoN] = useState(0);
  const [showTrash, setShowTrash] = useState(false);
  const pushUndo = () => { try { undoStack.current.push(JSON.stringify(dataRef.current)); if (undoStack.current.length > 30) undoStack.current.shift(); setUndoN(undoStack.current.length); } catch (e) {} };
  const undo = () => { const prev = undoStack.current.pop(); if (prev != null) { try { setData(JSON.parse(prev)); } catch (e) {} } setUndoN(undoStack.current.length); };

  const lang = (data.meta && data.meta.lang) || "en";
  const L = k => t(lang, k);

  useEffect(() => { (async () => {
    let base = seed();
    try { if (window.storage) { const r = await window.storage.get(STORE_KEY); if (r && r.value) base = { ...seed(), ...JSON.parse(r.value) }; } } catch (e) {}
    const migrated = applyMigrations(base);
    lastContent.current = contentOf(migrated);
    setData(migrated);
    setLoaded(true);
  })(); }, []);

  useEffect(() => {
    if (!loaded) return;
    const content = contentOf(data);
    if (content === lastContent.current) return; // no real change — avoids sync loops
    const tm = setTimeout(async () => { try { if (window.storage) { const payload = { ...data, meta: { ...(data.meta || {}), savedAt: Date.now(), device: deviceId.current } }; await window.storage.set(STORE_KEY, JSON.stringify(payload)); lastContent.current = content; setSavedAt(new Date()); } } catch (e) {} }, 600);
    return () => clearTimeout(tm);
  }, [data, loaded]);

  const reloadFromCloud = async () => {
    try {
      if (!window.storage) return;
      const r = await window.storage.get(STORE_KEY);
      if (r && r.value) { const remote = JSON.parse(r.value); if (contentOf(remote) !== lastContent.current) { const mig = applyMigrations({ ...seed(), ...remote }); lastContent.current = contentOf(mig); setData(mig); setSyncMsg(lang === "th" ? "อัปเดตจากอุปกรณ์อื่น" : "updated from another device"); } else setSyncMsg(lang === "th" ? "ล่าสุดแล้ว" : "already up to date"); }
      setTimeout(() => setSyncMsg(""), 2500);
    } catch (e) {}
  };
  useEffect(() => {
    if (!live || !loaded) return;
    const id = setInterval(() => { reloadFromCloud(); }, 15000);
    return () => clearInterval(id);
  }, [live, loaded]);

  // Outlook auto-sync: once per app open, if enabled in meta.outlook + a Worker endpoint is set
  const outlookSynced = React.useRef(false);
  useEffect(() => {
    if (!loaded || outlookSynced.current) return;
    const cfg = (data.meta && data.meta.outlook) || {};
    const endpoint = (typeof window !== "undefined" && window.OUTLOOK_ENDPOINT) || "";
    if (!cfg.auto || !endpoint) return;
    outlookSynced.current = true;
    (async () => {
      try {
        const events = await fetchOutlookEvents(endpoint);
        if (!events.length) return;
        setData(d => {
          const res = mergeOutlook(d.activity, events, (d.meta && d.meta.outlook) || {});
          if (!res.added) return d;
          setSyncMsg((lang === "th" ? "ดึงจาก Outlook: เพิ่ม " : "Outlook: added ") + res.added);
          setTimeout(() => setSyncMsg(""), 3500);
          return { ...d, activity: [...(d.activity || []), ...res.addRows] };
        });
      } catch (e) {}
    })();
  }, [loaded]);

  const update = (tabKey, idx, key, val) => setData(d => {
    const rows = d[tabKey].slice(); const r = { ...rows[idx] }; r[key] = val;
    if (r._a && r._a.includes(key)) r._a = r._a.filter(k => k !== key); rows[idx] = r; return { ...d, [tabKey]: rows };
  });
  const addRow = tabKey => setData(d => { const b = { _a: [] }; cols[tabKey].forEach(c => b[c.k] = c.type === "number" ? 0 : ""); return { ...d, [tabKey]: [...d[tabKey], b] }; });
  const delRow = (tabKey, idx) => { if (!window.confirm(lang === "th" ? "ลบรายการนี้? (ย้ายไปถังขยะ — กู้คืนได้จากปุ่ม 🗑)" : "Delete this item? (moves to Trash — you can restore it from 🗑)")) return; pushUndo(); setData(d => { const row = d[tabKey][idx]; const item = { _tid: Math.random().toString(36).slice(2, 10), store: tabKey, ts: Date.now(), row }; return { ...d, [tabKey]: d[tabKey].filter((_, i) => i !== idx), trash: [...(d.trash || []), item] }; }); };
  // ---- Trash: soft-deleted rows live in data.trash until restored or emptied ----
  const restoreTrash = tid => setData(d => { const it = (d.trash || []).find(t => t._tid === tid); if (!it) return d; return { ...d, [it.store]: [...(d[it.store] || []), it.row], trash: (d.trash || []).filter(t => t._tid !== tid) }; });
  const restoreAllTrash = () => setData(d => { const nd = { ...d }; (d.trash || []).forEach(it => { nd[it.store] = [...(nd[it.store] || []), it.row]; }); nd.trash = []; return nd; });
  const emptyTrash = () => { if (window.confirm(lang === "th" ? "ล้างถังขยะถาวร? รายการในถังจะหายและกู้คืนไม่ได้อีก" : "Empty trash permanently? Items in the bin will be gone for good.")) { pushUndo(); setData(d => ({ ...d, trash: [] })); } };
  const setRow = (tabKey, idx, nr) => setData(d => { const rows = d[tabKey].slice(); rows[idx] = nr; return { ...d, [tabKey]: rows }; });
  const addRowWith = (tabKey, obj) => setData(d => ({ ...d, [tabKey]: [...d[tabKey], { _a: [], ...obj }] }));
  const quickAdd = (store, preset) => { setData(d => ({ ...d, [store]: [...(d[store] || []), { _a: [], ...preset }] })); setTab(store); };
  const setLang = lg => setData(d => ({ ...d, meta: { ...(d.meta || {}), lang: lg } }));

  const exportCSV = tabKey => {
    const cs = cols[tabKey]; const esc = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [cs.map(c => c.l).join(",")].concat(data[tabKey].map(r => cs.map(c => esc(r[c.k])).join(","))).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = `${tabKey}.csv`; a.click(); URL.revokeObjectURL(url);
  };
  const resetAll = () => { if (window.confirm("Reset every tab to the original seed data? Your edits will be lost.")) { pushUndo(); setData(seed()); } };
  const downloadBackup = () => { const today = new Date().toISOString().slice(0, 10); const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })); const a = document.createElement("a"); a.href = url; a.download = `phd_dashboard_backup_${today}.json`; a.click(); URL.revokeObjectURL(url); };

  const m = useMemo(() => {
    const T = data.timeline, C = data.contacts, E = data.events, P = data.publications, IV = data.interviews;
    const pcts = T.map(r => Number(r.pct) || 0);
    const overall = pcts.length ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length) : 0;
    const done = T.filter(r => r.status === "Completed").length;
    const intvTotal = IV.filter(r => r.code).length;
    const intvDone = IV.filter(r => ["Interviewed", "Transcribed"].includes(r.phase) && r.code).length;
    const phase = PHASE.map(p => { const rs = T.filter(r => r.phase === p); return { p, v: rs.length ? Math.round(rs.reduce((a, r) => a + (Number(r.pct) || 0), 0) / rs.length) : 0, n: rs.length }; }).filter(x => x.n > 0);
    const pubStatuses = ["Idea","Planned","Outline","Drafting","Submitted","Under review","Accepted"];
    const pubPipe = pubStatuses.map(s => ({ s, n: P.filter(r => r.status === s).length }));
    const ev = { attended: E.filter(r => ["Attended","Presented"].includes(r.status)).length, upcoming: E.filter(r => ["Registered","Abstract submitted"].includes(r.status)).length, ideas: E.filter(r => r.status === "Idea").length };
    const papers = P.filter(r => r.ptype !== "Thesis" && r.series !== "—").length;
    const followups = C.filter(r => r.follow === "Yes").length;
    const unverified = Object.values(data).flat().reduce((a, r) => a + ((r && r._a && r._a.length) || 0), 0);
    const A = roleRecords(data);
    const roleAgg = ROLES.map(role => { const rs = A.filter(x => x.role === role); return { role, count: rs.length, hours: rs.reduce((a, x) => a + (Number(x.hours) || 0), 0) }; });
    const nowMs = Date.now(), c30 = nowMs - 30 * 86400000;
    const inLast30 = d => { if (!/^\d{4}-\d{2}-\d{2}$/.test(d || "")) return false; const ms = new Date(d).getTime(); return !isNaN(ms) && ms >= c30 && ms <= nowMs; };
    const last30 = ROLES.map(role => ({ role, count: A.filter(x => x.role === role && inLast30(x.date)).length }));
    const recentAct = A.filter(x => /^\d{4}-\d{2}-\d{2}$/.test(x.date || "")).slice().sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 6).map(x => ({ date: x.date, role: x.role, activity: x.activity, category: x.category }));
    return { overall, done, total: T.length, intvDone, intvTotal, phase, pubPipe, ev, papers, followups, contacts: C.length, activities: data.activity.length, unverified, roleAgg, last30, recentAct };
  }, [data]);

  const months = (() => { const s = new Date(2023, 8, 25), n = new Date(); let mo = (n.getFullYear() - s.getFullYear()) * 12 + (n.getMonth() - s.getMonth()); if (n.getDate() < s.getDate()) mo--; return { y: Math.floor(mo / 12), m: mo % 12 }; })();
  const elapsed = lang === "th" ? `${months.y} ปี ${months.m} เดือน` : `${months.y}y ${months.m}m in`;
  const HEADER_ROLES = ["PhD", "Chula Lecturer", "BSSC Lecturer", "BSSC PGTA"];
  const roleCount = r => { const x = m.roleAgg.find(a => a.role === r); return x ? x.count : 0; };
  const goAdd = () => { setGroup("overview"); setTab("add"); };

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif", color: INK, background: OFF, minHeight: "100vh" }}>
      <div style={{ background: AUB, color: "#fff", padding: "16px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>🎓 Pundharee Dashboard</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <button onClick={goAdd} title={lang === "th" ? "ไปหน้าเพิ่มข้อมูล" : "go to the Add page"} style={{ background: "#fff", color: AUB, border: "none", borderRadius: 8, padding: "7px 15px", cursor: "pointer", fontSize: 13, fontWeight: 800 }}>＋ {lang === "th" ? "เพิ่ม" : "Add"}</button>
            <div style={{ display: "flex", border: "1px solid #6B4E8C", borderRadius: 7, overflow: "hidden" }}>
              {["en","th"].map(lg => (
                <button key={lg} onClick={() => setLang(lg)} style={{ border: "none", cursor: "pointer", padding: "5px 11px", fontSize: 12, fontWeight: 700, color: lang === lg ? AUB : "#fff", background: lang === lg ? "#fff" : "transparent" }}>{lg.toUpperCase()}</button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "#D9CCE6", textAlign: "right" }}>
              {savedAt ? `${L("saved")} ${savedAt.toLocaleTimeString()}` : (loaded ? L("savedAuto") : L("loading"))}
              <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "flex-end", marginTop: 3, flexWrap: "wrap" }}>
                <button onClick={undo} disabled={undoN === 0} title={lang === "th" ? "ย้อนการลบ/รีเซ็ต/แทนที่ครั้งล่าสุด" : "undo the last delete / reset / replace"} style={{ border: "1px solid rgba(255,255,255,0.4)", background: undoN ? "rgba(255,255,255,0.14)" : "transparent", color: "#fff", borderRadius: 6, padding: "2px 8px", cursor: undoN ? "pointer" : "default", fontSize: 10, opacity: undoN ? 1 : 0.45 }}>⤺ {lang === "th" ? "ย้อนกลับ" : "Undo"}{undoN ? ` (${undoN})` : ""}</button>
                <button onClick={() => setShowTrash(true)} title={lang === "th" ? "ถังขยะ — ดู/กู้คืนรายการที่ลบ" : "Trash — view / restore deleted items"} style={{ border: "1px solid rgba(255,255,255,0.4)", background: (data.trash || []).length ? "rgba(255,255,255,0.14)" : "transparent", color: "#fff", borderRadius: 6, padding: "2px 8px", cursor: "pointer", fontSize: 10 }}>🗑 {lang === "th" ? "ถังขยะ" : "Trash"}{(data.trash || []).length ? ` (${data.trash.length})` : ""}</button>
                <button onClick={downloadBackup} title={lang === "th" ? "ดาวน์โหลดสำเนาข้อมูลทั้งหมด (JSON)" : "download a full JSON backup of all your data"} style={{ border: "1px solid rgba(255,255,255,0.4)", background: "transparent", color: "#fff", borderRadius: 6, padding: "2px 8px", cursor: "pointer", fontSize: 10 }}>⤓ {lang === "th" ? "สำรอง" : "Backup"}</button>
                <button onClick={reloadFromCloud} title={lang === "th" ? "ดึงข้อมูลล่าสุดจากอุปกรณ์อื่น" : "pull latest from other devices"} style={{ border: "1px solid rgba(255,255,255,0.4)", background: "transparent", color: "#fff", borderRadius: 6, padding: "2px 8px", cursor: "pointer", fontSize: 10 }}>⟳ {lang === "th" ? "ซิงค์" : "Sync"}</button>
                <label style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10, color: "#D9CCE6", cursor: "pointer" }}><input type="checkbox" checked={live} onChange={e => setLive(e.target.checked)} />{lang === "th" ? "ไลฟ์" : "Live"}</label>
              </div>
              {syncMsg && <div style={{ color: "#CDEACD", marginTop: 2 }}>{syncMsg}</div>}
              {m.unverified > 0 && <div style={{ color: "#FFB4B4", marginTop: 2 }}>● {m.unverified} {L("toVerify")}</div>}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
          {HEADER_ROLES.map(r => (
            <div key={r} style={{ background: "rgba(255,255,255,0.10)", borderLeft: `3px solid ${roleColor(r)}`, borderRadius: 6, padding: "6px 12px", minWidth: 118 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{roleLab(lang, r)}</div>
              <div style={{ fontSize: 9.5, color: "#D9CCE6", marginTop: 1 }}>{rolePeriod(r) || "—"}</div>
              {elapsedLabel(roleStart(r), lang) && <div style={{ fontSize: 9.5, color: "#CDBBE0", fontWeight: 600 }}>⏱ {elapsedLabel(roleStart(r), lang)}</div>}
              <div style={{ fontSize: 19, fontWeight: 800, color: "#fff", lineHeight: 1.15, marginTop: 2 }}>{roleCount(r)} <span style={{ fontSize: 9, fontWeight: 400, color: "#D9CCE6" }}>{lang === "th" ? "กิจกรรม" : "logged"}</span></div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, background: AUB, padding: "8px 12px", flexWrap: "wrap" }}>
        {GROUPS.map(g => { const active = group === g.k; return (
          <button key={g.k} onClick={() => { setGroup(g.k); const first = TABS.find(tb => tb.group === g.k); if (first) setTab(first.k); }} style={{ border: "none", cursor: "pointer", padding: "6px 15px", borderRadius: 7, fontSize: 13, fontWeight: 700, color: active ? AUB : "#fff", background: active ? "#fff" : "rgba(255,255,255,0.12)" }}>{g.ic} {lang === "th" ? g.th : g.en}</button>
        ); })}
        <div style={{ flex: 1, minWidth: 8 }} />
        <button onClick={() => { setGroup("cv"); setTab("cv"); }} style={{ border: `1px solid ${group === "cv" ? "#fff" : "rgba(255,255,255,0.5)"}`, cursor: "pointer", padding: "6px 15px", borderRadius: 7, fontSize: 13, fontWeight: 700, color: group === "cv" ? AUB : "#fff", background: group === "cv" ? "#fff" : "transparent" }}>📋 {lang === "th" ? "ประวัติย่อ (CV)" : "CV"}</button>
      </div>

      {group !== "cv" && (
        <div style={{ display: "flex", gap: 2, background: "#fff", borderBottom: `2px solid ${AUB}`, padding: "0 12px", overflowX: "auto" }}>
          {TABS.filter(tb => tb.group === group).map(tb => { const active = tab === tb.k; return (
            <button key={tb.k} onClick={() => setTab(tb.k)} style={{ border: "none", cursor: "pointer", padding: "11px 16px", fontSize: 13, fontWeight: active ? 700 : 500, color: active ? AUB : AUB2, background: active ? CARD : "transparent", borderBottom: active ? `3px solid ${AUB}` : "3px solid transparent", whiteSpace: "nowrap" }}>{tb.ic} {lang === "th" ? tb.th : tb.en}</button>
          ); })}
        </div>
      )}

      <div style={{ padding: 18 }}>
        {tab === "dashboard" ? <Dashboard m={m} data={data} update={update} setTab={setTab} resetAll={resetAll} lang={lang} />
          : tab === "interviews" ? <InterviewBoard data={data} update={update} setRow={setRow} addRowWith={addRowWith} delRow={delRow} exportCSV={exportCSV} lang={lang} />
          : tab === "calendar" ? <CalendarTab data={data} setRow={setRow} addRowWith={addRowWith} delRow={delRow} setData={setData} lang={lang} />
          : tab === "cv" ? <CVTab data={data} setData={setData} lang={lang} />
          : tab === "plan" ? <ResearchPlanTab data={data} setData={setData} lang={lang} />
          : tab === "framing" ? <ResearchFramingTab data={data} setData={setData} lang={lang} />
          : tab === "teaching" ? <TeachingTab data={data} lang={lang} />
          : tab === "lecdash" ? <LecturerDashboard data={data} setTab={setTab} lang={lang} />
          : tab === "lecexport" ? <LecturerExport data={data} lang={lang} />
          : tab === "events" ? <EventsTab data={data} update={update} addRow={addRow} delRow={delRow} exportCSV={exportCSV} lang={lang} />
          : tab === "supervisor" ? <SupervisorTab data={data} update={update} addRow={addRow} delRow={delRow} exportCSV={exportCSV} lang={lang} />
          : tab === "add" ? <AddHub data={data} setData={setData} quickAdd={quickAdd} pushUndo={pushUndo} lang={lang} />
          : tab === "reports" ? <ReportsHub data={data} lang={lang} />
          : tab === "activity" ? <ActivityLog data={data} update={update} addRow={addRow} delRow={delRow} exportCSV={exportCSV} setRow={setRow} addRowWith={addRowWith} setData={setData} lang={lang} />
          : tab === "personal" ? <RoleSummaryTab data={data} role="Personal" icon="🌱" setTab={setTab} lang={lang} />
          : tab === "chula" ? <RoleSummaryTab data={data} role="Chula Lecturer" icon="🏛️" setTab={setTab} lang={lang} />
          : tab === "pgta" ? <RoleSummaryTab data={data} role="BSSC PGTA" icon="🎒" setTab={setTab} lang={lang} />
          : tab === "projects" ? <ProjectsTab data={data} update={update} addRow={addRow} delRow={delRow} exportCSV={exportCSV} lang={lang} />
          : <TableTab tabKey={tab} data={data} update={update} addRow={addRow} delRow={delRow} exportCSV={exportCSV} lang={lang} />}
      </div>

      {showTrash && <TrashModal data={data} restoreTrash={restoreTrash} restoreAllTrash={restoreAllTrash} emptyTrash={emptyTrash} close={() => setShowTrash(false)} lang={lang} />}
    </div>
  );
}

// ---- Trash bin: view / restore / empty soft-deleted rows ----
const TRASH_STORE_LABELS = { timeline: "Timeline", contacts: "Contacts", events: "Events", publications: "Publications", supervisor: "Supervisor log", activity: "Activity", interviews: "Interviews", tasks: "Tasks", sources: "Sources", outputs: "Outputs", ideas: "Ideas", reflections: "Reflections", teachingSessions: "Teaching sessions", guestLectures: "Guest lectures", supervision: "Supervision", marking: "Marking", teachingEvidence: "Teaching evidence" };
function trashLabel(row) {
  if (!row || typeof row !== "object") return "(item)";
  const v = row.activity || row.name || row.title || row.task || row.event || row.paper || row.agenda || row.idea || row.reflection || (row.first ? `${row.first} ${row.last || ""}`.trim() : "") || "";
  return v || "(item)";
}
function TrashModal({ data, restoreTrash, restoreAllTrash, emptyTrash, close, lang }) {
  const items = (data.trash || []).slice().sort((a, b) => (b.ts || 0) - (a.ts || 0));
  const fmt = ts => { try { return new Date(ts).toLocaleString(lang === "th" ? "th-TH" : "en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }); } catch (e) { return ""; } };
  return (
    <div onClick={close} style={{ position: "fixed", inset: 0, background: "rgba(20,12,30,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 60 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 12, width: 560, maxWidth: "100%", maxHeight: "88vh", display: "flex", flexDirection: "column", boxShadow: "0 10px 40px rgba(0,0,0,0.3)" }}>
        <div style={{ background: AUB, color: "#fff", padding: "12px 16px", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>🗑 {lang === "th" ? "ถังขยะ" : "Trash"} · {items.length}</span>
          <button onClick={close} style={{ border: "none", background: "transparent", color: "#fff", cursor: "pointer", fontSize: 18 }}>×</button>
        </div>
        <div style={{ padding: 14, overflowY: "auto", flex: 1 }}>
          {items.length === 0 ? <div style={{ fontSize: 13, color: GREY, textAlign: "center", padding: "30px 0" }}>{lang === "th" ? "ถังขยะว่าง — รายการที่ลบจะมาอยู่ที่นี่ กู้คืนได้" : "Trash is empty — deleted items land here and can be restored."}</div> :
            items.map(it => (
              <div key={it._tid} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 6px", borderBottom: `1px solid ${BORDER}`, fontSize: 12 }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", background: AUB2, borderRadius: 4, padding: "2px 6px", flex: "0 0 auto" }}>{TRASH_STORE_LABELS[it.store] || it.store}</span>
                <span style={{ flex: 1, minWidth: 0, color: INK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{trashLabel(it.row)}</span>
                <span style={{ fontSize: 10, color: GREY, flex: "0 0 auto" }}>{fmt(it.ts)}</span>
                <button onClick={() => restoreTrash(it._tid)} style={{ border: `1px solid ${AUB}`, background: CARD, color: AUB, borderRadius: 5, padding: "3px 10px", cursor: "pointer", fontSize: 11, fontWeight: 700, flex: "0 0 auto" }}>{lang === "th" ? "กู้คืน" : "Restore"}</button>
              </div>
            ))}
        </div>
        <div style={{ display: "flex", gap: 8, padding: "12px 16px", borderTop: `1px solid ${BORDER}` }}>
          <button onClick={restoreAllTrash} disabled={!items.length} style={{ background: items.length ? AUB : "#B9A9CC", color: "#fff", border: "none", borderRadius: 6, padding: "8px 14px", cursor: items.length ? "pointer" : "default", fontSize: 12, fontWeight: 700 }}>{lang === "th" ? "กู้คืนทั้งหมด" : "Restore all"}</button>
          <button onClick={emptyTrash} disabled={!items.length} style={{ marginLeft: "auto", background: "#fff", color: RED, border: `1px solid ${items.length ? RED : BORDER}`, borderRadius: 6, padding: "8px 14px", cursor: items.length ? "pointer" : "default", fontSize: 12 }}>{lang === "th" ? "ล้างถังขยะ" : "Empty trash"}</button>
        </div>
      </div>
    </div>
  );
}

function RoleSummaryTab({ data, role, icon, setTab, lang }) {
  const T = (th, en) => lang === "th" ? th : en;
  const recs = roleRecords(data).filter(x => x.role === role);
  const tasks = (data.tasks || []).filter(r => (r.role || "") === role);
  const refl = (data.reflections || []).filter(r => (r.role || "") === role);
  const ideas = (data.ideas || []).filter(r => (r.role || "") === role);
  const outputs = (data.outputs || []).filter(r => (r.role || "") === role);
  const hoursTotal = recs.reduce((a, x) => a + (Number(x.hours) || 0), 0);
  const recent = recs.filter(x => /^\d{4}-\d{2}-\d{2}$/.test(x.date || "")).slice().sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 12);
  const per = rolePeriod(role), el = elapsedLabel(roleStart(role), lang);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 800, color: AUB }}>{icon} {roleLab(lang, role)}</div>
        <div style={{ fontSize: 12, color: GREY, marginTop: 2 }}>{per ? `${per}${el ? " · " + el : ""} · ` : ""}{T("รวมทุกอย่างที่ติดแท็กหมวกนี้ — เพิ่มได้จากปุ่ม ＋ เพิ่ม", "Everything tagged with this hat. Add via ＋ Add.")}</div>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Kpi label={T("กิจกรรม/บันทึก", "Activities")} value={recs.length} sub={hoursTotal ? `${hoursTotal}${T("ชม.", "h")}` : ""} />
        <Kpi label={T("งาน", "Tasks")} value={tasks.length} />
        <Kpi label={T("ผลงาน", "Outputs")} value={outputs.length} />
        <Kpi label={T("บันทึกสะท้อน", "Reflections")} value={refl.length} />
        <Kpi label={T("ไอเดีย", "Ideas")} value={ideas.length} />
      </div>
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: AUB, marginBottom: 8 }}>{T("กิจกรรมล่าสุด", "Recent activity")}</div>
        {recent.length ? recent.map((x, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "baseline", fontSize: 12, padding: "5px 0", borderTop: i ? `1px solid ${BORDER}` : "none" }}>
            <span style={{ width: 82, color: GREY, flex: "0 0 auto" }}>{x.date}</span>
            <span style={{ flex: 1, minWidth: 0 }}>{x.activity || "—"}</span>
            <span style={{ fontSize: 10, color: AUB2, flex: "0 0 auto" }}>{x.category}</span>
          </div>
        )) : <div style={{ fontSize: 12, color: GREY }}>{T("ยังไม่มีรายการ — ไปที่ ＋ เพิ่ม แล้วเลือกหมวกนี้", "Nothing yet — go to ＋ Add and pick this hat.")}</div>}
      </div>
      <button onClick={() => setTab("add")} style={{ alignSelf: "flex-start", background: AUB, color: "#fff", border: "none", borderRadius: 8, padding: "9px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>＋ {T("เพิ่มรายการ", "Add item")}</button>
    </div>
  );
}

function ProjectsTab({ data, update, addRow, delRow, exportCSV, lang }) {
  const [roleF, setRoleF] = useState("all");
  const T = (th, en) => lang === "th" ? th : en;
  const projects = data.projects || [];
  const countFor = k => k === "all" ? projects.length : projects.filter(p => (p.role || "") === k).length;
  const shown = roleF === "all" ? projects : projects.filter(p => (p.role || "") === roleF);
  const byStatus = ["Active", "Planned", "On hold", "Idea", "Completed", "Dropped"].map(s => ({ s, n: shown.filter(p => p.status === s).length })).filter(x => x.n);
  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 800, color: AUB }}>📁 {T("โปรเจกต์ทั้งหมด", "All projects")}</div>
      <div style={{ fontSize: 12, color: GREY, marginBottom: 12 }}>{T("รวมโปรเจกต์ทุกหมวกไว้ที่เดียว — แท็กบทบาท (PhD / BSSC Lecturer / Chula Lecturer / Personal …) แล้วกรองดูได้", "Every project in one place — tag a role (PhD / BSSC Lecturer / Chula Lecturer / Personal …) and filter.")}</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {[["all", T("ทั้งหมด", "All")], ...ROLES.map(r => [r, roleLab(lang, r)])].map(([k, lb]) => (
          <button key={k} onClick={() => setRoleF(k)} style={{ border: `1px solid ${roleF === k ? AUB : BORDER}`, background: roleF === k ? (k === "all" ? AUB : roleColor(k)) : "#fff", color: roleF === k ? "#fff" : AUB2, borderRadius: 999, padding: "4px 12px", cursor: "pointer", fontSize: 12, fontWeight: roleF === k ? 700 : 500 }}>{lb} <span style={{ opacity: 0.7 }}>{countFor(k)}</span></button>
        ))}
      </div>
      {byStatus.length > 0 && <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>{byStatus.map(({ s, n }) => (<span key={s} style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: STAT_COLOR[s] || GREY, borderRadius: 6, padding: "3px 9px" }}>{s} · {n}</span>))}</div>}
      <TableTab tabKey="projects" data={data} update={update} addRow={addRow} delRow={delRow} exportCSV={exportCSV} lang={lang} filterRole={roleF} sortKey="start" sortDir="desc" />
    </div>
  );
}

function Kpi({ label, value, sub }) {
  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "12px 14px", minWidth: 130, flex: "1 1 130px" }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: AUB2, textTransform: "uppercase", letterSpacing: 0.4 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 800, color: AUB, lineHeight: 1.1, marginTop: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: GREY, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function Dashboard({ m, data, update, setTab, resetAll, lang }) {
  const L = k => t(lang, k);
  const phaseName = p => lang === "th" ? (PHASE_TH[p] || p) : p;
  const totalAct = m.roleAgg.reduce((a, r) => a + r.count, 0) || 1;
  const RORDER = ["PhD", "Chula Lecturer", "BSSC Lecturer", "BSSC PGTA", "Service/Admin", "Personal", "Unassigned"];
  const activeRoles = m.roleAgg.filter(r => r.count > 0).slice().sort((a, b) => RORDER.indexOf(a.role) - RORDER.indexOf(b.role));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <TaskTracker data={data} update={update} setTab={setTab} lang={lang} />
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: AUB }}>{L("actSummary")}</div>
        <div style={{ fontSize: 11, color: GREY, marginBottom: 12 }}>{L("actSummarySub")}</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
          {activeRoles.map(r => (
            <div key={r.role} style={{ flex: "1 1 120px", border: `1px solid ${BORDER}`, borderTop: `3px solid ${roleColor(r.role)}`, borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: roleColor(r.role) }}>{r.role === "Lecturer" ? "BSSC Lecturer" : r.role === "PGTA" ? "BSSC PGTA" : roleLab(lang, r.role)}{r.role === "PGTA" && <span style={{ color: GREY, fontWeight: 400 }}> · {lang === "th" ? "จบแล้ว" : "ended"}</span>}</div>
              {rolePeriod(r.role) && <div style={{ fontSize: 9, color: GREY, marginTop: 1 }}>{rolePeriod(r.role)}</div>}
              <div style={{ fontSize: 24, fontWeight: 800, color: AUB, lineHeight: 1.1 }}>{r.count}</div>
              <div style={{ fontSize: 11, color: GREY }}>{r.hours > 0 ? `${r.hours}${L("hoursShort")} ${L("logged")} · ` : ""}{Math.round(r.count / totalAct * 100)}%</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", height: 12, borderRadius: 6, overflow: "hidden", marginBottom: 14, border: `1px solid ${BORDER}` }}>
          {activeRoles.map(r => <div key={r.role} title={`${roleLab(lang, r.role)} ${r.count}`} style={{ width: `${r.count / totalAct * 100}%`, background: roleColor(r.role) }} />)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: AUB2 }}>{L("last30")}:</span>
          {m.last30.filter(r => r.count > 0).map(r => <span key={r.role} style={{ fontSize: 11, color: "#fff", background: roleColor(r.role), borderRadius: 999, padding: "2px 10px" }}>{roleLab(lang, r.role)} {r.count}</span>)}
          {m.last30.every(r => r.count === 0) && <span style={{ fontSize: 11, color: GREY }}>—</span>}
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: AUB, marginBottom: 4 }}>{L("recent")}</div>
        {m.recentAct.length ? m.recentAct.map((x, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "baseline", fontSize: 12, padding: "4px 0", borderTop: i ? `1px solid ${BORDER}` : "none" }}>
            <span style={{ width: 82, color: GREY, flex: "0 0 auto" }}>{x.date}</span>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: roleColor(x.role), flex: "0 0 auto" }} />
            <span style={{ flex: 1, minWidth: 0 }}>{x.activity || "—"}</span>
            <span style={{ fontSize: 10, color: AUB2, flex: "0 0 auto" }}>{x.category}</span>
          </div>
        )) : <div style={{ fontSize: 12, color: GREY }}>{L("noAct")}</div>}
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Kpi label={L("kOverall")} value={`${m.overall}%`} sub={L("avg")} />
        <Kpi label={L("kMile")} value={`${m.done} / ${m.total}`} />
        <Kpi label={L("kIntv")} value={`${m.intvDone} / ${m.intvTotal}`} />
        <Kpi label={L("kCont")} value={m.contacts} sub={`${m.followups} ${L("fu")}`} />
        <Kpi label={L("kEv")} value={m.ev.attended + m.ev.upcoming + m.ev.ideas} sub={`${m.ev.attended} ${L("att")}`} />
        <Kpi label={L("kPap")} value={m.papers} />
        <Kpi label={L("kAct")} value={m.activities} />
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "2 1 420px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: AUB, marginBottom: 10 }}>{L("byPhase")}</div>
          {m.phase.map(({ p, v }) => (
            <div key={p} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
              <div style={{ width: 120, fontSize: 12 }}>{phaseName(p)}</div>
              <div style={{ flex: 1, height: 12, background: "#EFEAF3", borderRadius: 6, overflow: "hidden" }}><div style={{ width: `${v}%`, height: "100%", background: v >= 100 ? GREEN : AUB2 }} /></div>
              <div style={{ width: 38, textAlign: "right", fontSize: 12, fontWeight: 700, color: AUB }}>{v}%</div>
            </div>
          ))}
        </div>
        <div style={{ flex: "1 1 240px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: AUB, marginBottom: 8 }}>{L("pubPipe")}</div>
            {m.pubPipe.map(({ s, n }) => (<div key={s} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "3px 0", color: n ? INK : GREY }}><span>{s}</span><span style={{ fontWeight: 700 }}>{n}</span></div>))}
          </div>
          <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: AUB, marginBottom: 8 }}>{L("evBox")}</div>
            {[[L("att"), m.ev.attended], ["+ upcoming", m.ev.upcoming], ["ideas", m.ev.ideas]].map(([l, n]) => (<div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "3px 0" }}><span>{l}</span><span style={{ fontWeight: 700 }}>{n}</span></div>))}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", fontSize: 12, color: GREY }}>
        <span style={{ color: RED, fontWeight: 700 }}>● {L("legend")}</span>
        <button onClick={resetAll} style={{ marginLeft: "auto", border: `1px solid ${BORDER}`, background: "#fff", color: AUB2, borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 12 }}>{L("reset")}</button>
      </div>
    </div>
  );
}

function TableTab({ tabKey, data, update, addRow, delRow, exportCSV, lang, sortKey, sortDir, filterRole }) {
  const cs = cols[tabKey]; const rows = data[tabKey] || []; const L = k => t(lang, k);
  // optional display sort/filter — keeps each row's real index (i) so edit/delete still target the right row
  let view = rows.map((r, i) => ({ r, i }));
  if (filterRole && filterRole !== "all") view = view.filter(o => (o.r.role || "") === filterRole);
  if (sortKey) {
    const dir = sortDir === "desc" ? -1 : 1;
    view = view.slice().sort((a, b) => {
      const av = a.r[sortKey] || "", bv = b.r[sortKey] || "";
      if (!av && !bv) return 0;
      if (!av) return 1; if (!bv) return -1;           // blank dates always sink to the bottom
      return (av < bv ? -1 : av > bv ? 1 : 0) * dir;
    });
  }
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}>
        <button onClick={() => addRow(tabKey)} style={{ background: AUB, color: "#fff", border: "none", borderRadius: 6, padding: "7px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>{L("addRow")}</button>
        <button onClick={() => exportCSV(tabKey)} style={{ background: "#fff", color: AUB2, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "7px 12px", cursor: "pointer", fontSize: 12 }}>{L("exportCSV")}</button>
        <span style={{ fontSize: 11, color: GREY, marginLeft: "auto" }}>{L("clickEdit")}</span>
      </div>
      <div style={{ overflowX: "auto", border: `1px solid ${BORDER}`, borderRadius: 8 }}>
        <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 12 }}>
          <thead><tr>
            {cs.map(c => (<th key={c.k} style={{ background: AUB, color: "#fff", textAlign: "left", padding: "8px", fontWeight: 700, minWidth: c.w }}>{colLab(lang, c.l)}</th>))}
            <th style={{ background: AUB, width: 34 }} />
          </tr></thead>
          <tbody>
            {view.map(({ r, i }, ri) => (
              <tr key={i} style={{ background: ri % 2 ? OFF : "#fff" }}>
                {cs.map(c => {
                  const assumed = r._a && r._a.includes(c.k); const isStatus = ["status", "follow"].includes(c.k);
                  const color = assumed ? RED : (isStatus && STAT_COLOR[r[c.k]] ? STAT_COLOR[r[c.k]] : INK);
                  const weight = assumed || isStatus ? 700 : 400;
                  const common = { width: "100%", border: "none", background: "transparent", font: "inherit", color, fontWeight: weight, outline: "none", padding: "6px 8px", boxSizing: "border-box" };
                  return (
                    <td key={c.k} style={{ border: `1px solid ${BORDER}`, verticalAlign: "top" }}>
                      {c.type === "select" ? (
                        <select value={r[c.k]} onChange={e => update(tabKey, i, c.k, e.target.value)} style={{ ...common, cursor: "pointer" }}><option value=""></option>{c.opts.map(o => <option key={o} value={o}>{o}</option>)}</select>
                      ) : c.type === "number" ? (
                        <input type="number" min="0" max="100" value={r[c.k]} onChange={e => update(tabKey, i, c.k, e.target.value)} style={{ ...common, textAlign: "center" }} />
                      ) : (
                        <textarea rows={1} value={r[c.k]} onChange={e => update(tabKey, i, c.k, e.target.value)} style={{ ...common, resize: "vertical", lineHeight: 1.35 }} />
                      )}
                    </td>
                  );
                })}
                <td style={{ border: `1px solid ${BORDER}`, textAlign: "center" }}><button onClick={() => delRow(tabKey, i)} title="Delete" style={{ border: "none", background: "transparent", color: GREY, cursor: "pointer", fontSize: 15 }}>×</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const ACT_VIEWS = [["list","list"],["calendar","calendar"],["folder","folder"]];

function ActivityLog({ data, update, addRow, delRow, exportCSV, setRow, addRowWith, setData, lang }) {
  const [view, setView] = useState("list");
  const [cal, setCal] = useState(() => new Date());
  const [editing, setEditing] = useState(null);
  const [roleF, setRoleF] = useState("all");
  const L = k => t(lang, k);
  const entries = data.activity; const indexed = entries.map((e, i) => ({ e, i }));
  const shown = roleF === "all" ? indexed : indexed.filter(o => roleOf(o.e) === roleF);
  const full = s => /^\d{4}-\d{2}-\d{2}$/.test(s || "");
  const vault = (data.meta && data.meta.vault) || "";
  const contactNames = data.contacts.map(c => c.name).filter(Boolean);
  const setVault = v => setData(d => ({ ...d, meta: { ...(d.meta || {}), vault: v } }));
  const openEdit = i => setEditing({ mode: "edit", index: i, draft: { ...entries[i] } });
  const openNew = pre => setEditing({ mode: "new", index: null, draft: { _a: [], date: "", category: "", activity: "", linked: "", detail: "", obsidian: "", output: "", hours: 0, tag: "", role: roleF !== "all" ? roleF : "PhD", ...pre } });
  const setField = (k, v) => setEditing(ed => { const dr = { ...ed.draft, [k]: v }; if (dr._a && dr._a.includes(k)) dr._a = dr._a.filter(x => x !== k); return { ...ed, draft: dr }; });
  const save = () => { if (editing.mode === "new") addRowWith("activity", editing.draft); else setRow("activity", editing.index, editing.draft); setEditing(null); };
  const remove = () => { if (editing.mode === "edit") delRow("activity", editing.index); setEditing(null); };
  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden" }}>
          {ACT_VIEWS.map(([k, lk]) => (<button key={k} onClick={() => setView(k)} style={{ border: "none", cursor: "pointer", padding: "7px 16px", fontSize: 12, fontWeight: view === k ? 700 : 500, color: view === k ? "#fff" : AUB2, background: view === k ? AUB : "#fff" }}>{L(lk)}</button>))}
        </div>
        {view !== "list" && <button onClick={() => openNew({})} style={{ background: AUB, color: "#fff", border: "none", borderRadius: 6, padding: "7px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>{L("addEntry")}</button>}
        {view !== "list" && <button onClick={() => exportCSV("activity")} style={{ background: "#fff", color: AUB2, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "7px 12px", cursor: "pointer", fontSize: 12 }}>{L("exportCSV")}</button>}
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: AUB2 }}>{L("vault")}<input value={vault} onChange={e => setVault(e.target.value)} placeholder="vault" style={{ border: `1px solid ${BORDER}`, borderRadius: 5, padding: "4px 7px", fontSize: 11, width: 110 }} /></label>
        <span style={{ fontSize: 11, color: GREY, marginLeft: "auto" }}>{(view === "list" ? entries.length : shown.length)} {L("entries")}</span>
      </div>
      {view !== "list" && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {[["all", L("allRoles")], ...ROLES.map(r => [r, roleLab(lang, r)])].map(([k, lb]) => (
            <button key={k} onClick={() => setRoleF(k)} title={k === "all" ? "" : rolePeriod(k)} style={{ border: `1px solid ${roleF === k ? AUB : BORDER}`, background: roleF === k ? (k === "all" ? AUB : roleColor(k)) : "#fff", color: roleF === k ? "#fff" : AUB2, borderRadius: 999, padding: "4px 12px", cursor: "pointer", fontSize: 12, fontWeight: roleF === k ? 700 : 500 }}>{lb}</button>
          ))}
        </div>
      )}
      {view === "list" && <TableTab tabKey="activity" data={data} update={update} addRow={addRow} delRow={delRow} exportCSV={exportCSV} lang={lang} sortKey="date" sortDir="desc" />}
      {view === "calendar" && <CalendarView indexed={shown} full={full} cal={cal} setCal={setCal} openEdit={openEdit} openNew={openNew} lang={lang} />}
      {view === "folder" && <FolderView indexed={shown} openEdit={openEdit} openNew={openNew} vault={vault} lang={lang} />}
      {editing && <EntryModal editing={editing} setField={setField} save={save} remove={remove} cancel={() => setEditing(null)} vault={vault} contactNames={contactNames} lang={lang} />}
    </div>
  );
}

function CalendarView({ indexed, full, cal, setCal, openEdit, openNew, lang }) {
  const L = k => t(lang, k);
  const y = cal.getFullYear(), mo = cal.getMonth();
  const dim = new Date(y, mo + 1, 0).getDate();
  const startDow = (new Date(y, mo, 1).getDay() + 6) % 7;
  const ds = d => `${y}-${String(mo + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const byDay = {}; indexed.forEach(o => { if (full(o.e.date)) (byDay[o.e.date] = byDay[o.e.date] || []).push(o); });
  const unsched = indexed.filter(o => !full(o.e.date));
  const cells = []; for (let i = 0; i < startDow; i++) cells.push(null); for (let d = 1; d <= dim; d++) cells.push(d);
  const dow = lang === "th" ? ["จ.","อ.","พ.","พฤ.","ศ.","ส.","อา."] : ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const today = new Date().toISOString().slice(0, 10);
  const locale = lang === "th" ? "th-TH" : "en-GB";
  const monthsSet = {}; indexed.forEach(o => { const dstr = o.e.date || ""; const m = dstr.match(/^(\d{4})-(\d{2})/); if (m) { const key = `${m[1]}-${m[2]}`; monthsSet[key] = (monthsSet[key] || 0) + 1; } });
  const journey = Object.keys(monthsSet).sort();
  const curKey = `${y}-${String(mo + 1).padStart(2, "0")}`;
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: AUB, marginBottom: 6 }}>{L("journey")}</div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6, marginBottom: 10 }}>
        {journey.map(key => { const [yy, mm] = key.split("-"); const dt = new Date(Number(yy), Number(mm) - 1, 1); const active = key === curKey;
          return (<button key={key} onClick={() => setCal(new Date(Number(yy), Number(mm) - 1, 1))} style={{ border: `1px solid ${active ? AUB : BORDER}`, background: active ? AUB : "#fff", color: active ? "#fff" : AUB2, borderRadius: 999, padding: "4px 11px", cursor: "pointer", fontSize: 11, whiteSpace: "nowrap", fontWeight: active ? 700 : 500 }}>{dt.toLocaleString(locale, { month: "short", year: "2-digit" })} · {monthsSet[key]}</button>); })}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <button onClick={() => setCal(new Date(y, mo - 1, 1))} style={navBtn}>‹</button>
        <div style={{ fontSize: 15, fontWeight: 800, color: AUB, minWidth: 170, textAlign: "center" }}>{cal.toLocaleString(locale, { month: "long", year: "numeric" })}</div>
        <button onClick={() => setCal(new Date(y, mo + 1, 1))} style={navBtn}>›</button>
        <button onClick={() => setCal(new Date())} style={{ ...navBtn, width: "auto", padding: "0 12px", fontSize: 12 }}>{L("today")}</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
        {dow.map(d => <div key={d} style={{ fontSize: 11, fontWeight: 700, color: AUB2, textAlign: "center", padding: "2px 0" }}>{d}</div>)}
        {cells.map((d, idx) => { if (d === null) return <div key={idx} />; const key = ds(d); const items = byDay[key] || []; const isT = key === today;
          return (
            <div key={idx} onDoubleClick={() => openNew({ date: key })} style={{ minHeight: 80, background: "#fff", border: `1px solid ${isT ? AUB : BORDER}`, borderRadius: 6, padding: 4, cursor: "pointer" }}>
              <div style={{ fontSize: 11, fontWeight: isT ? 800 : 500, color: isT ? AUB : GREY, marginBottom: 2 }}>{d}</div>
              {items.slice(0, 3).map(o => (<div key={o.i} onClick={e => { e.stopPropagation(); openEdit(o.i); }} title={o.e.activity} style={{ fontSize: 10, color: "#fff", background: ACT_COLOR[o.e.category] || GREY, borderRadius: 4, padding: "1px 4px", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{o.e.activity || "—"}</div>))}
              {items.length > 3 && <div style={{ fontSize: 10, color: AUB2 }}>+{items.length - 3}</div>}
            </div>
          ); })}
      </div>
      <div style={{ fontSize: 11, color: GREY, marginTop: 6 }}>{L("calHint")}</div>
      {unsched.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: AUB, marginBottom: 6 }}>{L("undated")}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{unsched.map(o => <div key={o.i} onClick={() => openEdit(o.i)} style={{ fontSize: 11, color: "#fff", background: ACT_COLOR[o.e.category] || GREY, borderRadius: 5, padding: "3px 8px", cursor: "pointer" }}>{o.e.date ? o.e.date + " · " : ""}{o.e.activity || "—"}</div>)}</div>
        </div>
      )}
    </div>
  );
}

function FolderView({ indexed, openEdit, openNew, vault, lang }) {
  const [open, setOpen] = useState({}); const isOpen = c => open[c] !== false;
  const cats = [...ACT_CATS, "Uncategorised"].filter(c => indexed.some(o => (o.e.category || "Uncategorised") === c));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {cats.map(c => { const items = indexed.filter(o => (o.e.category || "Uncategorised") === c).sort((a, b) => String(a.e.date).localeCompare(String(b.e.date))); const col = ACT_COLOR[c] || GREY;
        return (
          <div key={c} style={{ border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden" }}>
            <div onClick={() => setOpen(o => ({ ...o, [c]: !isOpen(c) }))} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", background: CARD, cursor: "pointer" }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: col }} />
              <span style={{ fontWeight: 700, color: AUB, fontSize: 13 }}>{c}</span><span style={{ fontSize: 11, color: GREY }}>{items.length}</span>
              <button onClick={e => { e.stopPropagation(); openNew({ category: c === "Uncategorised" ? "" : c }); }} style={{ marginLeft: "auto", border: `1px solid ${BORDER}`, background: "#fff", color: AUB2, borderRadius: 5, padding: "3px 8px", cursor: "pointer", fontSize: 11 }}>+ {t(lang, "addEntry").replace("+ ", "")}</button>
              <span style={{ color: AUB2, fontSize: 12 }}>{isOpen(c) ? "▾" : "▸"}</span>
            </div>
            {isOpen(c) && items.map(o => { const assumed = o.e._a && o.e._a.length > 0; const href = obsHref(o.e.obsidian, vault);
              return (
                <div key={o.i} onClick={() => openEdit(o.i)} style={{ display: "flex", gap: 10, padding: "8px 12px", borderTop: `1px solid ${BORDER}`, cursor: "pointer", fontSize: 12, alignItems: "baseline" }}>
                  <span style={{ width: 88, color: assumed ? RED : GREY, fontWeight: assumed ? 700 : 400 }}>{o.e.date || "—"}</span>
                  <span style={{ flex: 1, color: assumed ? RED : INK, fontWeight: assumed ? 700 : 400 }}>{o.e.activity || "—"}{o.e.linked ? <span style={{ color: AUB2, fontWeight: 400 }}> · {o.e.linked}</span> : null}</span>
                  {href && <a href={href} onClick={e => e.stopPropagation()} style={{ color: AUB2, textDecoration: "none", fontWeight: 700, whiteSpace: "nowrap" }}>{t(lang, "note")} ↗</a>}
                  <span style={{ color: GREY, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.e.detail}</span>
                </div>
              ); })}
          </div>
        ); })}
    </div>
  );
}

function EntryModal({ editing, setField, save, remove, cancel, vault, contactNames, lang }) {
  const d = editing.draft; const href = obsHref(d.obsidian, vault); const L = k => t(lang, k);
  return (
    <div onClick={cancel} style={{ position: "fixed", inset: 0, background: "rgba(20,12,30,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 50 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 12, width: 500, maxWidth: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 10px 40px rgba(0,0,0,0.3)" }}>
        <div style={{ background: AUB, color: "#fff", padding: "12px 16px", fontWeight: 800, fontSize: 14 }}>{editing.mode === "new" ? L("newRec") : L("editRec")}</div>
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          {cols.activity.map(f => { const assumed = d._a && d._a.includes(f.k);
            const st = { width: "100%", boxSizing: "border-box", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "7px 9px", fontSize: 13, color: assumed ? RED : INK, fontWeight: assumed ? 700 : 400, fontFamily: "inherit" };
            return (
              <div key={f.k}>
                <label style={{ fontSize: 11, fontWeight: 700, color: AUB2, display: "block", marginBottom: 3 }}>{colLab(lang, f.l)}{assumed && <span style={{ color: RED }}> ●</span>}</label>
                {f.type === "select" ? <select value={d[f.k] || ""} onChange={e => setField(f.k, e.target.value)} style={st}><option value=""></option>{f.opts.map(o => <option key={o} value={o}>{o}</option>)}</select>
                  : f.type === "number" ? <input type="number" value={d[f.k] || 0} onChange={e => setField(f.k, e.target.value)} style={st} />
                  : f.k === "detail" ? <textarea rows={3} value={d[f.k] || ""} onChange={e => setField(f.k, e.target.value)} style={{ ...st, resize: "vertical" }} />
                  : f.k === "linked" ? <><input list="al-contacts" value={d[f.k] || ""} onChange={e => setField(f.k, e.target.value)} placeholder={L("placeholder_person")} style={st} /><datalist id="al-contacts">{contactNames.map(n => <option key={n} value={n} />)}</datalist></>
                  : <input value={d[f.k] || ""} onChange={e => setField(f.k, e.target.value)} placeholder={f.k === "date" ? L("placeholder_date") : f.k === "obsidian" ? L("placeholder_obs") : ""} style={st} />}
                {f.k === "obsidian" && (href ? <a href={href} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: AUB2, fontWeight: 700, textDecoration: "none", display: "inline-block", marginTop: 4 }}>{L("openObs")} ↗</a> : (d.obsidian ? <span style={{ fontSize: 11, color: GREY, display: "inline-block", marginTop: 4 }}>{L("vaultHint")}</span> : null))}
              </div>
            ); })}
        </div>
        <div style={{ display: "flex", gap: 8, padding: "12px 16px", borderTop: `1px solid ${BORDER}` }}>
          <button onClick={save} style={{ background: AUB, color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>{L("save")}</button>
          <button onClick={cancel} style={{ background: "#fff", color: AUB2, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "8px 14px", cursor: "pointer", fontSize: 13 }}>{L("cancel")}</button>
          {editing.mode === "edit" && <button onClick={remove} style={{ marginLeft: "auto", background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 6, padding: "8px 14px", cursor: "pointer", fontSize: 13 }}>{L("del")}</button>}
        </div>
      </div>
    </div>
  );
}

function InterviewBoard({ data, update, setRow, addRowWith, delRow, exportCSV, lang }) {
  const [dragOver, setDragOver] = useState(null);
  const [editing, setEditing] = useState(null);
  const L = k => t(lang, k);
  const rows = data.interviews; const indexed = rows.map((e, i) => ({ e, i }));
  const phaseLabel = p => { const f = PHASES_IV.find(x => x.k === p); return f ? (lang === "th" ? f.th : f.en) : p; };
  const moveRel = (idx, dir) => { const cur = rows[idx].phase; const order = PHASES_IV.map(p => p.k); let pos = order.indexOf(cur); if (pos < 0) pos = 0; const np = Math.min(order.length - 1, Math.max(0, pos + dir)); update("interviews", idx, "phase", order[np]); };
  const onDrop = (e, phase) => { e.preventDefault(); const idx = Number(e.dataTransfer.getData("text/plain")); if (!Number.isNaN(idx)) update("interviews", idx, "phase", phase); setDragOver(null); };
  const openEdit = i => setEditing({ mode: "edit", index: i, draft: { ...rows[i] } });
  const openNew = () => setEditing({ mode: "new", index: null, draft: { _a: [], code: "", first: "", last: "", date: "", phase: "Invited", pis: false, consent: false, signed: false, qsent: false, interviewed: false, transcribed: false, note: "" } });
  const setField = (k, v) => setEditing(ed => ({ ...ed, draft: { ...ed.draft, [k]: v } }));
  const save = () => { if (editing.mode === "new") addRowWith("interviews", editing.draft); else setRow("interviews", editing.index, editing.draft); setEditing(null); };
  const remove = () => { if (editing.mode === "edit") delRow("interviews", editing.index); setEditing(null); };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
        <button onClick={openNew} style={{ background: AUB, color: "#fff", border: "none", borderRadius: 6, padding: "7px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>{L("addPart")}</button>
        <button onClick={() => exportCSV("interviews")} style={{ background: "#fff", color: AUB2, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "7px 12px", cursor: "pointer", fontSize: 12 }}>{L("exportCSV")}</button>
        <span style={{ fontSize: 11, color: GREY, marginLeft: "auto" }}>{indexed.filter(o => o.e.code).length} {lang === "th" ? "ผู้เข้าร่วม (มีรหัส)" : "coded participants"}</span>
      </div>
      <div style={{ fontSize: 11, color: AMBER, marginBottom: 10 }}>● {L("dragHint")}</div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8 }}>
        {PHASES_IV.map(ph => { const items = indexed.filter(o => o.e.phase === ph.k); const isOver = dragOver === ph.k;
          return (
            <div key={ph.k} onDragOver={e => { e.preventDefault(); setDragOver(ph.k); }} onDragLeave={() => setDragOver(null)} onDrop={e => onDrop(e, ph.k)}
              style={{ minWidth: 200, width: 200, flex: "0 0 auto", background: isOver ? "#EFEAF3" : OFF, border: `1px solid ${isOver ? AUB : BORDER}`, borderRadius: 10, padding: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: ph.c }} />
                <span style={{ fontWeight: 800, fontSize: 12, color: AUB }}>{phaseLabel(ph.k)}</span>
                <span style={{ fontSize: 11, color: GREY, marginLeft: "auto" }}>{items.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {items.map(o => (
                  <div key={o.i} draggable onDragStart={e => { e.dataTransfer.setData("text/plain", String(o.i)); e.dataTransfer.effectAllowed = "move"; }}
                    style={{ background: "#fff", border: `1px solid ${BORDER}`, borderLeft: `4px solid ${ph.c}`, borderRadius: 7, padding: "7px 8px", cursor: "grab" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      {o.e.code && <span style={{ fontSize: 10, fontWeight: 800, color: "#fff", background: AUB2, borderRadius: 4, padding: "1px 5px" }}>{o.e.code}</span>}
                      <span onClick={() => openEdit(o.i)} style={{ fontSize: 12, fontWeight: 700, color: INK, cursor: "pointer", flex: 1 }}>{o.e.first} {o.e.last}</span>
                      <button onClick={() => moveRel(o.i, -1)} title="prev" style={{ border: "none", background: "transparent", color: AUB2, cursor: "pointer", fontSize: 14, padding: "0 2px" }}>‹</button>
                      <button onClick={() => moveRel(o.i, 1)} title="next" style={{ border: "none", background: "transparent", color: AUB2, cursor: "pointer", fontSize: 14, padding: "0 2px" }}>›</button>
                    </div>
                    {o.e.date && <div style={{ fontSize: 10, color: GREY, marginTop: 2 }}>{o.e.date}</div>}
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginTop: 4 }}>
                      {IV_STAGES.map(([sk2, sl]) => (<span key={sk2} style={{ fontSize: 8.5, fontWeight: 700, padding: "1px 4px", borderRadius: 3, color: o.e[sk2] ? "#fff" : GREY, background: o.e[sk2] ? GREEN : "#EFEFEF" }}>{sl}</span>))}
                    </div>
                    {o.e.note && <div onClick={() => openEdit(o.i)} style={{ fontSize: 10, color: GREY, marginTop: 4, cursor: "pointer", lineHeight: 1.3 }}>{o.e.note}</div>}
                  </div>
                ))}
                {items.length === 0 && <div style={{ fontSize: 11, color: "#C4C4C4", textAlign: "center", padding: "10px 0" }}>—</div>}
              </div>
            </div>
          ); })}
      </div>
      {editing && <InterviewModal editing={editing} setField={setField} save={save} remove={remove} cancel={() => setEditing(null)} lang={lang} phaseLabel={phaseLabel} />}
    </div>
  );
}

function InterviewModal({ editing, setField, save, remove, cancel, lang, phaseLabel }) {
  const d = editing.draft; const L = k => t(lang, k);
  const st = { width: "100%", boxSizing: "border-box", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "7px 9px", fontSize: 13, fontFamily: "inherit" };
  const field = (k, label, ph) => (<div><label style={{ fontSize: 11, fontWeight: 700, color: AUB2, display: "block", marginBottom: 3 }}>{label}</label><input value={d[k] || ""} onChange={e => setField(k, e.target.value)} placeholder={ph || ""} style={st} /></div>);
  return (
    <div onClick={cancel} style={{ position: "fixed", inset: 0, background: "rgba(20,12,30,0.45)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, zIndex: 50 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 12, width: 460, maxWidth: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 10px 40px rgba(0,0,0,0.3)" }}>
        <div style={{ background: AUB, color: "#fff", padding: "12px 16px", fontWeight: 800, fontSize: 14 }}>{editing.mode === "new" ? L("newPart") : L("editPart")}</div>
        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 80 }}>{field("code", colLab(lang, "Code"))}</div>
            <div style={{ flex: 1 }}>{field("first", colLab(lang, "First name"))}</div>
            <div style={{ flex: 1 }}>{field("last", colLab(lang, "Last name"))}</div>
          </div>
          {field("date", colLab(lang, "Interview date"), L("placeholder_date"))}
          <div><label style={{ fontSize: 11, fontWeight: 700, color: AUB2, display: "block", marginBottom: 3 }}>{colLab(lang, "Phase")}</label>
            <select value={d.phase || ""} onChange={e => setField("phase", e.target.value)} style={st}>{PHASES_IV.map(p => <option key={p.k} value={p.k}>{phaseLabel(p.k)}</option>)}</select></div>
          <div><label style={{ fontSize: 11, fontWeight: 700, color: AUB2, display: "block", marginBottom: 4 }}>{lang === "th" ? "ขั้นตอนที่เสร็จ" : "Stages completed"}</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {[["pis","PIS"],["consent",colLab(lang,"Consent")],["signed",colLab(lang,"Signed")],["qsent",colLab(lang,"Questions sent")],["interviewed",colLab(lang,"Interviewed")],["transcribed",colLab(lang,"Transcribed")]].map(([k, lb]) => (
                <label key={k} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}><input type="checkbox" checked={!!d[k]} onChange={e => setField(k, e.target.checked)} />{lb}</label>
              ))}
            </div></div>
          <div><label style={{ fontSize: 11, fontWeight: 700, color: AUB2, display: "block", marginBottom: 3 }}>{colLab(lang, "Notes")}</label>
            <textarea rows={2} value={d.note || ""} onChange={e => setField("note", e.target.value)} style={{ ...st, resize: "vertical" }} /></div>
        </div>
        <div style={{ display: "flex", gap: 8, padding: "12px 16px", borderTop: `1px solid ${BORDER}` }}>
          <button onClick={save} style={{ background: AUB, color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 700 }}>{L("save")}</button>
          <button onClick={cancel} style={{ background: "#fff", color: AUB2, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "8px 14px", cursor: "pointer", fontSize: 13 }}>{L("cancel")}</button>
          {editing.mode === "edit" && <button onClick={remove} style={{ marginLeft: "auto", background: "#fff", color: RED, border: `1px solid ${RED}`, borderRadius: 6, padding: "8px 14px", cursor: "pointer", fontSize: 13 }}>{L("del")}</button>}
        </div>
      </div>
    </div>
  );
}

function CalendarTab({ data, setRow, addRowWith, delRow, setData, lang }) {
  const L = k => t(lang, k);
  const [order, setOrder] = useState("desc");
  const [yearF, setYearF] = useState("all");
  const [roleF, setRoleF] = useState("all");
  const [editing, setEditing] = useState(null);
  const locale = lang === "th" ? "th-TH" : "en-GB";
  const vault = (data.meta && data.meta.vault) || "";
  const contactNames = data.contacts.map(c => c.name).filter(Boolean);
  const entriesAll = data.activity.map((e, i) => ({ e, i }));
  const entries = roleF === "all" ? entriesAll : entriesAll.filter(o => roleOf(o.e) === roleF);

  const groups = {}; const undated = [];
  entries.forEach(o => { const m = (o.e.date || "").match(/^(\d{4})-(\d{2})/); if (m) { const key = `${m[1]}-${m[2]}`; (groups[key] = groups[key] || []).push(o); } else undated.push(o); });
  const allKeys = Object.keys(groups).sort();
  const years = [...new Set(allKeys.map(k => k.slice(0, 4)))];
  let keys = yearF === "all" ? allKeys.slice() : allKeys.filter(k => k.startsWith(yearF));
  if (order === "desc") keys = keys.reverse();
  const sortItems = arr => arr.slice().sort((a, b) => String(a.e.date).localeCompare(String(b.e.date)));
  const monthName = key => { const [y, mm] = key.split("-"); return new Date(Number(y), Number(mm) - 1, 1).toLocaleString(locale, { month: "long", year: "numeric" }); };
  const dayOf = dstr => { const m = (dstr || "").match(/^\d{4}-\d{2}-(\d{2})$/); return m ? String(Number(m[1])) : "—"; };
  const dowOf = dstr => { if (!/^\d{4}-\d{2}-\d{2}$/.test(dstr || "")) return ""; const d = new Date(dstr); return d.toLocaleString(locale, { weekday: "short" }); };

  const openEdit = i => setEditing({ mode: "edit", index: i, draft: { ...data.activity[i] } });
  const openNew = pre => setEditing({ mode: "new", index: null, draft: { _a: [], date: "", category: "", activity: "", linked: "", detail: "", obsidian: "", output: "", hours: 0, tag: "", role: roleF !== "all" ? roleF : "PhD", ...pre } });
  const setField = (k, v) => setEditing(ed => { const dr = { ...ed.draft, [k]: v }; if (dr._a && dr._a.includes(k)) dr._a = dr._a.filter(x => x !== k); return { ...ed, draft: dr }; });
  const save = () => { if (editing.mode === "new") addRowWith("activity", editing.draft); else setRow("activity", editing.index, editing.draft); setEditing(null); };
  const remove = () => { if (editing.mode === "edit") delRow("activity", editing.index); setEditing(null); };

  const chip = (active, onClick, label) => (<button onClick={onClick} style={{ border: `1px solid ${active ? AUB : BORDER}`, background: active ? AUB : "#fff", color: active ? "#fff" : AUB2, borderRadius: 999, padding: "4px 12px", cursor: "pointer", fontSize: 12, fontWeight: active ? 700 : 500 }}>{label}</button>);

  const renderMonth = (key, items) => {
    const counts = {}; items.forEach(o => { const c = o.e.category || "Uncategorised"; counts[c] = (counts[c] || 0) + 1; });
    return (
      <div key={key} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ background: CARD, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: AUB }}>{monthName(key)}</span>
          <span style={{ fontSize: 11, color: GREY }}>{items.length}</span>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {Object.entries(counts).map(([c, n]) => (<span key={c} style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: ACT_COLOR[c] || GREY, borderRadius: 4, padding: "1px 6px" }}>{c} ×{n}</span>))}
          </div>
          <button onClick={() => openNew({ date: `${key}-01`, })} style={{ marginLeft: "auto", border: `1px solid ${BORDER}`, background: "#fff", color: AUB2, borderRadius: 5, padding: "3px 9px", cursor: "pointer", fontSize: 11 }}>{L("addEntry")}</button>
        </div>
        {sortItems(items).map(o => { const assumed = o.e._a && o.e._a.length > 0; const href = obsHref(o.e.obsidian, vault);
          return (
            <div key={o.i} onClick={() => openEdit(o.i)} style={{ display: "flex", gap: 10, padding: "8px 14px", borderTop: `1px solid ${BORDER}`, cursor: "pointer", fontSize: 12, alignItems: "baseline" }}>
              <span style={{ width: 40, textAlign: "center", flex: "0 0 auto" }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: assumed ? RED : AUB }}>{dayOf(o.e.date)}</span>
                <span style={{ fontSize: 9, color: GREY, display: "block", lineHeight: 1 }}>{dowOf(o.e.date)}</span>
              </span>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: ACT_COLOR[o.e.category] || GREY, flex: "0 0 auto", marginTop: 4 }} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ color: assumed ? RED : INK, fontWeight: 700 }}>{o.e.activity || "—"}</span>
                {o.e.linked ? <span style={{ color: AUB2 }}> · {o.e.linked}</span> : null}
                {o.e.detail ? <span style={{ color: GREY, display: "block", fontWeight: 400, marginTop: 1 }}>{o.e.detail}</span> : null}
              </span>
              {href && <a href={href} onClick={e => e.stopPropagation()} target="_blank" rel="noreferrer" style={{ color: AUB2, textDecoration: "none", fontWeight: 700, whiteSpace: "nowrap" }}>{L("note")} ↗</a>}
            </div>
          ); })}
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
        {chip(yearF === "all", () => setYearF("all"), lang === "th" ? "ทั้งหมด" : "All")}
        {years.map(y => chip(yearF === y, () => setYearF(y), y))}
        <button onClick={() => setOrder(o => o === "desc" ? "asc" : "desc")} style={{ border: `1px solid ${BORDER}`, background: "#fff", color: AUB2, borderRadius: 6, padding: "4px 11px", cursor: "pointer", fontSize: 12 }}>
          {order === "desc" ? (lang === "th" ? "ใหม่ → เก่า ↓" : "Newest first ↓") : (lang === "th" ? "เก่า → ใหม่ ↑" : "Oldest first ↑")}
        </button>
        <button onClick={() => openNew({})} style={{ background: AUB, color: "#fff", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>{L("addEntry")}</button>
        <span style={{ fontSize: 11, color: GREY, marginLeft: "auto" }}>{keys.length} {lang === "th" ? "เดือน" : "months"}</span>
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        {[["all", L("allRoles")], ...ROLES.map(r => [r, roleLab(lang, r)])].map(([k, lb]) => (
          <button key={k} onClick={() => setRoleF(k)} title={k === "all" ? "" : rolePeriod(k)} style={{ border: `1px solid ${roleF === k ? AUB : BORDER}`, background: roleF === k ? (k === "all" ? AUB : roleColor(k)) : "#fff", color: roleF === k ? "#fff" : AUB2, borderRadius: 999, padding: "4px 12px", cursor: "pointer", fontSize: 12, fontWeight: roleF === k ? 700 : 500 }}>{lb}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {keys.map(key => renderMonth(key, groups[key]))}
        {undated.length > 0 && yearF === "all" && (
          <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ background: CARD, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: AUB }}>{L("undated")}</span>
              <span style={{ fontSize: 11, color: GREY }}>{undated.length}</span>
            </div>
            {undated.map(o => (
              <div key={o.i} onClick={() => openEdit(o.i)} style={{ display: "flex", gap: 10, padding: "8px 14px", borderTop: `1px solid ${BORDER}`, cursor: "pointer", fontSize: 12, alignItems: "baseline" }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: ACT_COLOR[o.e.category] || GREY, flex: "0 0 auto", marginTop: 4 }} />
                <span style={{ flex: 1 }}><span style={{ color: INK, fontWeight: 700 }}>{o.e.activity || "—"}</span>{o.e.linked ? <span style={{ color: AUB2 }}> · {o.e.linked}</span> : null}</span>
              </div>
            ))}
          </div>
        )}
        {keys.length === 0 && undated.length === 0 && <div style={{ fontSize: 12, color: GREY, textAlign: "center", padding: 30 }}>—</div>}
      </div>
      {editing && <EntryModal editing={editing} setField={setField} save={save} remove={remove} cancel={() => setEditing(null)} vault={vault} contactNames={contactNames} lang={lang} />}
    </div>
  );
}

// ---- CV generation (baseline from uploaded CV, live-linked) ----
const CV_BASELINE = {
  positions: [
    ["Lecturer (Teaching) in Sustainable Construction & AI", "The Bartlett School of Sustainable Construction, UCL", "Nov 2025 – Present"],
    ["PhD Candidate", "The Bartlett School of Sustainable Construction, UCL", "Sep 2023 – Present"],
    ["Full-time Lecturer", "Dept of Architecture, Faculty of Architecture, Chulalongkorn University, Thailand", "2024 – Present"],
  ],
  interests: "Digital transformation readiness in higher education estates; Corporate Real Estate Management (CREM) and Facilities Management (FM); smart campus and digital twin frameworks; BIM and ISO 19650 implementation; organisational adaptive capacity for digital change in the built environment; architectural research methods.",
  education: [
    { t: "PhD in Sustainable Construction", o: "The Bartlett (BSSC), UCL", d: "Sep 2023 – Present", b: ["Working thesis: Smart Campus Readiness and Strategic Decision-Making for Smart Campus Transformation (UCL Bloomsbury as empirical case study)", "Supervisors: Prof. Michael Pitt (primary), Prof. Qiuchen Lu / Vivi (secondary), Junpeng Lyu (third); funded via UCL Estates (Adrien Cooper)", "MPhil→PhD upgrade passed, May 2025", "Ethics approval: BSSC LREC, May 2025"] },
    { t: "Master of Architecture", o: "Chulalongkorn University, Thailand", d: "2018 – 2019", b: ["Major: History & Theory in Architecture (GPAX 3.94)", "Thesis: The Architectural Development of the National Stadium of Thailand, 1934–1966"] },
    { t: "Bachelor of Architecture (First Class Honours)", o: "Chulalongkorn University, Thailand", d: "2013 – 2018", b: ["GPAX 3.67; Design thesis: Huamark Arena, Huamark Sport Complex"] },
  ],
  pubs: [
    "Viryasiri, T., Laovisutthichai, V., Sangnin, K., Dhanakoses, K., Roopkaew, P., & Viryasiri, P. (2023). Hospital design principles implementation: Reflections from practitioners in Thailand. Journal of Asian Architecture and Building Engineering.",
    "Viryasiri, P. (2019). The Architectural Development of the National Stadium of Thailand, 1934–1966. Academic Journal of Architecture, 68, 19–34. (in Thai)",
    "Viryasiri, P., Pitt, M., & Cooper, A. (2025). Towards understanding of benefits realisation management through digital-enabled facilities and built asset management in university campus: UCL case study. 31st PRRES Conference, Hobart, Australia. (Conference paper)",
  ],
  talks: [
    "Conference presentation, 31st Annual PRRES Conference, Hobart, Australia (2025)",
    "Guest lecture: Digitalising Estates, BSSC, UCL",
    "Guest lecture: Innovation in Facilities Management, BSSC, UCL",
    "Research presentation, FM Seminars (including international audiences)",
    "PGTA experience talk, PhD orientation session, BSSC, UCL",
  ],
  applied: [
    { t: "MyCampus Project — UCL Estates Department", d: "2024 – Present", b: ["Doctoral researcher embedded in a major IWMS digital transformation initiative", "Member, IWMS Implementation team; contributor, Benefits Realisation Planning working group", "Prepared programme progress reports for the Faculty Professional Services Programme Committee (FPPC)", "Integrated & analysed UCL Estates portfolio data (area, attributes, reactive maintenance) from Power BI exports"] },
    { t: "Urban Digital Twins Workshop, London", d: "May 2026", b: ["Team member developing a digital-twin platform pitch for UCL Bloomsbury", "Co-developed a Smart Readiness scoring framework (six domains, portfolio bands)", "Delivered a dark-mode ultra-wide deck and an interactive web demo"] },
  ],
  teachUCL: [
    { t: "Lecturer (Teaching) in Sustainable Construction & AI", o: "BSSC, UCL", d: "Nov 2025 – Present", b: ["MSc Digital Innovation in Built Asset Management", "BIDI0002 Digital Innovation in Collaborative Practice (25/26) — tutorials & marking", "BIDI0003 Dissertation — supervision", "BCPM0089 Engineering the Digital Thread Across Lifecycle (25/26) — marking"] },
    { t: "Postgraduate Teaching Assistant (PGTA)", o: "BSSC, UCL", d: "2024/25 – Present", b: ["BIDI0005 Introduction to Facility & Asset Management (25/26) — tutorials & marking", "BIDI0007 Service Operations Management (24/25) — tutorials & marking"] },
  ],
  teachChula: [
    { t: "Full-time Lecturer", o: "Dept of Architecture, Chulalongkorn University", d: "2024 – Present", b: [] },
    { t: "Adjunct Lecturer", o: "Dept of Architecture, Chulalongkorn University", d: "2022/23", b: ["Architectural Design VI (Studio Yr 4); Selected Topics in Architecture (History & Theory, Yr 4); Architectural Thesis I & II (Yr 5)", "Hosted cross-university workshops: CU × Tokyo Metropolitan University 2023; Yale visiting workshop (with Asst. Prof. Rachaporn Choochuay)"] },
    { t: "Postgraduate Teaching Assistant (PGTA)", o: "Chulalongkorn University", d: "2019", b: ["Seminar in Architecture; Introduction to Urban Design; 5th-Year Studio Design"] },
  ],
  msc: ["MSc Digital Innovation in Built Asset Management, UCL — supervising dissertation on BIM communication efficiency in SMEs (systematic literature review, PRISMA)"],
  research: [
    { t: "Researcher", o: "Dept of Architecture, Chulalongkorn University", d: "2019 – Present", b: ["Healthcare Architecture Research Unit (HARU CHULA); Architectural Management Research Unit (AMRU CHULA)", "Developed department curriculum programme; facilitated academic collaboration workshops", "Programming research & design proposals for the Office of Student Affairs, CU", "Space-utilisation & planning research for Thai government agencies (MFA; ONCB; Ministry of Justice)", "Qualitative research on Thai healthcare architecture since the 1960s (with Architects 110 Co., Ltd.)"] },
  ],
  prof: [
    { t: "Architect, Architects & Associates Co., Ltd.", o: "", d: "Jan 2020 – Feb 2022", b: ["Government-agency project competitions; technical research & initial design reports for airport expansion projects", "Conceptual designs & digital models for urban hospitals, sports facilities, mixed-use projects", "Material specification, cross-office coordination, construction administration for a state enterprise HQ & government complex"] },
    { t: "Part-time / Freelance Architect", o: "", d: "2020 – Present", b: ["Residential & restaurant architecture and interiors; design competition entries"] },
    { t: "Internship — Junior Architect, Architect 49", o: "", d: "Summer 2017", b: ["Revit 3D modelling & digital presentations for a Bangkok high-rise condominium"] },
  ],
  certs: ["Associate Fellowship of the Higher Education Academy (AFHEA) — in progress", "TREES Associate NC, Thai Green Building Institute (TGBI), 2021", "Associate Architect, Architect Council of Thailand, 2019", "Youth Prosperity (YP6), CSR Leadership Programme, Judicial Training Institute, 2019"],
  affil: ["The Association of Siamese Architects under Royal Patronage — Ordinary Member (2019 – Present)", "Architect Council of Thailand — Associated Licensed Architect (2019 – Present)"],
  training: ["UCL Doctoral Skills Workshops", "PGTA Training, BSSC, UCL", "AFHEA — Associate Fellowship of the Higher Education Academy (in progress)"],
  skills: [
    "Languages: Thai (native); English (CEFR C1, IELTS 7.5); Japanese (N5)",
    "Research methods: systematic literature review (PRISMA); thematic analysis; mixed methods; MCDM & AHP; semi-structured interviews; document analysis; survey design; case study (within/cross-case)",
    "Digital & data: BIM & ISO 19650 (CDE, LOIN, IDS; OIR–PIM–AIM); Power BI; web prototyping (HTML/JS), CesiumJS; pptxgenjs; IWMS (UCL MyCampus)",
    "Drafting & modelling: Rhino, AutoCAD, Revit, SketchUp, Lumion, Enscape",
    "Graphics: Adobe Illustrator, Photoshop, InDesign, Lightroom",
  ],
  awards: ["20 Selected Works, International Open Call — Wonderfruit Pavilion Design Competition (2019)", "Second Runner-up, Vientiane Southern Bus Terminal Studio Competition (2015)", "Honourable Mention, Border Patrol School Design Competition, Siam City Cement (2015)", "Second Runner-up, Walking Shelter Studio Competition (2013)"],
};

const CV_DEFAULTS = {
  name: "Pundharee Viryasiri",
  title: "Lecturer (Teaching), Sustainable Construction & AI · PhD Candidate — UCL Bartlett",
  email: "pundharee.viryasiri.23@ucl.ac.uk",
  email2: "pundharee.v@chula.ac.th",
  orcid: "0009-0007-8261-5453",
  location: "London, UK / Bangkok, TH",
  summary: "",
};

function cvModel(data, cv) {
  const B = CV_BASELINE;
  const iv = data.interviews || [];
  const coded = iv.filter(r => r.code).length;
  const interviewed = iv.filter(r => ["Interviewed", "Transcribed"].includes(r.phase) && r.code).length;
  const livePubs = (data.publications || []).filter(r => r.paper && !/^\[/.test(r.paper) && ["Submitted", "Under review", "Accepted", "Published"].includes(r.status)).map(r => `${r.paper} — ${r.journal || "TBC"} (${r.status}${r.submitted ? ", " + r.submitted : ""}).`);
  const ent = e => ({ t: "e", title: e.t, org: e.o || "", date: e.d, b: e.b || [] });
  const S = [];
  S.push({ h: "Current Position", blocks: B.positions.map(p => ({ t: "e", title: p[0], org: p[1], date: p[2], b: [] })) });
  if (cv.summary) S.push({ h: "Profile", blocks: [{ t: "p", x: cv.summary }] });
  S.push({ h: "Research Interests", blocks: [{ t: "p", x: B.interests }] });
  S.push({ h: "Education", blocks: B.education.map(ent) });
  S.push({ h: "Publications", blocks: [{ t: "list", items: [...B.pubs, ...livePubs] }] });
  S.push({ h: "Conference Presentations & Invited Talks", blocks: [{ t: "list", items: B.talks }] });
  const mc = { t: "e", title: B.applied[0].t, org: "", date: B.applied[0].d, b: [...B.applied[0].b, `Conducted ${interviewed} of ${coded} planned semi-structured interviews with UCL Estates & Facilities staff; qualitative analysis in NVivo.`] };
  S.push({ h: "Applied Research & Industry Engagement", blocks: [mc, ...B.applied.slice(1).map(ent)] });
  S.push({ h: "Teaching Experience", blocks: [...B.teachUCL.map(ent), ...B.teachChula.map(ent)] });
  S.push({ h: "MSc Dissertation Supervision", blocks: [{ t: "list", items: B.msc }] });
  S.push({ h: "Research Experience", blocks: B.research.map(ent) });
  S.push({ h: "Professional Experience", blocks: B.prof.map(ent) });
  S.push({ h: "Certifications", blocks: [{ t: "list", items: B.certs }] });
  S.push({ h: "Affiliations", blocks: [{ t: "list", items: B.affil }] });
  S.push({ h: "Training & Professional Development", blocks: [{ t: "list", items: B.training }] });
  S.push({ h: "Skills", blocks: [{ t: "list", items: B.skills }] });
  S.push({ h: "Awards", blocks: [{ t: "list", items: B.awards }] });
  return S;
}

function cvMarkdown(cv, model) {
  let md = `# ${cv.name}\n\n${cv.title}\n\n${cv.email}${cv.email2 ? " · " + cv.email2 : ""}${cv.orcid ? " · ORCID " + cv.orcid : ""} · ${cv.location}\n`;
  model.forEach(s => {
    md += `\n## ${s.h}\n\n`;
    s.blocks.forEach(b => {
      if (b.t === "p") md += b.x + "\n";
      else if (b.t === "list") b.items.forEach(i => md += `- ${i}\n`);
      else { md += `**${b.title}**${b.date ? ` — ${b.date}` : ""}\n`; if (b.org) md += `*${b.org}*\n`; b.b.forEach(i => md += `- ${i}\n`); }
    });
  });
  md += `\n_Generated from PhD dashboard · ${new Date().toISOString().slice(0, 10)}_\n`;
  return md;
}

function cvHTML(cv, model) {
  const e = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  let body = "";
  model.forEach(s => {
    body += `<h2>${e(s.h)}</h2>`;
    s.blocks.forEach(b => {
      if (b.t === "p") body += `<p>${e(b.x)}</p>`;
      else if (b.t === "list") body += `<ul>${b.items.map(i => `<li>${e(i)}</li>`).join("")}</ul>`;
      else { body += `<div class="ent"><div class="row"><span class="ti">${e(b.title)}</span><span class="dt">${e(b.date)}</span></div>${b.org ? `<div class="or">${e(b.org)}</div>` : ""}${b.b.length ? `<ul>${b.b.map(i => `<li>${e(i)}</li>`).join("")}</ul>` : ""}</div>`; }
    });
  });
  return `<!doctype html><html><head><meta charset="utf-8"><title>${e(cv.name)} — CV</title>
<style>@page{margin:1.6cm} body{font-family:Georgia,'Times New Roman',serif;color:#1f2430;max-width:820px;margin:22px auto;padding:0 18px;line-height:1.45}
h1{font-size:25px;margin:0 0 2px;color:#2B1241} .meta{color:#555;font-size:12.5px;margin-bottom:6px}
h2{font-size:13.5px;color:#2B1241;border-bottom:1.5px solid #2B1241;padding-bottom:2px;margin:16px 0 7px;text-transform:uppercase;letter-spacing:.4px}
p{font-size:13px;margin:2px 0 6px} ul{margin:2px 0 6px 0;padding-left:20px} li{font-size:12.5px;margin-bottom:3px}
.ent{margin-bottom:7px} .row{display:flex;justify-content:space-between;gap:10px} .ti{font-weight:bold;font-size:13px} .dt{color:#555;font-size:11.5px;white-space:nowrap} .or{font-style:italic;color:#555;font-size:12px}
.foot{color:#999;font-size:11px;margin-top:18px}</style></head>
<body><h1>${e(cv.name)}</h1><div class="meta">${e(cv.title)}</div><div class="meta">${e(cv.email)}${cv.email2 ? " &middot; " + e(cv.email2) : ""}${cv.orcid ? " &middot; ORCID " + e(cv.orcid) : ""} &middot; ${e(cv.location)}</div>
${body}<div class="foot">Generated from PhD dashboard · ${new Date().toISOString().slice(0, 10)}</div></body></html>`;
}

function CVTab({ data, setData, lang }) {
  const L = k => t(lang, k);
  const cv = { ...CV_DEFAULTS, ...((data.meta && data.meta.cv) || {}) };
  const model = cvModel(data, cv);
  const setCv = (k, v) => setData(d => ({ ...d, meta: { ...(d.meta || {}), cv: { ...CV_DEFAULTS, ...((d.meta && d.meta.cv) || {}), [k]: v } } }));
  const dl = (name, text, type) => { const url = URL.createObjectURL(new Blob([text], { type })); const a = document.createElement("a"); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url); };
  const fname = cv.name.replace(/\s+/g, "_");
  const inp = { border: `1px solid ${BORDER}`, borderRadius: 6, padding: "6px 8px", fontSize: 13, fontFamily: "inherit", width: "100%", boxSizing: "border-box" };
  const fld = (k, label, area) => (
    <div>
      <label style={{ fontSize: 10, fontWeight: 700, color: AUB2, textTransform: "uppercase", letterSpacing: 0.3, display: "block", marginBottom: 3 }}>{label}</label>
      {area ? <textarea rows={area} value={cv[k]} onChange={ev => setCv(k, ev.target.value)} style={{ ...inp, resize: "vertical" }} /> : <input value={cv[k]} onChange={ev => setCv(k, ev.target.value)} style={inp} />}
    </div>
  );
  const headStyle = { fontSize: 13, fontWeight: 700, color: AUB, borderBottom: `1.5px solid ${AUB}`, paddingBottom: 2, margin: "16px 0 7px", textTransform: "uppercase", letterSpacing: 0.4 };
  return (
    <div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
        <button onClick={() => dl(`CV_${fname}.md`, cvMarkdown(cv, model), "text/markdown")} style={{ background: AUB, color: "#fff", border: "none", borderRadius: 6, padding: "7px 12px", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>{L("cvDownMd")}</button>
        <button onClick={() => dl(`CV_${fname}.html`, cvHTML(cv, model), "text/html")} style={{ background: "#fff", color: AUB2, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "7px 12px", cursor: "pointer", fontSize: 12 }}>{L("cvDownHtml")}</button>
        <span style={{ fontSize: 11, color: GREY, marginLeft: "auto", maxWidth: 380 }}>{L("cvNote")}</span>
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 280px", maxWidth: 340, background: OFF, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: AUB }}>{L("cvManual")}</div>
          {fld("name", "Name")}{fld("title", "Title")}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>{fld("email", "Email (UCL)")}{fld("email2", "Email (Chula)")}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>{fld("orcid", "ORCID")}{fld("location", "Location")}</div>
          {fld("summary", "Profile (optional)", 3)}
          <div style={{ fontSize: 10.5, color: GREY, lineHeight: 1.4 }}>The sections on the right come from your CV baseline and your live tabs (interviews, publications). To change a line, tell me and I'll update the baseline — or export and edit in Word.</div>
        </div>
        <div style={{ flex: "2 1 460px" }}>
          <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "26px 30px", fontFamily: "Georgia, 'Times New Roman', serif", color: INK }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: AUB }}>{cv.name}</div>
            <div style={{ fontSize: 12.5, color: "#555", marginTop: 2 }}>{cv.title}</div>
            <div style={{ fontSize: 12, color: "#555", marginBottom: 4 }}>{cv.email}{cv.email2 ? " · " + cv.email2 : ""}{cv.orcid ? " · ORCID " + cv.orcid : ""} · {cv.location}</div>
            {model.map(s => (
              <div key={s.h}>
                <div style={headStyle}>{s.h}</div>
                {s.blocks.map((b, i) => b.t === "p" ? (
                  <div key={i} style={{ fontSize: 13, margin: "2px 0 6px", lineHeight: 1.5 }}>{b.x}</div>
                ) : b.t === "list" ? (
                  <ul key={i} style={{ margin: "2px 0 6px", paddingLeft: 20 }}>{b.items.map((x, j) => <li key={j} style={{ fontSize: 12.5, marginBottom: 3, lineHeight: 1.4 }}>{x}</li>)}</ul>
                ) : (
                  <div key={i} style={{ marginBottom: 7 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <span style={{ fontWeight: 700, fontSize: 13 }}>{b.title}</span>
                      <span style={{ fontSize: 11.5, color: "#555", whiteSpace: "nowrap" }}>{b.date}</span>
                    </div>
                    {b.org && <div style={{ fontSize: 12, fontStyle: "italic", color: "#555" }}>{b.org}</div>}
                    {b.b.length > 0 && <ul style={{ margin: "3px 0 0", paddingLeft: 20 }}>{b.b.map((x, j) => <li key={j} style={{ fontSize: 12, marginBottom: 2, lineHeight: 1.4 }}>{x}</li>)}</ul>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Research Plan (from MPhil→PhD upgrade, 14 May 2025) ----
const RP_START_YEAR = 2023; // PhD started Sep 2023 (academic year boundary = September)
const RP_PHASES = [
  { h: "(1) Exploratory", tasks: [
    { t: "Literature Review", a: 1, b: 3 },
    { t: "Research Question Identification", a: 1, b: 2 },
    { t: "Literature Review: Smart Campus Transformation", a: 3, b: 5, indent: true },
    { t: "Literature Review: Readiness Assessment", a: 3, b: 5, indent: true },
    { t: "Literature Review: Strategic Decision-making in Campus Management", a: 4, b: 5, indent: true },
    { t: "Ethical Submission", a: 4, b: 4 },
    { t: "Upgrade MPhil to PhD", a: 5, b: 5, star: true },
  ]},
  { h: "(2) Framework Development", tasks: [
    { t: "Data Collection", a: 5, b: 6 },
    { t: "Document Analysis", a: 5, b: 6, indent: true },
    { t: "Semi-structured Interview: Estates Stakeholder", a: 6, b: 7, indent: true },
    { t: "Data Analysis", a: 6, b: 7 },
    { t: "Developing a journal paper", a: 6, b: 7 },
  ]},
  { h: "(3) Framework Design", tasks: [
    { t: "Validation", a: 7, b: 8 },
    { t: "Questionnaire: Estates' Strategic & Operational Level", a: 7, b: 7, indent: true },
    { t: "Expert Feedback: Estates' Strategic Level", a: 7, b: 7, indent: true },
    { t: "Refined Smart Campus Readiness Assessment Framework", a: 8, b: 9 },
    { t: "Summarise the study", a: 9, b: 9 },
    { t: "Thesis presentation and submission", a: 9, b: 9 },
  ]},
];
function rpNowCol() {
  const n = new Date(); const ms = (n.getFullYear() - RP_START_YEAR) * 12 + (n.getMonth() - 8); // months since Sep of start year
  if (ms < 0) return 0;
  const yr = Math.floor(ms / 12) + 1; const mo = ms % 12; const term = mo < 4 ? 1 : mo < 8 ? 2 : 3;
  const col = (yr - 1) * 3 + term; return col > 12 ? 13 : col; // 13 = past the plan
}

function ResearchPlanTab({ data, setData, lang }) {
  const L = k => t(lang, k);
  const now = rpNowCol();
  const NCOL = 12;
  const cols = Array.from({ length: NCOL }, (_, i) => i + 1);
  const terms = lang === "th" ? ["ท1", "ท2", "ท3"] : ["T1", "T2", "T3"];
  const yr = lang === "th" ? "ปีที่" : "Year";
  const yearRanges = ["2023/24", "2024/25", "2025/26", "2026/27"];
  const th = { border: `1px solid ${BORDER}`, padding: "5px 4px", fontSize: 11, textAlign: "center", background: AUB, color: "#fff", fontWeight: 700 };
  const cellW = 40;
  const MANUAL = "#64B5F6"; // your editable re-plan (blue); baseline stays locked
  const plan = data.researchPlan || RP_PHASES.map(ph => ({ h: ph.h, tasks: ph.tasks.map(tk => ({ t: tk.t, indent: !!tk.indent, star: !!tk.star, base: Array.from({ length: tk.b - tk.a + 1 }, (_, i) => tk.a + i), manual: [] })) }));
  const toggle = (pi, ti, c) => setData(d => {
    const rp = JSON.parse(JSON.stringify(d.researchPlan || plan));
    const tk = rp[pi].tasks[ti]; const manual = tk.manual || [];
    const idx = manual.indexOf(c);
    if (idx >= 0) manual.splice(idx, 1); else { manual.push(c); manual.sort((a, b) => a - b); }
    tk.manual = manual; return { ...d, researchPlan: rp };
  });
  return (
    <div>
      <div style={{ fontSize: 12, color: GREY, marginBottom: 4 }}>{L("rpCaption")}</div>
      <div style={{ fontSize: 11, color: AUB2, marginBottom: 12, fontWeight: 600 }}>{L("rpNote")} · {lang === "th" ? "แผนตั้งต้น (อัปเกรด) ถูกล็อกไว้ · คลิกเพื่อเพิ่ม/ลบแผนของคุณเอง (สีฟ้า) เมื่อกำหนดการเลื่อน" : "Upgrade baseline is locked. Click cells to add/remove your own re-plan (blue) as work shifts."}</div>
      <div style={{ overflowX: "auto", border: `1px solid ${BORDER}`, borderRadius: 8 }}>
        <table style={{ borderCollapse: "collapse", fontFamily: "Arial, sans-serif" }}>
          <thead>
            <tr>
              <th rowSpan={2} style={{ ...th, minWidth: 280, textAlign: "left", paddingLeft: 10 }}>{lang === "th" ? "แผนการวิจัย" : "Research Plan"}</th>
              {[0, 1, 2, 3].map(y => <th key={y} colSpan={3} style={th}>{yr} {y + 1}<div style={{ fontSize: 9, fontWeight: 400, color: "#D9CCE6" }}>{yearRanges[y]}</div></th>)}
            </tr>
            <tr>
              {cols.map(c => <th key={c} style={{ ...th, minWidth: cellW, background: c === now ? "#8A6FB0" : AUB }}>{terms[(c - 1) % 3]}{c === now && <div style={{ fontSize: 8, fontWeight: 400 }}>{lang === "th" ? "ตอนนี้" : "now"}</div>}</th>)}
            </tr>
          </thead>
          <tbody>
            {plan.map((ph, pi) => (
              <React.Fragment key={ph.h}>
                <tr><td colSpan={NCOL + 1} style={{ border: `1px solid ${BORDER}`, background: CARD, fontWeight: 800, color: AUB, fontSize: 12, padding: "6px 10px" }}>{ph.h}</td></tr>
                {ph.tasks.map((tk, ti) => { const base = tk.base || []; const manual = tk.manual || []; const starCol = tk.star && base.length ? Math.min(...base) : null;
                  return (
                  <tr key={tk.t}>
                    <td style={{ border: `1px solid ${BORDER}`, fontSize: 12, padding: "5px 8px", paddingLeft: tk.indent ? 24 : 10, color: tk.star ? AUB : INK, fontWeight: tk.star ? 700 : 400 }}>{tk.t}</td>
                    {cols.map(c => { const baseOn = base.includes(c); const manOn = manual.includes(c); const isStar = starCol === c; const isNow = c === now;
                      const bg = isStar ? AUB : manOn ? MANUAL : baseOn ? "#E3D7F0" : isNow ? "#FFF7E6" : "#fff";
                      return <td key={c} onClick={() => toggle(pi, ti, c)} title={lang === "th" ? "คลิกเพื่อสลับแผนของฉัน" : "click to toggle your re-plan"} style={{ border: `1px solid ${BORDER}`, borderLeft: isNow ? `2px solid ${AMBER}` : `1px solid ${BORDER}`, borderRight: isNow ? `2px solid ${AMBER}` : `1px solid ${BORDER}`, width: cellW, height: 24, textAlign: "center", cursor: "pointer", background: bg, color: "#fff", fontSize: 13 }}>{isStar ? "★" : ""}</td>;
                    })}
                  </tr>
                ); })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 10, fontSize: 11, color: GREY, alignItems: "center" }}>
        <span><span style={{ display: "inline-block", width: 12, height: 12, background: "#E3D7F0", verticalAlign: "middle", marginRight: 4, border: `1px solid ${BORDER}` }} />{lang === "th" ? "แผนตั้งต้น (ล็อก)" : "baseline plan (locked)"}</span>
        <span><span style={{ display: "inline-block", width: 12, height: 12, background: "#64B5F6", verticalAlign: "middle", marginRight: 4, border: `1px solid ${BORDER}` }} />{lang === "th" ? "แผนของฉัน (แก้ไขได้)" : "my re-plan (editable)"}</span>
        <span><span style={{ display: "inline-block", width: 12, height: 12, background: AUB, verticalAlign: "middle", marginRight: 4, textAlign: "center", color: "#fff", fontSize: 9, lineHeight: "12px" }}>★</span>{lang === "th" ? "อัปเกรด (ผ่าน พ.ค. 2025)" : "upgrade (passed May 2025)"}</span>
        <span><span style={{ display: "inline-block", width: 12, height: 12, background: "#FFF7E6", verticalAlign: "middle", marginRight: 4, border: `2px solid ${AMBER}` }} />{lang === "th" ? "ตอนนี้" : "today"}</span>
      </div>
    </div>
  );
}

// ---- Research Framing (editable + version history) ----
function GapVenn() {
  return (
    <svg viewBox="0 0 360 130" style={{ width: 300, maxWidth: "100%", display: "block", margin: "4px 0 10px" }}>
      <circle cx="130" cy="65" r="58" fill="#E3D7F0" fillOpacity="0.55" stroke={AUB2} />
      <circle cx="230" cy="65" r="58" fill="#D7EBD9" fillOpacity="0.55" stroke="#2E7D32" />
      <text x="95" y="60" fontSize="13" fontWeight="700" fill={AUB} textAnchor="middle">Academic</text>
      <text x="95" y="76" fontSize="8" fill="#555" textAnchor="middle">understanding & research</text>
      <text x="265" y="60" fontSize="13" fontWeight="700" fill="#2E7D32" textAnchor="middle">Practical</text>
      <text x="265" y="76" fontSize="8" fill="#555" textAnchor="middle">real-world implementation</text>
      <text x="180" y="70" fontSize="14" fontWeight="800" fill={INK} textAnchor="middle">GAP</text>
    </svg>
  );
}

function ResearchFramingTab({ data, setData, lang }) {
  const L = k => t(lang, k);
  const [viewing, setViewing] = useState(null);
  const [note, setNote] = useState("");
  const [showHist, setShowHist] = useState(false);
  const R = data.research || {};
  const hist = data.researchHistory || [];
  const today = new Date().toISOString().slice(0, 10);
  const setR = patch => setData(d => ({ ...d, research: { ...(d.research || {}), ...patch, updated: today } }));
  const setObj = (i, k, v) => setData(d => { const o = (d.research.objectives || []).slice(); o[i] = { ...o[i], [k]: v }; return { ...d, research: { ...d.research, objectives: o, updated: today } }; });
  const setQ = (i, v) => setData(d => { const q = (d.research.questions || []).slice(); q[i] = v; return { ...d, research: { ...d.research, questions: q, updated: today } }; });
  const addObj = () => setData(d => ({ ...d, research: { ...d.research, objectives: [...(d.research.objectives || []), { o: "", outcome: "" }], updated: today } }));
  const delObj = i => setData(d => ({ ...d, research: { ...d.research, objectives: (d.research.objectives || []).filter((_, x) => x !== i), updated: today } }));
  const addQ = () => setData(d => ({ ...d, research: { ...d.research, questions: [...(d.research.questions || []), ""], updated: today } }));
  const delQ = i => setData(d => ({ ...d, research: { ...d.research, questions: (d.research.questions || []).filter((_, x) => x !== i), updated: today } }));
  const saveVersion = () => { const snap = JSON.parse(JSON.stringify(data.research || {})); const e = { ts: today, note: note.trim() || "(no note)", snapshot: snap }; setData(d => ({ ...d, researchHistory: [...(d.researchHistory || []), e] })); setNote(""); };
  const restore = i => { const snap = JSON.parse(JSON.stringify(hist[i].snapshot)); setData(d => ({ ...d, research: { ...snap, updated: today } })); setViewing(null); };

  const V = viewing != null ? hist[viewing].snapshot : R;
  const ro = viewing != null; // read-only when viewing a past version
  const ta = { width: "100%", boxSizing: "border-box", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "8px 10px", fontSize: 13, fontFamily: "inherit", lineHeight: 1.5, resize: "vertical", color: INK };
  const head = { fontSize: 13, fontWeight: 800, color: AUB, borderBottom: `2px solid ${AUB}`, paddingBottom: 3, margin: "18px 0 10px", textTransform: "uppercase", letterSpacing: 0.4 };
  const lab = { fontSize: 10, fontWeight: 700, color: AUB2, textTransform: "uppercase", letterSpacing: 0.3, display: "block", margin: "0 0 3px" };
  const roBox = txt => <div style={{ fontSize: 13, lineHeight: 1.55, background: OFF, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "8px 10px", whiteSpace: "pre-wrap" }}>{txt}</div>;

  return (
    <div>
      <input value={V.title || ""} readOnly={ro} onChange={e => setR({ title: e.target.value })}
        style={{ width: "100%", boxSizing: "border-box", border: ro ? "none" : `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 12px", fontSize: 18, fontWeight: 800, color: AUB, textAlign: "center", fontFamily: "inherit", background: ro ? "transparent" : "#fff" }} />

      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", margin: "12px 0" }}>
        {!ro && <>
          <input value={note} onChange={e => setNote(e.target.value)} placeholder={L("rfVerNote")} style={{ flex: "1 1 200px", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "7px 10px", fontSize: 12 }} />
          <button onClick={saveVersion} style={{ background: AUB, color: "#fff", border: "none", borderRadius: 6, padding: "8px 14px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>{L("rfSaveVer")}</button>
        </>}
        <button onClick={() => setShowHist(s => !s)} style={{ background: "#fff", color: AUB2, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "8px 12px", cursor: "pointer", fontSize: 12 }}>{L("rfHistory")} ({hist.length})</button>
        <span style={{ fontSize: 11, color: GREY, marginLeft: "auto" }}>{L("rfUpdated")}: {V.updated || "—"}</span>
      </div>

      {showHist && (
        <div style={{ background: OFF, border: `1px solid ${BORDER}`, borderRadius: 8, padding: 12, marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: GREY, marginBottom: 8 }}>{L("rfSavedHint")}</div>
          {hist.length === 0 ? <div style={{ fontSize: 12, color: GREY }}>{L("rfNoVersions")}</div> :
            hist.slice().reverse().map((h, ri) => { const i = hist.length - 1 - ri; const active = viewing === i;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderTop: ri ? `1px solid ${BORDER}` : "none", fontSize: 12 }}>
                  <span style={{ width: 84, color: AUB, fontWeight: 700 }}>{h.ts}</span>
                  <span style={{ flex: 1, color: INK }}>{h.note}</span>
                  <button onClick={() => setViewing(active ? null : i)} style={{ border: `1px solid ${BORDER}`, background: active ? AUB : "#fff", color: active ? "#fff" : AUB2, borderRadius: 5, padding: "3px 10px", cursor: "pointer", fontSize: 11 }}>{active ? L("rfBackCurrent") : L("rfView")}</button>
                </div>
              ); })}
        </div>
      )}

      {ro && (
        <div style={{ background: "#FFF7E6", border: `1px solid ${AMBER}`, borderRadius: 8, padding: "8px 12px", marginBottom: 12, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#8a5a00", fontWeight: 600 }}>{L("rfViewing")}: {hist[viewing].ts} · {hist[viewing].note}</span>
          <button onClick={() => restore(viewing)} style={{ background: AUB, color: "#fff", border: "none", borderRadius: 5, padding: "5px 11px", cursor: "pointer", fontSize: 11, fontWeight: 700 }}>{L("rfRestore")}</button>
          <button onClick={() => setViewing(null)} style={{ background: "#fff", color: AUB2, border: `1px solid ${BORDER}`, borderRadius: 5, padding: "5px 11px", cursor: "pointer", fontSize: 11 }}>{L("rfBackCurrent")}</button>
        </div>
      )}

      <div style={head}>{L("rfGap")}</div>
      <GapVenn />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 260px" }}>
          <label style={lab}>{L("rfAcademic")}</label>
          {ro ? roBox(V.gapAcademic) : <textarea rows={5} value={V.gapAcademic || ""} onChange={e => setR({ gapAcademic: e.target.value })} style={ta} />}
        </div>
        <div style={{ flex: "1 1 260px" }}>
          <label style={lab}>{L("rfPractical")}</label>
          {ro ? roBox(V.gapPractical) : <textarea rows={5} value={V.gapPractical || ""} onChange={e => setR({ gapPractical: e.target.value })} style={ta} />}
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <label style={lab}>{L("rfContribution")}</label>
        {ro ? roBox(V.gapContribution) : <textarea rows={4} value={V.gapContribution || ""} onChange={e => setR({ gapContribution: e.target.value })} style={ta} />}
      </div>

      <div style={head}>{L("rfAim")}</div>
      {ro ? roBox(V.aim) : <textarea rows={4} value={V.aim || ""} onChange={e => setR({ aim: e.target.value })} style={ta} />}

      <div style={head}>{L("rfObj")}</div>
      {(V.objectives || []).map((ob, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
          <span style={{ fontWeight: 800, color: AUB, fontSize: 13, marginTop: 8, width: 18 }}>{i + 1}</span>
          <div style={{ flex: "2 1 240px" }}>{ro ? roBox(ob.o) : <textarea rows={2} value={ob.o} onChange={e => setObj(i, "o", e.target.value)} style={ta} />}</div>
          <div style={{ flex: "1 1 180px" }}>
            <label style={{ ...lab, margin: "0 0 2px" }}>{L("rfOutcome")}</label>
            {ro ? roBox(ob.outcome) : <textarea rows={2} value={ob.outcome} onChange={e => setObj(i, "outcome", e.target.value)} style={{ ...ta, background: OFF }} />}
          </div>
          {!ro && <button onClick={() => delObj(i)} style={{ border: "none", background: "transparent", color: GREY, cursor: "pointer", fontSize: 16, marginTop: 6 }}>×</button>}
        </div>
      ))}
      {!ro && <button onClick={addObj} style={{ background: "#fff", color: AUB2, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "5px 11px", cursor: "pointer", fontSize: 12 }}>{L("rfAddObj")}</button>}

      <div style={head}>{L("rfRQ")}</div>
      {(V.questions || []).map((q, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>{ro ? roBox(q) : <textarea rows={2} value={q} onChange={e => setQ(i, e.target.value)} style={ta} />}</div>
          {!ro && <button onClick={() => delQ(i)} style={{ border: "none", background: "transparent", color: GREY, cursor: "pointer", fontSize: 16, marginTop: 6 }}>×</button>}
        </div>
      ))}
      {!ro && <button onClick={addQ} style={{ background: "#fff", color: AUB2, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "5px 11px", cursor: "pointer", fontSize: 12 }}>{L("rfAddRQ")}</button>}
    </div>
  );
}

// ---- Teaching (Lecturer hat) ----
function TeachingTab({ data, lang }) {
  const teach = teachRecs(data);
  const pgta = teach.filter(r => roleOf(r) === "PGTA").length;
  const lect = teach.filter(r => roleOf(r) === "Lecturer").length;
  const tut = teach.filter(r => /tutorial/i.test(r.activity)).length;
  const marking = teach.filter(r => /mark/i.test(r.activity)).length;
  const students = teach.filter(r => /student|supervis|review/i.test(r.activity)).length;
  const recent = teach.filter(r => /^\d{4}-\d{2}-\d{2}$/.test(r.date || "")).slice().sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 8);
  const B = CV_BASELINE;
  const T = k => { const en = { modules: "Modules & roles", msc: "MSc dissertation supervision", recent: "Recent teaching activity", none: "No teaching logged yet — add entries in the Activity Log (role = PGTA / Lecturer).", src: "From your CV baseline. Live counts below come from your Activity Log.", act: "activities", tuts: "tutorial sessions", mark: "marking", studs: "student support" };
    const th = { modules: "รายวิชา & บทบาท", msc: "การดูแลวิทยานิพนธ์ MSc", recent: "กิจกรรมการสอนล่าสุด", none: "ยังไม่มีบันทึกการสอน — เพิ่มในบันทึกกิจกรรม (บทบาท = PGTA / Lecturer)", src: "จากข้อมูล CV ของคุณ · ตัวเลขด้านล่างมาจากบันทึกกิจกรรม", act: "กิจกรรม", tuts: "คาบติว", mark: "ตรวจงาน", studs: "ดูแลนักศึกษา" };
    return (lang === "th" ? th : en)[k]; };
  const entry = (e, i) => (
    <div key={i} style={{ marginBottom: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <span style={{ fontWeight: 700, fontSize: 13, color: AUB }}>{e.t}</span>
        <span style={{ fontSize: 11, color: GREY, whiteSpace: "nowrap" }}>{e.d}</span>
      </div>
      {e.o && <div style={{ fontSize: 12, fontStyle: "italic", color: "#555" }}>{e.o}</div>}
      {e.b && e.b.length > 0 && <ul style={{ margin: "3px 0 0", paddingLeft: 18 }}>{e.b.map((x, j) => <li key={j} style={{ fontSize: 12, marginBottom: 2, lineHeight: 1.4 }}>{x}</li>)}</ul>}
    </div>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Kpi label={lang === "th" ? "งานสอนทั้งหมด" : "Teaching logged"} value={teach.length} sub={`${lect} ${roleLab(lang, "Lecturer")} · ${pgta} ${roleLab(lang, "PGTA")}`} />
        <Kpi label={T("tuts")} value={tut} />
        <Kpi label={T("mark")} value={marking} />
        <Kpi label={T("studs")} value={students} />
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 340px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: AUB, marginBottom: 2 }}>{T("modules")}</div>
          <div style={{ fontSize: 10.5, color: GREY, marginBottom: 8 }}>{T("src")}</div>
          {[...B.teachUCL, ...B.teachChula].map(entry)}
          <div style={{ fontSize: 13, fontWeight: 800, color: AUB, margin: "14px 0 6px" }}>{T("msc")}</div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>{B.msc.map((x, j) => <li key={j} style={{ fontSize: 12, marginBottom: 3 }}>{x}</li>)}</ul>
        </div>
        <div style={{ flex: "1 1 300px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: AUB, marginBottom: 8 }}>{T("recent")}</div>
          {recent.length === 0 ? <div style={{ fontSize: 12, color: GREY }}>{T("none")}</div> : recent.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "baseline", fontSize: 12, padding: "5px 0", borderTop: i ? `1px solid ${BORDER}` : "none" }}>
              <span style={{ width: 78, color: GREY, flex: "0 0 auto" }}>{r.date}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", background: roleColor(roleOf(r)), borderRadius: 4, padding: "1px 5px", flex: "0 0 auto" }}>{roleLab(lang, roleOf(r))}</span>
              <span style={{ flex: 1 }}>{r.activity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Outlook calendar (.ics) parsing → Activity rows ----
function parseICS(text) {
  const unfolded = String(text || "").replace(/\r\n[ \t]/g, "").replace(/\n[ \t]/g, "");
  const lines = unfolded.split(/\r?\n/);
  const unesc = s => s.replace(/\\n/gi, " ").replace(/\\,/g, ",").replace(/\\;/g, ";").replace(/\\\\/g, "\\").trim();
  const icsDate = v => { const m = String(v).match(/(\d{4})(\d{2})(\d{2})/); return m ? `${m[1]}-${m[2]}-${m[3]}` : ""; };
  const out = []; let cur = null;
  for (const line of lines) {
    if (line === "BEGIN:VEVENT") { cur = {}; continue; }
    if (line === "END:VEVENT") { if (cur && cur.date) out.push(cur); cur = null; continue; }
    if (!cur) continue;
    const idx = line.indexOf(":"); if (idx < 0) continue;
    const left = line.slice(0, idx);            // NAME plus any ;PARAMS
    const name = left.split(";")[0].toUpperCase();
    const val = line.slice(idx + 1);
    if (name === "UID") cur.uid = val.trim();
    else if (name === "SUMMARY") cur.summary = unesc(val);
    else if (name === "LOCATION") cur.location = unesc(val);
    else if (name === "DESCRIPTION") cur.description = unesc(val).slice(0, 300);
    else if (name === "DTSTART") cur.date = icsDate(val);
    else if (name === "X-MICROSOFT-CDO-BUSYSTATUS") cur.busy = val.trim().toUpperCase();
    else if (name === "TRANSP" && !cur.busy) cur.busy = /TRANSPARENT/i.test(val) ? "FREE" : "BUSY";
    else if (name === "ORGANIZER") { const m = left.match(/CN=([^:;]+)/i); cur.organizer = m ? m[1].replace(/^"|"$/g, "").trim() : ""; }
  }
  return out.map(e => ({ uid: e.uid || (e.date + "|" + (e.summary || "")), date: e.date, summary: e.summary || "(no title)", location: e.location || "", description: e.description || "", organizer: e.organizer || "", busy: e.busy || "" }));
}
function outlookToActivity(ev, role) {
  return { _id: "ics-" + ev.uid, _a: [], date: ev.date, category: "Meeting", activity: ev.summary, linked: ev.organizer || "", detail: [ev.location, ev.description].filter(Boolean).join(" — "), obsidian: "", output: "", hours: 0, tag: "outlook", role: role || "PhD", acttype: "", evidence: "", reflection: "", impact: "", privacy: "" };
}
function filterOutlookEvents(events, filter) {
  const from = (filter.from || "").trim();
  const inc = (filter.keyword || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean); // include if title matches ANY
  const exc = (filter.exclude || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean); // drop if title matches ANY
  const busyMode = filter.busy || "busy"; // default: only events you're marked Busy/OOF for (i.e. committed)
  const allowedBusy = busyMode === "all" ? null : busyMode === "tentative" ? ["BUSY", "OOF", "TENTATIVE"] : ["BUSY", "OOF"];
  return events.filter(e => {
    if (from && (e.date || "") < from) return false;
    if (allowedBusy && e.busy && !allowedBusy.includes(e.busy)) return false; // skip Free/declined; keep unknown-status
    const hay = `${e.summary || ""} ${e.location || ""} ${e.organizer || ""}`.toLowerCase();
    if (inc.length && !inc.some(t => hay.includes(t))) return false;
    if (exc.length && exc.some(t => hay.includes(t))) return false;
    return true;
  });
}
// pick a hat for an event from the keyword→hat rules (first match wins); null if none match
function outlookHatFor(ev, rules) {
  const hay = `${ev.summary || ""} ${ev.location || ""}`.toLowerCase();
  for (const r of rules) {
    const terms = (r.match || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
    if (terms.length && terms.some(t => hay.includes(t))) return r.hat || "PhD";
  }
  return null;
}
// returns the NEW rows to append (already de-duplicated against existing activity by _id)
function mergeOutlook(activity, events, filter) {
  const gated = filterOutlookEvents(events, filter);
  const rules = Array.isArray(filter.rules) ? filter.rules.filter(r => (r.match || "").trim()) : [];
  const rows = [];
  gated.forEach(e => {
    let hat;
    if (rules.length) { hat = outlookHatFor(e, rules); if (!hat) hat = (filter.fallback === undefined ? "Unassigned" : filter.fallback); if (!hat) return; } // rule mode: unmatched → Unassigned by default (or a chosen fallback / Skip)
    else hat = filter.role || "PhD"; // single-hat mode
    const a = outlookToActivity(e, hat);
    if (a.date) rows.push(a);
  });
  const have = new Set((activity || []).map(r => r._id).filter(Boolean));
  const addRows = rows.filter(a => !have.has(a._id));
  return { addRows, added: addRows.length, skipped: rows.length - addRows.length };
}
async function fetchOutlookEvents(endpoint) {
  const r = await fetch(endpoint);
  const text = await r.text();
  if (!r.ok) throw new Error("HTTP " + r.status);
  if ((r.headers.get("content-type") || "").includes("json")) { const j = JSON.parse(text); if (j.error) throw new Error(j.error); }
  return parseICS(text);
}

// ---- Quick-Add hub (capture once, store structured) ----
function AddHub({ data, setData, quickAdd, pushUndo, lang }) {
  const [role, setRole] = useState("PhD");
  const today = new Date().toISOString().slice(0, 10);
  const HATS = ["PhD", "Chula Lecturer", "BSSC Lecturer", "BSSC PGTA", "Service/Admin", "Personal"];
  const items = [
    { k: "task", e: "✅", c: "#5D7079", en: "Add Task", th: "เพิ่มงาน", d: lang === "th" ? "สิ่งที่ต้องทำ + สถานะ + กำหนดส่ง" : "to-do with status & deadline", go: () => quickAdd("tasks", { status: "Not started", role, category: "", due: "", title: "" }) },
    { k: "meeting", e: "🤝", c: "#ED6C02", en: "Add Meeting", th: "เพิ่มการประชุม", d: lang === "th" ? "บันทึกการประชุม (→ บันทึกกิจกรรม)" : "log a meeting (→ Activity Log)", go: () => quickAdd("activity", { category: "Meeting", role, date: today, acttype: "Supervision meeting" }) },
    { k: "activity", e: "📝", c: "#0277BD", en: "Add Activity", th: "เพิ่มกิจกรรม", d: lang === "th" ? "สัมมนา บรรยาย ตรวจงาน…" : "seminar, lecture, marking…", go: () => quickAdd("activity", { category: "", role, date: today }) },
    { k: "person", e: "👤", c: "#2B1241", en: "Add Person", th: "เพิ่มบุคคล", d: lang === "th" ? "ผู้ติดต่อใหม่" : "a contact", go: () => quickAdd("contacts", {}) },
    { k: "source", e: "📚", c: "#6B4E8C", en: "Add Source", th: "เพิ่มแหล่งอ้างอิง", d: lang === "th" ? "บทความ หนังสือ รายงาน" : "paper, book, report", go: () => quickAdd("sources", { role }) },
    { k: "reflection", e: "💭", c: "#00796B", en: "Add Reflection", th: "เพิ่มบันทึกสะท้อน", d: lang === "th" ? "โน้ตถึงตัวเองในอนาคต" : "a note to your future self", go: () => quickAdd("reflections", { role, date: today }) },
    { k: "output", e: "📦", c: "#C2185B", en: "Add Output", th: "เพิ่มผลงาน", d: lang === "th" ? "บทความ สไลด์ สื่อการสอน" : "paper, deck, teaching material", go: () => quickAdd("outputs", { role, date: today }) },
    { k: "idea", e: "💡", c: "#2E7D32", en: "Add Idea", th: "เพิ่มไอเดีย", d: lang === "th" ? "จับความคิดไว้ก่อน" : "capture a thought", go: () => quickAdd("ideas", { role, date: today, status: "New" }) },
    { k: "project", e: "📁", c: "#1565C0", en: "Add Project", th: "เพิ่มโปรเจกต์", d: lang === "th" ? "โปรเจกต์ใหม่ + แท็กหมวก" : "a project + role tag", go: () => quickAdd("projects", { role, status: "Active", start: today }) },
  ];
  const exportAll = () => { const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })); const a = document.createElement("a"); a.href = url; a.download = `phd_dashboard_backup_${today}.json`; a.click(); URL.revokeObjectURL(url); };
  const importAll = e => { const f = e.target.files && e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { const p = JSON.parse(r.result); if (p && typeof p === "object" && p.timeline && window.confirm(lang === "th" ? "แทนที่ข้อมูลทั้งหมดด้วยไฟล์นี้? (แนะนำให้สำรองก่อน)" : "Replace ALL current data with this file? (Export a backup first if unsure.)")) { if (pushUndo) pushUndo(); setData(p); } else if (!p.timeline) window.alert("This doesn't look like a dashboard backup file."); } catch (err) { window.alert(lang === "th" ? "อ่านไฟล์ JSON ไม่ได้" : "Could not read that file as JSON."); } }; r.readAsText(f); e.target.value = ""; };

  // paste-JSON import: append rows into matching stores, or replace everything with a full backup
  const [pasteText, setPasteText] = useState("");
  const [pasteMsg, setPasteMsg] = useState(null);
  const IMPORT_STORES = ["timeline", "contacts", "events", "publications", "supervisor", "activity", "interviews", "tasks", "sources", "outputs", "ideas", "reflections", "teachingSessions", "guestLectures", "supervision", "marking", "teachingEvidence", "researchHistory", "researchPlan", "supervisorTeam"];
  const importPaste = mode => {
    let parsed;
    try { parsed = JSON.parse(pasteText); } catch (err) { setPasteMsg({ ok: false, text: lang === "th" ? "อ่าน JSON ไม่ได้ — ตรวจสอบรูปแบบ" : "Couldn't read that as JSON — check the format." }); return; }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) { setPasteMsg({ ok: false, text: lang === "th" ? 'ต้องเป็นออบเจ็กต์ เช่น { "activity": [ … ] }' : 'Paste an object like { "activity": [ … ], "contacts": [ … ] }.' }); return; }
    if (mode === "replace") {
      if (!parsed.timeline) { setPasteMsg({ ok: false, text: lang === "th" ? "ไม่ใช่ไฟล์สำรองเต็ม (ไม่มี timeline) — ใช้โหมดเพิ่มแทน" : "That isn't a full backup (no timeline) — use Add instead." }); return; }
      if (!window.confirm(lang === "th" ? "แทนที่ข้อมูลทั้งหมด? (สำรองก่อนถ้าไม่แน่ใจ)" : "Replace ALL current data with this? (Back up first if unsure.)")) return;
      if (pushUndo) pushUndo();
      setData(parsed); setPasteMsg({ ok: true, text: lang === "th" ? "แทนที่ข้อมูลทั้งหมดแล้ว" : "Replaced all data." }); setPasteText(""); return;
    }
    const summary = IMPORT_STORES.filter(k => Array.isArray(parsed[k]) && parsed[k].length).map(k => `${parsed[k].length} ${k}`);
    if (!summary.length) { setPasteMsg({ ok: false, text: lang === "th" ? "ไม่พบรายการที่รู้จัก (เช่น activity, contacts, tasks)" : "No known lists found (e.g. activity, contacts, tasks). Check the keys." }); return; }
    setData(d => { const nd = { ...d }; IMPORT_STORES.forEach(k => { if (Array.isArray(parsed[k]) && parsed[k].length) { const items = parsed[k].map(it => (it && typeof it === "object" && !Array.isArray(it)) ? { _a: [], ...it } : it); nd[k] = [...(Array.isArray(nd[k]) ? nd[k] : []), ...items]; } }); return nd; });
    setPasteMsg({ ok: true, text: (lang === "th" ? "เพิ่มแล้ว: " : "Added: ") + summary.join(", ") });
    setPasteText("");
  };

  // Outlook calendar sync (read-only): pull .ics events into the Activity Log, de-duplicated by UID.
  // Filter + auto-on-open settings live in meta.outlook so the auto-sync (in App) reuses them.
  const [outMsg, setOutMsg] = useState(null);
  const [outBusy, setOutBusy] = useState(false);
  const outlookEndpoint = (typeof window !== "undefined" && window.OUTLOOK_ENDPOINT) || "";
  const outlookCfg = (data.meta && data.meta.outlook) || {};
  const setOutlookCfg = patch => setData(d => ({ ...d, meta: { ...(d.meta || {}), outlook: { ...((d.meta && d.meta.outlook) || {}), ...patch } } }));
  const mergeCalEvents = events => {
    const filter = { ...outlookCfg, role };
    const res = mergeOutlook(data.activity, events, filter);
    if (res.added) setData(d => ({ ...d, activity: [...(d.activity || []), ...res.addRows], meta: { ...(d.meta || {}), outlook: { ...((d.meta && d.meta.outlook) || {}), role } } }));
    else setOutlookCfg({ role });
    return res;
  };
  const reportMerge = res => setOutMsg({ ok: true, text: lang === "th" ? `เพิ่ม ${res.added} กิจกรรม (ข้ามซ้ำ ${res.skipped})` : `Added ${res.added} events (skipped ${res.skipped} already imported)` });
  const syncOutlook = async () => {
    if (!outlookEndpoint) { setOutMsg({ ok: false, text: lang === "th" ? "ยังไม่ได้ตั้งค่า Worker — ใส่ Worker URL ใน index.html หรือใช้ ‘อัปโหลด .ics’" : "No Worker URL set — add it in index.html, or use ‘Import .ics file’." }); return; }
    setOutBusy(true); setOutMsg(null);
    try {
      const events = await fetchOutlookEvents(outlookEndpoint);
      if (!events.length) setOutMsg({ ok: false, text: lang === "th" ? "ไม่พบกิจกรรมในปฏิทิน" : "No events found in the calendar." });
      else reportMerge(mergeCalEvents(events));
    } catch (e) { setOutMsg({ ok: false, text: (lang === "th" ? "ซิงค์ไม่สำเร็จ: " : "Sync failed: ") + e.message }); }
    setOutBusy(false);
  };
  const importICSFile = e => {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    const rd = new FileReader();
    rd.onload = () => { try { const events = parseICS(String(rd.result)); if (!events.length) setOutMsg({ ok: false, text: lang === "th" ? "ไม่พบกิจกรรมในไฟล์" : "No events found in that file." }); else reportMerge(mergeCalEvents(events)); } catch (err) { setOutMsg({ ok: false, text: lang === "th" ? "อ่านไฟล์ .ics ไม่ได้" : "Couldn't read that .ics file." }); } };
    rd.readAsText(f); e.target.value = "";
  };

  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 800, color: AUB }}>{lang === "th" ? "เพิ่มข้อมูลครั้งเดียว แสดงผลได้หลายที่" : "Capture once — shown in many places"}</div>
      <div style={{ fontSize: 12, color: GREY, marginBottom: 14 }}>{lang === "th" ? "เลือกหมวกงาน แล้วเลือกสิ่งที่จะบันทึก — ระบบจะเปิดแท็บที่ถูกต้องให้กรอกต่อ" : "Pick the hat, then what you're capturing — it opens the right tab, pre-tagged, ready to fill in."}</div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: AUB2, textTransform: "uppercase" }}>{lang === "th" ? "บันทึกในฐานะ" : "Tag as"}</span>
        {HATS.map(h => (
          <button key={h} onClick={() => setRole(h)} title={rolePeriod(h)} style={{ border: `1px solid ${role === h ? AUB : BORDER}`, background: role === h ? roleColor(h) : "#fff", color: role === h ? "#fff" : AUB2, borderRadius: 999, padding: "5px 14px", cursor: "pointer", fontSize: 12, fontWeight: role === h ? 700 : 500 }}>{roleLab(lang, h)}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
        {items.map(it => (
          <button key={it.k} onClick={it.go} style={{ textAlign: "left", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, padding: 14, cursor: "pointer", display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 28, height: 28, borderRadius: 8, background: it.c, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{it.e}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: AUB }}>{lang === "th" ? it.th : it.en}</span>
            </div>
            <span style={{ fontSize: 11, color: GREY }}>{it.d}</span>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 22, background: OFF, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: AUB, marginBottom: 4 }}>{lang === "th" ? "สำรอง / กู้คืนข้อมูล (JSON)" : "Backup / restore (JSON)"}</div>
        <div style={{ fontSize: 11, color: GREY, marginBottom: 10 }}>{lang === "th" ? "ดาวน์โหลดทุกอย่าง (ทุกแท็บ + ประวัติเวอร์ชัน) เป็นไฟล์เดียวที่คุณเก็บเองได้ หรือโหลดกลับเข้ามา" : "Download everything — every tab plus full version history — as one file you keep, or load it back in."}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={exportAll} style={{ background: AUB, color: "#fff", border: "none", borderRadius: 6, padding: "8px 14px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>{lang === "th" ? "ดาวน์โหลดข้อมูลสำรอง" : "Download backup"}</button>
          <label style={{ background: "#fff", color: AUB2, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "8px 14px", cursor: "pointer", fontSize: 12 }}>
            {lang === "th" ? "กู้คืนจากไฟล์…" : "Restore from file…"}
            <input type="file" accept="application/json,.json" onChange={importAll} style={{ display: "none" }} />
          </label>
        </div>
      </div>

      <div style={{ marginTop: 16, background: OFF, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: AUB, marginBottom: 4 }}>{lang === "th" ? "วางข้อมูล JSON เพื่อเพิ่ม" : "Paste JSON to add data"}</div>
        <div style={{ fontSize: 11, color: GREY, marginBottom: 8 }}>{lang === "th" ? "วางออบเจ็กต์ที่คีย์เป็นชื่อแท็บ (เช่น activity, contacts, tasks) แล้วกด “เพิ่มเข้าข้อมูล” — รายการจะถูกเพิ่มต่อท้าย ไม่มีการทับข้อมูลเดิม" : "Paste an object whose keys are tab names (activity, contacts, tasks…). “Add to my data” appends the rows — nothing existing is overwritten."}</div>
        <textarea value={pasteText} onChange={e => { setPasteText(e.target.value); setPasteMsg(null); }} spellCheck={false} placeholder={'{\n  "activity": [\n    { "date": "2026-07-10", "category": "Meeting", "activity": "Met supervisor", "role": "PhD" }\n  ],\n  "contacts": [\n    { "name": "Jane Doe", "org": "UCL", "category": "Academic collaborator" }\n  ]\n}'} style={{ width: "100%", boxSizing: "border-box", minHeight: 120, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 10px", fontSize: 12, fontFamily: "ui-monospace, Menlo, monospace", resize: "vertical" }} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginTop: 8 }}>
          <button onClick={() => importPaste("add")} disabled={!pasteText.trim()} style={{ background: pasteText.trim() ? AUB : "#B9A9CC", color: "#fff", border: "none", borderRadius: 6, padding: "8px 14px", cursor: pasteText.trim() ? "pointer" : "default", fontSize: 12, fontWeight: 700 }}>{lang === "th" ? "เพิ่มเข้าข้อมูล" : "Add to my data"}</button>
          <button onClick={() => importPaste("replace")} disabled={!pasteText.trim()} style={{ background: "#fff", color: RED, border: `1px solid ${pasteText.trim() ? RED : BORDER}`, borderRadius: 6, padding: "8px 14px", cursor: pasteText.trim() ? "pointer" : "default", fontSize: 12 }}>{lang === "th" ? "แทนที่ทั้งหมด (ไฟล์สำรองเต็ม)" : "Replace all (full backup)"}</button>
          {pasteMsg && <span style={{ fontSize: 12, fontWeight: 600, color: pasteMsg.ok ? GREEN : RED }}>{pasteMsg.ok ? "✓ " : "⚠ "}{pasteMsg.text}</span>}
        </div>
        <div style={{ fontSize: 10.5, color: GREY, marginTop: 8, lineHeight: 1.5 }}>{lang === "th" ? "คีย์ที่รองรับ: " : "Supported keys: "}<span style={{ fontFamily: "ui-monospace, Menlo, monospace" }}>activity, contacts, tasks, events, publications, interviews, timeline, supervisor, sources, outputs, ideas, reflections, teachingSessions, guestLectures, supervision, marking, teachingEvidence</span></div>
      </div>

      <div style={{ marginTop: 16, background: OFF, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: AUB, marginBottom: 4 }}>📅 {lang === "th" ? "ซิงค์จากปฏิทิน Outlook" : "Sync from Outlook calendar"}</div>
        <div style={{ fontSize: 11, color: GREY, marginBottom: 10 }}>{lang === "th" ? "ดึงกิจกรรม/ประชุมจากปฏิทินมาเพิ่มใน Activity Log (อ่านอย่างเดียว, กันซ้ำอัตโนมัติด้วยรหัส UID) · แท็กด้วยหมวกที่เลือกด้านบน" : "Pulls your calendar events into the Activity Log (read-only, de-duplicated by UID). Tagged with the hat selected above; category = Meeting."}</div>
        <div style={{ background: "#FFF7E6", border: `1px solid ${AMBER}`, borderRadius: 8, padding: "7px 10px", fontSize: 11, color: "#8a5a00", marginBottom: 10 }}>{lang === "th" ? "💡 ปฏิทินมักมีหลายร้อยรายการ — แนะนำใส่ตัวกรองด้านล่างก่อน (เช่น คำว่า “supervision” หรือกำหนดวันเริ่ม) ไม่งั้นจะดึงเข้ามาทั้งหมด" : "💡 Calendars often have hundreds of entries — set a filter below first (e.g. keyword “supervision”, or a start date), otherwise everything gets imported."}</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}>
          <label style={{ fontSize: 11, color: AUB2, display: "flex", alignItems: "center", gap: 5 }}>{lang === "th" ? "ตั้งแต่วันที่" : "From date"}<input value={outlookCfg.from || ""} onChange={e => setOutlookCfg({ from: e.target.value })} placeholder="YYYY-MM-DD" style={{ border: `1px solid ${BORDER}`, borderRadius: 5, padding: "4px 7px", fontSize: 11, width: 120 }} /></label>
          <label style={{ fontSize: 11, color: AUB2, display: "flex", alignItems: "center", gap: 5 }}>{lang === "th" ? "มีคำใดคำหนึ่ง" : "Include any of"}<input value={outlookCfg.keyword || ""} onChange={e => setOutlookCfg({ keyword: e.target.value })} placeholder={lang === "th" ? "estates, phd, dibam" : "estates, phd, dibam"} title={lang === "th" ? "คั่นหลายคำด้วยเครื่องหมาย , (เจอคำใดคำหนึ่งก็เอา) · เว้นว่าง = เอาทุกอัน" : "comma-separated; keeps events matching ANY word · blank = keep all"} style={{ border: `1px solid ${BORDER}`, borderRadius: 5, padding: "4px 7px", fontSize: 11, width: 190 }} /></label>
          <label style={{ fontSize: 11, color: AUB2, display: "flex", alignItems: "center", gap: 5 }}>{lang === "th" ? "ตัดคำออก" : "Exclude"}<input value={outlookCfg.exclude || ""} onChange={e => setOutlookCfg({ exclude: e.target.value })} placeholder={lang === "th" ? "private, appointment" : "private, appointment"} title={lang === "th" ? "คั่นด้วย , · ตัดรายการที่มีคำเหล่านี้ออก" : "comma-separated; drops events containing ANY of these"} style={{ border: `1px solid ${BORDER}`, borderRadius: 5, padding: "4px 7px", fontSize: 11, width: 160 }} /></label>
          <label style={{ fontSize: 11, color: AUB2, display: "flex", alignItems: "center", gap: 5 }}>{lang === "th" ? "สถานะ" : "Status"}
            <select value={outlookCfg.busy || "busy"} onChange={e => setOutlookCfg({ busy: e.target.value })} style={{ border: `1px solid ${BORDER}`, borderRadius: 5, padding: "4px 7px", fontSize: 11, cursor: "pointer" }}>
              <option value="busy">{lang === "th" ? "เฉพาะที่ไม่ว่าง (Busy) — ไปจริง" : "Busy only (attended)"}</option>
              <option value="tentative">{lang === "th" ? "Busy + Tentative" : "Busy + Tentative"}</option>
              <option value="all">{lang === "th" ? "ทั้งหมด (รวม Free)" : "All (incl. Free)"}</option>
            </select>
          </label>
        </div>

        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 12px", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: AUB2 }}>{lang === "th" ? "แยกหมวกอัตโนมัติ (คำในหัวข้อ → หมวก)" : "Auto-assign hat (title keyword → hat)"}</span>
            {(!outlookCfg.rules || !outlookCfg.rules.length) && <button onClick={() => setOutlookCfg({ rules: [{ match: "dibam, bssc, tutorial, dissertation", hat: "BSSC PGTA" }, { match: "phd, estate, readiness, mycampus, interview, huddle, board, catch, governance", hat: "PhD" }], fallback: "Unassigned" })} style={{ border: `1px solid ${AUB}`, background: CARD, color: AUB, borderRadius: 5, padding: "3px 9px", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>{lang === "th" ? "＋ ใส่กฎแนะนำ (PhD/Lecturer)" : "＋ Use suggested rules"}</button>}
          </div>
          {(outlookCfg.rules || []).length === 0 && <div style={{ fontSize: 10.5, color: GREY }}>{lang === "th" ? "ไม่มีกฎ = ใช้หมวกเดียว (หมวกที่เลือกด้านบน) กับทุกรายการ" : "No rules = one hat (the one selected above) for everything."}</div>}
          {(outlookCfg.rules || []).map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
              <input value={r.match || ""} onChange={e => { const rules = (outlookCfg.rules || []).slice(); rules[i] = { ...rules[i], match: e.target.value }; setOutlookCfg({ rules }); }} placeholder={lang === "th" ? "คำ, คำ, คำ" : "word, word, word"} style={{ flex: "1 1 240px", border: `1px solid ${BORDER}`, borderRadius: 5, padding: "4px 7px", fontSize: 11 }} />
              <span style={{ color: GREY }}>→</span>
              <select value={r.hat || "PhD"} onChange={e => { const rules = (outlookCfg.rules || []).slice(); rules[i] = { ...rules[i], hat: e.target.value }; setOutlookCfg({ rules }); }} style={{ border: `1px solid ${BORDER}`, borderRadius: 5, padding: "4px 7px", fontSize: 11, cursor: "pointer" }}>{ROLES.map(h => <option key={h} value={h}>{roleLab(lang, h)}</option>)}</select>
              <button onClick={() => setOutlookCfg({ rules: (outlookCfg.rules || []).filter((_, x) => x !== i) })} title="delete" style={{ border: "none", background: "transparent", color: GREY, cursor: "pointer", fontSize: 15 }}>×</button>
            </div>
          ))}
          {(outlookCfg.rules || []).length > 0 && (
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginTop: 4 }}>
              <button onClick={() => setOutlookCfg({ rules: [...(outlookCfg.rules || []), { match: "", hat: "PhD" }] })} style={{ border: `1px solid ${BORDER}`, background: "#fff", color: AUB2, borderRadius: 5, padding: "3px 9px", cursor: "pointer", fontSize: 11 }}>{lang === "th" ? "＋ เพิ่มกฎ" : "＋ Add rule"}</button>
              <label style={{ fontSize: 11, color: AUB2, display: "flex", alignItems: "center", gap: 5 }}>{lang === "th" ? "รายการที่ไม่ตรงกฎ →" : "Unmatched →"}
                <select value={outlookCfg.fallback === undefined ? "Unassigned" : outlookCfg.fallback} onChange={e => setOutlookCfg({ fallback: e.target.value })} style={{ border: `1px solid ${BORDER}`, borderRadius: 5, padding: "4px 7px", fontSize: 11, cursor: "pointer" }}>
                  <option value="">{lang === "th" ? "ข้าม (ไม่นำเข้า)" : "Skip (don't import)"}</option>
                  {ROLES.map(h => <option key={h} value={h}>{roleLab(lang, h)}</option>)}
                </select>
              </label>
            </div>
          )}
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: AUB, fontWeight: 600, marginBottom: 10, cursor: "pointer" }}>
          <input type="checkbox" checked={!!outlookCfg.auto} onChange={e => setOutlookCfg({ auto: e.target.checked, role })} />
          🔄 {lang === "th" ? "ดึงอัตโนมัติทุกครั้งที่เปิดแอป (ใช้ตัวกรอง + กฎที่บันทึกไว้)" : "Auto-sync every time I open the app (uses the saved filter + rules)"}
        </label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={syncOutlook} disabled={outBusy} style={{ background: outBusy ? "#B9A9CC" : AUB, color: "#fff", border: "none", borderRadius: 6, padding: "8px 14px", cursor: outBusy ? "default" : "pointer", fontSize: 12, fontWeight: 700 }}>{outBusy ? (lang === "th" ? "กำลังซิงค์…" : "Syncing…") : (lang === "th" ? "ซิงค์จาก Outlook" : "Sync from Outlook")}</button>
          <label style={{ background: "#fff", color: AUB2, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "8px 14px", cursor: "pointer", fontSize: 12 }}>
            {lang === "th" ? "อัปโหลดไฟล์ .ics…" : "Import .ics file…"}
            <input type="file" accept=".ics,text/calendar" onChange={importICSFile} style={{ display: "none" }} />
          </label>
          {outMsg && <span style={{ fontSize: 12, fontWeight: 600, color: outMsg.ok ? GREEN : RED }}>{outMsg.ok ? "✓ " : "⚠ "}{outMsg.text}</span>}
        </div>
        <div style={{ fontSize: 10.5, color: GREY, marginTop: 8, lineHeight: 1.5 }}>{outlookEndpoint ? (lang === "th" ? "เชื่อม Worker แล้ว ✓" : "Worker connected ✓") : (lang === "th" ? "ยังไม่ได้เชื่อม Worker — “ซิงค์จาก Outlook” จะใช้ได้เมื่อใส่ URL ใน index.html · “อัปโหลด .ics” ใช้ได้เลย" : "Worker not connected yet — “Sync from Outlook” needs the URL in index.html · “Import .ics file” works right now.")}</div>
      </div>
    </div>
  );
}

// ---- Export layer: Reports hub ----
// derive grouped teaching-summary lines (module · role → n sessions)
function teachingItems(recs) {
  const groups = {};
  (recs || []).forEach(r => {
    const mod = (String(r.activity || "").match(/(BIDI|BCPM|BENV)\s?\d+/i) || [""])[0].toUpperCase().replace(/\s/g, "") || "Other";
    const role = r.role || "";
    const key = role ? `${mod} · ${role}` : mod;
    groups[key] = (groups[key] || 0) + 1;
  });
  return Object.entries(groups).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} — ${n} session${n > 1 ? "s" : ""}`);
}
function notPriv(r, excl) { return !excl || (r.privacy || "") !== "Private"; }
function repProgress(data) {
  const R = data.research || {}, T = data.timeline || [], IV = data.interviews || [];
  const done = T.filter(r => r.status === "Completed");
  const coded = IV.filter(r => r.code).length, interviewed = IV.filter(r => ["Interviewed", "Transcribed"].includes(r.phase) && r.code).length;
  const sup = (data.activity || []).filter(r => r.category === "Meeting" && roleOf(r) === "PhD" && /^\d{4}-\d{2}-\d{2}$/.test(r.date || "")).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
  const pubs = (data.publications || []).filter(r => r.paper && !/^\[/.test(r.paper));
  const tasks = (data.tasks || []).filter(r => roleOf(r) === "PhD" && r.status !== "Done");
  return { title: "PhD Progress Report", sub: R.title || "", sections: [
    { h: "Milestones completed", items: done.map(r => `${r.task}${(r.aEnd || r.aStart) ? ` (${r.aEnd || r.aStart})` : ""}`) },
    { h: "Fieldwork", items: [`${interviewed} of ${coded} planned semi-structured interviews conducted with UCL Estates & Facilities staff.`] },
    { h: "Recent supervision meetings", items: sup.map(r => `${r.date} — ${r.activity || "Supervision"}${r.linked ? ` (${r.linked})` : ""}`) },
    { h: "Publications", items: pubs.map(r => `${r.paper} — ${r.journal || "TBC"} (${r.status})`) },
    { h: "Current focus / next", items: tasks.map(r => `[${r.status}] ${r.title}${r.due ? ` (due ${r.due})` : ""}`) },
    { h: "Research questions", items: R.questions || [] },
  ] };
}
function repTeaching(data) {
  const acts = teachRecs(data);
  const outs = (data.outputs || []).filter(r => ["PGTA", "Lecturer"].includes(r.role));
  const refl = (data.reflections || []).filter(r => ["PGTA", "Lecturer"].includes(r.role));
  const sup = data.supervision || [];
  const students = sup.reduce((a, r) => a + (Number(r.nstudents) || 0), 0);
  return { title: "Teaching Portfolio", sub: "UCL Bartlett School of Sustainable Construction", sections: [
    { h: "Teaching roles & modules", items: teachingItems(acts) },
    { h: "Supervision", items: sup.map(r => `${r.title} — ${r.level || ""} ${r.programme || ""} (${r.status || ""})`) },
    { h: "Teaching outputs & materials", items: outs.map(o => `${o.title}${o.date ? ` (${o.date})` : ""}`) },
    { h: "Students supervised", items: [`${students} students across ${sup.length} supervision records.`] },
    { h: "Teaching reflections", items: refl.map(r => `${r.date || ""} — ${r.reflection}`) },
  ] };
}
function repWorkload(data, excl) {
  const A = roleRecords(data);
  const byHat = ROLES.map(role => { const rs = A.filter(x => x.role === role); return { role, n: rs.length, h: rs.reduce((a, x) => a + (Number(x.hours) || 0), 0) }; }).filter(x => x.n);
  const byMonth = {}; A.forEach(x => { const m = (x.date || "").slice(0, 7); if (/^\d{4}-\d{2}$/.test(m)) byMonth[m] = (byMonth[m] || 0) + 1; });
  const months = Object.keys(byMonth).sort().slice(-12);
  const evid = (data.activity || []).filter(x => notPriv(x, excl) && x.evidence && String(x.evidence).trim());
  return { title: "Workload & CV Evidence", sub: "", sections: [
    { h: "Activity by hat", items: byHat.map(x => `${roleLab("en", x.role)}: ${x.n} records${x.h ? `, ${x.h}h` : ""}`) },
    { h: "Activity by month (recent)", items: months.map(m => `${m}: ${byMonth[m]} records`) },
    { h: "Evidence log", items: evid.map(x => `${x.date || ""} — ${x.activity} → ${x.evidence}`) },
  ] };
}
function repAudit(data, excl) {
  const rows = [];
  (data.activity || []).filter(r => notPriv(r, excl)).forEach(r => { if (/^\d{4}-\d{2}-\d{2}$/.test(r.date || "")) rows.push([r.date, `[${roleOf(r)}] ${r.category || "Activity"}: ${r.activity || ""}`]); });
  (data.outputs || []).filter(r => notPriv(r, excl)).forEach(r => { if (r.date) rows.push([r.date, `[Output] ${r.title}`]); });
  (data.researchHistory || []).forEach(r => rows.push([r.ts, `[Framing version saved] ${r.note}`]));
  (data.tasks || []).filter(r => r.status === "Done" && r.due).forEach(r => rows.push([r.due, `[Task done] ${r.title}`]));
  rows.sort((a, b) => String(b[0]).localeCompare(String(a[0])));
  return { title: "Audit Trail", sub: "Complete chronological record", sections: [{ h: "", items: rows.map(x => `${x[0]} — ${x[1]}`) }] };
}
function reportMD(m) {
  let s = `# ${m.title}\n\n${m.sub ? m.sub + "\n" : ""}`;
  m.sections.forEach(sec => { if (sec.h) s += `\n## ${sec.h}\n\n`; else s += "\n"; (sec.items.length ? sec.items : ["—"]).forEach(i => s += `- ${i}\n`); });
  s += `\n_Generated from PhD dashboard · ${new Date().toISOString().slice(0, 10)}_\n`;
  return s;
}
function reportHTML(m) {
  const e = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const body = m.sections.map(sec => `${sec.h ? `<h2>${e(sec.h)}</h2>` : ""}<ul>${(sec.items.length ? sec.items : ["—"]).map(i => `<li>${e(i)}</li>`).join("")}</ul>`).join("");
  return `<!doctype html><html><head><meta charset="utf-8"><title>${e(m.title)}</title>
<style>@page{margin:2cm} body{font-family:Georgia,serif;color:#1f2430;max-width:820px;margin:22px auto;padding:0 18px;line-height:1.5}
h1{font-size:23px;color:#2B1241;margin:0 0 2px} .sub{color:#555;font-size:13px;margin-bottom:8px}
h2{font-size:14px;color:#2B1241;border-bottom:1.5px solid #2B1241;padding-bottom:2px;margin:16px 0 7px;text-transform:uppercase;letter-spacing:.4px}
ul{margin:2px 0 8px;padding-left:20px} li{font-size:13px;margin-bottom:4px} .foot{color:#999;font-size:11px;margin-top:18px}</style></head>
<body><h1>${e(m.title)}</h1><div class="sub">${e(m.sub || "")}</div>${body}<div class="foot">Generated from PhD dashboard · ${new Date().toISOString().slice(0, 10)}</div></body></html>`;
}

function ReportsHub({ data, lang }) {
  const [sel, setSel] = useState("progress");
  const [excl, setExcl] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const defs = [
    { k: "progress", e: "📈", en: "PhD Progress Report", th: "รายงานความก้าวหน้า", d: lang === "th" ? "สำหรับพบอาจารย์ / ทบทวนประจำปี" : "for supervision / annual review", build: () => repProgress(data) },
    { k: "teaching", e: "🍎", en: "Teaching Portfolio", th: "แฟ้มสะสมงานสอน", d: lang === "th" ? "สำหรับ AFHEA / เลื่อนตำแหน่ง" : "for AFHEA / promotion", build: () => repTeaching(data) },
    { k: "workload", e: "⏱️", en: "Workload & CV Evidence", th: "ภาระงาน & หลักฐาน CV", d: lang === "th" ? "สำหรับทุน / วิเคราะห์ภาระงาน" : "for fellowship / workload", build: () => repWorkload(data, excl) },
    { k: "audit", e: "🧾", en: "Audit Trail", th: "ร่องรอยการทำงาน", d: lang === "th" ? "บันทึกทั้งหมดตามเวลา" : "full chronological log", build: () => repAudit(data, excl) },
  ];
  const cur = defs.find(d => d.k === sel);
  const model = cur.build();
  const dl = (ext, text, type) => { const url = URL.createObjectURL(new Blob([text], { type })); const a = document.createElement("a"); a.href = url; a.download = `${model.title.replace(/[^\w]+/g, "_")}_${today}.${ext}`; a.click(); URL.revokeObjectURL(url); };
  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 800, color: AUB }}>{lang === "th" ? "รายงาน — เปลี่ยนสิ่งที่บันทึกเป็นเอกสารส่งได้" : "Reports — turn what you've captured into deliverables"}</div>
      <div style={{ fontSize: 12, color: GREY, marginBottom: 14 }}>{lang === "th" ? "สร้างจากทุกแท็บโดยอัตโนมัติ ดาวน์โหลดเป็น Markdown หรือ HTML (พิมพ์เป็น PDF)" : "Built automatically from every tab. Download as Markdown or HTML (print to PDF)."}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px,1fr))", gap: 10, marginBottom: 14 }}>
        {defs.map(d => { const active = sel === d.k; return (
          <button key={d.k} onClick={() => setSel(d.k)} style={{ textAlign: "left", border: `1px solid ${active ? AUB : BORDER}`, background: active ? CARD : "#fff", borderRadius: 10, padding: "10px 12px", cursor: "pointer" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: AUB }}>{d.e} {lang === "th" ? d.th : d.en}</div>
            <div style={{ fontSize: 11, color: GREY, marginTop: 2 }}>{d.d}</div>
          </button>
        ); })}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
        <button onClick={() => dl("md", reportMD(model), "text/markdown")} style={{ background: AUB, color: "#fff", border: "none", borderRadius: 6, padding: "8px 14px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>{lang === "th" ? "ดาวน์โหลด · Markdown" : "Download · Markdown"}</button>
        <button onClick={() => dl("html", reportHTML(model), "text/html")} style={{ background: "#fff", color: AUB2, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "8px 14px", cursor: "pointer", fontSize: 12 }}>{lang === "th" ? "ดาวน์โหลด · HTML" : "Download · HTML"}</button>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: AUB2, marginLeft: "auto" }}>
          <input type="checkbox" checked={excl} onChange={e => setExcl(e.target.checked)} />{lang === "th" ? "ไม่รวมรายการส่วนตัว (Private)" : "Exclude Private items"}
        </label>
      </div>
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "22px 26px", fontFamily: "Georgia, serif" }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: AUB }}>{model.title}</div>
        {model.sub && <div style={{ fontSize: 12.5, color: "#555", marginBottom: 6 }}>{model.sub}</div>}
        {model.sections.map((sec, i) => (
          <div key={i}>
            {sec.h && <div style={{ fontSize: 13.5, fontWeight: 700, color: AUB, borderBottom: `1.5px solid ${AUB}`, paddingBottom: 2, margin: "15px 0 7px", textTransform: "uppercase", letterSpacing: 0.4 }}>{sec.h}</div>}
            <ul style={{ margin: "4px 0 6px", paddingLeft: 20 }}>{(sec.items.length ? sec.items : ["—"]).map((it, j) => <li key={j} style={{ fontSize: 13, marginBottom: 4, lineHeight: 1.45 }}>{it}</li>)}</ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Lecturer Record: dashboard + export ----
function ayNow() { const n = new Date(); let y = n.getFullYear(); if (n.getMonth() < 8) y -= 1; return `${y}/${String((y + 1) % 100).padStart(2, "0")}`; }

function LecturerDashboard({ data, setTab, lang }) {
  const ts = data.teachingSessions || [], gl = data.guestLectures || [], sup = data.supervision || [], mk = data.marking || [], ev = data.teachingEvidence || [];
  const students = sup.reduce((a, r) => a + (Number(r.nstudents) || 0), 0);
  const active = sup.filter(r => r.status === "Active").length, completed = sup.filter(r => r.status === "Completed").length;
  const scripts = mk.reduce((a, r) => a + (Number(r.nstudents) || 0), 0);
  const themes = {}; [...ts, ...gl, ...sup].forEach(r => { const t = (r.topic || "").trim(); if (t) themes[t] = (themes[t] || 0) + 1; });
  const topThemes = Object.entries(themes).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const recent = [
    ...ts.map(r => ({ d: r.date || "", t: `Teaching: ${r.title}` })),
    ...gl.map(r => ({ d: r.date || "", t: `Guest lecture: ${r.title}` })),
    ...mk.map(r => ({ d: r.date || "", t: `Marking: ${r.title}` })),
    ...sup.map(r => ({ d: "", t: `Supervision: ${r.title} (${r.status || ""})` })),
  ].filter(x => x.d).sort((a, b) => b.d.localeCompare(a.d)).slice(0, 8);
  const kpis = [
    ["📚", "Teaching sessions", ts.length, () => setTab("teachingSessions")],
    ["🎤", "Guest lectures", gl.length, () => setTab("guestLectures")],
    ["🧑‍🎓", "Students supervised", students, () => setTab("supervision")],
    ["🟢", "Active / completed", `${active} / ${completed}`, () => setTab("supervision")],
    ["✍️", "Scripts marked", scripts, () => setTab("marking")],
    ["🗂️", "Evidence items", ev.length, () => setTab("teachingEvidence")],
  ];
  const card = { background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: 14 };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: AUB }}>🍎 {lang === "th" ? "แดชบอร์ดอาจารย์" : "Lecturer Dashboard"} <span style={{ fontSize: 11, fontWeight: 400, color: GREY }}>· {ayNow()}</span></div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {kpis.map(([e, label, val, go]) => (
          <button key={label} onClick={go} style={{ textAlign: "left", ...card, minWidth: 140, flex: "1 1 140px", cursor: "pointer" }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: AUB2, textTransform: "uppercase", letterSpacing: 0.4 }}>{e} {label}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: AUB, marginTop: 4 }}>{val}</div>
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 300px", ...card }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: AUB, marginBottom: 8 }}>🕘 {lang === "th" ? "กิจกรรมล่าสุด" : "Recent lecturer activity"}</div>
          {recent.length ? recent.map((r, i) => (<div key={i} style={{ display: "flex", gap: 8, fontSize: 12, padding: "3px 0", borderTop: i ? `1px solid ${BORDER}` : "none" }}><span style={{ width: 82, color: GREY }}>{r.d}</span><span style={{ flex: 1 }}>{r.t}</span></div>)) : <div style={{ fontSize: 12, color: GREY }}>—</div>}
        </div>
        <div style={{ flex: "1 1 240px", ...card }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: AUB, marginBottom: 8 }}>🎯 {lang === "th" ? "ธีมการสอนหลัก" : "Main teaching themes"}</div>
          {topThemes.length ? topThemes.map(([t, n]) => (<div key={t} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "3px 0" }}><span>{t}</span><span style={{ fontWeight: 700, color: AUB }}>{n}</span></div>)) : <div style={{ fontSize: 12, color: GREY }}>—</div>}
        </div>
      </div>
      <div style={{ fontSize: 11, color: GREY }}>{lang === "th" ? "แต่ละบันทึกเก็บครั้งเดียว แล้วปรากฏในหลายมุมมอง (แดชบอร์ด แท็บ และศูนย์ส่งออก) ผ่านแท็กและตัวกรอง" : "Each record is stored once and surfaces across the dashboard, its tab, and the Export Centre via tags and filters."}</div>
    </div>
  );
}

function useForItems(data, tag) {
  const stores = [["Teaching session", "teachingSessions"], ["Guest lecture", "guestLectures"], ["Supervision", "supervision"], ["Marking", "marking"], ["Evidence", "teachingEvidence"]];
  const out = [];
  stores.forEach(([label, store]) => (data[store] || []).filter(r => (r.usefor || "") === tag).forEach(r => out.push(`[${label}] ${r.title || ""}${r.date ? ` (${r.date})` : r.ay ? ` (${r.ay})` : ""}`)));
  return out;
}
function lecTeachingCV(data) {
  const sup = data.supervision || []; const students = sup.reduce((a, r) => a + (Number(r.nstudents) || 0), 0);
  return { title: "Teaching CV Summary", sub: "Pundharee Viryasiri", sections: [
    { h: "Teaching", items: teachingItems(teachRecs(data)) },
    { h: "Guest lectures", items: (data.guestLectures || []).map(g => g.cvwording || `${g.title}${g.institution ? ", " + g.institution : ""}`) },
    { h: "Supervision", items: [`${students} students supervised across ${sup.length} records.`, ...sup.map(r => `${r.title} — ${r.role || ""}, ${r.status || ""}`)] },
    { h: "Assessment", items: [`${(data.marking || []).length} marking records; ${(data.marking || []).reduce((a, r) => a + (Number(r.nstudents) || 0), 0)} scripts.`] },
  ] };
}
function lecGuestList(data) { return { title: "Guest Lecture List", sub: "", sections: [{ h: "", items: (data.guestLectures || []).map(g => `${g.title}${g.institution ? ", " + g.institution : ""}${g.date ? ` (${g.date})` : g.ay ? ` (${g.ay})` : ""}${g.type ? " — " + g.type : ""}`) }] }; }
function lecSupPortfolio(data) { const sup = (data.supervision || []).filter(r => (r.usefor || "") !== "Not for export"); return { title: "Supervision Portfolio", sub: "", sections: [{ h: "", items: sup.map(r => `${r.title} — ${r.level || ""}, ${r.programme || ""} (${r.institution || ""}${r.ay ? ", " + r.ay : ""}). Role: ${r.role || ""}. Topic: ${r.topic || "—"}. Status: ${r.status || ""}${r.outcome ? "; outcome: " + r.outcome : ""}.`) }] }; }
function lecAnnual(data) { return { title: "Annual Teaching Record", sub: ayNow(), sections: [
  { h: "Teaching sessions", items: (data.teachingSessions || []).map(r => `${r.date || r.ay || ""} — ${r.title} (${r.type || ""}${r.programme ? ", " + r.programme : ""})`) },
  { h: "Guest lectures", items: (data.guestLectures || []).map(r => `${r.title}${r.institution ? ", " + r.institution : ""}`) },
  { h: "Supervision", items: (data.supervision || []).map(r => `${r.title} — ${r.status || ""}`) },
  { h: "Marking", items: (data.marking || []).map(r => `${r.title} (${r.nstudents || "?"} scripts)`) },
] }; }
function lecWorkload(data) {
  const rr = roleRecords(data); const byHat = ROLES.map(role => { const rs = rr.filter(x => x.role === role); return { role, n: rs.length, h: rs.reduce((a, x) => a + (Number(x.hours) || 0), 0) }; }).filter(x => x.n);
  const sup = data.supervision || [];
  return { title: "Workload Summary", sub: "", sections: [
    { h: "By hat", items: byHat.map(x => `${roleLab("en", x.role)}: ${x.n} records${x.h ? `, ${x.h}h` : ""}`) },
    { h: "Teaching load", items: [`${(data.teachingSessions || []).length} teaching sessions`, `${(data.guestLectures || []).length} guest lectures`, `${(data.marking || []).length} marking records / ${(data.marking || []).reduce((a, r) => a + (Number(r.nstudents) || 0), 0)} scripts`, `${sup.reduce((a, r) => a + (Number(r.nstudents) || 0), 0)} students supervised`] },
  ] };
}

function LecturerExport({ data, lang }) {
  const [sel, setSel] = useState("cv");
  const today = new Date().toISOString().slice(0, 10);
  const defs = [
    { k: "cv", e: "📇", en: "Teaching CV Summary", build: () => lecTeachingCV(data) },
    { k: "guest", e: "🎤", en: "Guest Lecture List", build: () => lecGuestList(data) },
    { k: "sup", e: "🧑‍🎓", en: "Supervision Portfolio", build: () => lecSupPortfolio(data) },
    { k: "annual", e: "🗓️", en: "Annual Teaching Record", build: () => lecAnnual(data) },
    { k: "hea", e: "🎓", en: "HEA Fellowship Evidence", build: () => ({ title: "HEA Fellowship Evidence", sub: "Records tagged 'use for: HEA Fellowship'", sections: [{ h: "", items: useForItems(data, "HEA Fellowship") }] }) },
    { k: "promo", e: "📈", en: "Promotion Evidence", build: () => ({ title: "Promotion Evidence", sub: "Records tagged 'use for: Promotion'", sections: [{ h: "", items: useForItems(data, "Promotion") }] }) },
    { k: "work", e: "⏱️", en: "Workload Summary", build: () => lecWorkload(data) },
  ];
  const cur = defs.find(d => d.k === sel); const model = cur.build();
  const dl = (ext, text, type) => { const url = URL.createObjectURL(new Blob([text], { type })); const a = document.createElement("a"); a.href = url; a.download = `${model.title.replace(/[^\w]+/g, "_")}_${today}.${ext}`; a.click(); URL.revokeObjectURL(url); };
  return (
    <div>
      <div style={{ fontSize: 15, fontWeight: 800, color: AUB }}>📤 {lang === "th" ? "ศูนย์ส่งออก (งานสอน)" : "Export Centre — Lecturer Record"}</div>
      <div style={{ fontSize: 12, color: GREY, marginBottom: 14 }}>{lang === "th" ? "สร้างจากบันทึกงานสอนของคุณ · ไม่รวมรายการที่ตั้งเป็น ‘Not for export’" : "Built from your lecturer records. Items marked 'Not for export' are left out."}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 10, marginBottom: 14 }}>
        {defs.map(d => { const active = sel === d.k; return (
          <button key={d.k} onClick={() => setSel(d.k)} style={{ textAlign: "left", border: `1px solid ${active ? AUB : BORDER}`, background: active ? CARD : "#fff", borderRadius: 10, padding: "10px 12px", cursor: "pointer", fontSize: 13, fontWeight: 700, color: AUB }}>{d.e} {d.en}</button>
        ); })}
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <button onClick={() => dl("md", reportMD(model), "text/markdown")} style={{ background: AUB, color: "#fff", border: "none", borderRadius: 6, padding: "8px 14px", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>{lang === "th" ? "ดาวน์โหลด · Markdown" : "Download · Markdown"}</button>
        <button onClick={() => dl("html", reportHTML(model), "text/html")} style={{ background: "#fff", color: AUB2, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "8px 14px", cursor: "pointer", fontSize: 12 }}>{lang === "th" ? "ดาวน์โหลด · HTML" : "Download · HTML"}</button>
      </div>
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "22px 26px", fontFamily: "Georgia, serif" }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: AUB }}>{model.title}</div>
        {model.sub && <div style={{ fontSize: 12.5, color: "#555", marginBottom: 6 }}>{model.sub}</div>}
        {model.sections.map((sec, i) => (
          <div key={i}>
            {sec.h && <div style={{ fontSize: 13.5, fontWeight: 700, color: AUB, borderBottom: `1.5px solid ${AUB}`, paddingBottom: 2, margin: "15px 0 7px", textTransform: "uppercase", letterSpacing: 0.4 }}>{sec.h}</div>}
            <ul style={{ margin: "4px 0 6px", paddingLeft: 20 }}>{(sec.items.length ? sec.items : ["—"]).map((it, j) => <li key={j} style={{ fontSize: 13, marginBottom: 4, lineHeight: 1.45 }}>{it}</li>)}</ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Events tab with type counts ----
function EventsTab({ data, update, addRow, delRow, exportCSV, lang }) {
  const E = data.events || [];
  const types = ["Conference", "Workshop", "Seminar", "Networking", "Training", "Symposium", "Other"];
  const counts = {}; types.forEach(t => counts[t] = 0);
  let attended = 0;
  E.forEach(r => { if (r.etype && counts[r.etype] != null) counts[r.etype]++; else if (r.etype) counts["Other"]++; if (["Attended", "Presented"].includes(r.status)) attended++; });
  const total = E.filter(r => r.event && !/^\[/.test(r.event)).length;
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 800, color: AUB, marginBottom: 8 }}>🎪 {lang === "th" ? "สรุปกิจกรรมที่เข้าร่วม" : "Events attended — by type"}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "10px 14px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: AUB2, textTransform: "uppercase" }}>{lang === "th" ? "รวม" : "Total"}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: AUB }}>{total}</div>
          <div style={{ fontSize: 11, color: GREY }}>{attended} {lang === "th" ? "เข้าร่วมแล้ว" : "attended"}</div>
        </div>
        {types.filter(t => counts[t] > 0).map(t => (
          <div key={t} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "10px 14px", minWidth: 92 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: AUB2 }}>{t}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: AUB }}>{counts[t]}</div>
          </div>
        ))}
      </div>
      <TableTab tabKey="events" data={data} update={update} addRow={addRow} delRow={delRow} exportCSV={exportCSV} lang={lang} />
    </div>
  );
}

// ---- Task tracker (front-page) ----
function TaskTracker({ data, update, setTab, lang }) {
  const today = new Date().toISOString().slice(0, 10);
  const tasks = (data.tasks || []).map((t, i) => ({ t, i }));
  const bucket = o => { const s = o.t.status || "", due = o.t.due || ""; if (s === "Done") return "done"; if (/^\d{4}-\d{2}-\d{2}$/.test(due) && due < today) return "overdue"; if (s === "Awaiting") return "waiting"; return "active"; };
  const COLS = [["overdue", lang === "th" ? "เลยกำหนด" : "Overdue", RED], ["active", lang === "th" ? "กำลังทำ" : "Active", AMBER], ["waiting", lang === "th" ? "รออยู่" : "Waiting", "#6B4E8C"], ["done", lang === "th" ? "เสร็จแล้ว" : "Done", GREEN]];
  const STATUS = ["Not started", "In progress", "Awaiting", "Done"];
  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: AUB }}>✅ {lang === "th" ? "ตัวติดตามงาน" : "Task tracker"}</div>
        <span style={{ fontSize: 11, color: GREY }}>{tasks.filter(o => bucket(o) !== "done").length} {lang === "th" ? "ยังไม่เสร็จ" : "unfinished"}</span>
        <button onClick={() => setTab("tasks")} style={{ marginLeft: "auto", border: `1px solid ${BORDER}`, background: "#fff", color: AUB2, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 11 }}>{lang === "th" ? "จัดการงาน" : "manage tasks"} →</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 10 }}>
        {COLS.map(([k, label, col]) => { const items = tasks.filter(o => bucket(o) === k);
          return (
            <div key={k} style={{ background: OFF, border: `1px solid ${BORDER}`, borderTop: `3px solid ${col}`, borderRadius: 8, padding: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: col, marginBottom: 6 }}>{label} <span style={{ color: GREY, fontWeight: 400 }}>{items.length}</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {items.map(o => (
                  <div key={o.i} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "6px 8px" }}>
                    <div style={{ fontSize: 12, color: INK, fontWeight: 600 }}>{o.t.title || "—"}</div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 3, flexWrap: "wrap" }}>
                      {o.t.category && <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", background: AUB2, borderRadius: 4, padding: "1px 5px" }}>{o.t.category}</span>}
                      {o.t.role && <span style={{ fontSize: 9, fontWeight: 700, color: roleColor(o.t.role) }}>{roleLab(lang, o.t.role)}</span>}
                      {o.t.due && <span style={{ fontSize: 9, color: k === "overdue" ? RED : GREY }}>{lang === "th" ? "กำหนด" : "due"} {o.t.due}</span>}
                    </div>
                    <select value={o.t.status || ""} onChange={e => update("tasks", o.i, "status", e.target.value)} style={{ marginTop: 5, width: "100%", border: `1px solid ${BORDER}`, borderRadius: 5, fontSize: 11, padding: "2px 4px", color: AUB2, cursor: "pointer" }}>
                      <option value=""></option>{STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                ))}
                {items.length === 0 && <div style={{ fontSize: 11, color: "#C4C4C4", textAlign: "center", padding: "6px 0" }}>—</div>}
              </div>
            </div>
          ); })}
      </div>
    </div>
  );
}

// ---- Supervisor tab: team info + meeting log ----
function SupervisorTab({ data, update, addRow, delRow, exportCSV, lang }) {
  const team = data.supervisorTeam || SUP_TEAM_SEED;
  // people met, counted from Activity Log meetings (linked) + the supervision log ("with"); supervisors always shown
  const ALWAYS_SHOW = ["Michael Pitt", "Vivi (Qiuchen Lu)", "Junpeng Lyu", "Adrien Cooper"];
  const splitP = s => String(s || "").split(/\s*[;&,]\s*/).map(x => x.trim()).filter(Boolean);
  const meetingCounts = (() => {
    const counts = {}; ALWAYS_SHOW.forEach(n => { counts[n] = 0; });
    const seen = new Set(); // person|date — dedupe the same meeting appearing in both activity + the log
    const add = (n, date) => { const k = n + "|" + (date || ""); if (seen.has(k)) return; seen.add(k); counts[n] = (counts[n] || 0) + 1; };
    (data.activity || []).forEach(r => { if ((r.category || "") === "Meeting") splitP(r.linked).forEach(n => add(n, r.date)); });
    (data.supervisor || []).forEach(r => splitP(r.with).forEach(n => add(n, r.date)));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  })();
  const actMeetingDates = new Set((data.activity || []).filter(r => (r.category || "") === "Meeting").map(r => r.date).filter(Boolean));
  const totalMeetings = (data.activity || []).filter(r => (r.category || "") === "Meeting").length + (data.supervisor || []).filter(r => splitP(r.with).length && !actMeetingDates.has(r.date)).length;
  const lastWith = name => { const ds = [...(data.activity || []).filter(r => (r.category || "") === "Meeting" && splitP(r.linked).includes(name)), ...(data.supervisor || []).filter(r => splitP(r.with).includes(name))].map(r => r.date).filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d || "")).sort(); return ds.length ? ds[ds.length - 1] : ""; };
  return (
    <div>
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: AUB, marginBottom: 2 }}>📊 {lang === "th" ? "สรุปการประชุม — พบใครไปกี่ครั้ง" : "Meeting summary — who you've met, and how often"}</div>
        <div style={{ fontSize: 11, color: GREY, marginBottom: 10 }}>{lang === "th" ? `รวม ${totalMeetings} ครั้ง · นับจากบันทึกกิจกรรม (หมวด Meeting → ช่อง “Linked to”)` : `${totalMeetings} meetings total · counted from your Activity Log (category = Meeting → "Linked to")`}</div>
        {meetingCounts.length ? (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {meetingCounts.map(([name, n]) => { const last = lastWith(name);
              return (
                <div key={name} style={{ border: `1px solid ${BORDER}`, borderTop: `3px solid ${AUB2}`, borderRadius: 10, padding: "8px 12px", minWidth: 130, background: OFF }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: AUB }}>{name}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: AUB, lineHeight: 1.1 }}>{n} <span style={{ fontSize: 11, fontWeight: 600, color: GREY }}>{lang === "th" ? "ครั้ง" : (n === 1 ? "meeting" : "meetings")}</span></div>
                  {last && <div style={{ fontSize: 10, color: GREY, marginTop: 1 }}>{lang === "th" ? "ล่าสุด " : "last "}{last}</div>}
                </div>
              ); })}
          </div>
        ) : <div style={{ fontSize: 12, color: GREY }}>{lang === "th" ? "ยังไม่มีบันทึกการประชุมที่ระบุบุคคล — เพิ่มการประชุมใน Activity Log แล้วใส่ชื่อในช่อง Linked to" : "No meetings with a named person yet — log a Meeting in the Activity Log and fill in “Linked to”."}</div>}
      </div>
      <div style={{ fontSize: 13, fontWeight: 800, color: AUB, marginBottom: 8 }}>🧑‍🏫 {lang === "th" ? "ทีมที่ปรึกษา & ผู้ให้ทุน" : "Supervisory team & funder"}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 10, marginBottom: 18 }}>
        {team.map((p, i) => { const funder = /fund/i.test(p.role);
          return (
            <div key={i} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderTop: `3px solid ${funder ? GREEN : AUB}`, borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: funder ? GREEN : AUB2, textTransform: "uppercase", letterSpacing: 0.3 }}>{p.role}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: AUB, marginTop: 2 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: GREY }}>{p.org}</div>
              {p.link && <a href={p.link} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: AUB2, fontWeight: 700, textDecoration: "none", display: "inline-block", marginTop: 3 }}>{/linkedin/i.test(p.link) ? "LinkedIn" : "UCL profile"} ↗</a>}
            </div>
          ); })}
      </div>
      <div style={{ fontSize: 13, fontWeight: 800, color: AUB, marginBottom: 8 }}>🗒️ {lang === "th" ? "บันทึกการประชุมที่ปรึกษา" : "Supervision meeting log"}</div>
      <TableTab tabKey="supervisor" data={data} update={update} addRow={addRow} delRow={delRow} exportCSV={exportCSV} lang={lang} />
    </div>
  );
}

// ---- mount hook (gated by index.html passphrase screen) ----
window.mountPhDApp = function () {
  const el = document.getElementById("root");
  if (!el || el.__mounted) return;
  el.__mounted = true;
  ReactDOM.createRoot(el).render(<App />);
};
if (window.__READY_TO_MOUNT__) window.mountPhDApp();
