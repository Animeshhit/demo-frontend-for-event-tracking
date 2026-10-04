"use client";
import {useAuth} from '@/hooks/use-auth';
export function LoginContent() {
  const { user, login, logout } = useAuth();
  return (
    <main className="mx-auto max-w-lg px-5 py-32 text-center">
      <h1 className="text-5xl font-light tracking-[-.07em]">
        {user ? `Welcome, ${user.name}.` : "A quieter way to shop."}
      </h1>
      <p className="mt-4 text-black/55">
        This is a demo account. No password required.
      </p>
      <button
        // onClick={user ? logout : login}
        className="mt-8 rounded-full bg-black px-6 py-3 text-sm text-white"
      >
        {user ? "Sign out" : "Continue as Alex"}
      </button>
    </main>
  );
}
