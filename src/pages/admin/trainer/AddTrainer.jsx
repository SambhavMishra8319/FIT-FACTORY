import { useState } from "react";
import toast from "react-hot-toast";

import { addTrainer } from "../../../firebase/trainerService";

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
      <h2>Add Trainer</h2>

      <form onSubmit={handleSubmit} className="trainer-form">
        <input
          type="text"
          name="name"
          placeholder="Trainer Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={handleChange}
        />

        <input
          type="number"
          name="salary"
          placeholder="Monthly Salary"
          value={formData.salary}
          onChange={handleChange}
        />

        <input
          type="number"
          name="ptShare"
          placeholder="Trainer PT %"
          value={formData.ptShare}
          onChange={handleChange}
        />

        <input
          type="number"
          name="gymShare"
          placeholder="Gym %"
          value={formData.gymShare}
          onChange={handleChange}
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <button disabled={loading}>
          {loading ? "Adding..." : "Add Trainer"}
        </button>
      </form>
    </div>
  );
}