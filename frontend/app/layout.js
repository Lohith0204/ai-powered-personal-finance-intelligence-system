import "./globals.css";

export const metadata = {
  title: "AI Personal Finance Intelligence",
  description: "Understand your spending behavior and predict expenses automatically using AI.",
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
