import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useForm } from "react-hook-form";
import { register as registerUser } from "./State/AuthSlice";
import { useAppDispatch } from "app/hooks";
import "./styles/register.scss";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNavigate, Link } from "react-router-dom";
import { Toast } from "react-bootstrap";
import ToastContainer from "react-bootstrap/ToastContainer";

interface FormData {
  name: string;
  email: string;
  password: string;
}

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [errorMessage, setErrorMessage] = useState<any>("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const user = await dispatch(registerUser({ ...data }));
      unwrapResult(user);

      navigate("/app");
    } catch (error) {
      setErrorMessage(error);
    }
  };

  return (
    <>
      <Card className="register-form p-4">
        <h2>Register</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              {...register("name", { required: true })}
            />
            {errors.name && <span>This field is required</span>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            />
            {errors.email && <span>Please enter a valid email</span>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              {...register("password", { required: true, minLength: 6 })}
            />
            {errors.password && (
              <span>Password must be at least 6 characters</span>
            )}
          </Form.Group>

          <Button type="submit">Register</Button>

          <Card.Text className="my-2 text-center">
            Have an account already? <Link to={"/"}>Login to your account</Link>
          </Card.Text>
        </Form>
      </Card>
      <ToastContainer position={"top-end"}>
        <Toast
          onClose={() => setErrorMessage("")}
          show={!!errorMessage}
          delay={3000}
          autohide
          bg={"danger"}
        >
          <Toast.Header>
            <p className="me-auto">Error!</p>
          </Toast.Header>
          <Toast.Body>{errorMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default Register;
