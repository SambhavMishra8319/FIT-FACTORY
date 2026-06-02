// // // // import { useEffect, useMemo, useState } from "react";
// // // // import toast from "react-hot-toast";
// // // // import { format } from "date-fns";

// // // // import {
// // // //   getAllMembers,
// // // //   bookMassageSession,
// // // //   getMassageBookings,
// // // // } from "../../firebase/service";

// // // // import "../../styles/massageChair.css";

// // // // export default function MassageChair() {
// // // //   const [members, setMembers] = useState([]);
// // // //   const [bookings, setBookings] = useState([]);
// // // //   const [selectedMemberId, setSelectedMemberId] = useState("");
// // // //   const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
// // // //   const [time, setTime] = useState("");
// // // //   const [notes, setNotes] = useState("");
// // // //   const [search, setSearch] = useState("");
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [booking, setBooking] = useState(false);

// // // //   async function loadData() {
// // // //     try {
// // // //       setLoading(true);

// // // //       const [memberData, bookingData] = await Promise.all([
// // // //         getAllMembers(),
// // // //         getMassageBookings(),
// // // //       ]);

// // // //       setMembers(memberData || []);
// // // //       setBookings(bookingData || []);
// // // //     } catch (error) {
// // // //       console.error(error);
// // // //       toast.error("Failed to load massage data");
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   }

// // // //   useEffect(() => {
// // // //     loadData();
// // // //   }, []);

// // // //   const filteredMembers = useMemo(() => {
// // // //     const s = search.toLowerCase().trim();

// // // //     if (!s) return members;

// // // //     return members.filter((m) => {
// // // //       return (
// // // //         m.name?.toLowerCase().includes(s) ||
// // // //         m.fullName?.toLowerCase().includes(s) ||
// // // //         m.phone?.toLowerCase().includes(s) ||
// // // //         m.memberId?.toLowerCase().includes(s)
// // // //       );
// // // //     });
// // // //   }, [members, search]);

// // // //   const selectedMember = useMemo(() => {
// // // //     return members.find((m) => m.id === selectedMemberId);
// // // //   }, [members, selectedMemberId]);

// // // //   async function handleBookMassage() {
// // // //     if (!selectedMember) {
// // // //       toast.error("Please select a member");
// // // //       return;
// // // //     }

// // // //     try {
// // // //       setBooking(true);

// // // //       await bookMassageSession(selectedMember, {
// // // //         date,
// // // //         time,
// // // //         notes,
// // // //       });

// // // //       toast.success("Massage session booked");

// // // //       setSelectedMemberId("");
// // // //       setTime("");
// // // //       setNotes("");

// // // //       await loadData();
// // // //     } catch (error) {
// // // //       console.error(error);
// // // //       toast.error(error.message || "Booking failed");
// // // //     } finally {
// // // //       setBooking(false);
// // // //     }
// // // //   }

// // // //   function getRemaining(member) {
// // // //     if (member?.massageSessionsRemaining === "unlimited") return "Unlimited";
// // // //     return member?.massageSessionsRemaining ?? 0;
// // // //   }

// // // //   return (
// // // //     <div className="page-enter massage-page">
// // // //       <div className="topbar">
// // // //         <div>
// // // //           <div className="page-title">Massage Chair</div>
// // // //           <div className="page-subtitle">
// // // //             Book and manage free massage chair sessions
// // // //           </div>
// // // //         </div>
// // // //       </div>

// // // //       <div className="page-body">
// // // //         <div className="massage-grid">
// // // //           <div className="massage-card">
// // // //             <h3>Book Massage Session</h3>

// // // //             <label>Search Member</label>
// // // //             <input
// // // //               type="text"
// // // //               placeholder="Search by name, phone or member ID..."
// // // //               value={search}
// // // //               onChange={(e) => setSearch(e.target.value)}
// // // //             />

// // // //             <label>Select Member</label>
// // // //             <select
// // // //               value={selectedMemberId}
// // // //               onChange={(e) => setSelectedMemberId(e.target.value)}
// // // //             >
// // // //               <option value="">Choose member</option>

// // // //               {filteredMembers.map((m) => (
// // // //                 <option key={m.id} value={m.id}>
// // // //                   {m.name || m.fullName || "Unnamed"} — Remaining:{" "}
// // // //                   {getRemaining(m)}
// // // //                 </option>
// // // //               ))}
// // // //             </select>

// // // //             {selectedMember && (
// // // //               <div className="selected-member-box">
// // // //                 <div>
// // // //                   <strong>{selectedMember.name || selectedMember.fullName}</strong>
// // // //                   <span>{selectedMember.phone}</span>
// // // //                 </div>

// // // //                 <div>
// // // //                   <p>Allowed</p>
// // // //                   <b>
// // // //                     {selectedMember.massageSessionsAllowed === "unlimited"
// // // //                       ? "Unlimited"
// // // //                       : selectedMember.massageSessionsAllowed ?? 0}
// // // //                   </b>
// // // //                 </div>

// // // //                 <div>
// // // //                   <p>Used</p>
// // // //                   <b>{selectedMember.massageSessionsUsed ?? 0}</b>
// // // //                 </div>

// // // //                 <div>
// // // //                   <p>Remaining</p>
// // // //                   <b>{getRemaining(selectedMember)}</b>
// // // //                 </div>
// // // //               </div>
// // // //             )}

// // // //             <label>Date</label>
// // // //             <input
// // // //               type="date"
// // // //               value={date}
// // // //               onChange={(e) => setDate(e.target.value)}
// // // //             />

// // // //             <label>Time</label>
// // // //             <input
// // // //               type="time"
// // // //               value={time}
// // // //               onChange={(e) => setTime(e.target.value)}
// // // //             />

// // // //             <label>Notes</label>
// // // //             <textarea
// // // //               placeholder="Optional notes..."
// // // //               value={notes}
// // // //               onChange={(e) => setNotes(e.target.value)}
// // // //             />

// // // //             <button disabled={booking} onClick={handleBookMassage}>
// // // //               {booking ? "Booking..." : "Book Massage"}
// // // //             </button>
// // // //           </div>

// // // //           <div className="massage-card">
// // // //             <h3>Recent Massage Bookings</h3>

// // // //             {loading ? (
// // // //               <div className="empty-box">Loading...</div>
// // // //             ) : bookings.length === 0 ? (
// // // //               <div className="empty-box">No massage bookings yet.</div>
// // // //             ) : (
// // // //               <div className="massage-table-wrap">
// // // //                 <table className="massage-table">
// // // //                   <thead>
// // // //                     <tr>
// // // //                       <th>Member</th>
// // // //                       <th>Phone</th>
// // // //                       <th>Date</th>
// // // //                       <th>Time</th>
// // // //                       <th>Status</th>
// // // //                     </tr>
// // // //                   </thead>

// // // //                   <tbody>
// // // //                     {bookings.map((b) => (
// // // //                       <tr key={b.id}>
// // // //                         <td>{b.memberName || "-"}</td>
// // // //                         <td>{b.phone || "-"}</td>
// // // //                         <td>{b.date || "-"}</td>
// // // //                         <td>{b.time || "-"}</td>
// // // //                         <td>
// // // //                           <span className="status-pill">{b.status}</span>
// // // //                         </td>
// // // //                       </tr>
// // // //                     ))}
// // // //                   </tbody>
// // // //                 </table>
// // // //               </div>
// // // //             )}
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }
// // // import { useEffect, useMemo, useState } from "react";
// // // import toast from "react-hot-toast";
// // // import { format } from "date-fns";
// // // import { Search, Armchair, CalendarDays, Clock, UserRound } from "lucide-react";

// // // import {
// // //   getAllMembers,
// // //   bookMassageSession,
// // //   getMassageBookings,
// // // } from "../../firebase/service";

// // // import "../../styles/massageChair.css";

// // // export default function MassageChair() {
// // //   const [members, setMembers] = useState([]);
// // //   const [bookings, setBookings] = useState([]);
// // //   const [selectedMemberId, setSelectedMemberId] = useState("");
// // //   const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
// // //   const [time, setTime] = useState("");
// // //   const [notes, setNotes] = useState("");
// // //   const [search, setSearch] = useState("");
// // //   const [loading, setLoading] = useState(true);
// // //   const [booking, setBooking] = useState(false);

// // //   async function loadData() {
// // //     try {
// // //       setLoading(true);

// // //       const [memberData, bookingData] = await Promise.all([
// // //         getAllMembers(),
// // //         getMassageBookings(),
// // //       ]);

// // //       setMembers(memberData || []);
// // //       setBookings(bookingData || []);
// // //     } catch (error) {
// // //       console.error(error);
// // //       toast.error("Failed to load massage chair data");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }

// // //   useEffect(() => {
// // //     loadData();
// // //   }, []);

// // //   const filteredMembers = useMemo(() => {
// // //     const keyword = search.toLowerCase().trim();
// // //     if (!keyword) return members;

// // //     return members.filter((m) => {
// // //       const name = (m.name || m.fullName || "").toLowerCase();
// // //       const phone = (m.phone || "").toLowerCase();
// // //       const memberId = (m.memberId || "").toLowerCase();

// // //       return (
// // //         name.includes(keyword) ||
// // //         phone.includes(keyword) ||
// // //         memberId.includes(keyword)
// // //       );
// // //     });
// // //   }, [members, search]);

// // //   const selectedMember = useMemo(() => {
// // //     return members.find((m) => m.id === selectedMemberId);
// // //   }, [members, selectedMemberId]);

// // //   function getRemaining(member) {
// // //     if (!member) return 0;
// // //     if (member.massageSessionsRemaining === "unlimited") return "Unlimited";
// // //     return Number(member.massageSessionsRemaining || 0);
// // //   }

// // //   function getAllowed(member) {
// // //     if (!member) return 0;
// // //     if (member.massageSessionsAllowed === "unlimited") return "Unlimited";
// // //     return Number(member.massageSessionsAllowed || 0);
// // //   }

// // //   async function handleBookMassage() {
// // //     if (!selectedMember) {
// // //       toast.error("Please select a member");
// // //       return;
// // //     }

// // //     if (!date) {
// // //       toast.error("Please select date");
// // //       return;
// // //     }

// // //     try {
// // //       setBooking(true);

// // //       await bookMassageSession(selectedMember, {
// // //         date,
// // //         time,
// // //         notes,
// // //       });

// // //       toast.success("Massage chair session booked");

// // //       setSelectedMemberId("");
// // //       setTime("");
// // //       setNotes("");

// // //       await loadData();
// // //     } catch (error) {
// // //       console.error(error);
// // //       toast.error(error.message || "Booking failed");
// // //     } finally {
// // //       setBooking(false);
// // //     }
// // //   }

// // //   const todayBookings = useMemo(() => {
// // //     const today = format(new Date(), "yyyy-MM-dd");
// // //     return bookings.filter((b) => b.date === today).length;
// // //   }, [bookings]);

// // //   return (
// // //     <div className="page-enter massage-page">
// // //       <div className="topbar">
// // //         <div>
// // //           <div className="page-title">Massage Chair</div>
// // //           <div className="page-subtitle">
// // //             Book massage sessions and auto-deduct free plan sessions
// // //           </div>
// // //         </div>
// // //       </div>

// // //       <div className="page-body">
// // //         <div className="massage-stats">
// // //           <div className="massage-stat-card">
// // //             <Armchair size={20} />
// // //             <div>
// // //               <p>Total Bookings</p>
// // //               <h3>{bookings.length}</h3>
// // //             </div>
// // //           </div>

// // //           <div className="massage-stat-card">
// // //             <CalendarDays size={20} />
// // //             <div>
// // //               <p>Today</p>
// // //               <h3>{todayBookings}</h3>
// // //             </div>
// // //           </div>

// // //           <div className="massage-stat-card">
// // //             <UserRound size={20} />
// // //             <div>
// // //               <p>Total Members</p>
// // //               <h3>{members.length}</h3>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         <div className="massage-grid">
// // //           <div className="massage-card">
// // //             <h3>Book Massage Session</h3>

// // //             <label>Search Member</label>
// // //             <div className="massage-search-box">
// // //               <Search size={16} />
// // //               <input
// // //                 type="text"
// // //                 placeholder="Search by name, phone or member ID..."
// // //                 value={search}
// // //                 onChange={(e) => setSearch(e.target.value)}
// // //               />
// // //             </div>

// // //             <label>Select Member</label>
// // //             <select
// // //               value={selectedMemberId}
// // //               onChange={(e) => setSelectedMemberId(e.target.value)}
// // //             >
// // //               <option value="">Choose member</option>

// // //               {filteredMembers.map((m) => (
// // //                 <option key={m.id} value={m.id}>
// // //                   {m.name || m.fullName || "Unnamed"} — Remaining: {getRemaining(m)}
// // //                 </option>
// // //               ))}
// // //             </select>

// // //             {selectedMember && (
// // //               <div className="selected-member-box">
// // //                 <div className="selected-member-main">
// // //                   <strong>{selectedMember.name || selectedMember.fullName}</strong>
// // //                   <span>{selectedMember.phone || "No phone"}</span>
// // //                 </div>

// // //                 <div>
// // //                   <p>Allowed</p>
// // //                   <b>{getAllowed(selectedMember)}</b>
// // //                 </div>

// // //                 <div>
// // //                   <p>Used</p>
// // //                   <b>{selectedMember.massageSessionsUsed || 0}</b>
// // //                 </div>

// // //                 <div>
// // //                   <p>Remaining</p>
// // //                   <b>{getRemaining(selectedMember)}</b>
// // //                 </div>
// // //               </div>
// // //             )}

// // //             <div className="massage-form-row">
// // //               <div>
// // //                 <label>Date</label>
// // //                 <input
// // //                   type="date"
// // //                   value={date}
// // //                   onChange={(e) => setDate(e.target.value)}
// // //                 />
// // //               </div>

// // //               <div>
// // //                 <label>Time</label>
// // //                 <input
// // //                   type="time"
// // //                   value={time}
// // //                   onChange={(e) => setTime(e.target.value)}
// // //                 />
// // //               </div>
// // //             </div>

// // //             <label>Notes</label>
// // //             <textarea
// // //               placeholder="Optional notes..."
// // //               value={notes}
// // //               onChange={(e) => setNotes(e.target.value)}
// // //             />

// // //             <button disabled={booking} onClick={handleBookMassage}>
// // //               {booking ? "Booking..." : "Book Massage"}
// // //             </button>
// // //           </div>

// // //           <div className="massage-card">
// // //             <div className="massage-card-head">
// // //               <h3>Recent Massage Bookings</h3>
// // //               <span>Latest first</span>
// // //             </div>

// // //             {loading ? (
// // //               <div className="empty-box">Loading...</div>
// // //             ) : bookings.length === 0 ? (
// // //               <div className="empty-box">No massage bookings yet.</div>
// // //             ) : (
// // //               <div className="massage-table-wrap">
// // //                 <table className="massage-table">
// // //                   <thead>
// // //                     <tr>
// // //                       <th>Member</th>
// // //                       <th>Phone</th>
// // //                       <th>Date</th>
// // //                       <th>Time</th>
// // //                       <th>Status</th>
// // //                     </tr>
// // //                   </thead>

// // //                   <tbody>
// // //                     {bookings.map((b) => (
// // //                       <tr key={b.id}>
// // //                         <td>{b.memberName || "-"}</td>
// // //                         <td>{b.phone || "-"}</td>
// // //                         <td>{b.date || "-"}</td>
// // //                         <td>
// // //                           <span className="time-chip">
// // //                             <Clock size={12} /> {b.time || "-"}
// // //                           </span>
// // //                         </td>
// // //                         <td>
// // //                           <span className="status-pill">{b.status || "booked"}</span>
// // //                         </td>
// // //                       </tr>
// // //                     ))}
// // //                   </tbody>
// // //                 </table>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // import { useEffect, useMemo, useState } from "react";
// // import toast from "react-hot-toast";
// // import { format } from "date-fns";

// // import {
// //   getAllMembers,
// //   bookMassageSession,
// //   getMassageBookings,
// // } from "../../firebase/service";

// // import "../../styles/massageChair.css";

// // export default function MassageChair() {
// //   const [members, setMembers] = useState([]);
// //   const [bookings, setBookings] = useState([]);

// //   const [selectedMemberId, setSelectedMemberId] = useState("");
// //   const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
// //   const [time, setTime] = useState("");
// //   const [notes, setNotes] = useState("");
// //   const [search, setSearch] = useState("");

// //   const [loadingMembers, setLoadingMembers] = useState(true);
// //   const [loadingBookings, setLoadingBookings] = useState(true);
// //   const [booking, setBooking] = useState(false);

// //   async function loadMembers() {
// //     try {
// //       setLoadingMembers(true);

// //       const data = await getAllMembers();
// //       console.log("MEMBERS OK", data);

// //       setMembers(data || []);
// //     } catch (error) {
// //       console.error("MEMBERS LOAD FAILED:", error);
// //       toast.error("Failed to load members");
// //     } finally {
// //       setLoadingMembers(false);
// //     }
// //   }

// //   async function loadBookings() {
// //     try {
// //       setLoadingBookings(true);

// //       const data = await getMassageBookings();
// //       console.log("MASSAGE BOOKINGS OK", data);

// //       setBookings(data || []);
// //     } catch (error) {
// //       console.error("MASSAGE BOOKINGS LOAD FAILED:", error);
// //       toast.error("Failed to load massage bookings. Check Firestore rules.");
// //     } finally {
// //       setLoadingBookings(false);
// //     }
// //   }

// //   async function loadData() {
// //     await loadMembers();
// //     await loadBookings();
// //   }

// //   useEffect(() => {
// //     loadData();
// //   }, []);

// //   const filteredMembers = useMemo(() => {
// //     const s = search.toLowerCase().trim();

// //     if (!s) return members;

// //     return members.filter((m) => {
// //       return (
// //         (m.name || "").toLowerCase().includes(s) ||
// //         (m.fullName || "").toLowerCase().includes(s) ||
// //         (m.phone || "").toLowerCase().includes(s) ||
// //         (m.memberId || "").toLowerCase().includes(s)
// //       );
// //     });
// //   }, [members, search]);

// //   const selectedMember = useMemo(() => {
// //     return members.find((m) => m.id === selectedMemberId);
// //   }, [members, selectedMemberId]);

// //   function getRemaining(member) {
// //     if (!member) return 0;

// //     if (member.massageSessionsRemaining === "unlimited") {
// //       return "Unlimited";
// //     }

// //     return member.massageSessionsRemaining ?? 0;
// //   }

// //   function getAllowed(member) {
// //     if (!member) return 0;

// //     if (member.massageSessionsAllowed === "unlimited") {
// //       return "Unlimited";
// //     }

// //     return member.massageSessionsAllowed ?? 0;
// //   }

// //   async function handleBookMassage() {
// //     if (!selectedMember) {
// //       toast.error("Please select a member");
// //       return;
// //     }

// //     const remaining = selectedMember.massageSessionsRemaining;

// //     if (remaining !== "unlimited" && Number(remaining || 0) <= 0) {
// //       toast.error("No massage sessions remaining for this member");
// //       return;
// //     }

// //     try {
// //       setBooking(true);

// //       await bookMassageSession(selectedMember, {
// //         date,
// //         time,
// //         notes,
// //       });

// //       toast.success("Massage session booked successfully");

// //       setSelectedMemberId("");
// //       setTime("");
// //       setNotes("");

// //       await loadData();
// //     } catch (error) {
// //       console.error("BOOK MASSAGE FAILED:", error);
// //       toast.error(error.message || "Booking failed");
// //     } finally {
// //       setBooking(false);
// //     }
// //   }

// //   return (
// //     <div className="page-enter massage-page">
// //       <div className="topbar">
// //         <div>
// //           <div className="page-title">Massage Chair</div>
// //           <div className="page-subtitle">
// //             Book and manage free massage chair sessions
// //           </div>
// //         </div>
// //       </div>

// //       <div className="page-body">
// //         <div className="massage-grid">
// //           <div className="massage-card">
// //             <h3>Book Massage Session</h3>

// //             <label>Search Member</label>
// //             <input
// //               type="text"
// //               placeholder="Search by name, phone or member ID..."
// //               value={search}
// //               onChange={(e) => setSearch(e.target.value)}
// //             />

// //             <label>Select Member</label>
// //             <select
// //               value={selectedMemberId}
// //               onChange={(e) => setSelectedMemberId(e.target.value)}
// //               disabled={loadingMembers}
// //             >
// //               <option value="">
// //                 {loadingMembers ? "Loading members..." : "Choose member"}
// //               </option>

// //               {filteredMembers.map((m) => (
// //                 <option key={m.id} value={m.id}>
// //                   {m.name || m.fullName || "Unnamed"} — Remaining:{" "}
// //                   {getRemaining(m)}
// //                 </option>
// //               ))}
// //             </select>

// //             {selectedMember && (
// //               <div className="selected-member-box">
// //                 <div>
// //                   <strong>
// //                     {selectedMember.name || selectedMember.fullName || "Member"}
// //                   </strong>
// //                   <span>{selectedMember.phone || "No phone"}</span>
// //                 </div>

// //                 <div>
// //                   <p>Allowed</p>
// //                   <b>{getAllowed(selectedMember)}</b>
// //                 </div>

// //                 <div>
// //                   <p>Used</p>
// //                   <b>{selectedMember.massageSessionsUsed ?? 0}</b>
// //                 </div>

// //                 <div>
// //                   <p>Remaining</p>
// //                   <b>{getRemaining(selectedMember)}</b>
// //                 </div>
// //               </div>
// //             )}

// //             <label>Date</label>
// //             <input
// //               type="date"
// //               value={date}
// //               onChange={(e) => setDate(e.target.value)}
// //             />

// //             <label>Time</label>
// //             <input
// //               type="time"
// //               value={time}
// //               onChange={(e) => setTime(e.target.value)}
// //             />

// //             <label>Notes</label>
// //             <textarea
// //               placeholder="Optional notes..."
// //               value={notes}
// //               onChange={(e) => setNotes(e.target.value)}
// //             />

// //             <button disabled={booking || !selectedMember} onClick={handleBookMassage}>
// //               {booking ? "Booking..." : "Book Massage"}
// //             </button>
// //           </div>

// //           <div className="massage-card">
// //             <h3>Recent Massage Bookings</h3>

// //             {loadingBookings ? (
// //               <div className="empty-box">Loading bookings...</div>
// //             ) : bookings.length === 0 ? (
// //               <div className="empty-box">No massage bookings yet.</div>
// //             ) : (
// //               <div className="massage-table-wrap">
// //                 <table className="massage-table">
// //                   <thead>
// //                     <tr>
// //                       <th>Member</th>
// //                       <th>Phone</th>
// //                       <th>Date</th>
// //                       <th>Time</th>
// //                       <th>Status</th>
// //                     </tr>
// //                   </thead>

// //                   <tbody>
// //                     {bookings.map((b) => (
// //                       <tr key={b.id}>
// //                         <td>{b.memberName || "-"}</td>
// //                         <td>{b.phone || "-"}</td>
// //                         <td>{b.date || "-"}</td>
// //                         <td>{b.time || "-"}</td>
// //                         <td>
// //                           <span className="status-pill">
// //                             {b.status || "booked"}
// //                           </span>
// //                         </td>
// //                       </tr>
// //                     ))}
// //                   </tbody>
// //                 </table>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import { useEffect, useMemo, useState } from "react";
// import toast from "react-hot-toast";
// import { format } from "date-fns";

// import {
//   getAllMembers,
//   addMassageSession,
//   getMassageSessions,
//   updateMassageSessionStatus,
// } from "../../firebase/service";

// import "../../styles/massageChair.css";

// export default function MassageChair() {
//   const [members, setMembers] = useState([]);
//   const [sessions, setSessions] = useState([]);

//   const [selectedMemberId, setSelectedMemberId] = useState("");
//   const [search, setSearch] = useState("");
//   const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
//   const [time, setTime] = useState("");
//   const [duration, setDuration] = useState(20);
//   const [notes, setNotes] = useState("");

//   const [loadingMembers, setLoadingMembers] = useState(true);
//   const [loadingSessions, setLoadingSessions] = useState(false);
//   const [saving, setSaving] = useState(false);

//   async function loadMembers() {
//     try {
//       setLoadingMembers(true);
//       const data = await getAllMembers();
//       setMembers(data || []);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load members");
//     } finally {
//       setLoadingMembers(false);
//     }
//   }
//   // async function handleStatusUpdate(sessionId, status) {
//   //   try {
//   //     await updateMassageSessionStatus(sessionId, status);
//   //     toast.success(`Session ${status}`);
//   //     await loadSessions(selectedMember.id);
//   //   } catch (error) {
//   //     console.error(error);
//   //     toast.error("Failed to update status");
//   //   }
//   // }
// async function handleStatusUpdate(sessionId, status) {
//   try {
//     await updateMassageSessionStatus(sessionId, status);

//     toast.success(`Session ${status}`);

//     await loadSessions(selectedMemberId);
//   } catch (error) {
//     console.error(error);
//     toast.error("Failed to update status");
//   }
// }
//   async function loadSessions(memberId = selectedMemberId) {
//     if (!memberId) {
//       setSessions([]);
//       return;
//     }

//     try {
//       setLoadingSessions(true);
//       const data = await getMassageSessions(memberId);
//       setSessions(data || []);
//     } catch (error) {
//       console.error(error);
//       toast.error("Failed to load massage sessions");
//     } finally {
//       setLoadingSessions(false);
//     }
//   }

//   useEffect(() => {
//     loadMembers();
//   }, []);

//   useEffect(() => {
//     loadSessions(selectedMemberId);
//   }, [selectedMemberId]);

//   const filteredMembers = useMemo(() => {
//     const s = search.toLowerCase().trim();
//     if (!s) return members;

//     return members.filter((m) => {
//       return (
//         (m.name || "").toLowerCase().includes(s) ||
//         (m.fullName || "").toLowerCase().includes(s) ||
//         (m.phone || "").toLowerCase().includes(s) ||
//         (m.memberId || "").toLowerCase().includes(s)
//       );
//     });
//   }, [members, search]);

//   const selectedMember = useMemo(() => {
//     return members.find((m) => m.id === selectedMemberId) || null;
//   }, [members, selectedMemberId]);

//   const latestSession = sessions[0] || null;

//   function getAllowed(member) {
//     if (!member) return 0;
//     if (member.massageSessionsAllowed === "unlimited") return "Unlimited";
//     return Number(member.massageSessionsAllowed || 0);
//   }

//   function getUsed(member) {
//     if (!member) return 0;
//     return Number(member.massageSessionsUsed || 0);
//   }

//   function getRemaining(member) {
//     if (!member) return 0;
//     if (member.massageSessionsRemaining === "unlimited") return "Unlimited";
//     return Number(member.massageSessionsRemaining || 0);
//   }

//   async function handleAddSession(e) {
//     e.preventDefault();

//     if (!selectedMember) {
//       toast.error("Select a member first");
//       return;
//     }

//     if (!date) {
//       toast.error("Select date");
//       return;
//     }

//     const remaining = selectedMember.massageSessionsRemaining;
//     if (remaining !== "unlimited" && Number(remaining || 0) <= 0) {
//       toast.error("No massage sessions remaining for this member");
//       return;
//     }

//     try {
//       setSaving(true);

//       await addMassageSession(selectedMember, {
//         date,
//         time,
//         duration: Number(duration || 20),
//         notes,
//       });

//       toast.success("Massage session added");

//       setTime("");
//       setDuration(20);
//       setNotes("");

//       const updatedMembers = await getAllMembers();
//       setMembers(updatedMembers || []);
//       await loadSessions(selectedMember.id);
//     } catch (error) {
//       console.error(error);
//       toast.error(error.message || "Failed to add massage session");
//     } finally {
//       setSaving(false);
//     }
//   }

//   return (
//     <div className="page-enter massage-page">
//       <div className="topbar">
//         <div>
//           <div className="page-title">Massage Chair</div>
//           <div className="page-subtitle">
//             Add sessions, track usage, and manage member massage history
//           </div>
//         </div>
//       </div>

//       <div className="page-body">
//         <div className="massage-admin-grid">
//           <div className="massage-card massage-form-card">
//             <h3>Add Massage Session</h3>

//             <label>Search Member</label>
//             <input
//               type="text"
//               placeholder="Search by name, phone or member ID..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />

//             <label>Select Member</label>
//             <select
//               value={selectedMemberId}
//               onChange={(e) => setSelectedMemberId(e.target.value)}
//               disabled={loadingMembers}
//             >
//               <option value="">
//                 {loadingMembers ? "Loading members..." : "Choose member"}
//               </option>

//               {filteredMembers.map((m) => (
//                 <option key={m.id} value={m.id}>
//                   {m.name || m.fullName || "Unnamed"} · {m.phone || "No phone"}{" "}
//                   · Remaining: {getRemaining(m)}
//                 </option>
//               ))}
//             </select>

//             {selectedMember && (
//               <div className="massage-member-box">
//                 <div className="massage-member-main">
//                   <strong>
//                     {selectedMember.name || selectedMember.fullName}
//                   </strong>
//                   <span>{selectedMember.phone || "No phone"}</span>
//                   <span>{selectedMember.plan || "No plan"}</span>
//                 </div>

//                 <div>
//                   <p>Allowed</p>
//                   <b>{getAllowed(selectedMember)}</b>
//                 </div>

//                 <div>
//                   <p>Used</p>
//                   <b>{getUsed(selectedMember)}</b>
//                 </div>

//                 <div>
//                   <p>Remaining</p>
//                   <b>{getRemaining(selectedMember)}</b>
//                 </div>
//               </div>
//             )}

//             <form onSubmit={handleAddSession}>
//               <label>Date</label>
//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//               />

//               <label>Time</label>
//               <input
//                 type="time"
//                 value={time}
//                 onChange={(e) => setTime(e.target.value)}
//               />

//               <label>Duration</label>
//               <select
//                 value={duration}
//                 onChange={(e) => setDuration(e.target.value)}
//               >
//                 <option value={10}>10 minutes</option>
//                 <option value={15}>15 minutes</option>
//                 <option value={20}>20 minutes</option>
//                 <option value={30}>30 minutes</option>
//               </select>

//               <label>Notes</label>
//               <textarea
//                 placeholder="Recovery, relaxation, back pain, post-workout, etc."
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//               />

//               <button disabled={saving || !selectedMember} type="submit">
//                 {saving ? "Saving..." : "Add Massage Session"}
//               </button>
//             </form>
//           </div>

//           <div className="massage-content">
//             {!selectedMember ? (
//               <div className="massage-card empty-box tall">
//                 <div style={{ fontSize: 42, marginBottom: 12 }}>💆</div>
//                 <strong>Select a member</strong>
//                 <p>Choose a member to view massage entitlement and history.</p>
//               </div>
//             ) : (
//               <>
//                 <div className="massage-stats-grid">
//                   <div className="massage-stat-card">
//                     <span>Total Sessions</span>
//                     <strong>{getAllowed(selectedMember)}</strong>
//                   </div>

//                   <div className="massage-stat-card">
//                     <span>Used</span>
//                     <strong>{getUsed(selectedMember)}</strong>
//                   </div>

//                   <div className="massage-stat-card">
//                     <span>Remaining</span>
//                     <strong>{getRemaining(selectedMember)}</strong>
//                   </div>

//                   <div className="massage-stat-card">
//                     <span>Last Session</span>
//                     <strong>{latestSession?.date || "—"}</strong>
//                   </div>
//                 </div>

//                 <div className="massage-card">
//                   <div className="massage-section-title">Massage History</div>

//                   {loadingSessions ? (
//                     <div className="empty-box">Loading sessions...</div>
//                   ) : sessions.length === 0 ? (
//                     <div className="empty-box">
//                       No massage sessions added yet.
//                     </div>
//                   ) : (
//                     <div className="massage-table-wrap">
//                       <table className="massage-table">
//                         <thead>
//                           <tr>
//                             <th>Date</th>
//                             <th>Time</th>
//                             <th>Duration</th>
//                             <th>Session No.</th>
//                             <th>Notes</th>
//                             <th>Status</th>
//                             <th>Action</th>
//                           </tr>
//                         </thead>

//                         <tbody>
//                           {sessions.map((s) => (
//                             <tr key={s.id}>
//                               <td>{s.date || "-"}</td>
//                               <td>{s.time || "-"}</td>
//                               <td>{s.duration || 20} min</td>
//                               <td>{s.sessionNumber || "-"}</td>
//                               <td>{s.notes || "-"}</td>
//                               <td>
//   <span className={`status-pill ${s.status || "pending"}`}>
//     {s.status || "pending"}
//   </span>
// </td>

// <td>
//   <div className="massage-actions">
//     <button type="button" onClick={() => handleStatusUpdate(s.id, "approved")}>
//       Approve
//     </button>
//     <button type="button" onClick={() => handleStatusUpdate(s.id, "rejected")}>
//       Reject
//     </button>
//     <button type="button" onClick={() => handleStatusUpdate(s.id, "completed")}>
//       Complete
//     </button>
//   </div>
// </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { format } from "date-fns";

import {
  getAllMembers,
  addMassageSession,
  getMassageSessions,
  getAllMassageSessions,
  updateMassageSessionStatus,
} from "../../firebase/service";

import "../../styles/massageChair.css";

export default function MassageChair() {
  const [members, setMembers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [allSessions, setAllSessions] = useState([]);

  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [search, setSearch] = useState("");
  const [historyFilter, setHistoryFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState(20);
  const [notes, setNotes] = useState("");

  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingAllSessions, setLoadingAllSessions] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadMembers() {
    try {
      setLoadingMembers(true);
      const data = await getAllMembers();
      setMembers(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load members");
    } finally {
      setLoadingMembers(false);
    }
  }

  async function loadSessions(memberId = selectedMemberId) {
    if (!memberId) {
      setSessions([]);
      return;
    }

    try {
      setLoadingSessions(true);
      const data = await getMassageSessions(memberId);
      setSessions(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load massage sessions");
    } finally {
      setLoadingSessions(false);
    }
  }

  async function loadAllSessions() {
    try {
      setLoadingAllSessions(true);
      const data = await getAllMassageSessions();
      setAllSessions(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load massage history");
    } finally {
      setLoadingAllSessions(false);
    }
  }

  useEffect(() => {
    loadMembers();
    loadAllSessions();
  }, []);

  useEffect(() => {
    loadSessions(selectedMemberId);
  }, [selectedMemberId]);

  const filteredMembers = useMemo(() => {
    const s = search.toLowerCase().trim();
    if (!s) return members;

    return members.filter((m) => {
      return (
        (m.name || "").toLowerCase().includes(s) ||
        (m.fullName || "").toLowerCase().includes(s) ||
        (m.phone || "").toLowerCase().includes(s) ||
        (m.memberId || "").toLowerCase().includes(s)
      );
    });
  }, [members, search]);

  const selectedMember = useMemo(() => {
    return members.find((m) => m.id === selectedMemberId) || null;
  }, [members, selectedMemberId]);

  const latestSession = sessions[0] || null;

  const filteredAllSessions = useMemo(() => {
    let data = [...allSessions];

    if (selectedDate) {
      data = data.filter((s) => s.date === selectedDate);
    }

    if (historyFilter !== "all") {
      data = data.filter((s) => (s.status || "pending") === historyFilter);
    }

    return data.sort((a, b) => {
      const dateCompare = new Date(b.date || 0) - new Date(a.date || 0);
      if (dateCompare !== 0) return dateCompare;
      return String(b.time || "").localeCompare(String(a.time || ""));
    });
  }, [allSessions, selectedDate, historyFilter]);

  const todayStats = useMemo(() => {
    const today = selectedDate;

    const todaySessions = allSessions.filter((s) => s.date === today);

    return {
      total: todaySessions.length,
      pending: todaySessions.filter((s) => (s.status || "pending") === "pending").length,
      approved: todaySessions.filter((s) => s.status === "approved").length,
      completed: todaySessions.filter((s) => s.status === "completed").length,
    };
  }, [allSessions, selectedDate]);

  function getAllowed(member) {
    if (!member) return 0;
    if (member.massageSessionsAllowed === "unlimited") return "Unlimited";
    return Number(member.massageSessionsAllowed || 0);
  }

  function getUsed(member) {
    if (!member) return 0;
    return Number(member.massageSessionsUsed || 0);
  }

  function getRemaining(member) {
    if (!member) return 0;
    if (member.massageSessionsRemaining === "unlimited") return "Unlimited";
    return Number(member.massageSessionsRemaining || 0);
  }

  async function handleStatusUpdate(sessionId, status) {
    try {
      await updateMassageSessionStatus(sessionId, status);

      toast.success(`Session ${status}`);

      await loadAllSessions();

      if (selectedMemberId) {
        await loadSessions(selectedMemberId);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  }

  async function handleAddSession(e) {
    e.preventDefault();

    if (!selectedMember) {
      toast.error("Select a member first");
      return;
    }

    if (!date) {
      toast.error("Select date");
      return;
    }

    const remaining = selectedMember.massageSessionsRemaining;

    if (remaining !== "unlimited" && Number(remaining || 0) <= 0) {
      toast.error("No massage sessions remaining for this member");
      return;
    }

    try {
      setSaving(true);

      await addMassageSession(selectedMember, {
        date,
        time,
        duration: Number(duration || 20),
        notes,
        status: "pending",
      });

      toast.success("Massage session request added");

      setTime("");
      setDuration(20);
      setNotes("");

      const updatedMembers = await getAllMembers();
      setMembers(updatedMembers || []);

      await loadSessions(selectedMember.id);
      await loadAllSessions();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to add massage session");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-enter massage-page">
      <div className="topbar">
        <div>
          <div className="page-title">Massage Chair</div>
          <div className="page-subtitle">
            Add sessions, approve requests, and manage complete massage history
          </div>
        </div>

        <div className="topbar-right">
          <input
            className="form-input"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ width: "auto", fontSize: 13 }}
          />
        </div>
      </div>

      <div className="page-body">
        <div
          className="stats-grid mb-20"
          style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
        >
          <div className="stat-card s-gold">
            <div className="stat-label">Total</div>
            <div className="stat-value c-gold">{todayStats.total}</div>
          </div>

          <div className="stat-card s-orange">
            <div className="stat-label">Pending</div>
            <div className="stat-value c-orange">{todayStats.pending}</div>
          </div>

          <div className="stat-card s-green">
            <div className="stat-label">Approved</div>
            <div className="stat-value c-green">{todayStats.approved}</div>
          </div>

          <div className="stat-card s-blue">
            <div className="stat-label">Completed</div>
            <div className="stat-value c-blue">{todayStats.completed}</div>
          </div>
        </div>

        <div className="massage-admin-grid">
          <div className="massage-card massage-form-card">
            <h3>Add Massage Session</h3>

            <label>Search Member</label>
            <input
              type="text"
              placeholder="Search by name, phone or member ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <label>Select Member</label>
            <select
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
              disabled={loadingMembers}
            >
              <option value="">
                {loadingMembers ? "Loading members..." : "Choose member"}
              </option>

              {filteredMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name || m.fullName || "Unnamed"} · {m.phone || "No phone"} ·
                  Remaining: {getRemaining(m)}
                </option>
              ))}
            </select>

            {selectedMember && (
              <div className="massage-member-box">
                <div className="massage-member-main">
                  <strong>{selectedMember.name || selectedMember.fullName}</strong>
                  <span>{selectedMember.phone || "No phone"}</span>
                  <span>{selectedMember.plan || "No plan"}</span>
                </div>

                <div>
                  <p>Allowed</p>
                  <b>{getAllowed(selectedMember)}</b>
                </div>

                <div>
                  <p>Used</p>
                  <b>{getUsed(selectedMember)}</b>
                </div>

                <div>
                  <p>Remaining</p>
                  <b>{getRemaining(selectedMember)}</b>
                </div>
              </div>
            )}

            <form onSubmit={handleAddSession}>
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <label>Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />

              <label>Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={20}>20 minutes</option>
                <option value={30}>30 minutes</option>
              </select>

              <label>Notes</label>
              <textarea
                placeholder="Recovery, relaxation, back pain, post-workout, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              <button disabled={saving || !selectedMember} type="submit">
                {saving ? "Saving..." : "Add Massage Session"}
              </button>
            </form>
          </div>

          <div className="massage-content">
            {!selectedMember ? (
              <div className="massage-card empty-box tall">
                <div style={{ fontSize: 42, marginBottom: 12 }}>💆</div>
                <strong>Select a member</strong>
                <p>Choose a member to view personal massage entitlement and history.</p>
              </div>
            ) : (
              <>
                <div className="massage-stats-grid">
                  <div className="massage-stat-card">
                    <span>Total Sessions</span>
                    <strong>{getAllowed(selectedMember)}</strong>
                  </div>

                  <div className="massage-stat-card">
                    <span>Used</span>
                    <strong>{getUsed(selectedMember)}</strong>
                  </div>

                  <div className="massage-stat-card">
                    <span>Remaining</span>
                    <strong>{getRemaining(selectedMember)}</strong>
                  </div>

                  <div className="massage-stat-card">
                    <span>Last Session</span>
                    <strong>{latestSession?.date || "—"}</strong>
                  </div>
                </div>

                <div className="massage-card">
                  <div className="massage-section-title">Selected Member History</div>

                  {loadingSessions ? (
                    <div className="empty-box">Loading sessions...</div>
                  ) : sessions.length === 0 ? (
                    <div className="empty-box">No massage sessions added yet.</div>
                  ) : (
                    <div className="massage-table-wrap">
                      <table className="massage-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Duration</th>
                            <th>Status</th>
                            <th>Notes</th>
                          </tr>
                        </thead>

                        <tbody>
                          {sessions.map((s) => (
                            <tr key={s.id}>
                              <td>{s.date || "-"}</td>
                              <td>{s.time || "-"}</td>
                              <td>{s.duration || 20} min</td>
                              <td>
                                <span className={`status-pill ${s.status || "pending"}`}>
                                  {s.status || "pending"}
                                </span>
                              </td>
                              <td>{s.notes || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="card mt-20">
          <div className="card-title">📋 All Massage History</div>

          <div className="steam-filter-row mb-16">
            {[
              ["all", "All"],
              ["pending", "Pending"],
              ["approved", "Approved"],
              ["completed", "Completed"],
              ["rejected", "Rejected"],
            ].map(([key, label]) => (
              <button
                key={key}
                className={`steam-filter-btn ${
                  historyFilter === key ? "active" : ""
                }`}
                onClick={() => setHistoryFilter(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {loadingAllSessions ? (
            <div className="empty-box">Loading massage history...</div>
          ) : filteredAllSessions.length === 0 ? (
            <div className="form-label">No massage sessions for this filter/date.</div>
          ) : (
            <div className="massage-table-wrap">
              <table className="massage-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Phone</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAllSessions.map((s) => (
                    <tr key={s.id}>
                      <td>{s.memberName || "-"}</td>
                      <td>{s.phone || "-"}</td>
                      <td>{s.date || "-"}</td>
                      <td>{s.time || "-"}</td>
                      <td>{s.duration || 20} min</td>
                      <td>
                        <span className={`status-pill ${s.status || "pending"}`}>
                          {s.status || "pending"}
                        </span>
                      </td>
                      <td>
                        <div className="massage-actions">
                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(s.id, "approved")}
                          >
                            Approve
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(s.id, "rejected")}
                          >
                            Reject
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStatusUpdate(s.id, "completed")}
                          >
                            Complete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}