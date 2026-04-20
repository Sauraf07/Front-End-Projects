import { Link } from "react-router-dom";

function UserCard({ user }) {
  return (
    <div style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>

      <Link to={`/user/${user.id}`}>
        <button>View Details</button>
      </Link>
    </div>
  );
}

export default UserCard;