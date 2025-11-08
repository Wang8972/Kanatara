import { useState } from "react";
import { dailyTasks, leaderboard } from "../data/sampleData";
import { useAuthGuard } from "../hooks/useAuthGuard";

const TasksPage = () => {
  const { user, initializing } = useAuthGuard();
  const [tasks, setTasks] = useState(dailyTasks);
  const [points, setPoints] = useState(user?.points ?? 120);
  const [message, setMessage] = useState<string | null>(null);

  if (!user && !initializing) {
    return null;
  }

  const handleComplete = async (taskId: string) => {
    const response = await fetch("/api/tasks/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId }),
    });
    const data = await response.json();
    if (response.ok) {
      setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: true } : task)));
      setPoints((prev) => prev + data.reward);
      setMessage(`任务完成 +${data.reward} 积分`);
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">社区任务</h1>
        <p className="text-slate-500 text-sm">坚持打卡累积积分，匹配排行榜。</p>
      </div>
      <div className="grid md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white rounded-xl border p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">{task.title}</p>
                <p className="text-sm text-slate-500">{task.description}</p>
                <p className="text-xs text-slate-400">奖励：{task.reward} 积分</p>
              </div>
              <button
                className={`px-4 py-2 rounded-md text-sm ${
                  task.completed ? "bg-green-100 text-green-600" : "bg-primary text-white"
                }`}
                disabled={!!task.completed}
                onClick={() => handleComplete(task.id)}
              >
                {task.completed ? "已完成" : "完成任务"}
              </button>
            </div>
          ))}
          {message && <p className="text-sm text-green-600">{message}</p>}
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold">积分统计</h3>
            <p className="text-3xl font-bold mt-2">{points}</p>
            <p className="text-xs text-slate-500">说明：真实项目中将与Points表同步。</p>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold">排行榜（示例数据）</h3>
            <ul className="mt-3 space-y-2">
              {leaderboard.map((entry, index) => (
                <li key={entry.id} className="flex items-center justify-between text-sm">
                  <span>
                    {index + 1}. {entry.nickname}
                  </span>
                  <span>{entry.points} 分</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TasksPage;


