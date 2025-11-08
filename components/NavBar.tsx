import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { href: "/ladder", label: "梯度学习" },
  { href: "/exam", label: "真题练习" },
  { href: "/vocab", label: "词汇学习" },
  { href: "/video", label: "视频模块" },
  { href: "/tasks", label: "社区任务" },
  { href: "/user", label: "用户中心" },
  { href: "/assistant", label: "AI助手" },
];

export const NavBar = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <span className="text-xl font-semibold text-primary">Kanatara</span>
        </Link>
        <nav className="hidden md:flex gap-4 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-md transition-colors ${
                router.pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <span className="text-slate-500 hidden sm:inline">{user.email}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-md"
              >
                退出
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-slate-600 hover:text-primary">
                登录
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                注册
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;


