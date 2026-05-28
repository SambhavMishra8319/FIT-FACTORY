import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import toast from "react-hot-toast";
import { getAllMembers, getBCAReadings, addBCAReading } from "../../firebase/service";

const empty = { weight: "", fat: "", muscle: "", water: "", bmi: "" };

export default function BCA() {
  const [searchParams] = useSearchParams();
  const [members, setMembers] = useState([]);
  const [selectedId, setSelectedId] = useState(searchParams.get("member") || "");
  const [readings, setReadings] = useState([]);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [loadingReadings, setLoadingReadings] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  // Load all members for selector
  useEffect(() => {
    getAllMembers().then(setMembers);
  }, []);

  // Load readings when member changes
  useEffect(() => {
    if (!selectedId) { setReadings([]); return; }
    setLoadingReadings(true);
    getBCAReadings(selectedId)
      .then(setReadings)
      .finally(() => setLoadingReadings(false));
  }, [selectedId]);

  const selectedMember = members.find(m => m.id === selectedId);
  const latest = readings[readings.length - 1];
  const prev = readings[readings.length - 2];

  const diff = (key) => {
    if (!latest || !prev) return null;
    const d = parseFloat(latest[key]) - parseFloat(prev[key]);
    return d;
  };

  const diffLabel = (key, unit = "") => {
    const d = diff(key);
    if (d === null) return null;
    const positive = d > 0;
    const color = key === "fat" || key === "weight" || key === "bmi"
      ? (positive ? "var(--red)" : "var(--green)")
      : (positive ? "var(--green)" : "var(--red)");
    return <span style={{ color, fontWeight: 700, fontSize: 12 }}>{positive ? "+" : ""}{d.toFixed(1)}{unit}</span>;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedId) { toast.error("Select a member first."); return; }
    if (!form.weight) { toast.error("Weight is required."); return; }
    setSaving(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      await addBCAReading({
        memberId: selectedId,
        memberName: selectedMember?.name || "",
        date: today,
        weight: parseFloat(form.weight),
        fat: parseFloat(form.fat) || 0,
        muscle: parseFloat(form.muscle) || 0,
        water: parseFloat(form.water) || 0,
        bmi: parseFloat(form.bmi) || 0,
      });
      toast.success("BCA reading saved! 📊");
      setForm(empty);
      // Refresh readings
      const updated = await getBCAReadings(selectedId);
      setReadings(updated);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save. Check Firebase connection.");
    } finally {
      setSaving(false);
    }
  };

  const chartData = readings.map(r => ({
    date: r.date,
    Weight: r.weight,
    "Body Fat %": r.fat,
    Muscle: r.muscle,
  }));

  const initials = (name) => name ? name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "?";

  return (
    <>
      <div className="topbar">
        <div className="page-title">BCA — Body Analysis</div>
        <div className="topbar-right">
          <select
            className="form-input"
            style={{ width: 220, fontSize: 13 }}
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
          >
            <option value="">— Select a member —</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.name} · {m.phone}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="page-body">
        {!selectedId ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--muted)" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Select a Member</div>
            <div style={{ fontSize: 13 }}>Choose a member from the dropdown above to view and log their BCA readings.</div>
          </div>
        ) : (
          <>
            {/* Member profile bar */}
            {selectedMember && (
              <div className="profile-header mb-16">
                <div className="avatar">{initials(selectedMember.name)}</div>
                <div>
                  <div className="profile-name">{selectedMember.name}</div>
                  <div className="profile-meta">{selectedMember.phone} · {selectedMember.plan} · Goal: {selectedMember.goal}</div>
                  <div className="profile-tags">
                    <span className="badge badge-orange">{selectedMember.goal}</span>
                    <span className="badge badge-green">{selectedMember.status || "Active"}</span>
                    <span className="badge badge-blue">{readings.length} readings</span>
                  </div>
                </div>
                {latest && (
                  <div style={{ marginLeft: "auto", textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Last Reading</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--orange)" }}>{latest.date}</div>
                  </div>
                )}
              </div>
            )}

            {loadingReadings ? (
              <div style={{ textAlign: "center", padding: 40, color: "var(--muted)" }}>Loading readings…</div>
            ) : (
              <>
                {/* Latest stats */}
                {latest && (
                  <>
                    <div className="stats-grid mb-16">
                      <div className="stat-card s-red">
                        <div className="stat-label">Weight</div>
                        <div className="stat-value c-red">{latest.weight} kg</div>
                        <div className="stat-sub">{diffLabel("weight", " kg")} vs prev</div>
                      </div>
                      <div className="stat-card s-orange">
                        <div className="stat-label">BMI</div>
                        <div className="stat-value c-orange">{latest.bmi || "—"}</div>
                        <div className="stat-sub">{diffLabel("bmi")}</div>
                      </div>
                      <div className="stat-card s-green">
                        <div className="stat-label">Muscle Mass</div>
                        <div className="stat-value c-green">{latest.muscle} kg</div>
                        <div className="stat-sub">{diffLabel("muscle", " kg")}</div>
                      </div>
                      <div className="stat-card s-gold">
                        <div className="stat-label">Body Fat</div>
                        <div className="stat-value c-gold">{latest.fat}%</div>
                        <div className="stat-sub">{diffLabel("fat", "%")}</div>
                      </div>
                    </div>

                    <div className="grid-2 mb-16">
                      {/* Composition bars */}
                      <div className="card">
                        <div className="card-title">Body Composition</div>
                        <div className="bca-bar-wrap">
                          <div className="bca-label-row"><span className="label">Body Fat %</span><span style={{ color: "var(--orange)", fontWeight: 600 }}>{latest.fat}%</span></div>
                          <div className="bca-track"><div className="bca-fill fat" style={{ width: `${Math.min(latest.fat, 100)}%` }}></div></div>
                        </div>
                        <div className="bca-bar-wrap">
                          <div className="bca-label-row"><span className="label">Muscle (% of body wt)</span><span style={{ color: "var(--blue)", fontWeight: 600 }}>{latest.weight ? ((latest.muscle / latest.weight) * 100).toFixed(1) : 0}%</span></div>
                          <div className="bca-track"><div className="bca-fill muscle" style={{ width: `${latest.weight ? Math.min((latest.muscle / latest.weight) * 100, 100) : 0}%` }}></div></div>
                        </div>
                        <div className="bca-bar-wrap">
                          <div className="bca-label-row"><span className="label">Body Water %</span><span style={{ color: "var(--green)", fontWeight: 600 }}>{latest.water}%</span></div>
                          <div className="bca-track"><div className="bca-fill water" style={{ width: `${Math.min(latest.water, 100)}%` }}></div></div>
                        </div>
                        <div className="bca-bar-wrap">
                          <div className="bca-label-row"><span className="label">BMI (out of 35)</span><span style={{ color: "var(--gold)", fontWeight: 600 }}>{latest.bmi}</span></div>
                          <div className="bca-track"><div className="bca-fill bmi" style={{ width: `${Math.min((latest.bmi / 35) * 100, 100)}%` }}></div></div>
                        </div>
                      </div>

                      {/* Progress chart */}
                      <div className="card">
                        <div className="card-title">Progress Chart</div>
                        {readings.length < 2 ? (
                          <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: 13 }}>
                            Add at least 2 readings to see the chart.
                          </div>
                        ) : (
                          <>
                            <ResponsiveContainer width="100%" height={180}>
                              <LineChart data={chartData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                                <XAxis dataKey="date" tick={{ fill: "#888", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: "#888", fontSize: 10 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 6, fontSize: 12 }} />
                                <Line type="monotone" dataKey="Weight" stroke="#f47c20" strokeWidth={2} dot={{ r: 3 }} />
                                <Line type="monotone" dataKey="Muscle" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
                                <Line type="monotone" dataKey="Body Fat %" stroke="#e63329" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="4 2" />
                              </LineChart>
                            </ResponsiveContainer>
                            <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 8 }}>
                              <span style={{ fontSize: 11, color: "var(--orange)" }}>● Weight</span>
                              <span style={{ fontSize: 11, color: "var(--green)" }}>● Muscle</span>
                              <span style={{ fontSize: 11, color: "var(--red)" }}>● Body Fat</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* History table */}
                    {readings.length > 0 && (
                      <>
                        <div className="section-header mb-12">
                          <div className="section-title">Reading History ({readings.length})</div>
                        </div>
                        <div className="table-wrap mb-20">
                          <table>
                            <thead><tr><th>Date</th><th>Weight (kg)</th><th>Body Fat %</th><th>Muscle (kg)</th><th>Water %</th><th>BMI</th></tr></thead>
                            <tbody>
                              {[...readings].reverse().map(r => (
                                <tr key={r.id}>
                                  <td>{r.date}</td>
                                  <td>{r.weight}</td>
                                  <td>{r.fat}</td>
                                  <td>{r.muscle}</td>
                                  <td>{r.water}</td>
                                  <td>{r.bmi}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* Log new reading */}
                <div className="section-header mb-12">
                  <div className="section-title">Log New BCA Reading</div>
                </div>
                <div className="card" style={{ maxWidth: 560 }}>
                  <form onSubmit={handleSave}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Weight (kg) *</label>
                        <input className="form-input" type="number" step="0.1" placeholder="74.0" value={form.weight} onChange={e => set("weight", e.target.value)} required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Body Fat %</label>
                        <input className="form-input" type="number" step="0.1" placeholder="22.5" value={form.fat} onChange={e => set("fat", e.target.value)} />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Muscle Mass (kg)</label>
                        <input className="form-input" type="number" step="0.1" placeholder="36.0" value={form.muscle} onChange={e => set("muscle", e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Body Water %</label>
                        <input className="form-input" type="number" step="0.1" placeholder="55.2" value={form.water} onChange={e => set("water", e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">BMI</label>
                      <input className="form-input" type="number" step="0.1" placeholder="22.4" value={form.bmi} onChange={e => set("bmi", e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={saving} style={{ width: "100%" }}>
                      {saving ? "Saving…" : "📊 Save BCA Reading to Firebase"}
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
