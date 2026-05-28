import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  subscribeSteamBookings,
  bookSteamSlot,
  deleteSteamBooking,
  getAllMembers,
  createSteamSlot,
  requestSteamSlot,
  approveSteamBooking,
  rejectSteamBooking,
  removeSteamSlot,
  subscribeSteamSlots,
} from "../../firebase/service";
import "../../styles/steam.css";
import { useAuth } from "../../context/AuthContext";

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
  const { user, loading } = useAuth();

  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [filter, setFilter] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedMember, setSelectedMember] = useState("");
  const [saving, setSaving] = useState(false);
  const [visible, setVisible] = useState(false);

  const [customSlots, setCustomSlots] = useState([]);
  const [slots, setSlots] = useState([]);

  const [newTime, setNewTime] = useState("");
  const [newPeriod, setNewPeriod] = useState("Morning");

  useEffect(() => {
    if (loading || !user) return;

    getAllMembers()
      .then((data) =>
        setMembers(
          data.filter((m) => m.status === "active" || m.status === "expiring"),
        ),
      )
      .catch(console.error);
  }, [user, loading]);
  useEffect(() => {
    const unsub = subscribeSteamSlots((data) => {
      setCustomSlots(data);
    });

    return () => unsub();
  }, []);
  useEffect(() => {
    if (!selectedDate || !user) return;

    const unsub = subscribeSteamBookings(selectedDate, (data) => {
      setBookings(data);
      setTimeout(() => setVisible(true), 60);
    });

    return () => unsub();
  }, [selectedDate, user]);

  // const ALL_AVAILABLE_SLOTS = useMemo(() => {
  //   return [...ALL_SLOTS, ...customSlots];
  // }, [customSlots]);
  const ALL_AVAILABLE_SLOTS = useMemo(() => {
    const map = new Map();

    [...ALL_SLOTS, ...customSlots].forEach((s) => {
      const key = `${s.period}-${s.time}`;

      if (!map.has(key)) {
        map.set(key, s);
      }
    });

    return Array.from(map.values());
  }, [customSlots]);
  // const bookedSlots = bookings.map((b) => b.slot);
  // const bookedSlots = bookings
  const occupiedSlots = bookings.filter((b) =>
    ["pending", "confirmed"].includes(b.status),
  );
  const bookedSlots = occupiedSlots.map((b) => `${b.period}-${b.slot}`);
  //   .filter((b) => b.status === "confirmed" || b.status === "pending")
  //   .map((b) => `${b.period}-${b.slot}`);

  const available = ALL_AVAILABLE_SLOTS.filter(
    (s) => !bookedSlots.includes(`${s.period}-${s.time}`) && !s.disabled,
  ).length;

  const normalizeTime = (t) => t?.trim().toLowerCase();
  const handleAddSlot = async () => {
    if (!newTime) return toast.error("Select time");

    const formattedTime = formatTime12(newTime);
    const hour = parseInt(newTime.split(":")[0], 10);

    const autoPeriod = hour < 12 ? "Morning" : "Evening";

    const exists = ALL_AVAILABLE_SLOTS.some(
      (s) =>
        s.time.toLowerCase() === formattedTime.toLowerCase() &&
        s.period === autoPeriod,
    );

    if (exists) return toast.error("Slot already exists");

    const slot = {
      time: formattedTime,
      period: autoPeriod,
      disabled: false,
    };

    try {
      await createSteamSlot(slot);

      setCustomSlots((prev) => {
        const already = prev.some(
          (p) =>
            p.time.toLowerCase() === formattedTime.toLowerCase() &&
            p.period === autoPeriod,
        );

        if (already) return prev;

        return [...prev, slot];
      });
      setNewTime("");
      toast.success(`Added in ${autoPeriod}`);
    } catch (e) {
      toast.error(e.message || "Failed to create slot");
    }
  };

  const isAdmin = user?.role === "admin";
  const handleDeleteSlot = async (slot) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${slot.time} (${slot.period}) slot?`,
    );

    if (!confirmDelete) return;

    try {
      // await removeSteamSlot(`${slot.period}-${slot.time}`);
      await removeSteamSlot(slot.id);
      setCustomSlots((prev) => prev.filter((s) => s.id !== slot.id));

      setSlots((prev) => prev.filter((s) => s.id !== slot.id));

      toast.success("Slot deleted");
    } catch (e) {
      toast.error(e.message || "Failed to delete slot");
    }
  };

  const handleBook = async () => {
    if (!selectedSlot) {
      return toast.error("Select a time slot.");
    }

    if (!selectedMember) {
      return toast.error("Select a member.");
    }

    const member = members.find((m) => m.id === selectedMember);

    if (!member) {
      return toast.error("Member not found.");
    }

    setSaving(true);

    try {
      const [period, slotTime] = selectedSlot.split("-");

      const ref = await requestSteamSlot({
        date: selectedDate,
        slot: slotTime,
        period,
        memberId: selectedMember,
        memberName: member.name,
        memberPhone: member.phone,
      });

      // auto approve if admin books
      await approveSteamBooking(ref.id, selectedDate, slotTime, period);

      toast.success(`${member.name} booked ${slotTime} 🌫️`);

      setSelectedSlot(null);
      setSelectedMember("");
    } catch (err) {
      toast.error(err.message || "Booking failed.");
    } finally {
      setSaving(false);
    }
  };
  const handleCancel = async (bookingId, memberName, slot) => {
    if (!window.confirm(`Cancel ${memberName}'s booking at ${slot}?`)) return;

    try {
      await deleteSteamBooking(bookingId);
      toast.success("Booking cancelled.");
    } catch {
      toast.error("Could not cancel.");
    }
  };

  const SlotGrid = ({ period }) => {
    // const slots = ALL_AVAILABLE_SLOTS.filter((s) => s.period === period);
    const slots = useMemo(() => {
      const unique = new Map();

      ALL_AVAILABLE_SLOTS.filter((s) => s.period === period).forEach((s) => {
        const key = `${s.time}-${s.period}`;
        if (!unique.has(key)) unique.set(key, s);
      });

      return Array.from(unique.values());
    }, [ALL_AVAILABLE_SLOTS, period]);
    return (
      <div className="slot-grid steam-slot-grid">
        {slots.map((s) => {
          const booking = bookings.find((b) => {
            return (
              b.period === s.period &&
              b.slot?.trim().toLowerCase() === s.time?.trim().toLowerCase() &&
              (b.status === "confirmed" || b.status === "pending")
            );
          });
          const isBooked = !!booking;
          const isSel = selectedSlot === `${s.period}-${s.time}`;

          const isCustom = customSlots.some(
            (cs) =>
              normalizeTime(cs.time) === normalizeTime(s.time) &&
              cs.period === s.period,
          );

          return (
            <div
              key={`${s.period}-${s.time}`}
              className={`slot steam-slot ${
                isBooked ? "booked" : ""
              } ${isSel ? "selected" : ""}`}
              onClick={() =>
                !isBooked &&
                setSelectedSlot(isSel ? null : `${s.period}-${s.time}`)
              }
            >
              {/* <div className="slot-time">{s.time}</div> */}
              <div className="slot-time steam-slot-time">{s.time}</div>

              {/* EMPTY SLOT */}
              {!isBooked && (
                <div className="slot-label steam-slot-label">
                  {isSel ? "Selected ✓" : "Available"}
                </div>
              )}

              {isBooked && booking.status === "pending" && (
                <>
                  <div className="slot-label steam-slot-label">
                    Pending • {booking.memberName}
                  </div>

                  <div className="slot-actions">
                    <button
                      className="mini-btn approve"
                      onClick={async (e) => {
                        e.stopPropagation();

                        try {
                          await approveSteamBooking(
                            booking.id,
                            booking.date,
                            booking.slot,
                            booking.period,
                          );

                          toast.success("Booking approved");
                        } catch (err) {
                          toast.error(err.message);
                        }
                      }}
                    >
                      Approve
                    </button>

                    <button
                      className="mini-btn reject"
                      onClick={async (e) => {
                        e.stopPropagation();

                        try {
                          await rejectSteamBooking(booking.id);

                          toast.success("Booking rejected");
                        } catch {
                          toast.error("Reject failed");
                        }
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </>
              )}

              {/* CONFIRMED BOOKING */}
              {isBooked && booking.status === "confirmed" && (
                <>
                  <div className="slot-label steam-slot-label">
                    {/* {isAdmin ? booking.memberName : "Booked ✓"} */}
                    {isAdmin ? `Booked • ${booking.memberName}` : "Booked ✓"}
                  </div>

                  <button
                    className="mini-btn cancel"
                    onClick={(e) => {
                      e.stopPropagation();

                      handleCancel(
                        booking.id,
                        booking.memberName,
                        booking.slot,
                      );
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}

              {/* DELETE CUSTOM SLOT */}
              {isCustom && !isBooked && (
                <button
                  style={{
                    marginTop: 5,
                    fontSize: 9,
                    background: "rgba(255,0,0,0.15)",
                    border: "none",
                    color: "red",
                    borderRadius: 3,
                    padding: "2px 6px",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSlot(s);
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  const formatTime12 = (time24) => {
    if (!time24) return "";

    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);

    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;

    return `${hour}:${minute} ${ampm}`;
  };
  const filteredBookings = useMemo(() => {
    if (filter === "all") return bookings;
    return bookings.filter((b) => b.status === filter);
  }, [bookings, filter]);
  const anim = (delay) => ({
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
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedSlot(null);
            }}
            style={{ width: "auto", fontSize: 13 }}
          />
        </div>
      </div>

      <div className="page-body">
        <div
          className="stats-grid mb-20"
          style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
        >
          {[
            {
              label: "Available",
              value: available,
              cls: "s-green",
              val: "c-green",
            },
            {
              label: "Booked",
              // value: bookings.filter((b) => b.status === "confirmed").length,
              value: bookings.filter(
                (b) => b.status === "confirmed" || b.status === "pending",
              ).length,
              cls: "s-red",
              val: "c-red",
            },
            {
              label: "Duration",
              value: "20 min",
              cls: "s-gold",
              val: "c-gold",
            },
          ].map((s, i) => (
            <div
              key={i}
              className={`stat-card ${s.cls}`}
              style={anim(i * 0.07)}
            >
              <div className="stat-label">{s.label}</div>
              <div className={`stat-value ${s.val}`} >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ alignItems: "start" }}>
          <div>
            {["Morning", "Evening"].map((period) => (
              <div key={period}>
                <div className="section-header mb-12" style={anim(0.15)}>
                  <div className="section-title">{period} Slots</div>
                </div>

                <div style={anim(0.2)}>
                  <SlotGrid period={period} />
                </div>
              </div>
            ))}
            {/* <div style={{ display: "flex", gap: 8, marginBottom: 10 }}> */}
            <div className="steam-filter-row">
              {/* <button onClick={() => setFilter("all")}>All</button> */}
              <button
                className={`steam-filter-btn ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
  className={`steam-filter-btn ${filter === "pending" ? "active" : ""}`}
  onClick={() => setFilter("pending")}
>
  Pending
</button>

<button
  className={`steam-filter-btn ${filter === "confirmed" ? "active" : ""}`}
  onClick={() => setFilter("confirmed")}
>
  Confirmed
</button>

<button
  className={`steam-filter-btn ${filter === "rejected" ? "active" : ""}`}
  onClick={() => setFilter("rejected")}
>
  Rejected
</button>
              {/* <button onClick={() => setFilter("pending")}>Pending</button>
              
              <button onClick={() => setFilter("confirmed")}>Confirmed</button>
              <button onClick={() => setFilter("rejected")}>Rejected</button> */}
            </div>
            {/* ================= BOOKING OVERVIEW ================= */}
            <div className="card mt-20">
              <div className="card-title">📋 All Bookings (Live)</div>

              {filteredBookings.length === 0 ? (
                <div className="form-label">No bookings for this date.</div>
              ) : (
                <div className="booking-list">
                  {filteredBookings
                    .sort((a, b) => {
                      // sort by time + period
                      return `${a.period}-${a.slot}`.localeCompare(
                        `${b.period}-${b.slot}`,
                      );
                    })
                    .map((b) => (
                      <div
                        key={b.id}
                        className={`booking-item ${b.status}`}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "10px",
                          borderBottom: "1px solid #eee",
                          alignItems: "center",
                        }}
                      >
                        {/* LEFT SIDE */}
                        <div>
                          <div style={{ fontWeight: 600 }}>
                            {b.slot} ({b.period})
                          </div>

                          <div style={{ fontSize: 13, opacity: 0.8 }}>
                            👤 {b.memberName} • {b.memberPhone}
                          </div>
                        </div>

                        {/* RIGHT SIDE STATUS */}
                        <div>
                          {b.status === "pending" && (
                            <span style={{ color: "orange" }}>⏳ Pending</span>
                          )}

                          {b.status === "confirmed" && (
                            <span style={{ color: "green" }}>✅ Confirmed</span>
                          )}

                          {b.status === "rejected" && (
                            <span style={{ color: "red" }}>❌ Rejected</span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="card mb-16">
              <div className="card-title">Create New Slot</div>

              <input
                className="form-input"
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />

              <button className="btn btn-primary mt-12" onClick={handleAddSlot}>
                ➕ Add Slot
              </button>
            </div>

            <div className="card mb-16">
              <div className="card-title">Book a Slot</div>

              <div className="form-group">
                <label className="form-label">Selected Slot</label>
                <div className="form-input">
                  {selectedSlot || "← Click a slot to select"}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Member</label>
                <select
                  className="form-input"
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                >
                  <option value="">— Select Member —</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.phone})
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleBook}
                disabled={saving || !selectedSlot || !selectedMember}
              >
                {saving ? "Booking…" : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
