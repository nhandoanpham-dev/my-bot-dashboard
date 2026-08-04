export const metadata = {
  title: 'Discord Bot Dashboard',
  description: 'Customizer Bot Status',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className="bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
