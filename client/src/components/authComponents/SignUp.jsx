import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLoading } from "../../contexts/LoadingContext";
import { HOST } from "../../config/config";


export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { startLoading, stopLoading } = useLoading();

  const passwordInstruction = "Password: 6+ chars, 1 letter, 1 number, 1 special char."

  useEffect(() => {
    if (!fullName && !email && !password && !confirmPassword) {
      setError("");
    }
  }, [fullName, email, password, confirmPassword]);

  useEffect(() => {
    if (!confirmPassword && error === "Passwords do not match") {
      setError("");
    } else if (
      password !== confirmPassword &&
      confirmPassword.length > 0 &&
      isPasswordValid(password)
    ) {
      setError("Passwords do not match");
    } else if (
      password === confirmPassword &&
      confirmPassword.length > 0 &&
      isPasswordValid(password)
    ) {
      setError("");
    }
  }, [confirmPassword, password]);

  useEffect(() => {
    if (!isPasswordValid(password) && password.length > 0) {
      setError(
        passwordInstruction
      );
    } else if (
      isPasswordValid(password) &&
      error ===
      passwordInstruction
    ) {
      setError("");
    }
  }, [password]);

  const isPasswordValid = (password) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    return passwordRegex.test(password);
  };

  const isEmailValid = (email) => {
    // Simple email validation using a regular expression
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };

  //Handle Signup Request
  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      fullName.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      setError("All fields are required");
      return;
    }

    if (!isPasswordValid(password)) {
      setError(
        passwordInstruction
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!isEmailValid(email)) {
      setError("Enter a Valid Email Address.");
      return;
    }

    startLoading();

    try {
      const response = await fetch(`${HOST}/auth/createuser`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName.trim(),
          email: email.trim(),
          password: password.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSuccess("Registration successful!");
          setError("");
          setUser(data.user);
          navigate("/app", { replace: true });
        } else {
          setError(data.message);
          setSuccess("");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message);
        setSuccess("");
      }
    } catch (error) {
      setError("An error occurred while registering.");
      setSuccess("");
    } finally {
      stopLoading();
    }
  };

  return (
    <>
      <section className=" bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full rounded-lg shadow  border md:mt-0 sm:max-w-md xl:p-0  bg-gray-800  border-gray-700">
            <div className="p-6 space-y-3 md:space-y-3 ">
              <h1 className="text-xl text-center font-bold leading-tight tracking-tight  md:text-2xl  text-white">
                Create an Account
              </h1>
              <div className="h-1 pb-4 xl:text-base text-center">
                {error && (
                  <p className="text-red-500 ">
                    * {error}
                  </p>
                )}
                {success && <p className="text-white">* {success}</p>}
              </div>
              <form className="space-y-4 md:space-y-6">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block mb-2 text-sm font-medium    text-white"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="border   sm:text-sm rounded-lg block w-full p-2.5  bg-gray-700  border-gray-600  placeholder-gray-400  text-white  focus:ring-blue-500  focus:border-blue-500"
                    placeholder="Full Name"
                    required=""
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium    text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border   sm:text-sm rounded-lg block w-full p-2.5  bg-gray-700  border-gray-600  placeholder-gray-400  text-white  focus:ring-blue-500  focus:border-blue-500"
                    placeholder="name@company.com"
                    required=""
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium    text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Set Password"
                    className="border   sm:text-sm rounded-lg block w-full p-2.5  bg-gray-700  border-gray-600  placeholder-gray-400  text-white  focus:ring-blue-500  focus:border-blue-500"
                    required=""
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium    text-white"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirm-password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="border   sm:text-sm rounded-lg block w-full p-2.5  bg-gray-700  border-gray-600  placeholder-gray-400  text-white  focus:ring-blue-500  focus:border-blue-500"
                    required=""
                  />
                </div>

                <button
                  type="submit"
                  onClick={handleRegister}
                  className="w-full text-white bg-blue-600 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center   hover:bg-blue-700  focus:ring-blue-800"
                >
                  Sign Up
                </button>
                <p className="text-sm font-light text-gray-400">
                  Already have an account?
                  <Link
                    to="/login"
                    className="font-medium hover:underline  text-blue-600 ml-1"
                  >
                    Login
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
