import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, getDeeds } from "../api/api.js"; // Import API calls

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [deeds, setDeeds] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with actual user ID (could come from localStorage or context)
        const userId = 1;
        const userProfile = await getUserProfile(userId);
        const userDeeds = await getDeeds();

        setUser(userProfile.data);
        setDeeds(userDeeds.data.filter((deed) => deed.user_id === userId));
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError("Failed to load dashboard.");
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.villain_name}!</h1>
      <p>Level: {user.title}</p>
      <p>Notoriety Score: {user.notoriety_score}</p>
      <p>Number of Deeds Logged: {deeds.length}</p>

      <h2>Your Recent Deeds</h2>
      <ul>
        {deeds.slice(0, 5).map((deed) => (
          <li key={deed.deed_id}>
            <p>{deed.description}</p>
            <p>Category: {deed.category}</p>
            <p>
              Evil Laughs: {deed.evil_laughs} | Comments: {deed.comments_count}
            </p>
          </li>
        ))}
      </ul>

      <div>
        <button onClick={() => navigate("/profile")}>Go to Profile</button>
        <button onClick={() => navigate("/leaderboard")}>
          View Leaderboard
        </button>
        <button onClick={() => navigate("/deeds")}>View Evil Deeds</button>
      </div>
    </div>
  );
};

export default Dashboard;
