import { useState } from "react";
import { ladderCourses } from "../data/sampleData";
import { useAuthGuard } from "../hooks/useAuthGuard";

const LadderPage = () => {
  const { user, initializing } = useAuthGuard();
  const [selectedCourse, setSelectedCourse] = useState(ladderCourses[0]);
  const [question, setQuestion] = useState("想请教老师：录播课可以无限回放吗？");

  if (!user && !initializing) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">梯度学习 · 达人课程</h1>
        <p className="text-slate-500 text-sm">覆盖A1-C1梯度课程，支持直播互动与录播精讲。</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <video key={selectedCourse.id} controls className="w-full rounded-xl border">
            <source src={selectedCourse.videoUrl} type="video/mp4" />
          </video>
          <div className="bg-white p-4 rounded-xl border space-y-2">
            <h2 className="font-semibold">{selectedCourse.title}</h2>
            <p className="text-sm text-slate-500">{selectedCourse.description}</p>
            <div className="text-xs text-slate-500 flex gap-4">
              <span>等级：{selectedCourse.level}</span>
              <span>类型：{selectedCourse.type === "live" ? "直播" : "录播"}</span>
              <span>讲师：{selectedCourse.instructor}</span>
              <span>时间：{selectedCourse.schedule}</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold mb-3">课程列表</h3>
            <ul className="space-y-3">
              {ladderCourses.map((course) => (
                <li key={course.id}>
                  <button
                    onClick={() => setSelectedCourse(course)}
                    className={`w-full text-left p-3 rounded-lg border ${
                      selectedCourse.id === course.id
                        ? "border-primary bg-primary/5"
                        : "border-slate-200"
                    }`}
                  >
                    <p className="font-medium">{course.title}</p>
                    <p className="text-xs text-slate-500">{course.level} · {course.type === "live" ? "直播" : "录播"}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl border p-4">
            <h3 className="font-semibold mb-2">课程问答</h3>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full border rounded-md p-3 text-sm"
              rows={4}
            />
            <button className="mt-2 w-full bg-secondary text-white py-2 rounded-md" disabled>
              提交问题（敬请期待实时互动）
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LadderPage;


