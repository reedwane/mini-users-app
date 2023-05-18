import { useAppDispatch } from "app/hooks";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { login } from "./State/AuthSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import Card from "react-bootstrap/Card";
import { Toast } from "react-bootstrap";
import ToastContainer from "react-bootstrap/ToastContainer";

import "./styles/login.scss";

interface FormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<any>("");

  const onSubmit = async (data: FormData) => {
    try {
      const user = await dispatch(login(data));
      unwrapResult(user);

      navigate("/app");
    } catch (error) {
      setErrorMessage(error);
    }
  };

  return (
    <>
      <Card className="login-form p-3">
        <h2>Login</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <span>{errors.email.message}</span>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <span>{errors.password.message}</span>}
          </Form.Group>

          <Button variant="primary" type="submit">
            Login
          </Button>
        </Form>

        <Card.Text className="my-2 text-center">
          New Here? <Link to={"/register"}>Sign up now</Link>
        </Card.Text>

        <Card.Text className="my-2 text-center">
          Forgot your password?{" "}
          <Link to={"/forgot-password"}>Reset Password</Link>
        </Card.Text>
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

export default LoginPage;
