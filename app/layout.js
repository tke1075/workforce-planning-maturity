// app/layout.js
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css'; // Your custom overrides (if any)

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Workforce Planning Maturity</title>
      </head>
      <body>{children}</body>
    </html>
  );
}

