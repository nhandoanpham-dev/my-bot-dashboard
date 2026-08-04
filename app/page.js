'use client';
import { useState, useEffect } from 'react';

export default function BotDashboard() {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('online');
  const [activityType, setActivityType] = useState('0');
  const [activityName, setActivityName] = useState('');
  const [streamingUrl, setStreamingUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch('/api/bot-config');
        const { data } = await res.json();
        if (data) {
          if (data.token) setToken(data.token);
          if (data.status) setStatus(data.status);
          if (data.activity_type !== undefined) setActivityType(data.activity_type.toString());
          if (data.activity_name) setActivityName(data.activity_name);
          if (data.streaming_url) setStreamingUrl(data.streaming_url);
        }
      } catch (err) {
        console.error('Không thể tải cấu hình cũ:', err);
      } finally {
        setFetching(false);
      }
    }
    loadConfig();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          status,
          activityType: parseInt(activityType),
          activityName,
          streamingUrl,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Cập nhật trạng thái & Lưu cấu hình thành công!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Có lỗi xảy ra.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Không thể kết nối tới máy chủ.' });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p className="text-slate-400 text-sm animate-pulse">Đang tải cấu hình Bot...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <h1 className="text-xl font-bold tracking-wide">Discord Bot Customizer</h1>
        </div>

        {message.text && (
          <div className={`p-3 rounded-lg mb-4 text-sm ${message.type === 'success' ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-200' : 'bg-rose-950/80 border border-rose-800 text-rose-200'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Bot Token (Đã tự động nhớ)
            </label>
            <input
              type="password"
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="MTA1X..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Trạng thái (Status)
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="online">🟢 Trực tuyến (Online)</option>
              <option value="idle">🟡 Chờ (Idle)</option>
              <option value="dnd">🔴 Không làm phiền (DND)</option>
              <option value="invisible">⚪ Ẩn (Invisible)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Loại hoạt động
            </label>
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="0">Đang chơi (Playing)</option>
              <option value="1">Đang Phát trực tiếp (Streaming)</option>
              <option value="2">Đang nghe (Listening)</option>
              <option value="3">Đang xem (Watching)</option>
              <option value="5">Đang thi đấu (Competing)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Tên hoạt động / Ghi chú Custom
            </label>
            <input
              type="text"
              required
              value={activityName}
              onChange={(e) => setActivityName(e.target.value)}
              placeholder="VD: Genshin Impact / bot.vibehost.vn"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {activityType === '1' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Link Stream (Twitch/YouTube)
              </label>
              <input
                type="url"
                required
                value={streamingUrl}
                onChange={(e) => setStreamingUrl(e.target.value)}
                placeholder="https://www.twitch.tv/username"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
          >
            {loading ? 'Đang kết nối & Lưu...' : 'Lưu & Cập Nhật Trạng Thái Bot'}
          </button>
        </form>
      </div>
    </div>
  );
}
