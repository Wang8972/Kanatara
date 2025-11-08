import Link from "next/link";

const modules = [
  { title: "梯度学习", description: "达人课程与实时问答", href: "/ladder" },
  { title: "真题练习", description: "TOPIK 选择题 + 作文反馈", href: "/exam" },
  { title: "词汇学习", description: "单词卡 & 复习计划", href: "/vocab" },
  { title: "视频模块", description: "影视赏析 + 发音评估", href: "/video" },
  { title: "社区任务", description: "每日任务与积分系统", href: "/tasks" },
  { title: "用户中心", description: "资料、积分、邀请码", href: "/user" },
  { title: "AI 学习助手", description: "六种模式的智能助手", href: "/assistant" },
];

const HomePage = () => {
  return (
    <section className="space-y-10">
      <div className="text-center space-y-4">
        <p className="text-sm tracking-[0.4em] text-secondary">KANATARA</p>
        <h1 className="text-4xl font-bold">韩语学习实验站</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          六大模块覆盖梯度课程、真题刷题、词汇记忆、视频跟读、社区任务与用户成长。当前版本为原型，重点验证路由、接口与数据流。
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/register" className="px-6 py-3 rounded-md bg-primary text-white">
            新用户注册
          </Link>
          <Link href="/login" className="px-6 py-3 rounded-md border border-primary text-primary">
            立即登录
          </Link>
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Link
            key={module.href}
            href={module.href}
            className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition"
          >
            <h3 className="font-semibold text-lg">{module.title}</h3>
            <p className="text-slate-500 text-sm mt-2">{module.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HomePage;


