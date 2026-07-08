// import { useEffect, useState } from "react";

// import toast from "react-hot-toast";

// import { format } from "date-fns";

// import { useAuth } from "../../context/AuthContext";

// import { useMembership } from "../../hooks/useMembership";

// import { LockGate, ExpiryBanner } from "../../components/auth/LockGate";

// import LoadingSkeleton from "../../components/member/ui/LoadingSkeleton";
// import StatCard from "../../components/member/ui/StatCard";
// import SectionHeader from "../../components/member/ui/SectionHeader";

// import {
//   subscribeSteamBookings,
//   bookSteamSlot,
//   requestSteamSlot,
//   deleteSteamBooking,
//   subscribeSteamSlots,
// } from "../../firebase/service";

// // const ALL_SLOTS = [
// //   {
// //     time: "6:00 AM",
// //     period: "Morning",
// //   },

// //   {
// //     time: "7:00 AM",
// //     period: "Morning",
// //   },

// //   {
// //     time: "6:00 PM",
// //     period: "Evening",
// //   },

// //   {
// //     time: "7:00 PM",
// //     period: "Evening",
// //   },
// // ];
// const ALL_SLOTS = [
//   { time: "6:00 AM", period: "Morning" },
//   { time: "7:00 AM", period: "Morning" },
//   { time: "8:00 AM", period: "Morning" },
//   { time: "9:00 AM", period: "Morning" },

//   { time: "5:00 PM", period: "Evening" },
//   { time: "6:00 PM", period: "Evening" },
//   { time: "7:00 PM", period: "Evening" },
//   { time: "8:00 PM", period: "Evening" },
// ];
// export default function MemberSteam() {
//   const { membership, loading } = useMembership();

//   const { profile } = useAuth();

//   const [selectedDate, setSelectedDate] = useState(
//     format(new Date(), "yyyy-MM-dd"),
//   );

//   //   const [bookings, setBookings] = useState([]);

//   //   const [selected, setSelected] = useState(null);

//   //   const [saving, setSaving] = useState(false);
//   //   useEffect(() => {
//   //     const unsub = subscribeSteamBookings(selectedDate, setBookings);

//   //     return () => unsub();
//   //   }, [selectedDate]);
//   //   useEffect(() => {
//   //     const unsub =
//   //       subscribeSteamSlots(
//   //         selectedDate,
//   //         setBookings
//   //       );

//   //     return () => unsub();
//   //   }, [selectedDate]);
//   const [bookings, setBookings] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [slots, setSlots] = useState([]);

//   useEffect(() => {
//     const unsub = subscribeSteamBookings(selectedDate, setBookings);

//     return () => unsub();
//   }, [selectedDate]);

//   useEffect(() => {
//     const unsub = subscribeSteamSlots(setSlots);

//     return () => unsub();
//   }, []);
//   // const bookedSlots = bookings.map((b) => b.slot);
//   const getBooking = (slot) =>
//     bookings.find(
//       (b) => `${b.period}-${b.slot}` === `${slot.period}-${slot.time}`,
//     );
//   const bookedSlots = bookings
//     .filter((b) => b.status === "confirmed" || b.status === "pending")
//     .map((b) => `${b.period}-${b.slot}`);
//   const myBookings = bookings.filter(
//     (b) => b.memberId === membership?.memberId,
//   );

//   // const mySlots = myBookings.map((b) => `${b.period}-${b.slot}`);
//   const mySlots = myBookings
//     .filter((b) => b.status !== "rejected")
//     .map((b) => `${b.period}-${b.slot}`);
//   // const mySlots = myBookings.map((b) => b.slot);
//   //   const [slots, setSlots] = useState([]);
//   //   useEffect(() => {
//   //     const unsub = subscribeSteamSlots(setSlots);

//   //     return () => unsub();
//   //   }, []);

//   //   const available =
//   //     ALL_SLOTS.length -
//   //     bookedSlots.length;
//   // const mergedSlots = [...ALL_SLOTS, ...slots];

//   // // remove duplicate times
//   // const displaySlots = mergedSlots.filter(
//   //   (slot, index, self) =>
//   //     index ===
//   //     self.findIndex((s) => s.time === slot.time && s.period === slot.period),
//   // );
//   const mergedSlots = [...ALL_SLOTS, ...slots];

//   // remove duplicates
//   const displaySlots = mergedSlots.filter(
//     (slot, index, self) =>
//       index ===
//       self.findIndex((s) => s.time === slot.time && s.period === slot.period),
//   );
//   const available = displaySlots.length - bookedSlots.length;
//   // const bookSlot = async () => {
//   //   if (!selected) {
//   //     toast.error("Select a slot");
//   //     return;
//   //   }

//   //   setSaving(true);

//   //   try {
//   //     await requestSteamSlot({
//   //       date: selectedDate,
//   //       slot: selected,

//   //       memberId: membership.memberId,

//   //       memberName: profile?.name,
//   //     });
//   //     // await bookSteamSlot({
//   //     //   date: selectedDate,
//   //     //   slot: selected,

//   //     //   memberId: membership.memberId,

//   //     //   memberName: profile?.name,
//   //     // });

//   //     toast.success("Request sent for approval 🌫️");

//   //     setSelected(null);
//   //   } catch (err) {
//   //     toast.error(err.message || "Booking failed");
//   //   } finally {
//   //     setSaving(false);
//   //   }
//   // };
//   const bookSlot = async () => {
//     if (!selected) {
//       toast.error("Select a slot");
//       return;
//     }

//     setSaving(true);

//     try {
//       const [period, slotTime] = selected.split("-");

//       await requestSteamSlot({
//         date: selectedDate,
//         slot: slotTime,
//         period,

//         memberId: membership.memberId,
//         memberName: profile?.name,
//       });

//       toast.success("Request sent for approval 🌫️");

//       setSelected(null);
//     } catch (err) {
//       toast.error(err.message || "Booking failed");
//     } finally {
//       setSaving(false);
//     }
//   };
//   const cancelBooking = async (id, slot) => {
//     if (!window.confirm(`Cancel ${slot} booking?`)) {
//       return;
//     }

//     try {
//       await deleteSteamBooking(id);

//       toast.success("Cancelled");
//     } catch (err) {
//       toast.error("Could not cancel");
//     }
//   };

//   if (loading) {
//     return <LoadingSkeleton />;
//   }

//   return (
//     <LockGate feature="steam" membership={membership}>
//       <div className="page-enter">
//         <div className="topbar">
//           <div className="page-title">Steam Bath</div>

//           <div className="topbar-right">
//             <input
//               type="date"
//               className="form-input"
//               value={selectedDate}
//               min={format(new Date(), "yyyy-MM-dd")}
//               onChange={(e) => setSelectedDate(e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="page-body">
//           <ExpiryBanner membership={membership} />

//           <div className="stats-grid mb-16">
//             <StatCard
//               label="Available"
//               value={available}
//               cls="s-green"
//               valueClass="c-green"
//             />

//             <StatCard
//               label="Booked"
//               value={bookedSlots.length}
//               cls="s-red"
//               valueClass="c-red"
//             />

//             <StatCard
//               label="Duration"
//               value="20"
//               unit="min"
//               cls="s-gold"
//               valueClass="c-gold"
//             />
//           </div>

//           {["Morning", "Evening"].map((period) => (
//             <div key={period}>
//               <SectionHeader title={`${period} Slots`} />

//               <div className="slot-grid mb-16">
//                 {displaySlots
//                   .filter(
//                     (s) => s.period?.toLowerCase() === period.toLowerCase(),
//                   )
//                   .map((slot) => {
//                     const booking = myBookings
//                       .filter(
//                         (b) =>
//                           `${b.period}-${b.slot}` ===
//                           `${slot.period}-${slot.time}`,
//                       )
//                       .sort(
//                         (a, b) => b.createdAt?.seconds - a.createdAt?.seconds,
//                       )[0];
//                     const isBooked =
//                       bookedSlots.includes(`${slot.period}-${slot.time}`) &&
//                       !mySlots.includes(`${slot.period}-${slot.time}`);
//                     // const isMine = mySlots.includes(slot.time);
//                     // const isMine = mySlots.includes(
//                     //   `${slot.period}-${slot.time}`,
//                     // );
//                     // const isMine = booking && booking.status !== "rejected";
//                     const isMine = ["pending", "confirmed"].includes(
//                       booking?.status,
//                     );
//                     // console.log("All Slots:", displaySlots);
//                     // const isSelected = selected === slot.time;
//                     const isSelected =
//                       selected === `${slot.period}-${slot.time}`;

//                     return (
//                       <div
//                         key={`${slot.period}-${slot.time}`}
//                         className={`slot ${isBooked ? "booked" : ""} ${
//                           isMine || isSelected ? "selected" : ""
//                         }`}
//                         //                         onClick={() => {
//                         //   if (!isBooked && !booking?.status || booking?.status === "rejected") {
//                         //     setSelected(`${slot.period}-${slot.time}`);
//                         //   }
//                         // }}
//                         // onClick={() => {

//                         //   const key = `${slot.period}-${slot.time}`;
//                         //   const booking = getBooking(slot);

//                         //   const isBlocked =
//                         //     booking &&
//                         //     (booking.status === "pending" ||
//                         //       booking.status === "confirmed");

//                         //   if (!isBlocked) {
//                         //     setSelected(key);
//                         //   }
//                         // }}
//                         // onClick={() => {
//                         //   const key = `${slot.period}-${slot.time}`;

//                         //   const booking = myBookings.find(
//                         //     (b) => `${b.period}-${b.slot}` === key,
//                         //   );

//                         //   const status = booking?.status;
//                         //   //   const isActive = booking && ["pending", "confirmed"].includes(booking.status);

//                         //   //   if (!isActive) {
//                         //   //     setSelected(key);
//                         //   //   }
//                         //   const isBlocked = myBookings.some(
//                         //     (b) =>
//                         //       `${b.period}-${b.slot}` === key &&
//                         //       ["pending", "confirmed"].includes(b.status),
//                         //   );

//                         //   if (!isBlocked) {
//                         //     setSelected(key);
//                         //   }
//                         // }}
//                         onClick={() => {
//   const key = `${slot.period}-${slot.time}`;

//   // Someone else already booked it
//   const alreadyTaken = bookedSlots.includes(key);

//   // My active booking exists
//   const myActiveBooking = myBookings.some(
//     (b) =>
//       `${b.period}-${b.slot}` === key &&
//       ["pending", "confirmed"].includes(b.status)
//   );

//   // Prevent selecting booked slots
//   if (alreadyTaken && !myActiveBooking) {
//     toast.error("This slot is already booked");
//     return;
//   }

//   // Allow only if not actively booked by me
//   if (!myActiveBooking) {
//     setSelected(key);
//   }
// }}
//                       >
//                         <div className="slot-time">{slot.time}</div>
//                         <div className="slot-label">
//                           {booking
//                             ? booking.status === "pending"
//                               ? "Pending Approval"
//                               : booking.status === "confirmed"
//                                 ? "✓ Confirmed"
//                                 : "Rejected → Rebook allowed"
//                             : isBooked
//                               ? "Taken"
//                               : "Available"}
//                         </div>
//                         {booking && booking.status !== "rejected" && (
//                           <button
//                             className="btn btn-sm"
//                             onClick={(e) => {
//                               e.stopPropagation();

//                               const booking = myBookings.find(
//                                 (b) =>
//                                   `${b.period}-${b.slot}` ===
//                                   `${slot.period}-${slot.time}`,
//                               );

//                               if (booking) {
//                                 cancelBooking(booking.id, slot.time);
//                               }
//                             }}
//                           >
//                             Cancel
//                           </button>
//                         )}
//                       </div>
//                     );
//                   })}
//               </div>
//             </div>
//           ))}

//           {selected && (
//             <div className="card">
//               <div
//                 style={{
//                   marginBottom: 12,
//                 }}
//               >
//                 Confirm booking at <strong>{selected}</strong>?
//               </div>

//               <button
//                 className="btn btn-primary"
//                 onClick={bookSlot}
//                 disabled={saving}
//               >
//                 {saving ? "Booking..." : "Confirm 🌫️"}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </LockGate>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { format } from "date-fns";

import { useAuth } from "../../context/AuthContext";
import { useMembership } from "../../hooks/useMembership";
import { LockGate, ExpiryBanner } from "../../components/auth/LockGate";

import LoadingSkeleton from "../../components/member/ui/LoadingSkeleton";
import StatCard from "../../components/member/ui/StatCard";
import SectionHeader from "../../components/member/ui/SectionHeader";
import EmptyState from "../../components/member/ui/EmptyState";
import "../../styles/memberSteam.css"
import {
  subscribeSteamBookings,
  requestSteamSlot,
  deleteSteamBooking,
  subscribeSteamSlots,
} from "../../firebase/service";

const DEFAULT_SLOTS = [
  { time: "6:00 AM", period: "Morning" },
  { time: "7:00 AM", period: "Morning" },
  { time: "8:00 AM", period: "Morning" },
  { time: "9:00 AM", period: "Morning" },
  { time: "5:00 PM", period: "Evening" },
  { time: "6:00 PM", period: "Evening" },
  { time: "7:00 PM", period: "Evening" },
  { time: "8:00 PM", period: "Evening" },
];

const statusText = (status = "pending") => {
  if (status === "confirmed" || status === "approved") return "✅ Approved";
  if (status === "rejected") return "❌ Rejected";
  if (status === "completed") return "✅ Completed";
  if (status === "cancelled") return "Cancelled";
  return "⏳ Pending";
};

export default function MemberSteam() {
  const { membership, loading } = useMembership();
  const { profile } = useAuth();

  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [bookings, setBookings] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = subscribeSteamBookings(selectedDate, setBookings);
    return () => unsub();
  }, [selectedDate]);

  useEffect(() => {
    const unsub = subscribeSteamSlots(setSlots);
    return () => unsub();
  }, []);

  const displaySlots = useMemo(() => {
    const merged = [...DEFAULT_SLOTS, ...slots];

    return merged.filter(
      (slot, index, self) =>
        index ===
        self.findIndex(
          (s) =>
            String(s.time) === String(slot.time) &&
            String(s.period) === String(slot.period)
        )
    );
  }, [slots]);

  const myBookings = useMemo(() => {
    return bookings.filter((b) => b.memberId === membership?.memberId);
  }, [bookings, membership?.memberId]);

  // const activeBookings = useMemo(() => {
  //   return bookings.filter((b) =>
  //     ["pending", "confirmed", "approved"].includes(b.status || "pending")
  //   );
  // }, [bookings]);
const bookedBookings = useMemo(() => {
  return bookings.filter((b) =>
    ["confirmed", "approved", "completed"].includes(b.status || "pending")
  );
}, [bookings]);

const blockedBookings = useMemo(() => {
  return bookings.filter((b) =>
    ["pending", "confirmed", "approved"].includes(b.status || "pending")
  );
}, [bookings]);
  const myActiveBooking = useMemo(() => {
    return myBookings.find((b) =>
      ["pending", "confirmed", "approved"].includes(b.status || "pending")
    );
  }, [myBookings]);

  const history = useMemo(() => {
    return [...myBookings].sort((a, b) => {
      const aTime = a.createdAt?.seconds || 0;
      const bTime = b.createdAt?.seconds || 0;
      return bTime - aTime;
    });
  }, [myBookings]);

  const slotKey = (slot) => `${slot.period}-${slot.time}`;

  const getBookingForSlot = (slot) => {
    return bookings.find(
      (b) =>
        String(b.period) === String(slot.period) &&
        String(b.slot) === String(slot.time) &&
        ["pending", "confirmed", "approved"].includes(b.status || "pending")
    );
  };

  const selectedSlot = useMemo(() => {
    if (!selected) return null;
    return displaySlots.find((s) => slotKey(s) === selected);
  }, [selected, displaySlots]);

  // const availableCount = displaySlots.length - activeBookings.length;
  const availableCount = displaySlots.length - blockedBookings.length;

  const bookSlot = async () => {
    if (!selectedSlot) {
      toast.error("Select a slot first");
      return;
    }

    if (!membership?.memberId) {
      toast.error("Member account not linked");
      return;
    }

    setSaving(true);

    try {
      await requestSteamSlot({
        date: selectedDate,
        slot: selectedSlot.time,
        period: selectedSlot.period,
        memberId: membership.memberId,
        memberName: profile?.name || membership?.memberData?.name || "Member",
        memberPhone: profile?.phone || membership?.memberData?.phone || "",
      });

      toast.success("Steam request sent for approval 🌫️");
      setSelected(null);
    } catch (err) {
      toast.error(err.message || "Booking failed");
    } finally {
      setSaving(false);
    }
  };

  const cancelBooking = async (booking) => {
    const ok = window.confirm(`Cancel ${booking.slot} steam booking?`);
    if (!ok) return;

    try {
      await deleteSteamBooking(booking.id);
      toast.success("Booking cancelled");
    } catch {
      toast.error("Could not cancel booking");
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <LockGate feature="steam" membership={membership}>
      <div className="page-enter">
        <div className="topbar">
          <div>
            <div className="page-title">Steam Bath</div>
            <div className="page-subtitle">Book steam slot and track approval</div>
          </div>

          <div className="topbar-right">
            <input
              type="date"
              className="form-input"
              value={selectedDate}
              min={format(new Date(), "yyyy-MM-dd")}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelected(null);
              }}
            />
          </div>
        </div>

        <div className="page-body">
          <ExpiryBanner membership={membership} />

          <div className="stats-grid mb-16">
            <StatCard
              label="Available"
              value={availableCount}
              cls="s-green"
              valueClass="c-green"
            />

            <StatCard
              label="Booked"
              // value={activeBookings.length}
              value={bookedBookings.length}
              cls="s-red"
              valueClass="c-red"
            />

            <StatCard
              label="My Requests"
              value={myBookings.length}
              cls="s-blue"
              valueClass="c-blue"
            />

            <StatCard
              label="Duration"
              value="20"
              unit="min"
              cls="s-gold"
              valueClass="c-gold"
            />
          </div>

          {myActiveBooking && (
            <div className="card mb-16">
              <div className="card-title">My Current Booking</div>

              <div className="activity-item">
                <div className="activity-dot gold" />
                <div style={{ flex: 1 }}>
                  <div className="activity-text">
                    {myActiveBooking.period} · {myActiveBooking.slot}
                  </div>
                  <div className="activity-time">
                    {selectedDate} · {statusText(myActiveBooking.status)}
                  </div>
                </div>

                {(myActiveBooking.status || "pending") === "pending" && (
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => cancelBooking(myActiveBooking)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}

          {["Morning", "Evening"].map((period) => (
            <div key={period} className="mb-16">
              <SectionHeader title={`${period} Slots`} />

              <div className="slot-grid">
                {displaySlots
                  .filter(
                    (s) =>
                      String(s.period).toLowerCase() === period.toLowerCase()
                  )
                  .map((slot) => {
                    const key = slotKey(slot);
                    const booking = getBookingForSlot(slot);
                    const isMine = booking?.memberId === membership?.memberId;
                    const isTaken = booking && !isMine;
                    const isSelected = selected === key;

                    return (
                      <div
                        key={key}
                        // className={`slot ${isTaken ? "booked" : ""} ${
                        //   isSelected || isMine ? "selected" : ""
                        // }`}
                        className={`slot 
  ${isTaken ? "booked" : ""} 
  ${isSelected ? "selected" : ""} 
  ${isMine ? "mine" : ""}
`}
                        onClick={() => {
                          if (isTaken) {
                            toast.error("This slot is already booked");
                            return;
                          }

                          if (isMine) return;

                          setSelected(key);
                        }}
                      >
                        <div className="slot-time">{slot.time}</div>

                        <div className="slot-label">
                          {isMine
                            ? statusText(booking.status)
                            : isTaken
                            ? "Booked"
                            : isSelected
                            ? "Selected"
                            : "Available"}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}

          {selectedSlot && (
            <div className="card mb-16">
              <div className="card-title">Confirm Steam Booking</div>

              <div className="info-box warning">
                Request steam bath for{" "}
                <strong>
                  {selectedSlot.period} · {selectedSlot.time}
                </strong>{" "}
                on <strong>{selectedDate}</strong>.
                <br />
                Admin approval is required.
              </div>

              <button
                className="btn btn-primary tap-scale btn-ripple mt-12"
                style={{ width: "100%", justifyContent: "center", padding: 13 }}
                onClick={bookSlot}
                disabled={saving}
              >
                {saving ? "Sending Request..." : "Send Request →"}
              </button>
            </div>
          )}

          <SectionHeader title="Steam History" />

          {history.length === 0 ? (
            <EmptyState
              icon="🌫️"
              title="NO STEAM BOOKINGS"
              desc="Select a slot above and send your first steam request."
            />
          ) : (
            <div className="card">
              {history.map((b) => (
                <div key={b.id} className="activity-item">
                  <div
                    className={`activity-dot ${
                      b.status === "rejected"
                        ? "red"
                        : b.status === "completed"
                        ? "green"
                        : "gold"
                    }`}
                  />

                  <div style={{ flex: 1 }}>
                    <div className="activity-text">
                      {b.period || "Slot"} · {b.slot || b.time}
                    </div>

                    <div className="activity-time">
                      {b.date || selectedDate} · {statusText(b.status)}
                    </div>
                  </div>

                  {(b.status || "pending") === "pending" && (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => cancelBooking(b)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </LockGate>
  );
}