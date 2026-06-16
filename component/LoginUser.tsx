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
        toast.error("Check your username or password", {
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

 return (
   <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 flex items-center justify-center px-4 py-8">
     <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
       {/* Logo */}
       <Link href="/" className="block">
         <h1 className="text-3xl font-bold text-center text-[#043033]">
           OBI-TECH Store
         </h1>
       </Link>

       {/* Heading */}
       <div className="mt-6 text-center">
         <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
         <p className="mt-2 text-sm text-gray-500">
           Sign in to access your account
         </p>
       </div>

       {/* Form */}
       <div className="mt-8 space-y-4">
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
             placeholder="Enter your email"
             name="email"
             type="email"
             id="email"
             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#043033] focus:border-transparent outline-none transition"
           />
         </div>

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
             id="password"
             name="password"
             type="password"
             required
             minLength={8}
             placeholder="Enter your password"
             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#043033] focus:border-transparent outline-none transition"
           />
         </div>

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

         <button
           onClick={handleLogin}
           disabled={loading}
           className="w-full py-3 bg-[#043033] hover:bg-[#021d1f] text-white font-semibold rounded-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
         >
           {loading ? "Signing In..." : "Sign In"}
         </button>
       </div>

       {/* Footer */}
       <div className="mt-6 text-center">
         <p className="text-sm text-gray-600">
           Don't have an account?{" "}
           <Link
             href="/signup"
             className="font-semibold text-[#043033] hover:underline"
           >
             Create one
           </Link>
         </p>
       </div>
     </div>
   </div>
 );
};
export default LoginUser;
