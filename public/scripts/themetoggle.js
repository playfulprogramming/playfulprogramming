/* AFTER CHANGING THIS FILE, PLEASE MANUALLY MINIFY IT AND PUT INTO tabs.min.js */
const COLOR_MODE_STORAGE_KEY = "currentTheme";

const themeToggleBtn = document.querySelector('#theme-toggle-button');
const darkIconEl = document.querySelector('#dark-icon');
const lightIconEl = document.querySelector('#light-icon');
function toggleButton(theme) {
  themeToggleBtn.ariaPressed = `${theme === 'dark'}`;
  if (theme === 'light') {
    lightIconEl.style.display = null;
    darkIconEl.style.display = 'none';
  } else {
    lightIconEl.style.display = 'none';
    darkIconEl.style.display = null;
  }
}

// TODO: Migrate to `classList`
const initialTheme = document.documentElement.className;
toggleButton(initialTheme);
themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.className;
  document.documentElement.className = currentTheme === 'light' ? 'dark' : 'light';
  // TODO: Persist new setting
  const newTheme = document.documentElement.className;
  toggleButton(newTheme);
  localStorage.setItem(COLOR_MODE_STORAGE_KEY, newTheme)
})