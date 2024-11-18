import { useState, useEffect } from "react";
import { getDeeds, addDeed } from "../api/api";

const DeedLog = () => {
  const [form, setForm] = useState({ description: "", category: "" });
  const [deeds, setDeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch deeds when the component mounts
  useEffect(() => {
    const fetchDeeds = async () => {
      try {
        const response = await getDeeds();
        setDeeds(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching deeds:", err);
        setLoading(false);
      }
    };

    fetchDeeds();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user_id = localStorage.getItem("user_id");
      const newDeed = { ...form, user_id };
      await addDeed(newDeed);
      alert("Deed added successfully!");

      // Fetch deeds again to update the list
      const response = await getDeeds();
      setDeeds(response.data);

      // Reset the form
      setForm({ description: "", category: "" });
    } catch (err) {
      console.error("Error adding deed:", err);
    }
  };

  return (
    <div>
      <h1>Deed Log</h1>

      {/* Form to add a new deed */}
      <form onSubmit={handleSubmit}>
        <textarea
          name="description"
          placeholder="Describe your villainous deed"
          value={form.description}
          onChange={handleChange}
          required
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          <option value="Petty deeds">Petty deeds</option>
          <option value="Moderate mischief">Moderate mischief</option>
          <option value="Diabolical schemes">Diabolical schemes</option>
        </select>
        <button type="submit">Submit Deed</button>
      </form>

      {/* Display deeds */}
      <h2>All Deeds</h2>
      {loading ? (
        <p>Loading deeds...</p>
      ) : deeds.length === 0 ? (
        <p>No deeds available.</p>
      ) : (
        <ul>
          {deeds.map((deed) => (
            <li key={deed.deed_id}>
              <p>
                <strong>Villain:</strong> {deed.villain_name}
              </p>
              <p>
                <strong>Description:</strong> {deed.description}
              </p>
              <p>
                <strong>Category:</strong> {deed.category}
              </p>
              <p>
                <strong>Date:</strong> {new Date(deed.date).toLocaleString()}
              </p>
              <p>
                <strong>Evil Laughs:</strong> {deed.evil_laughs} |{" "}
                <strong>Comments:</strong> {deed.comments_count}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeedLog;
