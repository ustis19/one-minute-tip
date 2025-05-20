"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { motion } from "framer-motion";
import { tips, Tip } from "../data/tips";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border bg-white/20 p-4 shadow ${className}`}>{children}</div>;
}

function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

function Button({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function AdBlock() {
  return (
    <div className="max-w-xl my-8 p-4 border rounded bg-yellow-50 text-center text-yellow-800 shadow-md">
      <h3 className="font-bold mb-2">Реклама</h3>
      <p>🔥 Здесь может быть ваша реклама! Свяжитесь с нами для размещения.</p>
      <a
        href="mailto:ads@example.com"
        className="inline-block mt-3 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded"
      >
        Связаться
      </a>
    </div>
  );
}

export default function Home() {
  const [tip, setTip] = useState<Tip | null>(null);
  const [sortedTips, setSortedTips] = useState<Tip[]>([]);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  useEffect(() => {
    const sorted = [...tips].sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split('.').map(Number);
      const [dayB, monthB, yearB] = b.date.split('.').map(Number);
      return new Date(yearA, monthA - 1, dayA).getTime() - new Date(yearB, monthB - 1, dayB).getTime();
    });
    setSortedTips(sorted);

    const todayStr = new Date().toLocaleDateString("ru-RU");
    const todayTip = sorted.find(t => t.date === todayStr);
    setTip(todayTip || sorted[0]);
  }, []);

  const tipIndex = tip ? sortedTips.findIndex(t => t.date === tip.date) : 0;
  const bgImage = `/images/tips/tip_${String(tipIndex + 1).padStart(2, "0")}.jpg`;

  const handleShowNextTip = () => {
    if (!tip || sortedTips.length === 0) return;
    const currentIndex = sortedTips.findIndex(t => t.date === tip.date);
    const nextIndex = (currentIndex + 1) % sortedTips.length;
    setTip(sortedTips[nextIndex]);
  };

  const toggleArchive = () => setIsArchiveOpen(prev => !prev);

  const handleTelegramSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let username = (formData.get("telegram_user") as string).trim();

    if (!username) {
      alert("Пожалуйста, введите ваш Telegram username");
      return;
    }

    if (!username.startsWith("@")) {
      username = "@" + username;
    }

    const isValid = /^@?[a-zA-Z0-9_]{5,32}$/.test(username);
    if (!isValid) {
      alert("Некорректный username. Допустимы только буквы, цифры и подчёркивания (5–32 символа).");
      return;
    }

    const token = "YOUR_TELEGRAM_BOT_TOKEN";
    const chatId = "YOUR_TELEGRAM_CHAT_ID";
    const text = `Новая подписка в Telegram: ${username}`;

    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text }),
      });

      if (!res.ok) throw new Error("Ошибка при отправке сообщения");

      alert("Спасибо за подписку через Telegram!");
      e.currentTarget.reset();
    } catch (err) {
      console.error(err);
      alert("Не удалось отправить сообщение. Попробуйте позже.");
    }
  };

  return (
    <div
      className="min-h-screen p-6 text-gray-100 transition-colors duration-300 relative"
      style={{
        backgroundImage: `url('${bgImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Затемнённый оверлей */}
      <div
        className="absolute inset-0 bg-black opacity-60 pointer-events-none"
        aria-hidden="true"
      />

      {/* Контент поверх оверлея */}
      <main className="relative flex flex-col items-center justify-center">
        <header className="mb-10 text-center z-10 relative">
          <motion.h1
            className="text-3xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            🕐 Одна минута полезности
          </motion.h1>

          <nav className="flex justify-center gap-4 text-blue-400 underline">
            <a href="#tip">Совет дня</a>
            <a href="#archive">Архив</a>
            <a href="#about">О проекте</a>
            <a href="#subscribe">Подписка</a>
          </nav>
        </header>

        {tip && (
          <>
            <motion.div
              id="tip"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="z-10 relative"
            >
              <Card className="max-w-xl text-center bg-white/20">
                <CardContent className="p-6 text-white">
                  <h2 className="text-xl font-semibold mb-2">{tip.title}</h2>
                  <p className="text-base mb-4">{tip.content}</p>
                  <p className="text-sm text-gray-300">
                    Тема: {tip.category} | {tip.date}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <AdBlock />
          </>
        )}

        <Button
          className="mt-6 z-10 relative"
          title="Показать следующий совет"
          onClick={handleShowNextTip}
        >
          🔄 Показать следующий совет
        </Button>

        <section
          id="archive"
          className="mt-16 max-w-2xl w-full z-10 relative"
        >
          <div
            onClick={toggleArchive}
            className="flex cursor-pointer items-center justify-between border-b border-gray-400 pb-2"
            aria-expanded={isArchiveOpen}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") toggleArchive();
            }}
          >
            <h2 className="text-2xl font-bold">🗂 Архив советов</h2>
            <span
              className={`transform transition-transform duration-300 text-white ${
                isArchiveOpen ? "rotate-90" : ""
              }`}
              aria-hidden="true"
            >
              ▶
            </span>
          </div>

          {isArchiveOpen && (
            <ul className="space-y-2 mt-4 max-h-96 overflow-auto text-white">
              {sortedTips.map((t, index) => (
                <li key={index} className="border-b border-gray-600 pb-2">
                  <strong>{t.title}</strong> — <em>{t.category}</em> ({t.date})
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="about" className="mt-16 max-w-2xl w-full text-center z-10 relative">
          <h2 className="text-2xl font-bold mb-4 text-white">🤔 О проекте</h2>
          <p className="text-gray-300">
            Этот сайт создан для тех, кто любит узнавать новое, но не хочет тратить много времени. Каждый день — новый короткий совет, который можно прочитать за 1 минуту.
          </p>
        </section>

        <section
          id="subscribe"
          className="mt-16 max-w-md w-full text-center z-10 relative"
        >
          <h2 className="text-2xl font-bold mb-4 text-white">📩 Подпишитесь на рассылку</h2>

          <div className="mb-10">
            <h3 className="font-semibold mb-2 text-white">Через Email (Formspree)</h3>
            <form
              action="https://formspree.io/f/xjkwzgvv"
              method="POST"
              className="flex flex-col gap-4"
            >
              <label htmlFor="email" className="text-left font-medium text-white">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Ваш email"
                className="p-2 border rounded"
                required
              />
              <Button type="submit">Подписаться</Button>
            </form>
          </div>

          <div>
            <h3 className="font-semibold mb-2 text-white">Через Telegram</h3>
            <form onSubmit={handleTelegramSubmit} className="flex flex-col gap-4">
              <label htmlFor="telegram_user" className="text-left font-medium text-white">Telegram @username</label>
              <input
                type="text"
                name="telegram_user"
                id="telegram_user"
                placeholder="@ваш_ник_в_telegram"
                pattern="^@?[a-zA-Z0-9_]{5,32}$"
                className="p-2 border rounded"
                required
              />
              <Button type="submit">Подписаться через Telegram</Button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
