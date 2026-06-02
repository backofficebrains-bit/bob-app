import "./globals.css";

export const metadata = {
  title: "BOB Career DNA Engine v0.1",
  description: "Mock inference engine that reconstructs likely operations exposure from resume content and job history."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
