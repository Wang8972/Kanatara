import { PropsWithChildren } from "react";
import { NavBar } from "./NavBar";

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">{children}</main>
      <footer className="border-t bg-white text-center text-xs text-slate-500 py-4">
        ? {new Date().getFullYear()} Kanatara · 韩语学习实验平台
      </footer>
    </div>
  );
};

export default Layout;


