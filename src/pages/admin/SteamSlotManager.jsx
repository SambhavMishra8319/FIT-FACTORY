import { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  subscribeSteamSlots,
  bookSteamSlot,
  deleteSteamSlot,
  toggleSteamSlot,
  getAllMembers,
} from "../firebase/service";

const SLOTS = [
  { time: "6:00 AM", period: "Morning" },
  { time: "7:00 AM", period: "Morning" },
  { time: "8:00 AM", period: "Morning" },
  { time: "9:00 AM", period: "Morning" },
  { time: "5:00 PM", period: "Evening" },
  { time: "6:00 PM", period: "Evening" },
  { time: "7:00 PM", period: "Evening" },
  { time: "8:00 PM", period: "Evening" },
];

export default function SteamSlotManager() {
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [slots, setSlots] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    getAllMembers().then(setMembers);
  }, []);

  useEffect(() => {
    const unsub = subscribeSteamSlots(date, setSlots);
    return () => unsub();
  }, [date]);

  const bookForMember = async () => {
    if (!selectedSlot || !selectedMember)
      return toast.error("Select slot + member");

    const m = members.find(x => x.id === selectedMember);

    try {
      await bookSteamSlot({
        date,
        slot: selectedSlot,
        memberId: m.id,
        memberName: m.name,
        memberPhone: m.phone,
        isAdmin: true,
      });

      toast.success("Booked by admin");
      setSelectedSlot(null);
      setSelectedMember("");
    } catch (e) {
      toast.error(e.message);
    }
  };

  const cancel = async (slot) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await deleteSteamSlot(slot.id);
      toast.success("Cancelled");
    } catch {
      toast.error("Failed");
    }
  };

  const toggleLock = async (slot) => {
    try {
      await toggleSteamSlot(slot.id, !slot.disabled);
      toast.success("Updated slot");
    } catch {
      toast.error("Failed");
    }
  };

  const booked = slots.filter(s => s.isBooked).length;

  return (
    <div className="page-enter">
      <div className="topbar">
        <div className="page-title">Steam Slot Manager (Admin)</div>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="form-input"
        />
      </div>

      <div className="stats-grid mb-16">
        <div className="stat-card s-green">
          <div className="stat-label">Total Slots</div>
          <div className="stat-value c-green">{SLOTS.length}</div>
        </div>
        <div className="stat-card s-red">
          <div className="stat-label">Booked</div>
          <div className="stat-value c-red">{booked}</div>
        </div>
        <div className="stat-card s-gold">
          <div className="stat-label">Available</div>
          <div className="stat-value c-gold">{SLOTS.length - booked}</div>
        </div>
      </div>

      <div className="grid-2">
        {/* SLOT GRID */}
        <div className="slot-grid">
          {SLOTS.map(slot => {
            const dbSlot = slots.find(s => s.slot === slot.time);

            return (
              <div
                key={slot.time}
                className={`slot ${dbSlot?.isBooked ? "booked" : ""}`}
              >
                <div className="slot-time">{slot.time}</div>

                <div className="slot-label">
                  {dbSlot?.isBooked ? dbSlot.memberName : "Available"}
                </div>

                {dbSlot?.isBooked && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => cancel(dbSlot)}
                  >
                    Cancel
                  </button>
                )}

                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => toggleLock(dbSlot || { id: slot.time })}
                >
                  {dbSlot?.disabled ? "Enable" : "Disable"}
                </button>
              </div>
            );
          })}
        </div>

        {/* ADMIN BOOK PANEL */}
        <div className="card">
          <div className="card-title">Admin Booking</div>

          <select
            className="form-input"
            value={selectedMember}
            onChange={e => setSelectedMember(e.target.value)}
          >
            <option value="">Select Member</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          <input
            className="form-input mt-12"
            placeholder="Selected Slot"
            value={selectedSlot || ""}
            readOnly
          />

          <button
            className="btn btn-primary mt-12"
            onClick={bookForMember}
          >
            Book Slot
          </button>
        </div>
      </div>
    </div>
  );
}