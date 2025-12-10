import { useState } from "react";

export default function PromptBox() {
  const [messages, setMessages] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setErrors] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors("");
    try {
      const res = await fetch("http://localhost:3000/api/rfp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messages, email: email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.message || "Error while sending order");
        return;
      }
      setMessages("");
      setEmail("");
      setSuccess(true);

      console.log("Success:", data);
    } catch (error) {
      console.log(error);
      setMessages("");
      setEmail("");
      setErrors("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black px-4">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black animate-gradient-xy opacity-80" />
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-600 blur-[200px] opacity-40 rounded-full" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-indigo-500 blur-[200px] opacity-40 rounded-full" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 
                   rounded-3xl shadow-[0_0_40px_rgba(255,255,255,0.1)] p-12 animate-fade-in z-10"
      >
        <h1 className="text-4xl font-extrabold text-white text-center mb-6 drop-shadow-xl tracking-wide">
          Create Your RFP Instantly
        </h1>

        <p className="text-gray-300 text-center mb-10 text-lg leading-relaxed max-w-xl mx-auto">
          Enter your email and describe your purchase request in natural
          language. Our AI will convert it into a structured, procurement-ready
          RFP.
        </p>

        <div className="relative mb-8">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=" "
            className="peer block w-full h-16 px-5 pt-6 pb-2 text-lg text-white 
               bg-white/10 rounded-2xl border border-white/30 
               backdrop-blur-md shadow-lg outline-none
               focus:border-purple-400 focus:ring-2 focus:ring-purple-500
               transition-all duration-300"
          />

          <label
            className="absolute left-5 top-4 text-gray-300 text-lg 
               transition-all duration-300 pointer-events-none resize-none
               peer-placeholder-shown:top-2 peer-placeholder-shown:text-lg
               peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-300"
          >
            Email Address
          </label>
        </div>

        <div className="relative">
          <textarea
            value={messages}
            onChange={(e) => setMessages(e.target.value)}
            placeholder=" "
            className="peer w-full h-48 p-6 text-lg text-white bg-white/10 rounded-2xl border border-white/30 
                       backdrop-blur-md shadow-xl resize-none
                       focus:border-purple-400 focus:ring-2 focus:ring-purple-500 
                       transition-all duration-300 outline-none"
          />
          <label
            className="absolute top-6 left-6 text-gray-300 text-lg transition-all duration-300
                       peer-placeholder-shown:top-6 peer-placeholder-shown:text-lg 
                       peer-focus:top-2 peer-focus:text-xs peer-focus:text-purple-300"
          >
            Describe your order…
          </label>
        </div>

        <button
          type="submit"
          className="mt-10 w-full py-4 rounded-2xl text-xl font-semibold text-white
                     bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500
                     shadow-[0_0_30px_rgba(139,92,246,0.7)]
                     hover:shadow-[0_0_50px_rgba(139,92,246,1)]
                     transition-all duration-300 active:scale-95 cursor-pointer"
        >
          {loading ? "Processing..." : "Generate RFP"}
        </button>

        {error && (
          <p className="text-red-400 text-center mt-4 text-lg font-medium">
            {error}
          </p>
        )}
      </form>
      {success && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 animate-fade-in">
          <div className="bg-white/10 border border-white/20 rounded-3xl p-10 shadow-2xl backdrop-blur-xl text-center max-w-md mx-auto animate-fade-in">
            <h2 className="text-3xl font-bold text-green-400 mb-4">
              Request Sent!
            </h2>

            <p className="text-gray-200 text-lg mb-8">
              Your request has been successfully sent to the vendor.
            </p>

            <button
              onClick={() => setSuccess(false)}
              className="px-8 py-3 rounded-2xl bg-gradient-to-r 
                         from-purple-500 to-indigo-500 text-white font-semibold
                         shadow-lg active:scale-95 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(25px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.9s ease-out forwards;
        }

        @keyframes gradient-xy {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        .animate-gradient-xy {
          background-size: 180% 180%;
          animation: gradient-xy 14s ease infinite;
        }
      `}</style>
    </div>
  );
}
