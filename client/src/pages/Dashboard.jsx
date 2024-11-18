import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, getDeeds } from "../api/api.js";
import { getUser } from "../utils/auth"; // Import user retrieval utility

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [deeds, setDeeds] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve the logged-in user from local storage
        const loggedInUser = getUser();
        if (!loggedInUser) {
          setError("User not logged in. Redirecting to login...");
          setTimeout(() => navigate("/"), 3000); // Redirect after 3 seconds
          return;
        }

        const userId = loggedInUser.id;

        // Fetch user profile and deeds
        const userProfile = await getUserProfile(userId);
        const allDeeds = await getDeeds();

        // Set user data and filter deeds by user ID
        setUser(userProfile.data);
        setDeeds(allDeeds.data.filter((deed) => deed.user_id === userId));
      } catch (err) {
        console.error("Error loading dashboard:", err);
        setError("Failed to load dashboard. Please try again later.");
      }
    };

    fetchData();
  }, [navigate]);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!user) {
    return <p>Loading your villainous dashboard...</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.villain_name}!</h1>
      <p>Level: {user.title}</p>
      <p>Notoriety Score: {user.notoriety_score}</p>
      <p>Number of Deeds Logged: {deeds.length}</p>

      <h2>Your Recent Deeds</h2>
      {deeds.length > 0 ? (
        <ul>
          {deeds.slice(0, 5).map((deed) => (
            <li key={deed.deed_id}>
              <p>{deed.description}</p>
              <p>Category: {deed.category}</p>
              <p>
                Evil Laughs: {deed.evil_laughs} | Comments:{" "}
                {deed.comments_count}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven&apos;t logged any deeds yet. Time to cause some chaos!</p>
      )}

      <div>
        <button onClick={() => navigate("/profile")}>Go to Profile</button>
        <button onClick={() => navigate("/leaderboard")}>
          View Leaderboard
        </button>
        <button onClick={() => navigate("/deed-log")}>Log a New Deed</button>
      </div>
    </div>
  );
};

export default Dashboard;
