export type CourseType = "live" | "recorded";

export interface LadderCourse {
  id: number;
  title: string;
  level: string;
  type: CourseType;
  instructor: string;
  schedule: string;
  videoUrl: string;
  description: string;
}

export const ladderCourses: LadderCourse[] = [
  {
    id: 1,
    title: "韩语语音打基础",
    level: "A1",
    type: "live",
    instructor: "Ha-neul Kim",
    schedule: "每周二/四 20:00",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    description: "通过直播互动掌握发音的梯度训练。",
  },
  {
    id: 2,
    title: "TOPIK 高频语法拆解",
    level: "B1",
    type: "recorded",
    instructor: "Yuna Park",
    schedule: "随报随学",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    description: "录播课聚焦中级语法的梯度进阶。",
  },
  {
    id: 3,
    title: "商务韩语表达力",
    level: "C1",
    type: "live",
    instructor: "Seojun Lee",
    schedule: "每周日 14:00",
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    description: "场景化商务沟通训练营。",
  },
];

export interface McqQuestion {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export const mcqQuestions: McqQuestion[] = [
  {
    id: 1,
    question: "选择与句子意思相同的表达：?? ???? __________.",
    options: ["?????", "????", "???", "????"],
    answerIndex: 0,
    explanation: "???? 表示学习，与语境匹配。",
  },
  {
    id: 2,
    question: "下列哪个词语属于TOPIK Ⅱ 高频副词?",
    options: ["?", "?", "?", "?"],
    answerIndex: 0,
    explanation: "? 表示相当，是常见副词。",
  },
];

export const essayPrompt = {
  id: 1,
  topic: "介绍你最喜欢的韩国文化元素",
  instructions: "150-200字，包含原因与个人体验",
};

export interface VocabWord {
  id: number;
  word: string;
  translation: string;
  example: string;
  mastered: boolean;
  level: "初级" | "中级" | "高级";
}

export const vocabWords: VocabWord[] = [
  { id: 1, word: "?????", translation: "你好", example: "?????? ?? ????.", mastered: true, level: "初级" },
  { id: 2, word: "????", translation: "感谢", example: "??? ????.", mastered: false, level: "初级" },
  { id: 3, word: "??", translation: "挑战", example: "??? ??? ?????.", mastered: false, level: "中级" },
  { id: 4, word: "???", translation: "有创意的", example: "???? ????? ????.", mastered: false, level: "高级" },
];

export interface ReviewPlan {
  date: string;
  words: string[];
  tip: string;
}

export const reviewPlan: ReviewPlan = {
  date: new Date().toISOString(),
  words: ["????", "??", "???"],
  tip: "集中复习动词变位并朗读三遍。",
};

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed?: boolean;
}

export const dailyTasks: DailyTask[] = [
  { id: "t1", title: "背5个新单词", description: "使用词汇模块完成", reward: 10 },
  { id: "t2", title: "完成1篇作文", description: "真题模块作文区提交", reward: 20 },
  { id: "t3", title: "跟读视频片段", description: "视频模块录音一次", reward: 15 },
];

export interface LeaderboardEntry {
  id: number;
  nickname: string;
  points: number;
}

export const leaderboard: LeaderboardEntry[] = [
  { id: 1, nickname: "????", points: 280 },
  { id: 2, nickname: "SeoulRunner", points: 245 },
  { id: 3, nickname: "TOPIKHunter", points: 223 },
];

export const inviteCodePool = ["KANATARA-2025", "K-ALPHA-001", "HALLYU-CLUB"];


