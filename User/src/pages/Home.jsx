import { useEffect, useState } from "react";
import UserCard from "../Components/User_card";

function Home() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1>User Dashboard</h1>

      <input
        placeholder="Search user..."
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredUsers.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

export default Home;