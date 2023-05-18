import { useAppDispatch } from "app/hooks";
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { forgotPassword } from "./State/AuthSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNavigate, Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { Toast } from "react-bootstrap";
import ToastContainer from "react-bootstrap/ToastContainer";

import "./styles/forgot.scss";

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const ForgotPassword = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
  } = useForm<FormData>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<any>("");

  const onSubmit = async ({ password, email }: FormData) => {
    try {
      const reset = await dispatch(
        forgotPassword({ email, newPassword: password })
      );
      unwrapResult(reset);

      navigate("/");
    } catch (error) {
      setErrorMessage(error);
    }
  };

  const validatePasswordConfirmation = (value: string) => {
    const password = getValues("password");
    return value === password || "Passwords do not match";
  };

  return (
    <>
      <Card className="reset-form p-3 w-80">
        <h2>Reset Password</h2>
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
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <span>{errors.password.message}</span>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: validatePasswordConfirmation,
              })}
            />
            {errors.confirmPassword && (
              <span>{errors.confirmPassword.message}</span>
            )}
          </Form.Group>

          <Button variant="primary" type="submit">
            Reset Password
          </Button>

          <Card.Text className="my-2 text-center">
            <Link to={"/"}>Sign In instead</Link>
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

export default ForgotPassword;
