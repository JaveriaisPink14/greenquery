export const globalStyle = `
  :root {
    /* Vintage Brown Theme - Classic Academic Library */
    
    /* Backgrounds - Warm earthy tones */
    --bg-main: #F4E9D8;           /* Main background - warm aged paper */
    --bg-card: #E8DCC8;           /* Card background - slightly darker parchment */
    --bg-nav: #DCC8A0;            /* Navigation background - warm wood */
    --bg-sidebar: #E0D0B8;        /* Sidebar background */
    
    /* Borders - Subtle brown */
    --border: #C4A882;            /* Main border color */
    --border-light: #D8C8A8;      /* Lighter border */
    --border-dark: #A8885A;       /* Darker border for emphasis */
    
    /* Text Colors */
    --text-primary: #4A3520;      /* Main text - deep brown */
    --text-secondary: #6B4C2A;    /* Secondary text - warm brown */
    --text-muted: #8B7355;        /* Muted text - softer brown */
    --text-light: #A88B6B;        /* Light text */
    
    /* Accent Colors - Muted vintage tones */
    --green: #5B7B4A;             /* Muted sage green */
    --green-light: #E8F0E0;       /* Light sage background */
    --green-dark: #3D5A2E;        /* Dark sage for text */
    
    --blue: #6B7B6B;              /* Muted olive blue */
    --purple: #7B6B6B;            /* Muted brown-purple */
    --yellow: #C4A24A;            /* Warm golden yellow */
    --orange: #B8702A;            /* Burnt orange */
    --red: #8B4A4A;               /* Rust red */
    
    /* Status Colors */
    --very-clean: #5B7B4A;        /* Sage green */
    --clean: #6B8E3A;             /* Olive green */
    --moderate: #C4882A;          /* Golden brown */
    --high-carbon: #8B4A4A;       /* Rust red */
    
    /* UI Elements */
    --shadow: rgba(74, 53, 32, 0.08);
    --shadow-hover: rgba(74, 53, 32, 0.12);
    
    /* Typography - Classic serif */
    --font: 'Georgia', 'Times New Roman', 'Playfair Display', serif;
    --font-mono: 'Courier New', 'SF Mono', monospace;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: var(--font);
    background: var(--bg-main);
    color: var(--text-primary);
    line-height: 1.5;
  }

  /* Navigation Bar */
  .nav {
    background: var(--bg-nav);
    padding: 14px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid var(--border);
    box-shadow: 0 2px 6px var(--shadow);
    backdrop-filter: blur(2px);
  }

  /* Avatar */
  .avatar {
    width: 38px;
    height: 38px;
    background: var(--green);
    color: #F4E9D8;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: var(--font-mono);
    border: 1px solid var(--border-dark);
  }

  .avatar:hover {
    background: var(--green-dark);
    transform: scale(1.05);
  }

  /* Avatar Menu */
  .avatar-menu {
    position: absolute;
    top: 48px;
    right: 0;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: 0 4px 12px var(--shadow);
    z-index: 100;
    min-width: 170px;
  }

  .avatar-menu button {
    width: 100%;
    text-align: left;
    padding: 10px 16px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 13px;
    color: var(--text-primary);
    font-family: var(--font);
  }

  .avatar-menu button:hover {
    background: var(--border-light);
  }

  /* Cards */
  .card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    box-shadow: 0 2px 8px var(--shadow);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px var(--shadow-hover);
  }

  /* Grid Cards (Dashboard) */
  .grid-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 22px 26px;
    transition: all 0.2s ease;
  }

  .grid-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px var(--shadow-hover);
  }

  /* Progress Bar Track */
  .prog-track {
    background: var(--border-light);
    border-radius: 10px;
    overflow: hidden;
    height: 8px;
    border: 1px solid var(--border-light);
  }

  /* Progress Bar Fill */
  .prog-fill {
    background: var(--green);
    border-radius: 10px;
    height: 100%;
    transition: width 0.3s ease;
  }

  /* Buttons */
  .btn-green {
    background: var(--green);
    color: #F4E9D8;
    border: none;
    border-radius: 50px;
    padding: 10px 22px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: var(--font);
    font-size: 14px;
    letter-spacing: 0.5px;
  }

  .btn-green:hover {
    background: var(--green-dark);
    transform: scale(1.02);
  }

  .btn-outline {
    background: transparent;
    border: 1.5px solid var(--border);
    border-radius: 50px;
    padding: 8px 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: var(--font);
    font-size: 12px;
    color: var(--text-primary);
  }

  .btn-outline:hover {
    background: var(--border-light);
  }

  /* Mode Cards (QueryPage) */
  .mode-card {
    background: var(--bg-card);
    border: 2px solid var(--border);
    border-radius: 16px;
    padding: 18px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .mode-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--shadow);
    border-color: var(--border-dark);
  }

  .mode-card.selected {
    border-color: var(--green);
    background: var(--green-light);
  }

  /* Paper Cards (ResultsPage) */
  .paper-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 18px;
    transition: all 0.2s ease;
  }

  .paper-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--shadow);
  }

  /* Score Badge */
  .score-badge {
    background: var(--green-light);
    color: var(--green-dark);
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    font-family: var(--font-mono);
  }

  /* Tab Pills */
  .tab-pill {
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 50px;
    padding: 5px 14px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--text-primary);
    font-family: var(--font);
  }

  .tab-pill.active {
    background: var(--green);
    border-color: var(--green);
    color: #F4E9D8;
  }

  .tab-pill:hover:not(.active) {
    background: var(--border-light);
  }

  /* Input Fields */
  input, textarea, select {
    font-family: var(--font);
    background: var(--bg-main);
    border: 1px solid var(--border);
    color: var(--text-primary);
    border-radius: 8px;
    padding: 10px 14px;
  }

  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: var(--green);
    box-shadow: 0 0 0 2px var(--green-light);
  }

  /* Range Slider */
  input[type="range"] {
    accent-color: var(--green);
    cursor: pointer;
  }

  /* Page Enter Animation */
  .page-enter {
    animation: fadeInUp 0.35s ease-out;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(25px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Links */
  a {
    color: var(--green-dark);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: var(--green);
    text-decoration: underline;
  }

  /* Scrollbar - Vintage Style */
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: var(--border-light);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--green);
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--green-dark);
  }

  /* Footer */
  footer {
    background: var(--bg-nav);
    border-top: 1px solid var(--border);
    color: var(--text-secondary);
    font-size: 11px;
    padding: 16px;
    text-align: center;
  }

  /* Typography Enhancements */
  h1, h2, h3, h4 {
    font-weight: 600;
    letter-spacing: -0.3px;
    color: var(--text-primary);
  }

  /* Logo Style */
  .logo-text {
    font-family: var(--font);
    font-weight: 700;
    font-size: 20px;
    letter-spacing: -0.5px;
    color: var(--text-primary);
  }
`;