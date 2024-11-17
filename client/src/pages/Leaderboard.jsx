import { useEffect, useState } from "react";
import { getLeaderboard } from "../api/api.js";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await getLeaderboard();
        setLeaderboard(response.data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div>
      <h1>Leaderboard</h1>
      <ul>
        {leaderboard.map((user, index) => {
          return (
            <div key={index}>
              <h3>{user.villain_name}</h3>
              <h5>{user.title}</h5>
              <p>Notoriety points: {user.notoriety_score}</p>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

export default Leaderboard;
