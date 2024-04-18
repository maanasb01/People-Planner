import {useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLoading } from "../../contexts/LoadingContext";
import { HOST } from "../../config/config";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState("");
  const [success, setSuccess] = useState("");
  const {setUser} = useAuth();
  const {startLoading, stopLoading} = useLoading();
  

  const navigate = useNavigate();

  const isEmailValid = (email) => {
    // Simple email validation using a regular expression
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    return emailRegex.test(email);
  };

//Handle Login Request
  const handleSubmit = async (e) => {
    e.preventDefault();
    startLoading();

    if(email.trim()==="" || password.trim()===""){
      setError("All Fields are Necessary.");
      return;
    }

    if(!isEmailValid(email)){
      setError("Enter a Valid Email");
      return;
    }

    // Create a data object to send to the API
    const data = {
      email:  email.trim(),
      password: password.trim(),
    };

    try {
      // Send a POST request to your authentication API
      const response = await fetch(`${HOST}/auth/login`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success) {
          setSuccess("Login successful!");
          setError("");
          navigate("/app",{replace: true});
          setUser(data.user); 

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
      console.error("An error occurred while logging in:", error);
      setError("An error occurred while logging in")
    }finally{
      stopLoading();
    }
  };


  return (
    <>
      <section className=" bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:mt-8 lg:py-0">
          <div className="w-full rounded-lg shadow  border md:mt-0 sm:max-w-md xl:p-0  bg-gray-800  border-gray-700">
            <div className="p-6 space-y-3 md:space-y-3 ">
              <h1 className="text-xl text-center font-bold leading-tight tracking-tight  md:text-2xl  text-white">
               Login
              </h1>
              <div className="h-1 text-center">
                {error && (
                  <p className="text-red-500 text-sm">
                    * {error}
                  </p>
                )}
                {success && <p className="text-white">* {success}</p>}
              </div>
              <form className="space-y-4 md:space-y-6">

                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium    text-white"
                  >
                    Email
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
                    placeholder="Password"
                    className="border   sm:text-sm rounded-lg block w-full p-2.5  bg-gray-700  border-gray-600  placeholder-gray-400  text-white  focus:ring-blue-500  focus:border-blue-500"
                    required=""
                  />
                </div>

                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full text-white bg-blue-600 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center   hover:bg-blue-700  focus:ring-blue-800"
                >
                  Login
                </button>
                <p className="text-sm font-light text-gray-400">
                  Don't have an account?
                  <Link
                    to="/signup"
                    className="font-medium hover:underline  text-blue-600 ml-1"
                  >
                    SignUp
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
