import React from "react";
import { useSelector } from "react-redux";
import { selectUserById } from "./State/UserSlice";
import { Link, useParams } from "react-router-dom";
import { Card } from "react-bootstrap";
import "./styles/singleUser.scss";

const ViewSingleUser = () => {
  const { userId } = useParams();
  const user = useSelector((state) => selectUserById(state, userId!));

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <Card className="singleUser p-2">
      <Card.Body>
        <Card.Title className="text-center">User Details</Card.Title>
        <Card.Text>
          <strong>Name:</strong> {user.name}
        </Card.Text>
        <Card.Text>
          <strong>Email:</strong> {user.email}
        </Card.Text>
      </Card.Body>

      <Card.Text className="text-center">
        <Link to={`edit`}>Edit User Profile</Link>
      </Card.Text>

      <Card.Text className="text-center">
        <Link to={`/app`}>Back to All Users</Link>
      </Card.Text>
    </Card>
  );
};

export default ViewSingleUser;
