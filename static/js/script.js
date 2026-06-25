document.addEventListener("DOMContentLoaded", () => {
  // === Existing Service Cards Logic ===
  const serviceCards = document.querySelectorAll(".service-card");

  serviceCards.forEach((card) => {
    card.addEventListener("click", () => {
      const isActive = card.classList.contains("active");

      serviceCards.forEach((c) => c.classList.remove("active"));
      if (!isActive) {
        card.classList.add("active");
      }
    });
  });

  // === Integrated Reaction/Like Button Logic ===
  const likeBtn = document.getElementById("like-btn");
  const likeCountElement = document.getElementById("like-count");
  const likeIcon = document.getElementById("like-icon");

  // Condition check prevents script breaks if loaded on a page without this button
  if (likeBtn && likeCountElement && likeIcon) {
    // 1. Fetch current counter state from JSON database on load
    fetch("/api/likes")
      .then((response) => response.json())
      .then((data) => {
        likeCountElement.textContent = data.likes;
      })
      .catch((error) => console.error("Error fetching initial likes:", error));

    // 2. Increment counter instantly via asynchronous background POST request
    likeBtn.addEventListener("click", () => {
      fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          // Dynamic counter interface update
          likeCountElement.textContent = data.likes;

          // Visual state change: empty heart to solid heart
          likeIcon.classList.replace("fa-regular", "fa-solid");

          // Retrigger the scale-pop CSS keyframe macro-interaction safely
          likeIcon.classList.remove("heart-animated");
          likeIcon.offsetHeight; // Forces a DOM layout recalculation (reflow)
          likeIcon.classList.add("heart-animated");
        })
        .catch((error) => console.error("Error processing like:", error));
    });
  }
  // === 3. Guest Book Panel (Comment Module) ===
  const commentForm = document.getElementById("comment-form");
  const commentsStream = document.getElementById("comments-stream");

  if (commentForm && commentsStream) {
    // Helper render layout injector
    const renderComments = (commentsArray) => {
      if (commentsArray.length === 0) {
        commentsStream.innerHTML = `<p class="text-muted text-center py-4">No messages left yet. Be the first!</p>`;
        return;
      }
      commentsStream.innerHTML = commentsArray
        .map(
          (item) => `
        <div class="single-comment-node">
          <div class="d-flex justify-content-between align-items-center mb-1">
            <strong style="color: #ff4757;">${escapeHTML(item.name)}</strong>
            <small class="text-muted">${item.date}</small>
          </div>
          <p class="mb-0 text-light" style="word-break: break-word;">${escapeHTML(item.text)}</p>
        </div>
      `,
        )
        .join("");
    };

    // Helper sanitization guard against injection compromises
    const escapeHTML = (str) =>
      str.replace(
        /[&<>'"]/g,
        (tag) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#39;",
            '"': "&quot;",
          })[tag] || tag,
      );

    // Initial load fetch
    fetch("/api/comments")
      .then((res) => res.json())
      .then((data) => renderComments(data))
      .catch((err) =>
        console.error("Error structural fetching timeline feeds:", err),
      );

    // Form interception process submission
    commentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("comment-name");
      const textInput = document.getElementById("comment-text");

      const payload = {
        name: nameInput.value.trim() || "Anonymous Guest",
        text: textInput.value.trim(),
      };

      fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((updatedTimeline) => {
          renderComments(updatedTimeline);
          commentForm.reset(); // Wipe inputs clear cleanly on success
        })
        .catch((err) =>
          console.error(
            "Failed submitting message pipeline execution context:",
            err,
          ),
        );
    });
  }
});
