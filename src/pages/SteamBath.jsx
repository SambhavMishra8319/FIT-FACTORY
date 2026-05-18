import { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { subscribeSteamBookings, bookSteamSlot, deleteSteamBooking, getAllMembers } from "../firebase/service";

const ALL_SLOTS = [
  { time: "6:00 AM", period: "Morning" },
  { time: "7:00 AM", period: "Morning" },
  { time: "8:00 AM", period: "Morning" },
  { time: "9:00 AM", period: "Morning" },
  { time: "5:00 PM", period: "Evening" },
  { time: "6:00 PM", period: "Evening" },
  { time: "7:00 PM", period: "Evening" },
  { time: "8:00 PM", period: "Evening" },
];

export default function SteamBath() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [bookings, setBookings]         = useState([]);
  const [members, setMembers]           = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedMember, setSelectedMember] = useState("");
  const [saving, setSaving]             = useState(false);
  const [visible, setVisible]           = useState(false);

  useEffect(() => {
    getAllMembers()
      .then(data => setMembers(data.filter(m => m.status === "active" || m.status === "expiring")))
      .catch(console.error);
  }, []);

  useEffect(() => {
    // ✅ Realtime listener — slot grid updates instantly
    const unsub = subscribeSteamBookings(selectedDate, data => {
      setBookings(data);
      setTimeout(() => setVisible(true), 60);
    });
    return () => unsub();
  }, [selectedDate]);

  const bookedSlots = bookings.map(b => b.slot);
  const available   = ALL_SLOTS.filter(s => !bookedSlots.includes(s.time)).length;

  const handleBook = async () => {
    if (!selectedSlot)   { toast.error("Select a time slot."); return; }
    if (!selectedMember) { toast.error("Select a member."); return; }

    const member = members.find(m => m.id === selectedMember);
    if (!member) { toast.error("Member not found."); return; }

    setSaving(true);
    try {
      // ✅ FIX #2 — Atomic transaction, no race condition
      await bookSteamSlot({
        date:        selectedDate,
        slot:        selectedSlot,
        memberId:    selectedMember,
        memberName:  member.name,
        memberPhone: member.phone,
      });
      toast.success(`${member.name} booked ${selectedSlot} 🌫️`);
      setSelectedSlot(null);
      setSelectedMember("");
    } catch (err) {
      // Transaction error means slot was taken simultaneously
      toast.error(err.message || "Booking failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async (bookingId, memberName, slot) => {
    if (!window.confirm(`Cancel ${memberName}'s booking at ${slot}?`)) return;
    try {
      await deleteSteamBooking(bookingId);
      toast.success("Booking cancelled.");
    } catch { toast.error("Could not cancel."); }
  };

  const SlotGrid = ({ period }) => {
    const slots = ALL_SLOTS.filter(s => s.period === period);
    return (
      <div className="slot-grid mb-16">
        {slots.map(s => {
          const booking  = bookings.find(b => b.slot === s.time);
          const isBooked = !!booking;
          const isSel    = selectedSlot === s.time;
          return (
            <div
              key={s.time}
              className={`slot tap-scale ${isBooked ? "booked" : ""} ${isSel ? "selected" : ""}`}
              onClick={() => !isBooked && setSelectedSlot(isSel ? null : s.time)}
            >
              <div className="slot-time">{s.time}</div>
              <div className="slot-label">
                {isBooked ? booking.memberName : isSel ? "Selected ✓" : "Available"}
              </div>
              {isBooked && (
                <button
                  style={{
                    marginTop: 5, fontSize: 9,
                    background: "rgba(230,51,41,0.15)",
                    border: "none", color: "var(--red)",
                    borderRadius: 3, padding: "2px 6px",
                    cursor: "pointer",
                  }}
                  onClick={e => {
                    e.stopPropagation();
                    handleCancel(booking.id, booking.memberName, s.time);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const anim = delay => ({
    opacity: visible ? 1 : 0,
    transition: `opacity 0.4s ease ${delay}s`,
  });

  return (
    <div className="page-enter">
      <div className="topbar">
        <div className="page-title">Steam Bath</div>
        <div className="topbar-right">
          <input
            className="form-input"
            type="date"
            value={selectedDate}
            onChange={e => { setSelectedDate(e.target.value); setSelectedSlot(null); }}
            style={{ width: "auto", fontSize: 13 }}
          />
        </div>
      </div>

      <div className="page-body">
        <div className="stats-grid mb-20" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {[
            { label: "Available", value: available,           cls: "s-green", val: "c-green" },
            { label: "Booked",    value: bookings.length,     cls: "s-red",   val: "c-red"   },
            { label: "Duration",  value: "20 min",            cls: "s-gold",  val: "c-gold"  },
          ].map((s, i) => (
            <div key={i} className={`stat-card ${s.cls}`} style={anim(i * 0.07)}>
              <div className="stat-label">{s.label}</div>
              <div className={`stat-value ${s.val}`} style={{ fontSize: 24 }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ alignItems: "start" }}>
          {/* Slot grids */}
          <div>
            {["Morning", "Evening"].map(period => (
              <div key={period}>
                <div className="section-header mb-12" style={anim(0.15)}>
                  <div className="section-title">{period} Slots</div>
                </div>
                <div style={anim(0.2)}>
                  <SlotGrid period={period} />
                </div>
              </div>
            ))}
          </div>

          {/* Booking form + today's list */}
          <div>
            <div className="card mb-16" style={{
              background: "rgba(245,200,66,0.04)",
              borderColor: "rgba(245,200,66,0.2)",
              ...anim(0.2),
            }}>
              <div className="card-title">Book a Slot</div>

              <div className="form-group">
                <label className="form-label">Selected Slot</label>
                <div className="form-input" style={{ opacity: selectedSlot ? 1 : 0.5, cursor: "default", color: selectedSlot ? "var(--gold)" : "var(--muted)" }}>
                  {selectedSlot || "← Click a slot to select"}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Member</label>
                <select className="form-input" value={selectedMember} onChange={e => setSelectedMember(e.target.value)}>
                  <option value="">— Select Member —</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.phone})</option>
                  ))}
                </select>
              </div>

              <div style={{ fontSize: 12, color: "var(--muted2)", lineHeight: 1.8, marginBottom: 14 }}>
                🌡 80–90°C · 💧 Detox & Muscle Recovery · ⏱ 20 min
              </div>

              <button
                className="btn btn-primary tap-scale btn-ripple"
                style={{ width: "100%" }}
                onClick={handleBook}
                disabled={saving || !selectedSlot || !selectedMember}
              >
                {saving ? "Booking…" : selectedSlot ? `Confirm — ${selectedSlot}` : "Select a Slot"}
              </button>

              {saving && (
                <div style={{ textAlign: "center", fontSize: 11, color: "var(--muted2)", marginTop: 8 }}>
                  Checking availability with Firestore transaction…
                </div>
              )}
            </div>

            {/* Today's bookings */}
            {bookings.length > 0 && (
              <div className="card" style={anim(0.25)}>
                <div className="card-title">Today's Bookings ({bookings.length})</div>
                {bookings
                  .sort((a, b) => a.slot.localeCompare(b.slot))
                  .map(b => (
                    <div key={b.id} className="activity-item">
                      <div className="activity-dot gold" />
                      <div style={{ flex: 1 }}>
                        <div className="activity-text">{b.memberName}</div>
                        <div className="activity-time">{b.slot} · {b.memberPhone}</div>
                      </div>
                      <button
                        className="btn btn-danger btn-sm tap-scale"
                        onClick={() => handleCancel(b.id, b.memberName, b.slot)}
                      >
                        Cancel
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
