"use client";
import { useEffect, useRef, useState } from "react";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Form } from "react-bootstrap";
import * as formik from "formik";
import * as yup from "yup";
import { login } from "@/store/reducers/registrationSlice";
import axios from "axios";
import { showErrorToast, showSuccessToast } from "../toast-popup/Toastify";
import "./RegisterPage.css";

const RegisterPage = () => {
  const { Formik } = formik;
  const formikRef = useRef<any>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  // Define Yup validation schema
  const schema = yup.object().shape({
    name: yup.string().required("Username is required"),
    fullName: yup.string().required("Full name is required"),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .required("Confirm password is required")
      .oneOf([yup.ref("password")], "Passwords do not match"),
    address: yup.string().required("Address is required"),
    phone: yup
      .string()
      .matches(/^[0-9]+$/, "Phone number must contain only digits")
      .min(10, "Phone number must be at least 10 digits")
      .max(11, "Phone number must not exceed 11 digits")
      .required("Phone number is required"),
  });

  const initialValues = {
    name: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
  };

  const onSubmit = async (values: any) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: values.name,
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        address: values.address,
        phone: values.phone
      });

      if (response.data) {
        localStorage.setItem("login_user", JSON.stringify(response.data));
        dispatch(login(response.data));
        showSuccessToast("Registration successful!");
        router.push("/login");
        if (formikRef.current) {
          formikRef.current.resetForm();
        }
      }
    } catch (error: any) {
      if (error.response) {
        showErrorToast(error.response.data.message || "Registration failed");
      } else {
        showErrorToast("Cannot connect to server");
      }
    }
  };

  // Thêm hàm xử lý phone input
  const handlePhoneChange = (e: React.ChangeEvent<any>, handleChange: any) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11); // Chỉ giữ lại số và giới hạn 11 ký tự
    e.target.value = value;
    handleChange(e);
  };

  return (
    <>
      <Breadcrumb title={"Register"} />
      <section className="gi-register padding-tb-40">
        <div className="container">
          <div className="section-title-2" style={{paddingBottom: "0px" }}>
            <h2 className="gi-title">
              Register<span></span>
            </h2>
            <p>Create a new account</p>
          </div>
          <div className="row">
            <div className="gi-register-wrapper" style={{ maxWidth: "500px", paddingBottom: "0px"}}>
              <div className="gi-register-container">
                <div className="gi-register-form">
                  <Formik
                    innerRef={formikRef}
                    validationSchema={schema}
                    onSubmit={onSubmit}
                    initialValues={initialValues}
                    validateOnChange={true}
                    validateOnBlur={true}
                  >
                    {({
                      handleSubmit,
                      handleChange,
                      handleBlur,
                      values,
                      touched,
                      errors,
                      isValid,
                      dirty
                    }: formik.FormikProps<{
                      name: string;
                      fullName: string;
                      email: string;
                      password: string;
                      confirmPassword: string;
                      address: string;
                      phone: string;
                    }>) => (
                      <>
                        <Form noValidate onSubmit={handleSubmit}>
                          <span className="gi-register-wrap">
                            <label className="lable-form">Username*</label>
                            <Form.Group>
                              <Form.Control
                                type="text"
                                name="name"
                                placeholder="Enter username"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.name && !!errors.name}
                                required
                              />
                              {touched.name && errors.name && (
                                <Form.Control.Feedback type="invalid">
                                  {(errors.name as string)}
                                </Form.Control.Feedback>
                              )}
                            </Form.Group>
                          </span>

                          <span className="gi-register-wrap">
                            <label className="lable-form">Full Name*</label>
                            <Form.Group>
                              <Form.Control
                                type="text"
                                name="fullName"
                                placeholder="Enter full name"
                                value={values.fullName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.fullName && !!errors.fullName}
                                required
                              />
                              {touched.fullName && errors.fullName && (
                                <Form.Control.Feedback type="invalid">
                                  {(errors.fullName as string)}
                                </Form.Control.Feedback>
                              )}
                            </Form.Group>
                          </span>

                          <span className="gi-register-wrap">
                            <label className="lable-form">Email*</label>
                            <Form.Group>
                              <Form.Control
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.email && !!errors.email}
                                required
                              />
                              {touched.email && errors.email && (
                                <Form.Control.Feedback type="invalid">
                                  {(errors.email as string)}
                                </Form.Control.Feedback>
                              )}
                            </Form.Group>
                          </span>

                          <span className="gi-register-wrap">
                            <label className="lable-form">Password*</label>
                            <Form.Group>
                              <Form.Control
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.password && !!errors.password}
                                required
                              />
                              {touched.password && errors.password && (
                                <Form.Control.Feedback type="invalid">
                                  {(errors.password as string)}
                                </Form.Control.Feedback>
                              )}
                            </Form.Group>
                          </span>

                          <span className="gi-register-wrap">
                            <label className="lable-form">Confirm Password*</label>
                            <Form.Group>
                              <Form.Control
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm password"
                                value={values.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.confirmPassword && !!errors.confirmPassword}
                                required
                              />
                              {touched.confirmPassword && errors.confirmPassword && (
                                <Form.Control.Feedback type="invalid">
                                  {(errors.confirmPassword as string)}
                                </Form.Control.Feedback>
                              )}
                            </Form.Group>
                          </span>

                          <span className="gi-register-wrap">
                            <label className="lable-form">Address*</label>
                            <Form.Group>
                              <Form.Control
                                type="text"
                                name="address"
                                placeholder="Enter address"
                                value={values.address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={touched.address && !!errors.address}
                                required
                              />
                              {touched.address && errors.address && (
                                <Form.Control.Feedback type="invalid">
                                  {(errors.address as string)}
                                </Form.Control.Feedback>
                              )}
                            </Form.Group>
                          </span>

                          <span className="gi-register-wrap">
                            <label className="lable-form">Phone Number*</label>
                            <Form.Group>
                              <Form.Control
                                type="tel"
                                name="phone"
                                placeholder="Enter phone number"
                                value={values.phone}
                                onChange={(e) => handlePhoneChange(e, handleChange)}
                                onBlur={handleBlur}
                                isInvalid={touched.phone && !!errors.phone}
                                pattern="[0-9]*"
                                inputMode="numeric"
                                style={{ 
                                  WebkitAppearance: 'none', 
                                  MozAppearance: 'textfield',
                                  appearance: 'textfield'
                                }}
                                required
                              />
                              {touched.phone && errors.phone && (
                                <Form.Control.Feedback type="invalid">
                                  {(errors.phone as string)}
                                </Form.Control.Feedback>
                              )}
                            </Form.Group>
                          </span>
                          <span style={{ marginTop: '5px' }} className="gi-register-wrap gi-register-btn">
                            <span>
                              Already have an account?
                              <a href="/login">Login</a>
                            </span>
                            <button 
                              className="gi-btn-1" 
                              type="submit"
                              disabled={!isValid || !dirty}
                            >
                              Register
                            </button>
                          </span>
                        </Form>
                      </>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RegisterPage;

export const getRegistrationData = () => {
  if (typeof window !== "undefined") {
    const registrationData = localStorage.getItem("registrationData");
    return registrationData ? JSON.parse(registrationData) : [];
  }
  return [];
};

export const setRegistrationData = (data: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("registrationData", JSON.stringify(data));
  }
};
