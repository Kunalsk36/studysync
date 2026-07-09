import { Inter } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "StudySync — Your Learning, Organized",
  description:
    "StudySync combines task management, calendar, Pomodoro, and analytics into one focused productivity workspace for learners.",
};

// Applied before hydration so dark mode (the documented default) never flashes light first.
const noFlashScript = `
(function() {
  try {
    var theme = window.localStorage.getItem('studysync-theme');
    if (theme !== 'light') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
        {/* Google Identity Services — approved decision: official GIS SDK, no wrapper package. */}
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
