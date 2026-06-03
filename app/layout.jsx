import "./globals.css";

export const metadata = {
  title: "BOB First Engagement Command Center",
  description: "Back Office Brains command center for controlled IB Ops and Murex trade-lifecycle automation."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
