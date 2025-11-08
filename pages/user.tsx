import { FormEvent, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAuthGuard } from "../hooks/useAuthGuard";

const UserPage = () => {
  const { logout } = useAuth();
  const { user, initializing } = useAuthGuard();
  const [profile, setProfile] = useState({ nickname: "韩语小行星", goal: "通过 TOPIK II" });
  const [message, setMessage] = useState<string | null>(null);

  if (!user && !initializing) {
    return null;
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setMessage("资料已更新（示例，无真实写入）");
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">用户中心</h1>
          <p className="text-slate-500 text-sm">查看个人信息、积分、邀请码。未来将接入实名资料修改。</p>
        </div>
        <button onClick={logout} className="text-sm text-primary underline">
          退出账号
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border p-5 space-y-4">
          <h3 className="font-semibold">基本信息</h3>
          <p className="text-sm text-slate-600">邮箱：{user?.email}</p>
          <p className="text-sm text-slate-600">积分：{user?.points ?? 0}</p>
          <p className="text-sm text-slate-600">邀请码：KANATARA-2025</p>
          <p className="text-xs text-slate-400">提示：邀请码来自 InviteCode 表，可通过脚本生成。</p>
        </div>
        <form className="bg-white rounded-xl border p-5 space-y-4" onSubmit={handleSubmit}>
          <h3 className="font-semibold">修改资料</h3>
          <div>
            <label className="block text-xs text-slate-500">昵称</label>
            <input
              value={profile.nickname}
              onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
              className="mt-1 w-full border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500">学习目标</label>
            <input
              value={profile.goal}
              onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
              className="mt-1 w-full border rounded-md px-3 py-2"
            />
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-md" type="submit">
            保存（示例）
          </button>
          {message && <p className="text-xs text-green-600">{message}</p>}
        </form>
      </div>
      <div className="bg-white rounded-xl border p-5">
        <h3 className="font-semibold mb-2">学习进度</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 border rounded-lg text-center">
            <p className="text-3xl font-bold text-primary">68%</p>
            <p className="text-slate-500">梯度课程完成度</p>
          </div>
          <div className="p-4 border rounded-lg text-center">
            <p className="text-3xl font-bold text-secondary">42</p>
            <p className="text-slate-500">累计任务</p>
          </div>
          <div className="p-4 border rounded-lg text-center">
            <p className="text-3xl font-bold text-emerald-500">128h</p>
            <p className="text-slate-500">累计学习时长</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserPage;


