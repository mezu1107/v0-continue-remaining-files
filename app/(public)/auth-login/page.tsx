"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const supabase = createClient();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      if (data.session) {
        toast.success("Login successful! Welcome back.");
        router.push("/Dashboard");
        router.refresh();
      } else {
        toast.warning("Please confirm your email first.");
        router.push("/signup");
      }
    } catch (error: any) {
      const msg = error?.message || "Invalid email or password";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-sky-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-colors duration-500">
      {/* Background Image - same as signup */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
          alt="Soft gradient background"
          className="w-full h-full object-cover opacity-30 dark:opacity-20 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-100/40 via-white/30 to-pink-100/40 dark:from-gray-950/80 dark:via-gray-900/70 dark:to-gray-950/80 backdrop-blur-sm transition-colors duration-500" />
      </div>

      {/* Glass Card - same style as signup */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-md space-y-8 bg-white/85 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/40 dark:bg-gray-900/70 dark:border-gray-700/50 dark:text-white z-10 transition-all duration-500"
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Welcome Back</h1>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">Log in to your account</p>
        </motion.div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          {/* Email */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white/80 dark:border-gray-700 dark:bg-gray-800/60 dark:text-white dark:placeholder-gray-500 focus:border-sky-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-sky-300/50 dark:focus:ring-indigo-500/30 focus:outline-none transition-all duration-300 placeholder-gray-500"
            />
          </motion.div>

          {/* Password with Eye Icon */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="current-password"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 bg-white/80 dark:border-gray-700 dark:bg-gray-800/60 dark:text-white dark:placeholder-gray-500 focus:border-sky-500 dark:focus:border-indigo-500 focus:ring-2 focus:ring-sky-300/50 dark:focus:ring-indigo-500/30 focus:outline-none transition-all duration-300 placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-sky-600 dark:hover:text-indigo-400 transition-colors duration-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </motion.div>

          {/* Error Message */}
          {errorMsg && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-sm text-center py-3 rounded-xl border ${
                isDarkMode
                  ? "text-red-400 bg-red-950/30 border-red-800/50"
                  : "text-red-600 bg-red-50 border-red-200"
              }`}
            >
              {errorMsg}
            </motion.p>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`w-full py-3.5 px-6 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
              loading
                ? "bg-gray-400 dark:bg-gray-700 cursor-not-allowed"
                : "bg-gradient-to-r from-sky-500 to-pink-500 dark:from-indigo-600 dark:to-purple-700 hover:from-sky-600 hover:to-pink-600 dark:hover:from-indigo-700 dark:hover:to-purple-800"
            } text-white`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" className="opacity-75" />
                </svg>
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </motion.button>
        </form>

        {/* Footer Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
        >
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-medium text-sky-600 dark:text-indigo-400 hover:text-sky-800 dark:hover:text-indigo-300 transition-colors"
          >
            Sign up
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}