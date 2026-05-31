// import { useState } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

import { addTrainer } from "../../../firebase/trainerService";
// import "../../../styles/trainer-pages.css";
import "../../../styles/AddTrainer.css"
export default function AddTrainer() {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    specialization: "",
    salary: "",
    ptShare: 50,
    gymShare: 50,
    status: "active",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const name = formData.name.trim();
  //   const phone = formData.phone.trim();
  //   const email = formData.email.trim();
  //   const specialization = formData.specialization.trim();

  //   const salary = Number(formData.salary);
  //   const ptShare = Number(formData.ptShare);
  //   const gymShare = Number(formData.gymShare);

  //   // ❌ VALIDATIONS
  //   if (!name) {
  //     toast.error("Trainer name is required");
  //     return;
  //   }

  //   if (salary < 0 || isNaN(salary)) {
  //     toast.error("Invalid salary");
  //     return;
  //   }

  //   if (ptShare + gymShare !== 100) {
  //     toast.error("PT + Gym share must equal 100%");
  //     return;
  //   }

  //   if (ptShare < 0 || gymShare < 0) {
  //     toast.error("Share cannot be negative");
  //     return;
  //   }

  //   setLoading(true);

  //   const res = await addTrainer({
  //     name,
  //     phone,
  //     email,
  //     specialization,
  //     salary,
  //     ptShare,
  //     gymShare,
  //     status: formData.status,
  //   });

  //   setLoading(false);

  //   if (res.success) {
  //     toast.success("Trainer Added");

  //     setFormData({
  //       name: "",
  //       phone: "",
  //       email: "",
  //       specialization: "",
  //       salary: "",
  //       ptShare: 50,
  //       gymShare: 50,
  //       status: "active",
  //     });
  //   } else {
  //     toast.error(res.error);
  //   }
  // };
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

    if (!name) {
      toast.error("Trainer name is required");
      return;
    }

    if (isNaN(salary) || salary < 0) {
      toast.error("Invalid salary");
      return;
    }

    if (ptShare < 0 || gymShare < 0) {
      toast.error("Share cannot be negative");
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
    });

    if (res.success) {
      toast.success("Trainer Added Successfully");

      setFormData({
        name: "",
        phone: "",
        email: "",
        specialization: "",
        salary: "",
        ptShare: 50,
        gymShare: 50,
        status: "active",
      });
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
      <div className="page-title">
        Add Trainer
      </div>
    </div>

    <div className="page-body">
      <div className="card mb-20">
        <div className="card-title">
          Trainer Information
        </div>

        <form
          onSubmit={handleSubmit}
          className="add-trainer-form"
        >
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Trainer Name
              </label>

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
              <label className="form-label">
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                className="form-input"
                placeholder="Enter phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Email
              </label>

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
              <label className="form-label">
                Specialization
              </label>

              <input
                type="text"
                name="specialization"
                className="form-input"
                placeholder="Strength Coach"
                value={formData.specialization}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">
                Monthly Salary
              </label>

              <input
                type="number"
                name="salary"
                className="form-input"
                placeholder="15000"
                value={formData.salary}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Status
              </label>

              <select
                name="status"
                className="form-input"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>
            </div>
          </div>

          <div className="card mb-20">
            <div className="card-title">
              Revenue Sharing
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Trainer PT Share %
                </label>

                <input
                  type="number"
                  name="ptShare"
                  className="form-input"
                  value={formData.ptShare}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Gym Share %
                </label>

                <input
                  type="number"
                  name="gymShare"
                  className="form-input"
                  value={formData.gymShare}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="info-box warning">
              Trainer Share : {formData.ptShare}% |
              Gym Share : {formData.gymShare}%
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            {loading
              ? "ADDING TRAINER..."
              : "ADD TRAINER"}
          </button>
        </form>
      </div>
    </div>
  </>
);
}