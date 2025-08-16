import { useState, type FormEvent } from "react";

interface ThemeInputProps {
  onSubmit: (theme: string) => void;
}

function ThemeInput({ onSubmit }: ThemeInputProps) {
  const [theme, setTheme] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!theme.trim()) {
      setError("Please enter a theme name");
      return;
    }

    onSubmit(theme);
  };
  return (
    <div className="theme-input-container">
      <h2>Generate Your Adventure</h2>
      <p>Enter a theme for story</p>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Enter a theme"
            className={error ? "error" : ""}
          />
          {error && <p className="error-text">{error}</p>}
        </div>
        <button className="generate-button">Generate Story</button>
      </form>
    </div>
  );
}

export default ThemeInput;
