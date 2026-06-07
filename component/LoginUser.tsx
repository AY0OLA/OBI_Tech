"use client";
import { useAppContext } from "@/context/AppContext";
import { login } from "@/utils/action/userAuth.action";
import { emailValidationSchema } from "@/utils/zodvalidations/form-validations";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState } from "react";
import toast from "react-hot-toast";

const LoginUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  // const [tokenPart, setTokenPart] = useState(false);
  // const [token, setToken] = useState("");
  const { setSession } = useAppContext();
  const router = useRouter();

  const handleLogin = async () => {
    //Check the email and proceed with login or signup

    try {
      setLoading(true);
      const emailCheck = emailValidationSchema.safeParse({ email: email });
      if (!emailCheck.success) {
        toast.error("Please enter a valid email address");
        return;
      }
      const strongPassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!strongPassword.test(password)) {
        toast.error(
          "Password must contain uppercase, lowercase, number, special character and be at least 8 characters.",
        );
        return;
      }
      const toastId = toast.loading("Signing in...");

      try {
        toast.success("Logged in successfully!", {
          id: toastId,
        });
      } catch (error) {
        toast.error("Something went wrong", {
          id: toastId,
        });
      }
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      const loginUser = await login(formData);

      if (loginUser?.error) {
        toast.error(loginUser.error);
        return;
      }
      if (loginUser?.session) {
        setSession(loginUser.session);
        toast.success("Logged in successfully!");
        router.push("/");
      }
    } catch (error) {
      console.error("Something went wrong. Please try again later.", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmitToken = async () => {
  //   try {
  //     setLoading(true);
  //     const formData = new FormData();
  //     formData.append("email", email);
  //     formData.append("token", token);
  //     const otpVerification = await verifyToken(formData);

  //     if (otpVerification?.error) {
  //       toast.error("Invalid token. Please try again.");
  //       return;
  //     }
  //     if (otpVerification?.session) {
  //       toast.success("You are now logged in!");
  //       setSession(otpVerification.session);
  //       router.push("/");
  //     }

  //     // You can redirect the user to the dashboard or home page after successful login
  //   } catch (error) {
  //     console.error("Error submitting token:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="bg-black">
      <section className="flex flex-col justify-center h-screen items-center gap-6 text-white w-full px-4">
        {/* Logo */}
        <Link href={"/"}>
          <h1 className="text-4xl font-bold text-center">OBI-TECH Store</h1>
        </Link>

        {/* Heading */}
        <h1 className="text-2xl md:text-2xl max-md:text-xl font-bold text-center">
          Please Provide Your Email
        </h1>

        {/* Input + Button */}
        <div className="w-full max-w-[600px] flex flex-col gap-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email"
            name="email"
            type="email"
            id="email"
            className="w-full px-4 py-3 bg-white rounded-lg transition-all duration-200 placeholder-gray-400 text-black shadow-sm"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="Password"
            className="w-full px-4 py-3 bg-white rounded-lg placeholder-gray-400 text-black shadow-sm"
          />{" "}
          <p className="text-sm text-slate-400">
            {" "}
            Password must contain: <br /> • At least 8 characters <br /> • One
            uppercase letter <br /> • One lowercase letter <br /> • One number{" "}
            <br /> • One special character{" "}
          </p>
        </div>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="px-3 py-2 mt-4 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300  bg-[#043033] rounded-lg  focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
        <div className="flex flex-row justify-center align-center text-white">
          <p className="">We sign you up if you don&apos;t have an account? </p>
        </div>
      </section>
    </div>
  );
};
export default LoginUser;
