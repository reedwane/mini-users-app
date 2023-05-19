import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, Card, Form } from "react-bootstrap";
import { createUser } from "./State/UserSlice";
import { useAppDispatch } from "app/hooks";
import { unwrapResult } from "@reduxjs/toolkit";

interface FormData {
  name: string;
  email: string;
  password: string;
}

const CreateUser = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [errorMessage, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const create = await dispatch(createUser(data));
      unwrapResult(create);

      navigate("/app");
    } catch (error: any) {
      setError(`${error?.message}`);
    }
  };

  return (
    <Card className="form-container p-3">
      <h2>Add User</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {errorMessage ? <p className="text-danger">{errorMessage}</p> : null}
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <Form.Text className="text-danger">{errors.name.message}</Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email format",
              },
            })}
          />
          {errors.email && (
            <Form.Text className="text-danger">
              {errors.email.message}
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <Form.Text className="text-danger">
              {errors.password.message}
            </Form.Text>
          )}
        </Form.Group>

        <Button variant="primary" type="submit">
          Add User
        </Button>
      </Form>
    </Card>
  );
};

export default CreateUser;
