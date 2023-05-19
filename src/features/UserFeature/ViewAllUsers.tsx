import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Card, Pagination } from "react-bootstrap";
import { fetchUsers, selectAllUsers } from "./State/UserSlice";
import { useAppDispatch } from "app/hooks";

import "./styles/allUsers.scss";
import { Link } from "react-router-dom";

const ViewAllUsers = () => {
  const dispatch = useAppDispatch();
  const users = useSelector(selectAllUsers);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const itemsPerPage = 5;
  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedUsers = users.slice(startIndex, endIndex);

  return (
    <div className="view-all-users-page">
      <h2>All Users</h2>
      <Link to={"create-user"}>Create New User</Link>

      <Card className="users-container">
        {displayedUsers.map((user) => (
          <Card className="user-card" key={user.id}>
            <Card.Body>
              <Link to={`/app/${user?.id}`}>
                <Card.Title>{user.name}</Card.Title>{" "}
              </Link>
              <Card.Text>Email: {user.email}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </Card>

      <Pagination>
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index + 1}
            active={currentPage === index + 1}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default ViewAllUsers;
