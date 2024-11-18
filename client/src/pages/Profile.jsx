import { useEffect, useState } from "react";
import { getUserProfile } from "../api/api";
import { getUser } from "../utils/auth";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = getUser(); // Get user info from storage
        if (!user) {
          console.error("User not logged in");
          return;
        }

        const response = await getUserProfile(user.id); // Pass dynamic ID
        setProfile(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h1>{profile.villain_name}</h1>
      <p>{profile.backstory}</p>
      <p>Notoriety: {profile.notoriety_score}</p>
      <p>Title: {profile.title}</p>
    </div>
  );
};

export default Profile;
