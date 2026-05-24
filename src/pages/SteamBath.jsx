import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  subscribeSteamBookings,
  bookSteamSlot,
  deleteSteamBooking,
  getAllMembers,
  createSteamSlot,
  removeSteamSlot,
} from "../firebase/service";

import { useAuth } from "../context/AuthContext";

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
    if (!selectedDate || !user) return;

    const unsub = subscribeSteamBookings(selectedDate, (data) => {
      setBookings(data);
      setTimeout(() => setVisible(true), 60);
    });

    return () => unsub();
  }, [selectedDate, user]);

  const ALL_AVAILABLE_SLOTS = useMemo(() => {
    return [...ALL_SLOTS, ...customSlots];
  }, [customSlots]);

  const bookedSlots = bookings.map((b) => b.slot);

  const available = ALL_AVAILABLE_SLOTS.filter(
    (s) => !bookedSlots.includes(s.time) && !s.disabled,
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
      s.period === autoPeriod
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
          p.time.toLowerCase() === slot.time.toLowerCase() &&
          p.period === slot.period
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
//   const handleAddSlot = async () => {
//     if (!newTime) return toast.error("Select time");

//     const hour = parseInt(newTime.split(":")[0], 10);

//     // ❌ validation based on selected period
//     if (newPeriod === "Morning" && hour >= 12) {
//       return toast.error("Morning slots must be between 1–11 AM");
//     }

//     if (newPeriod === "Evening" && hour >= 12) {
//       return toast.error(
//         "Evening slots must be between 1–11 PM format (use PM logic)",
//       );
//     }
//     const hour = parseInt(newTime.split(":")[0], 10);
// const autoPeriod = hour < 12 ? "Morning" : "Evening";

//     const formattedTime = formatTime12(newTime);

//     // const exists = ALL_AVAILABLE_SLOTS.some(
//     //   (s) =>
//     //     s.time.toLowerCase() === formattedTime.toLowerCase() &&
//     //     s.period === newPeriod
//     // );
// setCustomSlots((prev) => {
//   const already = prev.some(
//     (p) =>
//       p.time.trim().toLowerCase() === formattedTime.trim().toLowerCase() &&
//       p.period === newPeriod
//   );

//   if (already) return prev;
//   return [...prev, slot];
// });
//     if (exists) return toast.error("Slot already exists");

//     const slot = {
//       time: formattedTime,
//       period: newPeriod, // 👈 user controls Morning/Evening
//       disabled: false,
//     };

//     try {
//       await createSteamSlot(slot);

//       setCustomSlots((prev) => {
//         const already = prev.some(
//           (p) =>
//             p.time.toLowerCase() === formattedTime.toLowerCase() &&
//             p.period === newPeriod,
//         );

//         if (already) return prev;
//         return [...prev, slot];
//       });

//       setNewTime("");
//       toast.success(`Added in ${newPeriod}`);
//     } catch (e) {
//       toast.error(e.message || "Failed to create slot");
//     }
//   };
  // const handleAddSlot = async () => {
  //   if (!newTime) return toast.error("Select time");

  //   const hour = parseInt(newTime.split(":")[0], 10);

  //   const autoPeriod = hour < 12 ? "Morning" : "Evening";

  //   const formattedTime = formatTime12(newTime);

  //   const exists = ALL_AVAILABLE_SLOTS.some(
  //     (s) =>
  //       s.time.toLowerCase() === formattedTime.toLowerCase() &&
  //       s.period === autoPeriod
  //   );

  //   if (exists) return toast.error("Slot already exists");

  //   try {
  //     const slot = {
  //       time: formattedTime,
  //       period: autoPeriod, // ✅ auto assigned
  //       disabled: false,
  //     };

  //     await createSteamSlot(slot);

  //     setCustomSlots((prev) => {
  //       const already = prev.some(
  //         (p) =>
  //           p.time.toLowerCase() === formattedTime.toLowerCase() &&
  //           p.period === autoPeriod
  //       );

  //       if (already) return prev;
  //       return [...prev, slot];
  //     });

  //     setNewTime("");
  //     toast.success(`Slot added in ${autoPeriod}`);
  //   } catch (e) {
  //     toast.error(e.message || "Failed to create slot");
  //   }
  // };
  // const handleAddSlot = async () => {
  //   if (!newTime) return toast.error("Select time");

  //   const formattedTime = formatTime12(newTime);

  //   const exists = ALL_AVAILABLE_SLOTS.some(
  //     (s) =>
  //       normalizeTime(s.time) === normalizeTime(formattedTime) &&
  //       s.period === newPeriod
  //   );

  //   if (exists) return toast.error("Slot already exists");

  //   try {
  //     const slot = {
  //       time: formattedTime,
  //       period: newPeriod,
  //       disabled: false,
  //     };

  //     await createSteamSlot(slot);

  //     setCustomSlots((prev) => {
  //       // extra safety duplicate protection
  //       const already = prev.some(
  //         (p) =>
  //           normalizeTime(p.time) === normalizeTime(slot.time) &&
  //           p.period === slot.period
  //       );

  //       if (already) return prev;
  //       return [...prev, slot];
  //     });

  //     setNewTime("");
  //     toast.success("Slot added");
  //   } catch (e) {
  //     toast.error(e.message || "Failed to create slot");
  //   }
  // };
  // const handleAddSlot = async () => {
  //   if (!newTime) return toast.error("Select time");

  //   const formattedTime = formatTime12(newTime);

  //   // time rule validation
  //   const hour = parseInt(newTime.split(":")[0], 10);

  //   if (newPeriod === "Morning" && hour >= 12) {
  //     return toast.error("Morning slots must be before 12 PM");
  //   }

  //   if (newPeriod === "Evening" && hour < 12) {
  //     return toast.error("Evening slots must be after 12 PM");
  //   }

  //   const exists = ALL_AVAILABLE_SLOTS.some(
  //     (s) =>
  //       s.time.toLowerCase() === formattedTime.toLowerCase() &&
  //       s.period === newPeriod,
  //   );

  //   if (exists) return toast.error("Slot already exists");

  //   try {
  //     const slot = {
  //       time: formattedTime,
  //       period: newPeriod,
  //       disabled: false,
  //     };

  //     await createSteamSlot(slot);

  //     setCustomSlots((prev) => {
  //       const already = prev.some(
  //         (p) =>
  //           p.time.toLowerCase() === formattedTime.toLowerCase() &&
  //           p.period === newPeriod,
  //       );

  //       if (already) return prev;
  //       return [...prev, slot];
  //     });

  //     setNewTime("");
  //     toast.success("Slot added");
  //   } catch (e) {
  //     toast.error(e.message || "Failed to create slot");
  //   }
  // };
  // const handleDeleteSlot = async (slot) => {
  //   try {
  //     // await removeSteamSlot(slot);
  //     await removeSteamSlot(`${slot.period}-${slot.time}`);

  //     setCustomSlots((prev) =>
  //       prev.filter(
  //         (s) => `${s.period}-${s.time}` !== `${slot.period}-${slot.time}`,
  //       ),
  //     );

  //     setSlots((prev) => prev.filter((s) => s.time !== slot.time));

  //     toast.success("Slot deleted");
  //   } catch (e) {
  //     toast.error(e.message || "Failed to delete slot");
  //   }
  // };
  const handleDeleteSlot = async (slot) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${slot.time} (${slot.period}) slot?`,
    );

    if (!confirmDelete) return;

    try {
      await removeSteamSlot(`${slot.period}-${slot.time}`);

      setCustomSlots((prev) =>
        prev.filter(
          (s) => `${s.period}-${s.time}` !== `${slot.period}-${slot.time}`,
        ),
      );

      setSlots((prev) =>
        prev.filter(
          (s) => `${s.period}-${s.time}` !== `${slot.period}-${slot.time}`,
        ),
      );

      toast.success("Slot deleted");
    } catch (e) {
      toast.error(e.message || "Failed to delete slot");
    }
  };
  const handleBook = async () => {
    if (!selectedSlot) return toast.error("Select a time slot.");
    if (!selectedMember) return toast.error("Select a member.");

    const member = members.find((m) => m.id === selectedMember);
    if (!member) return toast.error("Member not found.");

    setSaving(true);
    try {
      await bookSteamSlot({
        date: selectedDate,
        slot: selectedSlot,
        memberId: selectedMember,
        memberName: member.name,
        memberPhone: member.phone,
      });

      toast.success(`${member.name} booked ${selectedSlot} 🌫️`);
      setSelectedSlot(null);
      setSelectedMember("");
    } catch (err) {
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
      <div className="slot-grid mb-16">
        {slots.map((s) => {
          const booking = bookings.find((b) => b.slot === s.time);
          const isBooked = !!booking;
          const isSel = selectedSlot === s.time;

          const isCustom = customSlots.some(
            (cs) => cs.time === s.time && cs.period === s.period,
          );

          return (
            <div
              key={s.time}
              className={`slot tap-scale ${
                isBooked ? "booked" : ""
              } ${isSel ? "selected" : ""}`}
              onClick={() =>
                !isBooked && setSelectedSlot(isSel ? null : s.time)
              }
            >
              <div className="slot-time">{s.time}</div>

              <div className="slot-label">
                {isBooked
                  ? booking.memberName
                  : isSel
                    ? "Selected ✓"
                    : "Available"}
              </div>

              {isBooked && (
                <button
                  style={{
                    marginTop: 5,
                    fontSize: 9,
                    background: "rgba(230,51,41,0.15)",
                    border: "none",
                    color: "var(--red)",
                    borderRadius: 3,
                    padding: "2px 6px",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancel(booking.id, booking.memberName, s.time);
                  }}
                >
                  Cancel
                </button>
              )}

              {/* ✅ FIXED DELETE BUTTON (NOW INSIDE RETURN) */}
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
              value: bookings.length,
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
              <div className={`stat-value ${s.val}`} style={{ fontSize: 24 }}>
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

              {/* <select
                className="form-input mt-12"
                value={newPeriod}
                onChange={(e) => setNewPeriod(e.target.value)}
              >
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
              </select> */}

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
