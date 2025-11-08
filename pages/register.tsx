import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", inviteCode: "KANATARA-2025" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await register(form);
      setMessage("注册成功，请登录");
      setTimeout(() => router.push("/login"), 800);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-6">创建账号</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-600">邮箱</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1 w-full border rounded-md px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-slate-600">密码</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="mt-1 w-full border rounded-md px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-slate-600">邀请码</label>
          <input
            value={form.inviteCode}
            onChange={(e) => setForm({ ...form, inviteCode: e.target.value })}
            className="mt-1 w-full border rounded-md px-3 py-2"
            placeholder="例如：KANATARA-2025"
            required
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}
        <button type="submit" className="w-full bg-secondary text-white py-2 rounded-md" disabled={loading}>
          {loading ? "提交中..." : "注册"}
        </button>
      </form>
      <p className="text-sm text-slate-500 mt-4">
        已有账号？<Link href="/login" className="text-primary">直接登录</Link>
      </p>
    </div>
  );
};

export default RegisterPage;


