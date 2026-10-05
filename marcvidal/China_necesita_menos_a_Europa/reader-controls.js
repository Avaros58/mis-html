(() => {
  "use strict";

  const levels = [90, 100, 115, 130];
  const defaultLevel = 115;
  const storageKey = "f008-reader-size";
  const root = document.documentElement;

  const readStoredLevel = () => {
    try {
      const value = Number.parseInt(localStorage.getItem(storageKey), 10);
      return levels.includes(value) ? value : defaultLevel;
    } catch {
      return defaultLevel;
    }
  };

  const saveLevel = (value) => {
    try {
      localStorage.setItem(storageKey, String(value));
    } catch {
      // El control sigue funcionando durante la sesión si el almacenamiento está bloqueado.
    }
  };

  let currentLevel = readStoredLevel();

  const applyLevel = (value, persist = true) => {
    currentLevel = levels.includes(value) ? value : defaultLevel;
    root.dataset.readerSize = String(currentLevel);

    const status = document.getElementById("reader-size-status");
    if (status) status.textContent = `${currentLevel} %`;

    document.querySelectorAll("[data-reader-action]").forEach((button) => {
      const isNormal = button.dataset.readerAction === "reset" && currentLevel === defaultLevel;
      button.setAttribute("aria-pressed", String(isNormal));
    });

    if (persist) saveLevel(currentLevel);
  };

  applyLevel(currentLevel, false);

  document.addEventListener("DOMContentLoaded", () => {
    applyLevel(currentLevel, false);

    document.querySelectorAll("[data-reader-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.readerAction;
        const index = levels.indexOf(currentLevel);

        if (action === "decrease") applyLevel(levels[Math.max(0, index - 1)]);
        if (action === "increase") applyLevel(levels[Math.min(levels.length - 1, index + 1)]);
        if (action === "reset") applyLevel(defaultLevel);
      });
    });
  });
})();
