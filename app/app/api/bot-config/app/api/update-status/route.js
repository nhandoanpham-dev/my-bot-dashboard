import { NextResponse } from 'next/server';
import { Client, GatewayIntentBits } from 'discord.js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    const { token, status, activityType, activityName, streamingUrl } = await req.json();

    if (!token || !activityName) {
      return NextResponse.json(
        { error: 'Vui lòng nhập đầy đủ Token và Tên trạng thái/Ghi chú.' },
        { status: 400 }
      );
    }

    const client = new Client({ intents: [GatewayIntentBits.Guilds] });

    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        client.destroy();
        reject(new Error('Kết nối tới Discord bị quá thời hạn (Timeout). Hãy kiểm tra lại Token.'));
      }, 10000);

      client.once('ready', async () => {
        try {
          await client.user.setPresence({
            status: status || 'online',
            activities: [
              {
                name: activityName,
                type: activityType,
                ...(activityType === 1 && streamingUrl ? { url: streamingUrl } : {}),
              },
            ],
          });
          clearTimeout(timeout);
          setTimeout(() => {
            client.destroy();
            resolve();
          }, 2000);
        } catch (err) {
          client.destroy();
          reject(err);
        }
      });

      client.login(token).catch(() => {
        clearTimeout(timeout);
        reject(new Error('Bot Token không hợp lệ.'));
      });
    });

    const { error: dbError } = await supabase.from('bot_settings').upsert({
      id: 'default_bot',
      token,
      status,
      activity_type: activityType,
      activity_name: activityName,
      streaming_url: streamingUrl,
      updated_at: new Date().toISOString(),
    });

    if (dbError) throw new Error(`Lỗi lưu vào CSDL: ${dbError.message}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Lỗi xử lý hệ thống' },
      { status: 500 }
    );
  }
}
