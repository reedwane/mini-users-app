import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, Card, Form } from "react-bootstrap";
import { deleteUser, selectUserById, updateUser } from "./State/UserSlice";
import { useAppDispatch } from "app/hooks";
import "./styles/editUser.scss";
import DeleteUser from "./DeleteUser";
import { unwrapResult } from "@reduxjs/toolkit";

interface FormData {
  name: string;
  email: string;
}

const UpdateUser = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();
  const user = useSelector((state) => selectUserById(state, userId!));

  const [showDeletModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: user?.name,
      email: user?.email,
    },
  });

  const onSubmit = async (data: FormData) => {
    if (user) {
      try {
        const edit = await dispatch(updateUser({ ...user, ...data }));
        unwrapResult(edit);
        navigate(`/app/${userId}`);
      } catch (error) {
        setErrorMessage(`${error}`);
      }
    }
  };

  const handleDelete = () => {
    dispatch(deleteUser(userId!));
    navigate("/app"); // Redirect to all users page
  };

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <>
      <Card className="editUser p-3">
        {errorMessage ? <Card.Text>{errorMessage}</Card.Text> : ""}
        <h2>Edit User</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              {...register("name", { required: true })}
              isInvalid={!!errors.name}
            />
            {errors.name && (
              <Form.Control.Feedback type="invalid">
                Name is required
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
              isInvalid={!!errors.email}
            />
            {errors.email && (
              <Form.Control.Feedback type="invalid">
                Valid email is required
              </Form.Control.Feedback>
            )}
          </Form.Group>
          <Button className="submit" variant="primary" type="submit">
            Save
          </Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            className="delete"
            variant="danger"
            onClick={() => setShowModal(true)}
          >
            Delete User
          </Button>
        </Form>
      </Card>

      <DeleteUser
        showDeleteModal={showDeletModal}
        hideModal={() => setShowModal(false)}
        userName={user.name}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default UpdateUser;
