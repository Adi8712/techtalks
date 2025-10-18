document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const resultsContainer = document.getElementById("search-results");
  if (resultsContainer) {
    resultsContainer.setAttribute("role", "listbox");
    resultsContainer.setAttribute("aria-live", "polite");
  }

  if (!searchInput || !resultsContainer) return;

  let fuse = null;
  let results = [];
  let activeIndex = -1;

  fetch("/index.json")
    .then(res => {
      if (!res.ok) throw new Error("Could not fetch search index");
      return res.json();
    })
    .then(data => {
      const list = Array.isArray(data) ? data : [];
      fuse = new Fuse(list, {
        keys: ["title", "content", "tags"],
        threshold: 0.35,
        includeScore: true,
      });
    })
    .catch();

  function clearResults() {
    resultsContainer.innerHTML = "";
    resultsContainer.style.display = "none";
    searchInput.setAttribute("aria-expanded", "false");
    activeIndex = -1;
    results = [];
  }

  function renderResults(items) {
    resultsContainer.innerHTML = "";
    activeIndex = -1;

    if (!items || items.length === 0) {
      resultsContainer.style.display = "none";
      searchInput.setAttribute("aria-expanded", "false");
      return;
    }

    items.forEach((r, i) => {
      const row = document.createElement("a");
      row.className = "result-item";
      row.setAttribute("role", "option");
      row.setAttribute("tabindex", "-1");
      row.href = r.item.permalink || "#";
      row.textContent = r.item.title || "(untitled)";
      row.addEventListener("click", clearResults);
      row.addEventListener("mouseenter", () => setActive(i));
      resultsContainer.appendChild(row);
    });

    resultsContainer.style.display = "block";
    searchInput.setAttribute("aria-expanded", "true");
  }

  function setActive(index) {
    const items = resultsContainer.querySelectorAll(".result-item");
    if (!items.length) return;
    if (index < 0) index = items.length - 1;
    if (index >= items.length) index = 0;
    activeIndex = index;
    items.forEach((el, i) => {
      el.classList.toggle("active", i === index);
      if (i === index) {
        el.scrollIntoView({ block: "nearest" });
      }
    });
  }

  searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim();
    if (!q || !fuse) {
      clearResults();
      return;
    }
    results = fuse.search(q, { limit: 10 });
    renderResults(results);
  });

  searchInput.addEventListener("keydown", (e) => {
    const items = resultsContainer.querySelectorAll(".result-item");
    if ((e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === "Escape") && !items.length) {
      if (e.key === "Escape") {
        clearResults();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(activeIndex + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(activeIndex - 1);
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        e.preventDefault();
        const items = resultsContainer.querySelectorAll(".result-item");
        if (items[activeIndex]) {
          window.location.href = items[activeIndex].href;
        }
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      clearResults();
      searchInput.blur();
    }
  });

  document.addEventListener("click", (e) => {
    if (!resultsContainer.contains(e.target) && e.target !== searchInput) {
      clearResults();
    }
  });
});
