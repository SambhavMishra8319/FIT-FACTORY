import { useState } from "react";
import toast from "react-hot-toast";

import { addTrainer } from "../../../firebase/trainerService";
import "../../../styles/trainer-pages.css";
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const res = await addTrainer({
      ...formData,
      salary: Number(formData.salary),
      ptShare: Number(formData.ptShare),
      gymShare: Number(formData.gymShare),
    });

    setLoading(false);

    if (res.success) {
      toast.success("Trainer Added");

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
      toast.error(res.error);
    }
  };

  return (
    <div className="page-container">
  <div className="page-header">
    <h1>Add Trainer</h1>

    <p>
      Create and manage trainer profiles,
      salaries and PT commissions
    </p>
  </div>

  <div className="glass-card">
    <form
      onSubmit={handleSubmit}
      className="trainer-form"
    >
      <div className="form-grid">
        <div className="form-group">
          <label>Trainer Name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter trainer name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>

          <input
            type="text"
            name="phone"
            placeholder="Enter phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Specialization</label>

          <input
            type="text"
            name="specialization"
            placeholder="Strength Coach"
            value={formData.specialization}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Monthly Salary</label>

          <input
            type="number"
            name="salary"
            placeholder="15000"
            value={formData.salary}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Trainer PT Share %</label>

          <input
            type="number"
            name="ptShare"
            value={formData.ptShare}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Gym Share %</label>

          <input
            type="number"
            name="gymShare"
            value={formData.gymShare}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Status</label>

          <select
            name="status"
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

      <button
        className="primary-btn"
        disabled={loading}
      >
        {loading
          ? "Adding Trainer..."
          : "Add Trainer"}
      </button>
    </form>
  </div>
</div>
  );
}