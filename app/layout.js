export const metadata = {
  title: 'Discord Bot Dashboard',
  description: 'Customizer Bot Status',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body style={{ margin: 0, backgroundColor: '#020617', color: '#f8fafc' }}>
        {children}
      </body>
    </html>
  );
}
