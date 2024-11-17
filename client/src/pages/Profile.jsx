import { useEffect, useState } from "react";
import api from "../api/api";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = 1; // Replace with the logged-in user's ID
        const response = await api.get(`/users/${userId}`);
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
