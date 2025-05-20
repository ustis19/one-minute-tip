"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { motion } from "framer-motion";
import { tips, Tip } from "../data/tips";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl border bg-white p-4 shadow ${className}`}>{children}</div>;
}

function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-2 ${className}`}>{children}</div>;
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

  // Определение фонового изображения по дате
  const today = new Date();
  const hashSuffix = today.getDate() + today.getMonth() * 31;
  const bgImage = `/backgrounds/bg_${hashSuffix % 100}.jpg`;

  useEffect(() => {
    const todayStr = today.toLocaleDateString("ru-RU");
    const todayTip = tips.find((t) => t.date === todayStr);
    setTip(todayTip || tips[0]);
  }, []);

  const handleShowNextTip = () => {
    if (!tip) return;
    const currentIndex = tips.findIndex((t) => t.date === tip.date);
    const nextIndex = (currentIndex + 1) % tips.length;
    setTip(tips[nextIndex]);
  };

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
      className="min-h-screen p-6 bg-white text-gray-800 transition-colors duration-300"
      style={{
        backgroundImage: `url('${bgImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <header className="mb-10 text-center">
        <motion.h1
          className="text-3xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          🕐 Одна минута полезности
        </motion.h1>

        <nav className="flex justify-center gap-4 text-blue-600 underline">
          <a href="#tip">Совет дня</a>
          <a href="#archive">Архив</a>
          <a href="#about">О проекте</a>
          <a href="#subscribe">Подписка</a>
        </nav>
      </header>

      <main className="flex flex-col items-center justify-center">
        {tip && (
          <>
            <motion.div
              id="tip"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="max-w-xl text-center">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{tip.title}</h2>
                  <p className="text-base mb-4">{tip.content}</p>
                  <p className="text-sm text-gray-500">
                    Тема: {tip.category} | {tip.date}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <AdBlock />
          </>
        )}

        <Button
          className="mt-6"
          title="Показать следующий совет"
          onClick={handleShowNextTip}
        >
          🔄 Показать следующий совет
        </Button>

        <section id="archive" className="mt-16 max-w-2xl w-full">
          <h2 className="text-2xl font-bold mb-4">🗂 Архив советов</h2>
          <ul className="space-y-2">
            {tips.map((t, index) => (
              <li key={index} className="border-b pb-2">
                <strong>{t.title}</strong> — <em>{t.category}</em> ({t.date})
              </li>
            ))}
          </ul>
        </section>

        <section id="about" className="mt-16 max-w-2xl w-full text-center">
          <h2 className="text-2xl font-bold mb-4">🤔 О проекте</h2>
          <p className="text-gray-700">
            Этот сайт создан для тех, кто любит узнавать новое, но не хочет тратить много времени. Каждый день — новый короткий совет, который можно прочитать за 1 минуту.
          </p>
        </section>

        <section id="subscribe" className="mt-16 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">📩 Подпишитесь на рассылку</h2>

          <div className="mb-10">
            <h3 className="font-semibold mb-2">Через Email (Formspree)</h3>
            <form
              action="https://formspree.io/f/xjkwzgvv"
              method="POST"
              className="flex flex-col gap-4"
            >
              <label htmlFor="email" className="text-left font-medium">Email</label>
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
            <h3 className="font-semibold mb-2">Через Telegram</h3>
            <form onSubmit={handleTelegramSubmit} className="flex flex-col gap-4">
              <label htmlFor="telegram_user" className="text-left font-medium">Telegram @username</label>
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
