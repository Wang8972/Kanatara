import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("demo@kanatara.com");
  const [password, setPassword] = useState("kanatara123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      router.push("/ladder");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">登录 Kanatara</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-600">邮箱</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border rounded-md px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-slate-600">密码</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border rounded-md px-3 py-2"
            required
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded-md"
        >
          {loading ? "登录中..." : "登录"}
        </button>
      </form>
      <p className="text-sm text-slate-500 mt-4">
        还没有账号？<Link href="/register" className="text-primary">立即注册</Link>
      </p>
    </div>
  );
};

export default LoginPage;


