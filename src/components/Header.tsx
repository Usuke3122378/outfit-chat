function Header() {
  return (
    <header className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
      <div className="mx-auto max-w-3xl px-4 py-3 sm:py-4">
        <h1 className="text-lg sm:text-xl font-bold text-stone-800 flex items-center gap-2">
          <span aria-hidden>👕</span>
          今日のコーデ相談
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          地域と予定を伝えて、今日の着回しを一緒に考えよう
        </p>
      </div>
    </header>
  );
}

export default Header;
