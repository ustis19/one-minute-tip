"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { motion } from "framer-motion";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Спасибо за ваше сообщение!\nИмя: ${formData.name}\nEmail: ${formData.email}\nСообщение: ${formData.message}`);
    setFormData({ name: "", email: "", message: "" });
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="max-w-xl my-8 p-4 border rounded bg-yellow-50 text-center text-yellow-800 shadow-md">
        <h3 className="font-bold mb-2">Реклама</h3>
        <p>🔥 Здесь может быть ваша реклама! Свяжитесь с нами для размещения.</p>
        <button
          onClick={toggleModal}
          className="inline-block mt-3 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded"
        >
          Связаться
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
            <button
              onClick={toggleModal}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold"
              aria-label="Закрыть"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4">Свяжитесь с нами</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="name"
                placeholder="Ваше имя"
                value={formData.name}
                onChange={handleChange}
                required
                className="p-2 border rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Ваш email"
                value={formData.email}
                onChange={handleChange}
                required
                className="p-2 border rounded"
              />
              <textarea
                name="message"
                placeholder="Сообщение"
                value={formData.message}
                onChange={handleChange}
                required
                className="p-2 border rounded resize-none"
                rows={4}
              />
              <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded">
                Отправить
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

type Tip = {
  title: string;
  content: string;
  category: string;
  date: string;
};

const tips: Tip[] = [
  {
    title: "💧 Пей больше воды",
    content:
      "Даже лёгкое обезвоживание снижает концентрацию и работоспособность. Поставь стакан воды рядом с рабочим местом!",
    category: "здоровье",
    date: "19.05.2025",
  },
  {
    title: "📚 Метод Помидора",
    content: "Работай 25 минут, отдыхай 5. Такой цикл повышает продуктивность и снижает выгорание.",
    category: "продуктивность",
    date: "18.05.2025",
  },
  {
    title: "💡 Быстрый способ снять стресс",
    content:
      "Глубокий вдох на 4 секунды, задержка дыхания на 4, выдох на 4. Повтори 3 раза — и почувствуешь эффект.",
    category: "психология",
    date: "17.05.2025",
  },
];

export default function Home() {
  const [tip, setTip] = useState<Tip | null>(null);

  useEffect(() => {
    const today = new Date().toLocaleDateString("ru-RU");
    const todayTip = tips.find((t) => t.date === today);
    setTip(todayTip || tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  const handleTelegramSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("telegram_email");

    const token = "YOUR_TELEGRAM_BOT_TOKEN";
    const chatId = "YOUR_TELEGRAM_CHAT_ID";
    const text = `Новая подписка: ${email}`;

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
    <div className="min-h-screen bg-white text-gray-800 p-6">
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
          title="Показать случайный совет"
          onClick={() => {
            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            setTip(randomTip);
          }}
        >
          🔄 Показать другой совет
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
              <label htmlFor="telegram_email" className="text-left font-medium">Email</label>
              <input
                type="email"
                name="telegram_email"
                id="telegram_email"
                placeholder="Ваш email"
                pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
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
