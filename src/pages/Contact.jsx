import { useState } from 'react';
import { FaGithub, FaInstagram, FaDiscord, FaPaperPlane } from 'react-icons/fa';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Demo form — no backend wired. Show inline confirmation instead of alert().
    setSent(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  const inputCls =
    'w-full rounded-2xl border-2 border-slate-900 bg-amber-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:font-normal placeholder:text-slate-400 focus:border-violet-600 focus:bg-white focus:outline-none';

  return (
    <div className="bg-amber-50 text-slate-900">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <p className="inline-block rotate-[1deg] rounded-full border-2 border-slate-900 bg-sky-300 px-3 py-1 text-xs font-extrabold uppercase tracking-widest shadow-[2px_2px_0_0_#0f172a]">
          Fan mail
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">Say hi to the maze crew</h1>
        <p className="mt-1 text-sm font-medium text-slate-600">
          Found a gnarly maze? Got an idea for a new racer? Send it over!
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-3xl border-2 border-slate-900 bg-white p-5 shadow-[4px_4px_0_0_#0f172a] md:p-6">
          {sent && (
            <p role="status" className="rounded-2xl border-2 border-slate-900 bg-emerald-300 px-3 py-2 text-sm font-black">
              Message noted! (Demo form — for anything urgent open a GitHub issue.)
            </p>
          )}
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-extrabold">Your name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Maze Fan"
              className={inputCls}
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-extrabold">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="fan@example.com"
              className={inputCls}
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-1 block text-sm font-extrabold">Message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              placeholder="I built a maze that stumped A*…"
              className={inputCls}
              required
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-slate-900 bg-violet-600 py-3 text-sm font-black text-white shadow-[3px_3px_0_0_#0f172a] transition-transform hover:-translate-y-0.5 hover:bg-violet-500"
          >
            <FaPaperPlane className="text-xs" />
            Launch message
          </button>
        </form>

        <div className="mt-6 flex justify-center gap-3">
          <a href="https://github.com/Moudjib16/Maze-Solver" target="_blank" rel="noopener noreferrer" aria-label="GitHub repository" className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-slate-900 bg-white text-lg text-slate-700 shadow-[2px_2px_0_0_#0f172a] transition-transform hover:-translate-y-0.5 hover:text-slate-900">
            <FaGithub />
          </a>
          <a href="https://www.instagram.com/moujiiiiiiii" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-slate-900 bg-white text-lg text-slate-700 shadow-[2px_2px_0_0_#0f172a] transition-transform hover:-translate-y-0.5 hover:text-rose-500">
            <FaInstagram />
          </a>
          <a href="https://discord.gg/Wele_Welo_Weli" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-slate-900 bg-white text-lg text-slate-700 shadow-[2px_2px_0_0_#0f172a] transition-transform hover:-translate-y-0.5 hover:text-violet-600">
            <FaDiscord />
          </a>
        </div>
      </div>
    </div>
  );
}
