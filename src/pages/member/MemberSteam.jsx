import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import { format } from "date-fns";

import { useAuth } from "../../context/AuthContext";

import { useMembership } from "../../hooks/useMembership";

import { LockGate, ExpiryBanner } from "../../components/auth/LockGate";

import LoadingSkeleton from "../../components/member/ui/LoadingSkeleton";
import StatCard from "../../components/member/ui/StatCard";
import SectionHeader from "../../components/member/ui/SectionHeader";

import {
  subscribeSteamBookings,
  bookSteamSlot,
  requestSteamSlot,
  deleteSteamBooking,
  subscribeSteamSlots,
} from "../../firebase/service";

// const ALL_SLOTS = [
//   {
//     time: "6:00 AM",
//     period: "Morning",
//   },

//   {
//     time: "7:00 AM",
//     period: "Morning",
//   },

//   {
//     time: "6:00 PM",
//     period: "Evening",
//   },

//   {
//     time: "7:00 PM",
//     period: "Evening",
//   },
// ];
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
export default function MemberSteam() {
  const { membership, loading } = useMembership();

  const { profile } = useAuth();

  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );

  //   const [bookings, setBookings] = useState([]);

  //   const [selected, setSelected] = useState(null);

  //   const [saving, setSaving] = useState(false);
  //   useEffect(() => {
  //     const unsub = subscribeSteamBookings(selectedDate, setBookings);

  //     return () => unsub();
  //   }, [selectedDate]);
  //   useEffect(() => {
  //     const unsub =
  //       subscribeSteamSlots(
  //         selectedDate,
  //         setBookings
  //       );

  //     return () => unsub();
  //   }, [selectedDate]);
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const unsub = subscribeSteamBookings(selectedDate, setBookings);

    return () => unsub();
  }, [selectedDate]);

  useEffect(() => {
    const unsub = subscribeSteamSlots(setSlots);

    return () => unsub();
  }, []);
  // const bookedSlots = bookings.map((b) => b.slot);
  const getBooking = (slot) =>
    bookings.find(
      (b) => `${b.period}-${b.slot}` === `${slot.period}-${slot.time}`,
    );
  const bookedSlots = bookings
    .filter((b) => b.status === "confirmed" || b.status === "pending")
    .map((b) => `${b.period}-${b.slot}`);
  const myBookings = bookings.filter(
    (b) => b.memberId === membership?.memberId,
  );

  // const mySlots = myBookings.map((b) => `${b.period}-${b.slot}`);
  const mySlots = myBookings
    .filter((b) => b.status !== "rejected")
    .map((b) => `${b.period}-${b.slot}`);
  // const mySlots = myBookings.map((b) => b.slot);
  //   const [slots, setSlots] = useState([]);
  //   useEffect(() => {
  //     const unsub = subscribeSteamSlots(setSlots);

  //     return () => unsub();
  //   }, []);

  //   const available =
  //     ALL_SLOTS.length -
  //     bookedSlots.length;
  // const mergedSlots = [...ALL_SLOTS, ...slots];

  // // remove duplicate times
  // const displaySlots = mergedSlots.filter(
  //   (slot, index, self) =>
  //     index ===
  //     self.findIndex((s) => s.time === slot.time && s.period === slot.period),
  // );
  const mergedSlots = [...ALL_SLOTS, ...slots];

  // remove duplicates
  const displaySlots = mergedSlots.filter(
    (slot, index, self) =>
      index ===
      self.findIndex((s) => s.time === slot.time && s.period === slot.period),
  );
  const available = displaySlots.length - bookedSlots.length;
  // const bookSlot = async () => {
  //   if (!selected) {
  //     toast.error("Select a slot");
  //     return;
  //   }

  //   setSaving(true);

  //   try {
  //     await requestSteamSlot({
  //       date: selectedDate,
  //       slot: selected,

  //       memberId: membership.memberId,

  //       memberName: profile?.name,
  //     });
  //     // await bookSteamSlot({
  //     //   date: selectedDate,
  //     //   slot: selected,

  //     //   memberId: membership.memberId,

  //     //   memberName: profile?.name,
  //     // });

  //     toast.success("Request sent for approval 🌫️");

  //     setSelected(null);
  //   } catch (err) {
  //     toast.error(err.message || "Booking failed");
  //   } finally {
  //     setSaving(false);
  //   }
  // };
  const bookSlot = async () => {
    if (!selected) {
      toast.error("Select a slot");
      return;
    }

    setSaving(true);

    try {
      const [period, slotTime] = selected.split("-");

      await requestSteamSlot({
        date: selectedDate,
        slot: slotTime,
        period,

        memberId: membership.memberId,
        memberName: profile?.name,
      });

      toast.success("Request sent for approval 🌫️");

      setSelected(null);
    } catch (err) {
      toast.error(err.message || "Booking failed");
    } finally {
      setSaving(false);
    }
  };
  const cancelBooking = async (id, slot) => {
    if (!window.confirm(`Cancel ${slot} booking?`)) {
      return;
    }

    try {
      await deleteSteamBooking(id);

      toast.success("Cancelled");
    } catch (err) {
      toast.error("Could not cancel");
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <LockGate feature="steam" membership={membership}>
      <div className="page-enter">
        <div className="topbar">
          <div className="page-title">Steam Bath</div>

          <div className="topbar-right">
            <input
              type="date"
              className="form-input"
              value={selectedDate}
              min={format(new Date(), "yyyy-MM-dd")}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        <div className="page-body">
          <ExpiryBanner membership={membership} />

          <div className="stats-grid mb-16">
            <StatCard
              label="Available"
              value={available}
              cls="s-green"
              valueClass="c-green"
            />

            <StatCard
              label="Booked"
              value={bookedSlots.length}
              cls="s-red"
              valueClass="c-red"
            />

            <StatCard
              label="Duration"
              value="20"
              unit="min"
              cls="s-gold"
              valueClass="c-gold"
            />
          </div>

          {["Morning", "Evening"].map((period) => (
            <div key={period}>
              <SectionHeader title={`${period} Slots`} />

              <div className="slot-grid mb-16">
                {displaySlots
                  .filter(
                    (s) => s.period?.toLowerCase() === period.toLowerCase(),
                  )
                  .map((slot) => {
                    const booking = myBookings
                      .filter(
                        (b) =>
                          `${b.period}-${b.slot}` ===
                          `${slot.period}-${slot.time}`,
                      )
                      .sort(
                        (a, b) => b.createdAt?.seconds - a.createdAt?.seconds,
                      )[0];
                    const isBooked =
                      bookedSlots.includes(`${slot.period}-${slot.time}`) &&
                      !mySlots.includes(`${slot.period}-${slot.time}`);
                    // const isMine = mySlots.includes(slot.time);
                    // const isMine = mySlots.includes(
                    //   `${slot.period}-${slot.time}`,
                    // );
                    // const isMine = booking && booking.status !== "rejected";
                    const isMine = ["pending", "confirmed"].includes(
                      booking?.status,
                    );
                    // console.log("All Slots:", displaySlots);
                    // const isSelected = selected === slot.time;
                    const isSelected =
                      selected === `${slot.period}-${slot.time}`;

                    return (
                      <div
                        key={`${slot.period}-${slot.time}`}
                        className={`slot ${isBooked ? "booked" : ""} ${
                          isMine || isSelected ? "selected" : ""
                        }`}
                        //                         onClick={() => {
                        //   if (!isBooked && !booking?.status || booking?.status === "rejected") {
                        //     setSelected(`${slot.period}-${slot.time}`);
                        //   }
                        // }}
                        // onClick={() => {

                        //   const key = `${slot.period}-${slot.time}`;
                        //   const booking = getBooking(slot);

                        //   const isBlocked =
                        //     booking &&
                        //     (booking.status === "pending" ||
                        //       booking.status === "confirmed");

                        //   if (!isBlocked) {
                        //     setSelected(key);
                        //   }
                        // }}
                        // onClick={() => {
                        //   const key = `${slot.period}-${slot.time}`;

                        //   const booking = myBookings.find(
                        //     (b) => `${b.period}-${b.slot}` === key,
                        //   );

                        //   const status = booking?.status;
                        //   //   const isActive = booking && ["pending", "confirmed"].includes(booking.status);

                        //   //   if (!isActive) {
                        //   //     setSelected(key);
                        //   //   }
                        //   const isBlocked = myBookings.some(
                        //     (b) =>
                        //       `${b.period}-${b.slot}` === key &&
                        //       ["pending", "confirmed"].includes(b.status),
                        //   );

                        //   if (!isBlocked) {
                        //     setSelected(key);
                        //   }
                        // }}
                        onClick={() => {
  const key = `${slot.period}-${slot.time}`;

  // Someone else already booked it
  const alreadyTaken = bookedSlots.includes(key);

  // My active booking exists
  const myActiveBooking = myBookings.some(
    (b) =>
      `${b.period}-${b.slot}` === key &&
      ["pending", "confirmed"].includes(b.status)
  );

  // Prevent selecting booked slots
  if (alreadyTaken && !myActiveBooking) {
    toast.error("This slot is already booked");
    return;
  }

  // Allow only if not actively booked by me
  if (!myActiveBooking) {
    setSelected(key);
  }
}}
                      >
                        <div className="slot-time">{slot.time}</div>
                        <div className="slot-label">
                          {booking
                            ? booking.status === "pending"
                              ? "Pending Approval"
                              : booking.status === "confirmed"
                                ? "✓ Confirmed"
                                : "Rejected → Rebook allowed"
                            : isBooked
                              ? "Taken"
                              : "Available"}
                        </div>
                        {booking && booking.status !== "rejected" && (
                          <button
                            className="btn btn-sm"
                            onClick={(e) => {
                              e.stopPropagation();

                              const booking = myBookings.find(
                                (b) =>
                                  `${b.period}-${b.slot}` ===
                                  `${slot.period}-${slot.time}`,
                              );

                              if (booking) {
                                cancelBooking(booking.id, slot.time);
                              }
                            }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}

          {selected && (
            <div className="card">
              <div
                style={{
                  marginBottom: 12,
                }}
              >
                Confirm booking at <strong>{selected}</strong>?
              </div>

              <button
                className="btn btn-primary"
                onClick={bookSlot}
                disabled={saving}
              >
                {saving ? "Booking..." : "Confirm 🌫️"}
              </button>
            </div>
          )}
        </div>
      </div>
    </LockGate>
  );
}
