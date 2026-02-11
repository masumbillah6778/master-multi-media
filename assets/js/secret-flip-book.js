const flipBook = (elBook) => {
  elBook.style.setProperty("--c", 0); // Set current page
  elBook.querySelectorAll(".book-page").forEach((page, idx) => {
    page.style.setProperty("--i", idx);
    page.addEventListener("click", (evt) => {
      if (evt.target.closest("a")) return;
      const curr = evt.target.closest(".back-side") ? idx : idx + 1;
      elBook.style.setProperty("--c", curr);
    });
  });
};

document.querySelectorAll(".full-book").forEach(flipBook);
