// // import { useEffect, useState } from "react";
// // import { useSearchParams } from "react-router-dom";
// // import {
// //   LineChart,
// //   Line,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   ResponsiveContainer,
// // } from "recharts";
// // import toast from "react-hot-toast";
// // import {
// //   getAllMembers,
// //   getBCAReadings,
// //   addBCAReading,
// // } from "../../firebase/service";
// // import BcaScanner from "../../components/BcaScanner";
// // import Tesseract from "tesseract.js";
// // // import { Html5QrcodeScanner } from "html5-qrcode";
// // // const empty = { weight: "", fat: "", muscle: "", water: "", bmi: "" };
// // const empty = {
// //   // Main
// //   weight: "",
// //   bmi: "",
// //   fat: "",
// //   muscle: "",
// //   water: "",

// //   // Advanced
// //   protein: "",
// //   bodyWaterKg: "",
// //   fatKg: "",
// //   ffm: "",
// //   abioSalt: "",

// //   // Obesity
// //   pbf: "",
// //   whr: "",
// //   visceralFat: "",

// //   // Metabolism
// //   bmr: "",
// //   bodyAge: "",
// //   healthScore: "",

// //   // Control
// //   idealWeight: "",
// //   weightControl: "",
// //   fatControl: "",
// //   muscleControl: "",

// //   // Segmental
// //   armLeftMuscle: "",
// //   armRightMuscle: "",
// //   legLeftMuscle: "",
// //   legRightMuscle: "",
// //   trunkMuscle: "",

// //   armLeftFat: "",
// //   armRightFat: "",
// //   legLeftFat: "",
// //   legRightFat: "",
// //   trunkFat: "",

// //   // Machine
// //   bodyType: "",
// //   scanTime: "",
// //   machineSerial: "",
// // };

// // export default function BCA() {
// //   const [searchParams] = useSearchParams();
// //   const [members, setMembers] = useState([]);
// //   const [selectedId, setSelectedId] = useState(
// //     searchParams.get("member") || "",
// //   );
// //   const [readings, setReadings] = useState([]);
// //   const [form, setForm] = useState(empty);
// //   const [saving, setSaving] = useState(false);
// //   const [loadingReadings, setLoadingReadings] = useState(false);
// //   const [showScanner, setShowScanner] = useState(false);
// //   const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

// //   // Load all members for selector
// //   useEffect(() => {
// //     getAllMembers().then(setMembers);
// //   }, []);

// //   // Load readings when member changes
// //   useEffect(() => {
// //     if (!selectedId) {
// //       setReadings([]);
// //       return;
// //     }
// //     setLoadingReadings(true);
// //     getBCAReadings(selectedId)
// //       .then(setReadings)
// //       .finally(() => setLoadingReadings(false));
// //   }, [selectedId]);

// //   const selectedMember = members.find((m) => m.id === selectedId);
// //   // const latest = readings[readings.length - 1];
// //   const latest = readings[0];
// //   const prev = readings[1];
// //   // const prev = readings[readings.length - 2];

// //   const diff = (key) => {
// //     if (!latest || !prev) return null;
// //     const d = parseFloat(latest[key]) - parseFloat(prev[key]);
// //     return d;
// //   };

// //   const diffLabel = (key, unit = "") => {
// //     const d = diff(key);
// //     if (d === null) return null;
// //     const positive = d > 0;
// //     const color =
// //       key === "fat" || key === "weight" || key === "bmi"
// //         ? positive
// //           ? "var(--red)"
// //           : "var(--green)"
// //         : positive
// //           ? "var(--green)"
// //           : "var(--red)";
// //     return (
// //       <span style={{ color, fontWeight: 700, fontSize: 12 }}>
// //         {positive ? "+" : ""}
// //         {d.toFixed(1)}
// //         {unit}
// //       </span>
// //     );
// //   };
// //   const handleScan = async (url) => {
// //     try {
// //       setShowScanner(false);

// //       toast.loading("Reading BCA report...");

// //       const result = await Tesseract.recognize(url, "eng");

// //       const text = result.data.text;

// //       console.log(text);

// //       // Example parsing
// //       const weight = text.match(/Weight\s*[:\-]?\s*(\d+\.?\d*)/i)?.[1];

// //       const fat = text.match(/Body Fat\s*[:\-]?\s*(\d+\.?\d*)/i)?.[1];

// //       const bmi = text.match(/BMI\s*[:\-]?\s*(\d+\.?\d*)/i)?.[1];

// //       const muscle = text.match(/Muscle\s*[:\-]?\s*(\d+\.?\d*)/i)?.[1];

// //       setForm((prev) => ({
// //         ...prev,
// //         weight: weight || "",
// //         fat: fat || "",
// //         bmi: bmi || "",
// //         muscle: muscle || "",
// //       }));

// //       toast.dismiss();
// //       toast.success("BCA data auto-filled!");
// //     } catch (err) {
// //       console.error(err);

// //       toast.dismiss();
// //       toast.error("Failed to read BCA report.");
// //     }
// //   };
// //   const handleSave = async (e) => {
// //     e.preventDefault();
// //     if (!selectedId) {
// //       toast.error("Select a member first.");
// //       return;
// //     }
// //     if (!form.weight) {
// //       toast.error("Weight is required.");
// //       return;
// //     }
// //     setSaving(true);
// //     try {
// //       const today = new Date().toISOString().split("T")[0];
// //       // await addBCAReading({
// //       //   memberId: selectedId,
// //       //   memberName: selectedMember?.name || "",
// //       //   date: today,
// //       //   weight: parseFloat(form.weight),
// //       //   fat: parseFloat(form.fat) || 0,
// //       //   muscle: parseFloat(form.muscle) || 0,
// //       //   water: parseFloat(form.water) || 0,
// //       //   bmi: parseFloat(form.bmi) || 0,
// //       // });
// //       await addBCAReading({
// //         memberId: selectedId,
// //         memberName: selectedMember?.name || "",

// //         date: today,

// //         ...Object.fromEntries(
// //           Object.entries(form).map(([k, v]) => [
// //             k,
// //             v === "" ? "" : Number(v) || v,
// //           ]),
// //         ),
// //       });

// //       toast.success("BCA reading saved! 📊");
// //       setForm(empty);
// //       // Refresh readings
// //       const updated = await getBCAReadings(selectedId);
// //       setReadings(updated);
// //     } catch (err) {
// //       console.error(err);
// //       toast.error("Failed to save. Check Firebase connection.");
// //     } finally {
// //       setSaving(false);
// //     }
// //   };

// //   const chartData = readings.map((r) => ({
// //     date: r.date,
// //     Weight: r.weight,
// //     "Body Fat %": r.fat,
// //     Muscle: r.muscle,
// //   }));

// //   const initials = (name) =>
// //     name
// //       ? name
// //           .split(" ")
// //           .map((n) => n[0])
// //           .join("")
// //           .slice(0, 2)
// //           .toUpperCase()
// //       : "?";
// //    useEffect(() => {
// //   if (!selectedMember) return;

// //   setForm((prev) => ({
// //     ...prev,
// //     weight: prev.weight || selectedMember.weight || "",
// //     height: prev.height || selectedMember.height || "",
// //     age: prev.age || selectedMember.age || "",
// //     gender: prev.gender || selectedMember.gender || "",
// //     bodyType: prev.bodyType || selectedMember.bodyType || "",
// //   }));
// // }, [selectedMember]);   
// // const Input = ({ label, name, required = false }) => (
// //   <div className="form-group">
// //     <label className="form-label">{label}</label>

// //     <input
// //       className="form-input"
// //       type="number"
// //       step="0.1"
// //       placeholder={latest?.[name] || ""}
// //       value={form[name]}
// //       required={required}
// //       onChange={(e) => set(name, e.target.value)}
// //     />
// //   </div>
// // );
// //   return (
// //     <>
// //       <div className="topbar">
// //         <div className="page-title">BCA — Body Analysis</div>
// //         <div className="topbar-right">
// //           <select
// //             className="form-input"
// //             style={{ width: 220, fontSize: 13 }}
// //             value={selectedId}
// //             onChange={(e) => setSelectedId(e.target.value)}
// //           >
// //             <option value="">— Select a member —</option>
// //             {members.map((m) => (
// //               <option key={m.id} value={m.id}>
// //                 {m.name} · {m.phone}
// //               </option>
// //             ))}
// //           </select>
// //         </div>
// //       </div>

// //       <div className="page-body">
// //         {!selectedId ? (
// //           <div
// //             style={{
// //               textAlign: "center",
// //               padding: "60px 20px",
// //               color: "var(--muted)",
// //             }}
// //           >
// //             <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
// //             <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
// //               Select a Member
// //             </div>
// //             <div style={{ fontSize: 13 }}>
// //               Choose a member from the dropdown above to view and log their BCA
// //               readings.
// //             </div>
// //           </div>
// //         ) : (
// //           <>
// //             {/* Member profile bar */}
// //             {selectedMember && (
// //               <div className="profile-header mb-16">
// //                 <div className="avatar">{initials(selectedMember.name)}</div>
// //                 <div>
// //                   <div className="profile-name">{selectedMember.name}</div>
// //                   <div className="profile-meta">
// //                     {selectedMember.phone} · {selectedMember.plan} · Goal:{" "}
// //                     {selectedMember.goal}
// //                   </div>
// //                   <div className="profile-tags">
// //                     {latest?.bodyType && (
// //                       <span className="badge badge-purple">
// //                         {latest.bodyType}
// //                       </span>
// //                     )}

// //                     <span className="badge badge-orange">
// //                       {selectedMember.goal}
// //                     </span>
// //                     <span className="badge badge-green">
// //                       {selectedMember.status || "Active"}
// //                     </span>
// //                     <span className="badge badge-blue">
// //                       {readings.length} readings
// //                     </span>
// //                   </div>
// //                 </div>
// //                 {latest && (
// //                   <div style={{ marginLeft: "auto", textAlign: "right" }}>
// //                     <div
// //                       style={{
// //                         fontSize: 11,
// //                         color: "var(--muted)",
// //                         marginBottom: 4,
// //                       }}
// //                     >
// //                       Last Reading
// //                     </div>
// //                     <div
// //                       style={{
// //                         fontSize: 13,
// //                         fontWeight: 600,
// //                         color: "var(--orange)",
// //                       }}
// //                     >
// //                       {latest.date}
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>
// //             )}

// //             {loadingReadings ? (
// //               <div
// //                 style={{
// //                   textAlign: "center",
// //                   padding: 40,
// //                   color: "var(--muted)",
// //                 }}
// //               >
// //                 Loading readings…
// //               </div>
// //             ) : (
// //               <>
// //                 {/* Latest stats */}
// //                 {latest && (
// //                   <>
// //                     <div className="stats-grid mb-16">
// //                       <div className="stat-card s-red">
// //                         <div className="stat-label">Weight</div>
// //                         <div className="stat-value c-red">
// //                           {latest.weight} kg
// //                         </div>
// //                         <div className="stat-sub">
// //                           {diffLabel("weight", " kg")} vs prev
// //                         </div>
// //                       </div>

// //                       <div className="stat-card s-orange">
// //                         <div className="stat-label">BMI</div>
// //                         <div className="stat-value c-orange">
// //                           {latest.bmi || "—"}
// //                         </div>
// //                         <div className="stat-sub">{diffLabel("bmi")}</div>
// //                       </div>

// //                       <div className="stat-card s-green">
// //                         <div className="stat-label">Muscle</div>
// //                         <div className="stat-value c-green">
// //                           {latest.muscle} kg
// //                         </div>
// //                         <div className="stat-sub">
// //                           {diffLabel("muscle", " kg")}
// //                         </div>
// //                       </div>

// //                       <div className="stat-card s-gold">
// //                         <div className="stat-label">Body Fat</div>
// //                         <div className="stat-value c-gold">{latest.fat}%</div>
// //                         <div className="stat-sub">{diffLabel("fat", "%")}</div>
// //                       </div>

// //                       <div className="stat-card s-blue">
// //                         <div className="stat-label">Visceral Fat</div>
// //                         <div className="stat-value c-blue">
// //                           {latest.visceralFat || "—"}
// //                         </div>
// //                       </div>

// //                       <div className="stat-card s-purple">
// //                         <div className="stat-label">BMR</div>
// //                         <div className="stat-value">{latest.bmr || "—"}</div>
// //                         <div className="stat-sub">kcal/day</div>
// //                       </div>

// //                       <div className="stat-card s-green">
// //                         <div className="stat-label">Health Score</div>
// //                         <div className="stat-value c-green">
// //                           {latest.healthScore || "—"}
// //                         </div>
// //                       </div>

// //                       <div className="stat-card s-orange">
// //                         <div className="stat-label">Physical Age</div>
// //                         <div className="stat-value c-orange">
// //                           {latest.bodyAge || "—"}
// //                         </div>
// //                       </div>
// //                     </div>

// //                     <div className="grid-2 mb-16">
// //                       {/* Composition bars */}
// //                       <div className="card">
// //                         <div className="card-title">Body Composition</div>

// //                         <div className="card">
// //                           <div className="card-title">Advanced Metrics</div>

// //                           <div className="metrics-grid">
// //                             <div className="metric-item">
// //                               <span>Protein</span>
// //                               <strong>{latest.protein || 0} kg</strong>
// //                             </div>

// //                             <div className="metric-item">
// //                               <span>FFM</span>
// //                               <strong>{latest.ffm || 0} kg</strong>
// //                             </div>

// //                             <div className="metric-item">
// //                               <span>PBF</span>
// //                               <strong>{latest.pbf || 0}%</strong>
// //                             </div>

// //                             <div className="metric-item">
// //                               <span>WHR</span>
// //                               <strong>{latest.whr || 0}</strong>
// //                             </div>

// //                             <div className="metric-item">
// //                               <span>Ideal Weight</span>
// //                               <strong>{latest.idealWeight || 0} kg</strong>
// //                             </div>

// //                             <div className="metric-item">
// //                               <span>Water</span>
// //                               <strong>{latest.water || 0}%</strong>
// //                             </div>
// //                           </div>
// //                         </div>

// //                         <div className="bca-bar-wrap">
// //                           <div className="bca-label-row">
// //                             <span className="label">Body Fat %</span>
// //                             <span
// //                               style={{
// //                                 color: "var(--orange)",
// //                                 fontWeight: 600,
// //                               }}
// //                             >
// //                               {latest.fat}%
// //                             </span>
// //                           </div>
// //                           <div className="bca-track">
// //                             <div
// //                               className="bca-fill fat"
// //                               style={{ width: `${Math.min(latest.fat, 100)}%` }}
// //                             ></div>
// //                           </div>
// //                         </div>
// //                         <div className="bca-bar-wrap">
// //                           <div className="bca-label-row">
// //                             <span className="label">Muscle (% of body wt)</span>
// //                             <span
// //                               style={{ color: "var(--blue)", fontWeight: 600 }}
// //                             >
// //                               {latest.weight
// //                                 ? (
// //                                     (latest.muscle / latest.weight) *
// //                                     100
// //                                   ).toFixed(1)
// //                                 : 0}
// //                               %
// //                             </span>
// //                           </div>
// //                           <div className="bca-track">
// //                             <div
// //                               className="bca-fill muscle"
// //                               style={{
// //                                 width: `${latest.weight ? Math.min((latest.muscle / latest.weight) * 100, 100) : 0}%`,
// //                               }}
// //                             ></div>
// //                           </div>
// //                         </div>
// //                         <div className="bca-bar-wrap">
// //                           <div className="bca-label-row">
// //                             <span className="label">Body Water %</span>
// //                             <span
// //                               style={{ color: "var(--green)", fontWeight: 600 }}
// //                             >
// //                               {latest.water}%
// //                             </span>
// //                           </div>
// //                           <div className="bca-track">
// //                             <div
// //                               className="bca-fill water"
// //                               style={{
// //                                 width: `${Math.min(latest.water, 100)}%`,
// //                               }}
// //                             ></div>
// //                           </div>
// //                         </div>
// //                         <div className="bca-bar-wrap">
// //                           <div className="bca-label-row">
// //                             <span className="label">BMI (out of 35)</span>
// //                             <span
// //                               style={{ color: "var(--gold)", fontWeight: 600 }}
// //                             >
// //                               {latest.bmi}
// //                             </span>
// //                           </div>
// //                           <div className="bca-track">
// //                             <div
// //                               className="bca-fill bmi"
// //                               style={{
// //                                 width: `${Math.min((latest.bmi / 35) * 100, 100)}%`,
// //                               }}
// //                             ></div>
// //                           </div>
// //                         </div>
// //                       </div>

// //                       {/* Progress chart */}
// //                       <div className="card">
// //                         <div className="card-title">Progress Chart</div>
// //                         {readings.length < 2 ? (
// //                           <div
// //                             style={{
// //                               height: 180,
// //                               display: "flex",
// //                               alignItems: "center",
// //                               justifyContent: "center",
// //                               color: "var(--muted)",
// //                               fontSize: 13,
// //                             }}
// //                           >
// //                             Add at least 2 readings to see the chart.
// //                           </div>
// //                         ) : (
// //                           <>
// //                             <ResponsiveContainer width="100%" height={180}>
// //                               <LineChart
// //                                 data={chartData}
// //                                 margin={{
// //                                   top: 0,
// //                                   right: 0,
// //                                   left: -30,
// //                                   bottom: 0,
// //                                 }}
// //                               >
// //                                 <XAxis
// //                                   dataKey="date"
// //                                   tick={{ fill: "#888", fontSize: 10 }}
// //                                   axisLine={false}
// //                                   tickLine={false}
// //                                 />
// //                                 <YAxis
// //                                   tick={{ fill: "#888", fontSize: 10 }}
// //                                   axisLine={false}
// //                                   tickLine={false}
// //                                 />
// //                                 <Tooltip
// //                                   contentStyle={{
// //                                     background: "#1a1a1a",
// //                                     border: "1px solid #2a2a2a",
// //                                     borderRadius: 6,
// //                                     fontSize: 12,
// //                                   }}
// //                                 />
// //                                 <Line
// //                                   type="monotone"
// //                                   dataKey="Weight"
// //                                   stroke="#f47c20"
// //                                   strokeWidth={2}
// //                                   dot={{ r: 3 }}
// //                                 />
// //                                 <Line
// //                                   type="monotone"
// //                                   dataKey="Muscle"
// //                                   stroke="#22c55e"
// //                                   strokeWidth={2}
// //                                   dot={{ r: 3 }}
// //                                 />
// //                                 <Line
// //                                   type="monotone"
// //                                   dataKey="Body Fat %"
// //                                   stroke="#e63329"
// //                                   strokeWidth={2}
// //                                   dot={{ r: 3 }}
// //                                   strokeDasharray="4 2"
// //                                 />
// //                               </LineChart>
// //                             </ResponsiveContainer>
// //                             <div
// //                               style={{
// //                                 display: "flex",
// //                                 gap: 16,
// //                                 justifyContent: "center",
// //                                 marginTop: 8,
// //                               }}
// //                             >
// //                               <span
// //                                 style={{ fontSize: 11, color: "var(--orange)" }}
// //                               >
// //                                 ● Weight
// //                               </span>
// //                               <span
// //                                 style={{ fontSize: 11, color: "var(--green)" }}
// //                               >
// //                                 ● Muscle
// //                               </span>
// //                               <span
// //                                 style={{ fontSize: 11, color: "var(--red)" }}
// //                               >
// //                                 ● Body Fat
// //                               </span>
// //                             </div>
// //                           </>
// //                         )}
// //                       </div>
// //                     </div>
// //                     <button
// //                       type="button"
// //                       className="btn btn-secondary"
// //                       onClick={() => setShowScanner(true)}
// //                       style={{ marginBottom: 12 }}
// //                     >
// //                       📷 Scan BCA QR
// //                     </button>
// //                     {showScanner && (
// //                       <div className="card mb-16">
// //                         <BcaScanner onScan={handleScan} />
// //                       </div>
// //                     )}
// //                     {/* History table */}
// //                     {readings.length > 0 && (
// //                       <>
// //                         <div className="section-header mb-12">
// //                           <div className="section-title">
// //                             Reading History ({readings.length})
// //                           </div>
// //                         </div>
// //                         <div className="table-wrap mb-20">
// //                           <table>
// //                             {/* <thead><tr><th>Date</th><th>Weight (kg)</th><th>Body Fat %</th><th>Muscle (kg)</th><th>Water %</th><th>BMI</th></tr></thead> */}

// //                             <thead>
// //                               <tr>
// //                                 <th>Date</th>
// //                                 <th>Weight</th>
// //                                 <th>Fat%</th>
// //                                 <th>Muscle</th>
// //                                 <th>BMI</th>
// //                                 <th>Visceral</th>
// //                                 <th>BMR</th>
// //                                 <th>Age</th>
// //                                 <th>Score</th>
// //                               </tr>
// //                             </thead>

// //                             <tbody>
// //                               {[...readings].reverse().map((r) => (
// //                                 <tr key={r.id}>
// //                                   <td>{r.date}</td>

// //                                   <td>{r.weight || "—"}</td>

// //                                   <td>{r.fat || "—"}</td>

// //                                   <td>{r.muscle || "—"}</td>

// //                                   <td>{r.bmi || "—"}</td>

// //                                   <td>{r.visceralFat || "—"}</td>

// //                                   <td>{r.bmr || "—"}</td>

// //                                   <td>{r.bodyAge || "—"}</td>

// //                                   <td>{r.healthScore || "—"}</td>
// //                                 </tr>
// //                               ))}
// //                             </tbody>
// //                           </table>
// //                         </div>
// //                       </>
// //                     )}
// //                   </>
// //                 )}

// //                 {/* <div className="section-header mb-12">
// //                   <div className="section-title">Log New BCA Reading</div>
// //                 </div> */}
// // <div className="section-header mb-12">
// //   <div className="section-title">Log New BCA Reading</div>
// // </div>

// // <div className="card">
// //   <form onSubmit={handleSave}>
// //     <div className="form-row">
// //       <Input label="Weight (kg) *" name="weight" required />
// //       <Input label="BMI" name="bmi" />
// //     </div>

// //     <div className="form-row">
// //       <Input label="Body Fat %" name="fat" />
// //       <Input label="Muscle Mass (kg)" name="muscle" />
// //     </div>

// //     <div className="form-row">
// //       <Input label="Body Water %" name="water" />
// //       <Input label="Protein" name="protein" />
// //     </div>

// //     <div className="form-row">
// //       <Input label="Body Water KG" name="bodyWaterKg" />
// //       <Input label="Fat Mass KG" name="fatKg" />
// //     </div>

// //     <div className="form-row">
// //       <Input label="FFM" name="ffm" />
// //       <Input label="Minerals / Abio Salt" name="abioSalt" />
// //     </div>

// //     <div className="form-row">
// //       <Input label="PBF" name="pbf" />
// //       <Input label="WHR" name="whr" />
// //     </div>

// //     <div className="form-row">
// //       <Input label="Visceral Fat" name="visceralFat" />
// //       <Input label="BMR" name="bmr" />
// //     </div>

// //     <div className="form-row">
// //       <Input label="Physical Age" name="bodyAge" />
// //       <Input label="Health Score" name="healthScore" />
// //     </div>

// //     <div className="form-row">
// //       <Input label="Ideal Weight" name="idealWeight" />
// //       <Input label="Weight Control" name="weightControl" />
// //     </div>

// //     <div className="form-row">
// //       <Input label="Fat Control" name="fatControl" />
// //       <Input label="Muscle Control" name="muscleControl" />
// //     </div>

// //     <div className="section-header mb-12">
// //       <div className="section-title">Segmental Muscle</div>
// //     </div>

// //     <div className="form-row">
// //       <Input label="Left Arm Muscle" name="armLeftMuscle" />
// //       <Input label="Right Arm Muscle" name="armRightMuscle" />
// //     </div>

// //     <div className="form-row">
// //       <Input label="Left Leg Muscle" name="legLeftMuscle" />
// //       <Input label="Right Leg Muscle" name="legRightMuscle" />
// //     </div>

// //     <div className="form-row">
// //       <Input label="Trunk Muscle" name="trunkMuscle" />
// //     </div>

// //     <div className="section-header mb-12">
// //       <div className="section-title">Segmental Fat</div>
// //     </div>

// //     <div className="form-row">
// //       <Input label="Left Arm Fat" name="armLeftFat" />
// //       <Input label="Right Arm Fat" name="armRightFat" />
// //     </div>

// //     <div className="form-row">
// //       <Input label="Left Leg Fat" name="legLeftFat" />
// //       <Input label="Right Leg Fat" name="legRightFat" />
// //     </div>

// //     <div className="form-row">
// //       <Input label="Trunk Fat" name="trunkFat" />
// //     </div>

// //     <div className="section-header mb-12">
// //       <div className="section-title">Machine Details</div>
// //     </div>

// //     <div className="form-row">
// //       <div className="form-group">
// //         <label className="form-label">Body Type</label>
// //         <input
// //           className="form-input"
// //           type="text"
// //           placeholder={latest?.bodyType || "Athletic / Standard / Obese"}
// //           value={form.bodyType}
// //           onChange={(e) => set("bodyType", e.target.value)}
// //         />
// //       </div>

// //       <div className="form-group">
// //         <label className="form-label">Scan Time</label>
// //         <input
// //           className="form-input"
// //           type="text"
// //           placeholder={latest?.scanTime || "10:30 AM"}
// //           value={form.scanTime}
// //           onChange={(e) => set("scanTime", e.target.value)}
// //         />
// //       </div>
// //     </div>

// //     <div className="form-row">
// //       <div className="form-group">
// //         <label className="form-label">Machine Serial</label>
// //         <input
// //           className="form-input"
// //           type="text"
// //           placeholder={latest?.machineSerial || "Machine serial no."}
// //           value={form.machineSerial}
// //           onChange={(e) => set("machineSerial", e.target.value)}
// //         />
// //       </div>
// //     </div>

// //     <button
// //       type="submit"
// //       className="btn btn-primary"
// //       disabled={saving}
// //       style={{ width: "100%" }}
// //     >
// //       {saving ? "Saving…" : "📊 Save Full BCA Reading"}
// //     </button>
// //   </form>
// // </div>
                

// //               </>
// //             )}
// //           </>
// //         )}
// //       </div>
// //     </>
// //   );
// // }


// import { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";
// import toast from "react-hot-toast";
// import { doc, updateDoc } from "firebase/firestore";

// import {
//   getAllMembers,
//   getBCAReadings,
//   addBCAReading,
// } from "../../firebase/service";

// import { db } from "../../firebase/config";
// import BcaScanner from "../../components/BcaScanner";
// import Tesseract from "tesseract.js";

// const empty = {
//   height: "",
//   age: "",
//   gender: "",

//   weight: "",
//   bmi: "",
//   fat: "",
//   muscle: "",
//   water: "",

//   protein: "",
//   bodyWaterKg: "",
//   fatKg: "",
//   ffm: "",
//   abioSalt: "",

//   pbf: "",
//   whr: "",
//   visceralFat: "",

//   bmr: "",
//   bodyAge: "",
//   healthScore: "",

//   idealWeight: "",
//   weightControl: "",
//   fatControl: "",
//   muscleControl: "",

//   armLeftMuscle: "",
//   armRightMuscle: "",
//   legLeftMuscle: "",
//   legRightMuscle: "",
//   trunkMuscle: "",

//   armLeftFat: "",
//   armRightFat: "",
//   legLeftFat: "",
//   legRightFat: "",
//   trunkFat: "",

//   bodyType: "",
//   scanTime: "",
//   machineSerial: "",
// };

// export default function BCA() {
//   const [searchParams] = useSearchParams();

//   const [members, setMembers] = useState([]);
//   const [selectedId, setSelectedId] = useState(searchParams.get("member") || "");
//   const [readings, setReadings] = useState([]);
//   const [form, setForm] = useState(empty);
//   const [saving, setSaving] = useState(false);
//   const [loadingReadings, setLoadingReadings] = useState(false);
//   const [showScanner, setShowScanner] = useState(false);

//   const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

//   useEffect(() => {
//     getAllMembers().then(setMembers);
//   }, []);

//   useEffect(() => {
//     if (!selectedId) {
//       setReadings([]);
//       setForm(empty);
//       return;
//     }

//     setLoadingReadings(true);

//     getBCAReadings(selectedId)
//       .then(setReadings)
//       .finally(() => setLoadingReadings(false));
//   }, [selectedId]);

//   const selectedMember = members.find((m) => m.id === selectedId);
//   const latest = readings[0];
//   const prev = readings[1];

//   useEffect(() => {
//     if (!selectedMember) return;

//     setForm((prev) => ({
//       ...prev,

//       height: prev.height || selectedMember.height || "",
//       age: prev.age || selectedMember.age || "",
//       gender: prev.gender || selectedMember.gender || "",

//       weight: prev.weight || selectedMember.weight || "",
//       bodyType: prev.bodyType || selectedMember.bodyType || "",
//     }));
//   }, [selectedMember]);

//   const diff = (key) => {
//     if (!latest || !prev) return null;

//     const a = Number(latest[key]);
//     const b = Number(prev[key]);

//     if (Number.isNaN(a) || Number.isNaN(b)) return null;

//     return a - b;
//   };

//   const diffLabel = (key, unit = "") => {
//     const d = diff(key);
//     if (d === null) return null;

//     const positive = d > 0;

//     const color =
//       key === "fat" || key === "weight" || key === "bmi"
//         ? positive
//           ? "var(--red)"
//           : "var(--green)"
//         : positive
//           ? "var(--green)"
//           : "var(--red)";

//     return (
//       <span style={{ color, fontWeight: 700, fontSize: 12 }}>
//         {positive ? "+" : ""}
//         {d.toFixed(1)}
//         {unit}
//       </span>
//     );
//   };

//   const handleScan = async (url) => {
//     try {
//       setShowScanner(false);
//       toast.loading("Reading BCA report...");

//       const result = await Tesseract.recognize(url, "eng");
//       const text = result.data.text;

//       const weight = text.match(/Weight\s*[:\-]?\s*(\d+\.?\d*)/i)?.[1];
//       const fat = text.match(/Body Fat\s*[:\-]?\s*(\d+\.?\d*)/i)?.[1];
//       const bmi = text.match(/BMI\s*[:\-]?\s*(\d+\.?\d*)/i)?.[1];
//       const muscle = text.match(/Muscle\s*[:\-]?\s*(\d+\.?\d*)/i)?.[1];

//       setForm((prev) => ({
//         ...prev,
//         weight: weight || prev.weight,
//         fat: fat || prev.fat,
//         bmi: bmi || prev.bmi,
//         muscle: muscle || prev.muscle,
//       }));

//       toast.dismiss();
//       toast.success("BCA data auto-filled!");
//     } catch (err) {
//       console.error(err);
//       toast.dismiss();
//       toast.error("Failed to read BCA report.");
//     }
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();

//     if (!selectedId) {
//       toast.error("Select a member first.");
//       return;
//     }

//     if (!form.weight) {
//       toast.error("Weight is required.");
//       return;
//     }

//     setSaving(true);

//     try {
//       const today = new Date().toISOString().split("T")[0];

//       const cleanedForm = Object.fromEntries(
//         Object.entries(form).map(([k, v]) => [
//           k,
//           v === "" ? "" : Number(v) || v,
//         ])
//       );

//       await addBCAReading({
//         memberId: selectedId,
//         memberName: selectedMember?.name || "",
//         date: today,
//         ...cleanedForm,
//       });

//       await updateDoc(doc(db, "members", selectedId), {
//         height: form.height || "",
//         age: form.age || "",
//         gender: form.gender || "",
//         weight: form.weight || "",
//         bodyType: form.bodyType || "",
//         updatedAt: new Date(),
//       });

//       toast.success("BCA reading saved and member profile updated! 📊");

//       setForm(empty);

//       const updated = await getBCAReadings(selectedId);
//       setReadings(updated);

//       const updatedMembers = await getAllMembers();
//       setMembers(updatedMembers);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to save. Check Firebase connection.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const chartData = readings.map((r) => ({
//     date: r.date,
//     Weight: r.weight,
//     "Body Fat %": r.fat,
//     Muscle: r.muscle,
//   }));

//   const initials = (name) =>
//     name
//       ? name
//           .split(" ")
//           .map((n) => n[0])
//           .join("")
//           .slice(0, 2)
//           .toUpperCase()
//       : "?";

//   const Input = ({ label, name, required = false, type = "number" }) => (
//     <div className="form-group">
//       <label className="form-label">{label}</label>

//       <input
//         className="form-input"
//         type={type}
//         step={type === "number" ? "0.1" : undefined}
//         placeholder={latest?.[name] || selectedMember?.[name] || ""}
//         value={form[name] || ""}
//         required={required}
//         onChange={(e) => set(name, e.target.value)}
//       />
//     </div>
//   );

//   return (
//     <>
//       <div className="topbar">
//         <div className="page-title">BCA — Body Analysis</div>

//         <div className="topbar-right">
//           <select
//             className="form-input"
//             style={{ width: 220, fontSize: 13 }}
//             value={selectedId}
//             onChange={(e) => setSelectedId(e.target.value)}
//           >
//             <option value="">— Select a member —</option>

//             {members.map((m) => (
//               <option key={m.id} value={m.id}>
//                 {m.name} · {m.phone}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="page-body">
//         {!selectedId ? (
//           <div
//             style={{
//               textAlign: "center",
//               padding: "60px 20px",
//               color: "var(--muted)",
//             }}
//           >
//             <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
//             <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
//               Select a Member
//             </div>
//             <div style={{ fontSize: 13 }}>
//               Choose a member from the dropdown above to view and log their BCA
//               readings.
//             </div>
//           </div>
//         ) : (
//           <>
//             {selectedMember && (
//               <div className="profile-header mb-16">
//                 <div className="avatar">{initials(selectedMember.name)}</div>

//                 <div>
//                   <div className="profile-name">{selectedMember.name}</div>

//                   <div className="profile-meta">
//                     {selectedMember.phone} · {selectedMember.plan} · Goal:{" "}
//                     {selectedMember.goal}
//                   </div>

//                   <div className="profile-tags">
//                     {latest?.bodyType && (
//                       <span className="badge badge-purple">
//                         {latest.bodyType}
//                       </span>
//                     )}

//                     <span className="badge badge-orange">
//                       {selectedMember.goal}
//                     </span>

//                     <span className="badge badge-green">
//                       {selectedMember.status || "Active"}
//                     </span>

//                     <span className="badge badge-blue">
//                       {readings.length} readings
//                     </span>
//                   </div>
//                 </div>

//                 {latest && (
//                   <div style={{ marginLeft: "auto", textAlign: "right" }}>
//                     <div
//                       style={{
//                         fontSize: 11,
//                         color: "var(--muted)",
//                         marginBottom: 4,
//                       }}
//                     >
//                       Last Reading
//                     </div>

//                     <div
//                       style={{
//                         fontSize: 13,
//                         fontWeight: 600,
//                         color: "var(--orange)",
//                       }}
//                     >
//                       {latest.date}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {loadingReadings ? (
//               <div
//                 style={{
//                   textAlign: "center",
//                   padding: 40,
//                   color: "var(--muted)",
//                 }}
//               >
//                 Loading readings…
//               </div>
//             ) : (
//               <>
//                 {latest && (
//                   <>
//                     <div className="stats-grid mb-16">
//                       <div className="stat-card s-red">
//                         <div className="stat-label">Weight</div>
//                         <div className="stat-value c-red">
//                           {latest.weight || "—"} kg
//                         </div>
//                         <div className="stat-sub">
//                           {diffLabel("weight", " kg")} vs prev
//                         </div>
//                       </div>

//                       <div className="stat-card s-orange">
//                         <div className="stat-label">BMI</div>
//                         <div className="stat-value c-orange">
//                           {latest.bmi || "—"}
//                         </div>
//                         <div className="stat-sub">{diffLabel("bmi")}</div>
//                       </div>

//                       <div className="stat-card s-green">
//                         <div className="stat-label">Muscle</div>
//                         <div className="stat-value c-green">
//                           {latest.muscle || "—"} kg
//                         </div>
//                         <div className="stat-sub">
//                           {diffLabel("muscle", " kg")}
//                         </div>
//                       </div>

//                       <div className="stat-card s-gold">
//                         <div className="stat-label">Body Fat</div>
//                         <div className="stat-value c-gold">
//                           {latest.fat || "—"}%
//                         </div>
//                         <div className="stat-sub">{diffLabel("fat", "%")}</div>
//                       </div>

//                       <div className="stat-card s-blue">
//                         <div className="stat-label">Visceral Fat</div>
//                         <div className="stat-value c-blue">
//                           {latest.visceralFat || "—"}
//                         </div>
//                       </div>

//                       <div className="stat-card s-purple">
//                         <div className="stat-label">BMR</div>
//                         <div className="stat-value">{latest.bmr || "—"}</div>
//                         <div className="stat-sub">kcal/day</div>
//                       </div>

//                       <div className="stat-card s-green">
//                         <div className="stat-label">Health Score</div>
//                         <div className="stat-value c-green">
//                           {latest.healthScore || "—"}
//                         </div>
//                       </div>

//                       <div className="stat-card s-orange">
//                         <div className="stat-label">Physical Age</div>
//                         <div className="stat-value c-orange">
//                           {latest.bodyAge || "—"}
//                         </div>
//                       </div>
//                     </div>

//                     <div className="grid-2 mb-16">
//                       <div className="card">
//                         <div className="card-title">Body Composition</div>

//                         <div className="card">
//                           <div className="card-title">Key Metrics</div>

//                           <div className="metrics-grid">
//                             <div className="metric-item">
//                               <span>Health Score</span>
//                               <strong>{latest.healthScore || "—"}</strong>
//                             </div>

//                             <div className="metric-item">
//                               <span>Ideal Weight</span>
//                               <strong>{latest.idealWeight || "—"} kg</strong>
//                             </div>

//                             <div className="metric-item">
//                               <span>Visceral Fat</span>
//                               <strong>{latest.visceralFat || "—"}</strong>
//                             </div>

//                             <div className="metric-item">
//                               <span>Body Age</span>
//                               <strong>{latest.bodyAge || "—"}</strong>
//                             </div>

//                             <div className="metric-item">
//                               <span>Protein</span>
//                               <strong>{latest.protein || "—"}</strong>
//                             </div>

//                             <div className="metric-item">
//                               <span>BMR</span>
//                               <strong>{latest.bmr || "—"} kcal</strong>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="bca-bar-wrap">
//                           <div className="bca-label-row">
//                             <span className="label">Body Fat %</span>
//                             <span
//                               style={{
//                                 color: "var(--orange)",
//                                 fontWeight: 600,
//                               }}
//                             >
//                               {latest.fat || 0}%
//                             </span>
//                           </div>

//                           <div className="bca-track">
//                             <div
//                               className="bca-fill fat"
//                               style={{
//                                 width: `${Math.min(
//                                   Number(latest.fat || 0),
//                                   100
//                                 )}%`,
//                               }}
//                             />
//                           </div>
//                         </div>

//                         <div className="bca-bar-wrap">
//                           <div className="bca-label-row">
//                             <span className="label">Muscle (% of body wt)</span>
//                             <span
//                               style={{ color: "var(--blue)", fontWeight: 600 }}
//                             >
//                               {latest.weight
//                                 ? (
//                                     (Number(latest.muscle || 0) /
//                                       Number(latest.weight || 1)) *
//                                     100
//                                   ).toFixed(1)
//                                 : 0}
//                               %
//                             </span>
//                           </div>

//                           <div className="bca-track">
//                             <div
//                               className="bca-fill muscle"
//                               style={{
//                                 width: `${
//                                   latest.weight
//                                     ? Math.min(
//                                         (Number(latest.muscle || 0) /
//                                           Number(latest.weight || 1)) *
//                                           100,
//                                         100
//                                       )
//                                     : 0
//                                 }%`,
//                               }}
//                             />
//                           </div>
//                         </div>

//                         <div className="bca-bar-wrap">
//                           <div className="bca-label-row">
//                             <span className="label">Body Water %</span>
//                             <span
//                               style={{ color: "var(--green)", fontWeight: 600 }}
//                             >
//                               {latest.water || 0}%
//                             </span>
//                           </div>

//                           <div className="bca-track">
//                             <div
//                               className="bca-fill water"
//                               style={{
//                                 width: `${Math.min(
//                                   Number(latest.water || 0),
//                                   100
//                                 )}%`,
//                               }}
//                             />
//                           </div>
//                         </div>

//                         <div className="bca-bar-wrap">
//                           <div className="bca-label-row">
//                             <span className="label">BMI</span>
//                             <span
//                               style={{ color: "var(--gold)", fontWeight: 600 }}
//                             >
//                               {latest.bmi || "—"}
//                             </span>
//                           </div>

//                           <div className="bca-track">
//                             <div
//                               className="bca-fill bmi"
//                               style={{
//                                 width: `${Math.min(
//                                   (Number(latest.bmi || 0) / 35) * 100,
//                                   100
//                                 )}%`,
//                               }}
//                             />
//                           </div>
//                         </div>
//                       </div>

//                       <div className="card">
//                         <div className="card-title">Progress Chart</div>

//                         {readings.length < 2 ? (
//                           <div
//                             style={{
//                               height: 180,
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                               color: "var(--muted)",
//                               fontSize: 13,
//                             }}
//                           >
//                             Add at least 2 readings to see the chart.
//                           </div>
//                         ) : (
//                           <>
//                             <ResponsiveContainer width="100%" height={180}>
//                               <LineChart
//                                 data={chartData}
//                                 margin={{
//                                   top: 0,
//                                   right: 0,
//                                   left: -30,
//                                   bottom: 0,
//                                 }}
//                               >
//                                 <XAxis
//                                   dataKey="date"
//                                   tick={{ fill: "#888", fontSize: 10 }}
//                                   axisLine={false}
//                                   tickLine={false}
//                                 />
//                                 <YAxis
//                                   tick={{ fill: "#888", fontSize: 10 }}
//                                   axisLine={false}
//                                   tickLine={false}
//                                 />
//                                 <Tooltip
//                                   contentStyle={{
//                                     background: "#1a1a1a",
//                                     border: "1px solid #2a2a2a",
//                                     borderRadius: 6,
//                                     fontSize: 12,
//                                   }}
//                                 />
//                                 <Line
//                                   type="monotone"
//                                   dataKey="Weight"
//                                   stroke="#f47c20"
//                                   strokeWidth={2}
//                                   dot={{ r: 3 }}
//                                 />
//                                 <Line
//                                   type="monotone"
//                                   dataKey="Muscle"
//                                   stroke="#22c55e"
//                                   strokeWidth={2}
//                                   dot={{ r: 3 }}
//                                 />
//                                 <Line
//                                   type="monotone"
//                                   dataKey="Body Fat %"
//                                   stroke="#e63329"
//                                   strokeWidth={2}
//                                   dot={{ r: 3 }}
//                                   strokeDasharray="4 2"
//                                 />
//                               </LineChart>
//                             </ResponsiveContainer>

//                             <div
//                               style={{
//                                 display: "flex",
//                                 gap: 16,
//                                 justifyContent: "center",
//                                 marginTop: 8,
//                               }}
//                             >
//                               <span
//                                 style={{ fontSize: 11, color: "var(--orange)" }}
//                               >
//                                 ● Weight
//                               </span>
//                               <span
//                                 style={{ fontSize: 11, color: "var(--green)" }}
//                               >
//                                 ● Muscle
//                               </span>
//                               <span
//                                 style={{ fontSize: 11, color: "var(--red)" }}
//                               >
//                                 ● Body Fat
//                               </span>
//                             </div>
//                           </>
//                         )}
//                       </div>
//                     </div>

//                     <button
//                       type="button"
//                       className="btn btn-secondary"
//                       onClick={() => setShowScanner(true)}
//                       style={{ marginBottom: 12 }}
//                     >
//                       📷 Scan BCA QR
//                     </button>

//                     {showScanner && (
//                       <div className="card mb-16">
//                         <BcaScanner onScan={handleScan} />
//                       </div>
//                     )}

//                     {readings.length > 0 && (
//                       <>
//                         <div className="section-header mb-12">
//                           <div className="section-title">
//                             Reading History ({readings.length})
//                           </div>
//                         </div>

//                         <div className="table-wrap mb-20">
//                           <table>
//                             <thead>
//                               <tr>
//                                 <th>Date</th>
//                                 <th>Weight</th>
//                                 <th>Fat%</th>
//                                 <th>Muscle</th>
//                                 <th>BMI</th>
//                                 <th>Visceral</th>
//                                 <th>BMR</th>
//                                 <th>Age</th>
//                                 <th>Score</th>
//                               </tr>
//                             </thead>

//                             <tbody>
//                               {[...readings].reverse().map((r) => (
//                                 <tr key={r.id || r.date}>
//                                   <td>{r.date}</td>
//                                   <td>{r.weight || "—"}</td>
//                                   <td>{r.fat || "—"}</td>
//                                   <td>{r.muscle || "—"}</td>
//                                   <td>{r.bmi || "—"}</td>
//                                   <td>{r.visceralFat || "—"}</td>
//                                   <td>{r.bmr || "—"}</td>
//                                   <td>{r.bodyAge || "—"}</td>
//                                   <td>{r.healthScore || "—"}</td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       </>
//                     )}
//                   </>
//                 )}

//                 <div className="section-header mb-12">
//                   <div className="section-title">Log New Full BCA Reading</div>
//                 </div>

//                 <div className="card">
//                   <form onSubmit={handleSave}>
//                     <div className="section-header mb-12">
//                       <div className="section-title">Common Member Details</div>
//                     </div>

//                     <div className="form-row">
//                       <Input label="Height" name="height" />
//                       <Input label="Age" name="age" />
//                     </div>

//                     <div className="form-row">
//                       <Input label="Gender" name="gender" type="text" />
//                       <Input label="Body Type" name="bodyType" type="text" />
//                     </div>

//                     <div className="section-header mb-12">
//                       <div className="section-title">Main Metrics</div>
//                     </div>

//                     <div className="form-row">
//                       <Input label="Weight (kg) *" name="weight" required />
//                       <Input label="BMI" name="bmi" />
//                     </div>

//                     <div className="form-row">
//                       <Input label="Body Fat %" name="fat" />
//                       <Input label="Muscle Mass (kg)" name="muscle" />
//                     </div>

//                     <div className="form-row">
//                       <Input label="Body Water %" name="water" />
//                       <Input label="Protein" name="protein" />
//                     </div>

//                     <div className="section-header mb-12">
//                       <div className="section-title">Advanced Metrics</div>
//                     </div>

//                     <div className="form-row">
//                       <Input label="Body Water KG" name="bodyWaterKg" />
//                       <Input label="Fat Mass KG" name="fatKg" />
//                     </div>

//                     <div className="form-row">
//                       <Input label="FFM" name="ffm" />
//                       <Input label="Minerals / Abio Salt" name="abioSalt" />
//                     </div>

//                     <div className="section-header mb-12">
//                       <div className="section-title">Obesity Analysis</div>
//                     </div>

//                     <div className="form-row">
//                       <Input label="PBF" name="pbf" />
//                       <Input label="WHR" name="whr" />
//                     </div>

//                     <div className="form-row">
//                       <Input label="Visceral Fat" name="visceralFat" />
//                     </div>

//                     <div className="section-header mb-12">
//                       <div className="section-title">Metabolism</div>
//                     </div>

//                     <div className="form-row">
//                       <Input label="BMR" name="bmr" />
//                       <Input label="Physical Age" name="bodyAge" />
//                     </div>

//                     <div className="form-row">
//                       <Input label="Health Score" name="healthScore" />
//                     </div>

//                     <div className="section-header mb-12">
//                       <div className="section-title">Body Control</div>
//                     </div>

//                     <div className="form-row">
//                       <Input label="Ideal Weight" name="idealWeight" />
//                       <Input label="Weight Control" name="weightControl" />
//                     </div>

//                     <div className="form-row">
//                       <Input label="Fat Control" name="fatControl" />
//                       <Input label="Muscle Control" name="muscleControl" />
//                     </div>

//                     <div className="section-header mb-12">
//                       <div className="section-title">Segmental Muscle</div>
//                     </div>

//                     <div className="form-row">
//                       <Input label="Left Arm Muscle" name="armLeftMuscle" />
//                       <Input label="Right Arm Muscle" name="armRightMuscle" />
//                     </div>

//                     <div className="form-row">
//                       <Input label="Left Leg Muscle" name="legLeftMuscle" />
//                       <Input label="Right Leg Muscle" name="legRightMuscle" />
//                     </div>

//                     <div className="form-row">
//                       <Input label="Trunk Muscle" name="trunkMuscle" />
//                     </div>

//                     <div className="section-header mb-12">
//                       <div className="section-title">Segmental Fat</div>
//                     </div>

//                     <div className="form-row">
//                       <Input label="Left Arm Fat" name="armLeftFat" />
//                       <Input label="Right Arm Fat" name="armRightFat" />
//                     </div>

//                     <div className="form-row">
//                       <Input label="Left Leg Fat" name="legLeftFat" />
//                       <Input label="Right Leg Fat" name="legRightFat" />
//                     </div>

//                     <div className="form-row">
//                       <Input label="Trunk Fat" name="trunkFat" />
//                     </div>

//                     <div className="section-header mb-12">
//                       <div className="section-title">Machine Details</div>
//                     </div>

//                     <div className="form-row">
//                       <Input label="Scan Time" name="scanTime" type="text" />
//                       <Input
//                         label="Machine Serial"
//                         name="machineSerial"
//                         type="text"
//                       />
//                     </div>

//                     <button
//                       type="submit"
//                       className="btn btn-primary"
//                       disabled={saving}
//                       style={{ width: "100%" }}
//                     >
//                       {saving
//                         ? "Saving…"
//                         : "📊 Save BCA + Sync Member Profile"}
//                     </button>
//                   </form>
//                 </div>
//               </>
//             )}
//           </>
//         )}
//       </div>
//     </>
//   );
// }

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";
import { doc, updateDoc } from "firebase/firestore";

import {
  getAllMembers,
  getBCAReadings,
  addBCAReading,
} from "../../firebase/service";

import { db } from "../../firebase/config";
import BcaScanner from "../../components/BcaScanner";
import Tesseract from "tesseract.js";

const empty = {
  height: "",
  age: "",
  gender: "",
  goal: "",
  weight: "",
  bmi: "",

  fat: "",
  muscle: "",
  water: "",
  protein: "",
  bodyWaterKg: "",
  fatKg: "",
  ffm: "",
  abioSalt: "",

  pbf: "",
  whr: "",
  visceralFat: "",

  bmr: "",
  bodyAge: "",
  healthScore: "",

  idealWeight: "",
  weightControl: "",
  fatControl: "",
  muscleControl: "",

  armLeftMuscle: "",
  armRightMuscle: "",
  legLeftMuscle: "",
  legRightMuscle: "",
  trunkMuscle: "",

  armLeftFat: "",
  armRightFat: "",
  legLeftFat: "",
  legRightFat: "",
  trunkFat: "",

  bodyType: "",
  scanTime: "",
  machineSerial: "",
};

export default function BCA() {
  const [searchParams] = useSearchParams();

  const [members, setMembers] = useState([]);
  const [selectedId, setSelectedId] = useState(searchParams.get("member") || "");
  const [readings, setReadings] = useState([]);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [loadingReadings, setLoadingReadings] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  useEffect(() => {
    getAllMembers().then(setMembers);
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setReadings([]);
      setForm(empty);
      return;
    }

    setForm(empty);
    setLoadingReadings(true);

    getBCAReadings(selectedId)
      .then((data) => setReadings(data || []))
      .finally(() => setLoadingReadings(false));
  }, [selectedId]);

  const selectedMember = members.find((m) => m.id === selectedId);
  const latest = readings[0];
  const prev = readings[1];

  useEffect(() => {
    if (!selectedMember) return;

    setForm((prev) => ({
      ...prev,
      height: selectedMember.height || "",
      age: selectedMember.age || "",
      gender: selectedMember.gender || "",
      goal: selectedMember.goal || "",
      weight: selectedMember.weight || "",
      bmi: selectedMember.bmi || "",
      bodyType: selectedMember.bodyType || "",
    }));
  }, [selectedMember]);

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return "";
    return (Number(weight) / (Number(height) / 100) ** 2).toFixed(1);
  };

  useEffect(() => {
    const autoBmi = calculateBMI(form.weight, form.height);

    if (autoBmi && autoBmi !== form.bmi) {
      setForm((prev) => ({
        ...prev,
        bmi: autoBmi,
      }));
    }
  }, [form.weight, form.height]);

  const diff = (key) => {
    if (!latest || !prev) return null;

    const a = Number(latest[key]);
    const b = Number(prev[key]);

    if (Number.isNaN(a) || Number.isNaN(b)) return null;

    return a - b;
  };

  const diffLabel = (key, unit = "") => {
    const d = diff(key);
    if (d === null) return null;

    const positive = d > 0;

    const color =
      key === "fat" || key === "weight" || key === "bmi"
        ? positive
          ? "var(--red)"
          : "var(--green)"
        : positive
          ? "var(--green)"
          : "var(--red)";

    return (
      <span style={{ color, fontWeight: 700, fontSize: 12 }}>
        {positive ? "+" : ""}
        {d.toFixed(1)}
        {unit}
      </span>
    );
  };

  const handleScan = async (url) => {
    try {
      setShowScanner(false);
      toast.loading("Reading BCA report...");

      const result = await Tesseract.recognize(url, "eng");
      const text = result.data.text;

      const weight = text.match(/Weight\s*[:\-]?\s*(\d+\.?\d*)/i)?.[1];
      const fat = text.match(/Body Fat\s*[:\-]?\s*(\d+\.?\d*)/i)?.[1];
      const bmi = text.match(/BMI\s*[:\-]?\s*(\d+\.?\d*)/i)?.[1];
      const muscle = text.match(/Muscle\s*[:\-]?\s*(\d+\.?\d*)/i)?.[1];

      setForm((prev) => ({
        ...prev,
        weight: weight || prev.weight,
        fat: fat || prev.fat,
        bmi: bmi || prev.bmi,
        muscle: muscle || prev.muscle,
      }));

      toast.dismiss();
      toast.success("BCA data auto-filled!");
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Failed to read BCA report.");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!selectedId) {
      toast.error("Select a member first.");
      return;
    }

    if (!form.weight) {
      toast.error("Weight is required.");
      return;
    }

    setSaving(true);

    try {
      const today = new Date().toISOString().split("T")[0];

      const cleanedForm = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [
          k,
          v === "" ? "" : Number(v) || v,
        ])
      );

      await addBCAReading({
        memberId: selectedId,
        memberName: selectedMember?.name || "",
        date: today,
        ...cleanedForm,
      });

      await updateDoc(doc(db, "members", selectedId), {
        height: form.height || "",
        age: form.age || "",
        gender: form.gender || "",
        goal: form.goal || selectedMember?.goal || "",
        weight: form.weight || "",
        bmi: form.bmi || "",
        bodyType: form.bodyType || "",
        updatedAt: new Date(),
      });

      toast.success("BCA saved and member profile synced! 📊");

      setForm(empty);

      const updatedReadings = await getBCAReadings(selectedId);
      setReadings(updatedReadings || []);

      const updatedMembers = await getAllMembers();
      setMembers(updatedMembers);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save. Check Firebase connection.");
    } finally {
      setSaving(false);
    }
  };

  const chartData = readings.map((r) => ({
    date: r.date,
    Weight: Number(r.weight || 0),
    "Body Fat %": Number(r.fat || 0),
    Muscle: Number(r.muscle || 0),
  }));

  const initials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "?";

  const Input = ({ label, name, required = false, type = "number" }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>

      <input
        className="form-input"
        type={type}
        step={type === "number" ? "0.1" : undefined}
        placeholder={latest?.[name] || selectedMember?.[name] || ""}
        value={form[name] || ""}
        required={required}
        onChange={(e) => set(name, e.target.value)}
      />
    </div>
  );

  const SelectInput = ({ label, name, options = [] }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>

      <select
        className="form-input"
        value={form[name] || ""}
        onChange={(e) => set(name, e.target.value)}
      >
        <option value="">Select</option>
        {options.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <>
      <div className="topbar">
        <div className="page-title">BCA — Body Analysis</div>

        <div className="topbar-right">
          <select
            className="form-input"
            style={{ width: 220, fontSize: 13 }}
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            <option value="">— Select a member —</option>

            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} · {m.phone}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="page-body">
        {!selectedId ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "var(--muted)",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>

            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
              Select a Member
            </div>

            <div style={{ fontSize: 13 }}>
              Choose a member from the dropdown above to view and log their BCA
              readings.
            </div>
          </div>
        ) : (
          <>
            {selectedMember && (
              <div className="profile-header mb-16">
                <div className="avatar">{initials(selectedMember.name)}</div>

                <div>
                  <div className="profile-name">{selectedMember.name}</div>

                  <div className="profile-meta">
                    {selectedMember.phone} · {selectedMember.plan} · Goal:{" "}
                    {selectedMember.goal}
                  </div>

                  <div className="profile-tags">
                    {form.bodyType && (
                      <span className="badge badge-purple">
                        {form.bodyType}
                      </span>
                    )}

                    <span className="badge badge-orange">
                      {form.goal || selectedMember.goal}
                    </span>

                    <span className="badge badge-green">
                      {selectedMember.status || "Active"}
                    </span>

                    <span className="badge badge-blue">
                      {readings.length} readings
                    </span>
                  </div>
                </div>

                {latest && (
                  <div style={{ marginLeft: "auto", textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--muted)",
                        marginBottom: 4,
                      }}
                    >
                      Last Reading
                    </div>

                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--orange)",
                      }}
                    >
                      {latest.date}
                    </div>
                  </div>
                )}
              </div>
            )}

            {loadingReadings ? (
              <div
                style={{
                  textAlign: "center",
                  padding: 40,
                  color: "var(--muted)",
                }}
              >
                Loading readings…
              </div>
            ) : (
              <>
                {latest && (
                  <>
                    <div className="stats-grid mb-16">
                      <div className="stat-card s-red">
                        <div className="stat-label">Weight</div>
                        <div className="stat-value c-red">
                          {latest.weight || "—"} kg
                        </div>
                        <div className="stat-sub">
                          {diffLabel("weight", " kg")} vs prev
                        </div>
                      </div>

                      <div className="stat-card s-orange">
                        <div className="stat-label">BMI</div>
                        <div className="stat-value c-orange">
                          {latest.bmi || "—"}
                        </div>
                        <div className="stat-sub">{diffLabel("bmi")}</div>
                      </div>

                      <div className="stat-card s-green">
                        <div className="stat-label">Muscle</div>
                        <div className="stat-value c-green">
                          {latest.muscle || "—"} kg
                        </div>
                        <div className="stat-sub">
                          {diffLabel("muscle", " kg")}
                        </div>
                      </div>

                      <div className="stat-card s-gold">
                        <div className="stat-label">Body Fat</div>
                        <div className="stat-value c-gold">
                          {latest.fat || "—"}%
                        </div>
                        <div className="stat-sub">{diffLabel("fat", "%")}</div>
                      </div>

                      <div className="stat-card s-blue">
                        <div className="stat-label">Visceral Fat</div>
                        <div className="stat-value c-blue">
                          {latest.visceralFat || "—"}
                        </div>
                      </div>

                      <div className="stat-card s-purple">
                        <div className="stat-label">BMR</div>
                        <div className="stat-value">{latest.bmr || "—"}</div>
                        <div className="stat-sub">kcal/day</div>
                      </div>

                      <div className="stat-card s-green">
                        <div className="stat-label">Health Score</div>
                        <div className="stat-value c-green">
                          {latest.healthScore || "—"}
                        </div>
                      </div>

                      <div className="stat-card s-orange">
                        <div className="stat-label">Physical Age</div>
                        <div className="stat-value c-orange">
                          {latest.bodyAge || "—"}
                        </div>
                      </div>
                    </div>

                    <div className="grid-2 mb-16">
                      <div className="card">
                        <div className="card-title">Body Composition</div>

                        <div className="card mb-16">
                          <div className="card-title">Key Metrics</div>

                          <div className="metrics-grid">
                            <div className="metric-item">
                              <span>Health Score</span>
                              <strong>{latest.healthScore || "—"}</strong>
                            </div>

                            <div className="metric-item">
                              <span>Ideal Weight</span>
                              <strong>{latest.idealWeight || "—"} kg</strong>
                            </div>

                            <div className="metric-item">
                              <span>Visceral Fat</span>
                              <strong>{latest.visceralFat || "—"}</strong>
                            </div>

                            <div className="metric-item">
                              <span>Body Age</span>
                              <strong>{latest.bodyAge || "—"}</strong>
                            </div>

                            <div className="metric-item">
                              <span>Protein</span>
                              <strong>{latest.protein || "—"}</strong>
                            </div>

                            <div className="metric-item">
                              <span>BMR</span>
                              <strong>{latest.bmr || "—"} kcal</strong>
                            </div>
                          </div>
                        </div>

                        <div className="bca-bar-wrap">
                          <div className="bca-label-row">
                            <span className="label">Body Fat %</span>
                            <span
                              style={{
                                color: "var(--orange)",
                                fontWeight: 600,
                              }}
                            >
                              {latest.fat || 0}%
                            </span>
                          </div>

                          <div className="bca-track">
                            <div
                              className="bca-fill fat"
                              style={{
                                width: `${Math.min(
                                  Number(latest.fat || 0),
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="bca-bar-wrap">
                          <div className="bca-label-row">
                            <span className="label">Muscle (% of body wt)</span>
                            <span
                              style={{ color: "var(--blue)", fontWeight: 600 }}
                            >
                              {latest.weight
                                ? (
                                    (Number(latest.muscle || 0) /
                                      Number(latest.weight || 1)) *
                                    100
                                  ).toFixed(1)
                                : 0}
                              %
                            </span>
                          </div>

                          <div className="bca-track">
                            <div
                              className="bca-fill muscle"
                              style={{
                                width: `${
                                  latest.weight
                                    ? Math.min(
                                        (Number(latest.muscle || 0) /
                                          Number(latest.weight || 1)) *
                                          100,
                                        100
                                      )
                                    : 0
                                }%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="bca-bar-wrap">
                          <div className="bca-label-row">
                            <span className="label">Body Water %</span>
                            <span
                              style={{ color: "var(--green)", fontWeight: 600 }}
                            >
                              {latest.water || 0}%
                            </span>
                          </div>

                          <div className="bca-track">
                            <div
                              className="bca-fill water"
                              style={{
                                width: `${Math.min(
                                  Number(latest.water || 0),
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="bca-bar-wrap">
                          <div className="bca-label-row">
                            <span className="label">BMI</span>
                            <span
                              style={{ color: "var(--gold)", fontWeight: 600 }}
                            >
                              {latest.bmi || "—"}
                            </span>
                          </div>

                          <div className="bca-track">
                            <div
                              className="bca-fill bmi"
                              style={{
                                width: `${Math.min(
                                  (Number(latest.bmi || 0) / 35) * 100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="card">
                        <div className="card-title">Progress Chart</div>

                        {readings.length < 2 ? (
                          <div
                            style={{
                              height: 180,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "var(--muted)",
                              fontSize: 13,
                            }}
                          >
                            Add at least 2 readings to see the chart.
                          </div>
                        ) : (
                          <>
                            <ResponsiveContainer width="100%" height={180}>
                              <LineChart
                                data={chartData}
                                margin={{
                                  top: 0,
                                  right: 0,
                                  left: -30,
                                  bottom: 0,
                                }}
                              >
                                <XAxis
                                  dataKey="date"
                                  tick={{ fill: "#888", fontSize: 10 }}
                                  axisLine={false}
                                  tickLine={false}
                                />

                                <YAxis
                                  tick={{ fill: "#888", fontSize: 10 }}
                                  axisLine={false}
                                  tickLine={false}
                                />

                                <Tooltip
                                  contentStyle={{
                                    background: "#1a1a1a",
                                    border: "1px solid #2a2a2a",
                                    borderRadius: 6,
                                    fontSize: 12,
                                  }}
                                />

                                <Line
                                  type="monotone"
                                  dataKey="Weight"
                                  stroke="#f47c20"
                                  strokeWidth={2}
                                  dot={{ r: 3 }}
                                />

                                <Line
                                  type="monotone"
                                  dataKey="Muscle"
                                  stroke="#22c55e"
                                  strokeWidth={2}
                                  dot={{ r: 3 }}
                                />

                                <Line
                                  type="monotone"
                                  dataKey="Body Fat %"
                                  stroke="#e63329"
                                  strokeWidth={2}
                                  dot={{ r: 3 }}
                                  strokeDasharray="4 2"
                                />
                              </LineChart>
                            </ResponsiveContainer>

                            <div
                              style={{
                                display: "flex",
                                gap: 16,
                                justifyContent: "center",
                                marginTop: 8,
                              }}
                            >
                              <span
                                style={{ fontSize: 11, color: "var(--orange)" }}
                              >
                                ● Weight
                              </span>

                              <span
                                style={{ fontSize: 11, color: "var(--green)" }}
                              >
                                ● Muscle
                              </span>

                              <span
                                style={{ fontSize: 11, color: "var(--red)" }}
                              >
                                ● Body Fat
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowScanner(true)}
                      style={{ marginBottom: 12 }}
                    >
                      📷 Scan BCA QR
                    </button>

                    {showScanner && (
                      <div className="card mb-16">
                        <BcaScanner onScan={handleScan} />
                      </div>
                    )}

                    {readings.length > 0 && (
                      <>
                        <div className="section-header mb-12">
                          <div className="section-title">
                            Reading History ({readings.length})
                          </div>
                        </div>

                        <div className="table-wrap mb-20">
                          <table>
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Weight</th>
                                <th>Fat%</th>
                                <th>Muscle</th>
                                <th>BMI</th>
                                <th>Visceral</th>
                                <th>BMR</th>
                                <th>Age</th>
                                <th>Score</th>
                              </tr>
                            </thead>

                            <tbody>
                              {[...readings].reverse().map((r) => (
                                <tr key={r.id || r.date}>
                                  <td>{r.date}</td>
                                  <td>{r.weight || "—"}</td>
                                  <td>{r.fat || "—"}</td>
                                  <td>{r.muscle || "—"}</td>
                                  <td>{r.bmi || "—"}</td>
                                  <td>{r.visceralFat || "—"}</td>
                                  <td>{r.bmr || "—"}</td>
                                  <td>{r.bodyAge || "—"}</td>
                                  <td>{r.healthScore || "—"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </>
                )}

                <div className="section-header mb-12">
                  <div className="section-title">Log New Full BCA Reading</div>
                </div>

                <div className="card">
                  <form onSubmit={handleSave}>
                    <div className="section-header mb-12">
                      <div className="section-title">
                        Common Member Details
                      </div>
                    </div>

                    <div className="form-row">
                      <Input label="Height (cm)" name="height" />
                      <Input label="Age" name="age" />
                    </div>

                    <div className="form-row">
                      <SelectInput
                        label="Gender"
                        name="gender"
                        options={["Male", "Female", "Other"]}
                      />

                      <SelectInput
                        label="Goal"
                        name="goal"
                        options={[
                          "Weight Loss",
                          "Fat Loss",
                          "Muscle Gain",
                          "Strength Training",
                          "Body Toning",
                          "General Fitness",
                          "Rehabilitation",
                          "Other",
                        ]}
                      />
                    </div>

                    <div className="form-row">
                      <Input label="Body Type" name="bodyType" type="text" />
                    </div>

                    <div className="section-header mb-12">
                      <div className="section-title">Main Metrics</div>
                    </div>

                    <div className="form-row">
                      <Input label="Weight (kg) *" name="weight" required />
                      <Input label="BMI" name="bmi" />
                    </div>

                    <div className="form-row">
                      <Input label="Body Fat %" name="fat" />
                      <Input label="Muscle Mass (kg)" name="muscle" />
                    </div>

                    <div className="form-row">
                      <Input label="Body Water %" name="water" />
                      <Input label="Protein" name="protein" />
                    </div>

                    <div className="section-header mb-12">
                      <div className="section-title">Advanced Metrics</div>
                    </div>

                    <div className="form-row">
                      <Input label="Body Water KG" name="bodyWaterKg" />
                      <Input label="Fat Mass KG" name="fatKg" />
                    </div>

                    <div className="form-row">
                      <Input label="FFM" name="ffm" />
                      <Input label="Minerals / Abio Salt" name="abioSalt" />
                    </div>

                    <div className="section-header mb-12">
                      <div className="section-title">Obesity Analysis</div>
                    </div>

                    <div className="form-row">
                      <Input label="PBF" name="pbf" />
                      <Input label="WHR" name="whr" />
                    </div>

                    <div className="form-row">
                      <Input label="Visceral Fat" name="visceralFat" />
                    </div>

                    <div className="section-header mb-12">
                      <div className="section-title">Metabolism</div>
                    </div>

                    <div className="form-row">
                      <Input label="BMR" name="bmr" />
                      <Input label="Physical Age" name="bodyAge" />
                    </div>

                    <div className="form-row">
                      <Input label="Health Score" name="healthScore" />
                    </div>

                    <div className="section-header mb-12">
                      <div className="section-title">Body Control</div>
                    </div>

                    <div className="form-row">
                      <Input label="Ideal Weight" name="idealWeight" />
                      <Input label="Weight Control" name="weightControl" />
                    </div>

                    <div className="form-row">
                      <Input label="Fat Control" name="fatControl" />
                      <Input label="Muscle Control" name="muscleControl" />
                    </div>

                    <div className="section-header mb-12">
                      <div className="section-title">Segmental Muscle</div>
                    </div>

                    <div className="form-row">
                      <Input label="Left Arm Muscle" name="armLeftMuscle" />
                      <Input label="Right Arm Muscle" name="armRightMuscle" />
                    </div>

                    <div className="form-row">
                      <Input label="Left Leg Muscle" name="legLeftMuscle" />
                      <Input label="Right Leg Muscle" name="legRightMuscle" />
                    </div>

                    <div className="form-row">
                      <Input label="Trunk Muscle" name="trunkMuscle" />
                    </div>

                    <div className="section-header mb-12">
                      <div className="section-title">Segmental Fat</div>
                    </div>

                    <div className="form-row">
                      <Input label="Left Arm Fat" name="armLeftFat" />
                      <Input label="Right Arm Fat" name="armRightFat" />
                    </div>

                    <div className="form-row">
                      <Input label="Left Leg Fat" name="legLeftFat" />
                      <Input label="Right Leg Fat" name="legRightFat" />
                    </div>

                    <div className="form-row">
                      <Input label="Trunk Fat" name="trunkFat" />
                    </div>

                    <div className="section-header mb-12">
                      <div className="section-title">Machine Details</div>
                    </div>

                    <div className="form-row">
                      <Input label="Scan Time" name="scanTime" type="text" />
                      <Input
                        label="Machine Serial"
                        name="machineSerial"
                        type="text"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                      style={{ width: "100%" }}
                    >
                      {saving
                        ? "Saving…"
                        : "📊 Save BCA + Sync Member Profile"}
                    </button>
                  </form>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}