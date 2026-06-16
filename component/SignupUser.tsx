"use client";
import { signUp } from "@/utils/action/userAuth.action";
import { emailValidationSchema } from "@/utils/zodvalidations/form-validations";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState } from "react";
import toast from "react-hot-toast";

const SignupUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    console.log("Signup button clicked");
    try {
      setLoading(true);

      const emailCheck = emailValidationSchema.safeParse({
        email,
      });

      if (!emailCheck.success) {
        toast.error("Please enter a valid email");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      const strongPassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!strongPassword.test(password)) {
        toast.error(
          "Password must contain uppercase, lowercase, number and special character",
        );
        return;
      }

      const formData = new FormData();

      formData.append("email", email);
      formData.append("password", password);

      const toastId = toast.loading("Creating account...");

      const result = await signUp(formData);

      if (result?.error) {
        toast.error(result.error, {
          id: toastId,
        });
        return;
      }

      toast.success("Account created successfully!", {
        id: toastId,
      });

      router.push("/login");
    } catch (error) {
      console.error(error);

      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        {/* Logo */}
        <Link href="/" className="block">
          <h1 className="text-3xl font-extrabold text-center text-[#043033]">
            OBI-TECH Store
          </h1>
        </Link>

        {/* Heading */}
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Join OBI-TECH Store and start shopping for the latest gadgets and
            accessories.
          </p>
        </div>

        {/* Form */}
        <div className="mt-8 space-y-4">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#043033] outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#043033] outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              placeholder="Create a password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#043033] outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#043033] outline-none"
            />
          </div>

          {/* Password Requirements */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs text-slate-600 leading-6">
              Password must contain:
              <br />• At least 8 characters
              <br />• One uppercase letter
              <br />• One lowercase letter
              <br />• One number
              <br />• One special character
            </p>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-2">
            <input type="checkbox" id="terms" className="mt-1" />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-[#043033] font-medium hover:underline"
              >
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-[#043033] font-medium hover:underline"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Button */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full py-3 bg-[#043033] hover:bg-[#021d1f] text-white font-semibold rounded-xl transition duration-300 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#043033] hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default SignupUser;
