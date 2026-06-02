// // import { useState } from "react";
// import { useState } from "react";
// import toast from "react-hot-toast";

// import { addTrainer } from "../../../firebase/trainerService";
// // import "../../../styles/trainer-pages.css";
// import "../../../styles/AddTrainer.css"
// export default function AddTrainer() {
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     specialization: "",
//     salary: "",
//     ptShare: 50,
//     gymShare: 50,
//     status: "active",
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   const name = formData.name.trim();
//   //   const phone = formData.phone.trim();
//   //   const email = formData.email.trim();
//   //   const specialization = formData.specialization.trim();

//   //   const salary = Number(formData.salary);
//   //   const ptShare = Number(formData.ptShare);
//   //   const gymShare = Number(formData.gymShare);

//   //   // ❌ VALIDATIONS
//   //   if (!name) {
//   //     toast.error("Trainer name is required");
//   //     return;
//   //   }

//   //   if (salary < 0 || isNaN(salary)) {
//   //     toast.error("Invalid salary");
//   //     return;
//   //   }

//   //   if (ptShare + gymShare !== 100) {
//   //     toast.error("PT + Gym share must equal 100%");
//   //     return;
//   //   }

//   //   if (ptShare < 0 || gymShare < 0) {
//   //     toast.error("Share cannot be negative");
//   //     return;
//   //   }

//   //   setLoading(true);

//   //   const res = await addTrainer({
//   //     name,
//   //     phone,
//   //     email,
//   //     specialization,
//   //     salary,
//   //     ptShare,
//   //     gymShare,
//   //     status: formData.status,
//   //   });

//   //   setLoading(false);

//   //   if (res.success) {
//   //     toast.success("Trainer Added");

//   //     setFormData({
//   //       name: "",
//   //       phone: "",
//   //       email: "",
//   //       specialization: "",
//   //       salary: "",
//   //       ptShare: 50,
//   //       gymShare: 50,
//   //       status: "active",
//   //     });
//   //   } else {
//   //     toast.error(res.error);
//   //   }
//   // };
// const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const name = formData.name.trim();
//     const phone = formData.phone.trim();
//     const email = formData.email.trim();
//     const specialization = formData.specialization.trim();

//     const salary = Number(formData.salary);
//     const ptShare = Number(formData.ptShare);
//     const gymShare = Number(formData.gymShare);

//     if (!name) {
//       toast.error("Trainer name is required");
//       return;
//     }

//     if (isNaN(salary) || salary < 0) {
//       toast.error("Invalid salary");
//       return;
//     }

//     if (ptShare < 0 || gymShare < 0) {
//       toast.error("Share cannot be negative");
//       return;
//     }

//     if (ptShare + gymShare !== 100) {
//       toast.error("PT Share + Gym Share must equal 100%");
//       return;
//     }

//     setLoading(true);

//     const res = await addTrainer({
//       name,
//       phone,
//       email,
//       specialization,
//       salary,
//       ptShare,
//       gymShare,
//       status: formData.status,
//     });

//     if (res.success) {
//       toast.success("Trainer Added Successfully");

//       setFormData({
//         name: "",
//         phone: "",
//         email: "",
//         specialization: "",
//         salary: "",
//         ptShare: 50,
//         gymShare: 50,
//         status: "active",
//       });
//     } else {
//       toast.error(res.error || "Failed to add trainer");
//     }
//   } catch (error) {
//     console.error(error);
//     toast.error("Something went wrong");
//   } finally {
//     setLoading(false);
//   }
// };
// return (
//   <>
//     <div className="topbar">
//       <div className="page-title">
//         Add Trainer
//       </div>
//     </div>

//     <div className="page-body">
//       <div className="card mb-20">
//         <div className="card-title">
//           Trainer Information
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="add-trainer-form"
//         >
//           <div className="form-row">
//             <div className="form-group">
//               <label className="form-label">
//                 Trainer Name
//               </label>

//               <input
//                 type="text"
//                 name="name"
//                 className="form-input"
//                 placeholder="Enter trainer name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="form-group">
//               <label className="form-label">
//                 Phone Number
//               </label>

//               <input
//                 type="text"
//                 name="phone"
//                 className="form-input"
//                 placeholder="Enter phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label className="form-label">
//                 Email
//               </label>

//               <input
//                 type="email"
//                 name="email"
//                 className="form-input"
//                 placeholder="Enter email"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="form-group">
//               <label className="form-label">
//                 Specialization
//               </label>

//               <input
//                 type="text"
//                 name="specialization"
//                 className="form-input"
//                 placeholder="Strength Coach"
//                 value={formData.specialization}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           <div className="form-row">
//             <div className="form-group">
//               <label className="form-label">
//                 Monthly Salary
//               </label>

//               <input
//                 type="number"
//                 name="salary"
//                 className="form-input"
//                 placeholder="15000"
//                 value={formData.salary}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="form-group">
//               <label className="form-label">
//                 Status
//               </label>

//               <select
//                 name="status"
//                 className="form-input"
//                 value={formData.status}
//                 onChange={handleChange}
//               >
//                 <option value="active">
//                   Active
//                 </option>

//                 <option value="inactive">
//                   Inactive
//                 </option>
//               </select>
//             </div>
//           </div>

//           <div className="card mb-20">
//             <div className="card-title">
//               Revenue Sharing
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label className="form-label">
//                   Trainer PT Share %
//                 </label>

//                 <input
//                   type="number"
//                   name="ptShare"
//                   className="form-input"
//                   value={formData.ptShare}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="form-group">
//                 <label className="form-label">
//                   Gym Share %
//                 </label>

//                 <input
//                   type="number"
//                   name="gymShare"
//                   className="form-input"
//                   value={formData.gymShare}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             <div className="info-box warning">
//               Trainer Share : {formData.ptShare}% |
//               Gym Share : {formData.gymShare}%
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="btn btn-primary btn-lg"
//             disabled={loading}
//           >
//             {loading
//               ? "ADDING TRAINER..."
//               : "ADD TRAINER"}
//           </button>
//         </form>
//       </div>
//     </div>
//   </>
// );
// }

import { useState } from "react";
import toast from "react-hot-toast";

import { addTrainer } from "../../../firebase/trainerService";
import "../../../styles/AddTrainer.css";

export default function AddTrainer() {
  const [loading, setLoading] = useState(false);

  const initialFormData = {
    name: "",
    phone: "",
    email: "",
    specialization: "",
    salary: "",
    ptShare: 50,
    gymShare: 50,
    status: "active",

    aadhaar: "",
    joiningDate: "",
    emergencyContact: "",
    address: "",
    profilePhoto: "",
    gender: "",
    experience: "",
    certification: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDigitChange = (name, value, maxLength) => {
    setFormData({
      ...formData,
      [name]: value.replace(/\D/g, "").slice(0, maxLength),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const name = formData.name.trim();
      const phone = formData.phone.trim();
      const email = formData.email.trim();
      const specialization = formData.specialization.trim();

      const salary = Number(formData.salary);
      const ptShare = Number(formData.ptShare);
      const gymShare = Number(formData.gymShare);

      const aadhaar = formData.aadhaar.trim();
      const joiningDate = formData.joiningDate;
      const emergencyContact = formData.emergencyContact.trim();
      const address = formData.address.trim();
      const profilePhoto = formData.profilePhoto.trim();
      const gender = formData.gender;
      const experience = Number(formData.experience);
      const certification = formData.certification.trim();

      if (!name) {
        toast.error("Trainer name is required");
        return;
      }

      if (name.length < 3) {
        toast.error("Trainer name must be at least 3 characters");
        return;
      }

      if (!/^\d{10}$/.test(phone)) {
        toast.error("Phone number must be exactly 10 digits");
        return;
      }

      if (email && !/\S+@\S+\.\S+/.test(email)) {
        toast.error("Invalid email address");
        return;
      }

      if (!specialization) {
        toast.error("Specialization is required");
        return;
      }

      if (isNaN(salary) || salary < 0) {
        toast.error("Invalid salary");
        return;
      }

      if (!/^\d{12}$/.test(aadhaar)) {
        toast.error("Aadhaar number must be exactly 12 digits");
        return;
      }

      if (!joiningDate) {
        toast.error("Joining date is required");
        return;
      }

      if (!/^\d{10}$/.test(emergencyContact)) {
        toast.error("Emergency contact must be exactly 10 digits");
        return;
      }

      if (!address) {
        toast.error("Address is required");
        return;
      }

      if (!gender) {
        toast.error("Please select gender");
        return;
      }

      if (isNaN(experience) || experience < 0 || experience > 60) {
        toast.error("Invalid experience years");
        return;
      }

      if (ptShare < 0 || ptShare > 100) {
        toast.error("PT Share must be between 0 and 100");
        return;
      }

      if (gymShare < 0 || gymShare > 100) {
        toast.error("Gym Share must be between 0 and 100");
        return;
      }

      if (ptShare + gymShare !== 100) {
        toast.error("PT Share + Gym Share must equal 100%");
        return;
      }

      setLoading(true);

      const res = await addTrainer({
        name,
        phone,
        email,
        specialization,
        salary,
        ptShare,
        gymShare,
        status: formData.status,

        aadhaar,
        joiningDate,
        emergencyContact,
        address,
        profilePhoto,
        gender,
        experience,
        certification,
      });

      if (res.success) {
        toast.success("Trainer Added Successfully");
        setFormData(initialFormData);
      } else {
        toast.error(res.error || "Failed to add trainer");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="topbar">
        <div className="page-title">Add Trainer</div>
      </div>

      <div className="page-body">
        <div className="card mb-20">
          <div className="card-title">Trainer Information</div>

          <form onSubmit={handleSubmit} className="add-trainer-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Trainer Name</label>

                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Enter trainer name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>

                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) =>
                    handleDigitChange("phone", e.target.value, 10)
                  }
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email</label>

                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Specialization</label>

                <input
                  type="text"
                  name="specialization"
                  className="form-input"
                  placeholder="Strength Coach"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Aadhaar Number</label>

                <input
                  type="text"
                  name="aadhaar"
                  className="form-input"
                  placeholder="12 digit Aadhaar number"
                  value={formData.aadhaar}
                  onChange={(e) =>
                    handleDigitChange("aadhaar", e.target.value, 12)
                  }
                  maxLength={12}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Joining Date</label>

                <input
                  type="date"
                  name="joiningDate"
                  className="form-input"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Emergency Contact</label>

                <input
                  type="tel"
                  name="emergencyContact"
                  className="form-input"
                  placeholder="10 digit emergency number"
                  value={formData.emergencyContact}
                  onChange={(e) =>
                    handleDigitChange("emergencyContact", e.target.value, 10)
                  }
                  maxLength={10}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>

                <select
                  name="gender"
                  className="form-input"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Experience Years</label>

                <input
                  type="number"
                  name="experience"
                  className="form-input"
                  placeholder="3"
                  value={formData.experience}
                  onChange={handleChange}
                  min="0"
                  max="60"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Certification</label>

                <input
                  type="text"
                  name="certification"
                  className="form-input"
                  placeholder="ACE, ISSA, K11, etc."
                  value={formData.certification}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Profile Photo URL</label>

                <input
                  type="url"
                  name="profilePhoto"
                  className="form-input"
                  placeholder="https://example.com/photo.jpg"
                  value={formData.profilePhoto}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Monthly Salary</label>

                <input
                  type="number"
                  name="salary"
                  className="form-input"
                  placeholder="15000"
                  value={formData.salary}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label className="form-label">Address</label>

                <textarea
                  name="address"
                  className="form-input"
                  placeholder="Trainer full address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Status</label>

                <select
                  name="status"
                  className="form-input"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="card mb-20">
              <div className="card-title">Revenue Sharing</div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Trainer PT Share %</label>

                  <input
                    type="number"
                    name="ptShare"
                    className="form-input"
                    value={formData.ptShare}
                    onChange={handleChange}
                    min="0"
                    max="100"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Gym Share %</label>

                  <input
                    type="number"
                    name="gymShare"
                    className="form-input"
                    value={formData.gymShare}
                    onChange={handleChange}
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="info-box warning">
                Trainer Share : {formData.ptShare}% | Gym Share :{" "}
                {formData.gymShare}%
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
            >
              {loading ? "ADDING TRAINER..." : "ADD TRAINER"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}