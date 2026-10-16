import { useState } from 'react';
import { FaGithub, FaInstagram, FaDiscord } from 'react-icons/fa';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent successfully!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center py-16 px-6">
      <div className="w-full max-w-3xl bg-gray-950/80 backdrop-blur-md p-8 rounded-lg shadow-xl border border-gray-800">
        <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent mb-6">Get in Touch</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-gray-300 mb-2">Name</label>
            <input
              type="text"
              name="name"
              className="w-full p-3 bg-gray-800 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div className="relative">
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              className="w-full p-3 bg-gray-800 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div className="relative">
            <label className="block text-gray-300 mb-2">Message</label>
            <textarea
              name="message"
              rows="5"
              className="w-full p-3 bg-gray-800 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              required
              value={formData.message}
              onChange={handleChange}
            ></textarea>
          </div>
          
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 hover:scale-105 transition-transform duration-300 shadow-md"
          >
            Send Message
          </button>
        </form>
      </div>
      
      {/* Social Media Links */}
      <div className="flex space-x-6 mt-8">
        <a href="https://github.com/Moudjib16" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-all text-3xl">
          <FaGithub />
        </a>
        <a href="https://instagram.com/moujiiiiiiii" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-400 transition-all text-3xl">
          <FaInstagram />
        </a>
        <a href="https://discord.gg/Wele_Welo_Weli" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400 transition-all text-3xl">
          <FaDiscord />
        </a>
      </div>
    </div>
  );
}