import { useParams } from "react-router-dom";

function UserDetails() {
  const { id } = useParams();

  return (
    <div>
      <h1>User Details</h1>
      <h2>User Name {name}</h2>
      <p>User ID: {id}</p>
    </div>
  );
}

export default UserDetails;