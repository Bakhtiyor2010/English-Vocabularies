document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("./vocabulary.json");
    const allTopics = await response.json();

    const contentDiv = document.getElementById("content");
    const groupsSection = document.getElementById("groups");
    const searchBox = document.getElementById("search-box");
    const resultsSection = document.getElementById("results");

    const params = new URLSearchParams(window.location.search);
    const topicName = params.get("topic");

    const renderTopics = () => {
      if (!groupsSection) return;
      groupsSection.innerHTML = "";
      const ul = document.createElement("ul");
      ul.id = "topic-list";

      allTopics.forEach((t) => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = `topic.html?topic=${encodeURIComponent(t.topic)}`;
        link.textContent = t.topic;
        link.target = "_blank";
        li.appendChild(link);
        ul.appendChild(li);
      });

      groupsSection.appendChild(ul);
    };

    const renderSections = (topic) => {
      if (!contentDiv) return;
      contentDiv.innerHTML = "";

      const h1 = document.createElement("h1");
      h1.textContent = topic.topic;
      contentDiv.appendChild(h1);

      const isSmallScreen = window.innerWidth <= 1000;

      topic.sections.forEach((section) => {
        const sectionTitle = document.createElement("h2");
        sectionTitle.textContent = section.title || "Section";
        contentDiv.appendChild(sectionTitle);

        if (!isSmallScreen) {
          const table = document.createElement("table");

          const thead = document.createElement("thead");
          const trHead = document.createElement("tr");
          section.columns.forEach((col) => {
            const th = document.createElement("th");
            th.textContent = col;
            trHead.appendChild(th);
          });
          thead.appendChild(trHead);
          table.appendChild(thead);

          const tbody = document.createElement("tbody");

          section.rows.forEach((row) => {
            if (section.title === "Word Formation") {
              const [id, word, forms, examples] = row;
              const formsArray = Array.isArray(forms) ? forms : [forms];
              const examplesArray = Array.isArray(examples)
                ? examples
                : [examples];

              formsArray.forEach((form, index) => {
                const tr = document.createElement("tr");

                if (index === 0) {
                  const tdId = document.createElement("td");
                  tdId.textContent = id;
                  tdId.rowSpan = formsArray.length;
                  tr.appendChild(tdId);

                  const tdWord = document.createElement("td");
                  tdWord.textContent = word;
                  tdWord.rowSpan = formsArray.length;
                  tr.appendChild(tdWord);
                }

                const tdForm = document.createElement("td");
                tdForm.textContent = form;
                tr.appendChild(tdForm);

                const tdExample = document.createElement("td");
                tdExample.textContent = examplesArray[index] || "";
                tr.appendChild(tdExample);

                tbody.appendChild(tr);
              });
            } else {
              const [id, word, definition, example] = row;
              const tr = document.createElement("tr");
              tr.appendChild(
                Object.assign(document.createElement("td"), {
                  textContent: id,
                }),
              );
              tr.appendChild(
                Object.assign(document.createElement("td"), {
                  textContent: word,
                }),
              );
              tr.appendChild(
                Object.assign(document.createElement("td"), {
                  textContent: definition,
                }),
              );
              tr.appendChild(
                Object.assign(document.createElement("td"), {
                  textContent: example,
                }),
              );
              tbody.appendChild(tr);
            }
          });

          table.appendChild(tbody);
          contentDiv.appendChild(table);
        } else {
          const ol = document.createElement("ol");

          section.rows.forEach((row) => {
            const word = row[1];
            const forms = Array.isArray(row[2]) ? row[2] : [row[2]];
            const examples = Array.isArray(row[3]) ? row[3] : [row[3]];

            const li = document.createElement("li");
            li.style.marginBottom = "30px";

            if (section.title === "Word Formation") {
              let html = `<b>Word:</b> ${word}<br>`;
              html += `<b>Forms:</b> ${forms.join(", ")}<br>`;
              html += `<b>Examples:</b><br>`;
              examples.forEach((ex) => {
                html += `– ${ex}<br>`;
              });
              li.innerHTML = html;
            } else {
              li.innerHTML = `
                  <b>Word:</b> ${word}<br>
                  <b>Definition:</b> ${Array.isArray(row[2]) ? row[2].join("<br>") : row[2]}<br>
                  <b>Example:</b> ${Array.isArray(row[3]) ? row[3].join("<br>") : row[3]}
                `;
            }

            ol.appendChild(li);
          });

          contentDiv.appendChild(ol);
        }
      });
    };

    const initSearch = () => {
      if (!searchBox || !groupsSection || !resultsSection) return;

      const allWords = [];
      allTopics.forEach((topic) => {
        topic.sections.forEach((section) => {
          section.rows.forEach((row) => {
            allWords.push({
              word: row[1],
              definition: Array.isArray(row[2]) ? row[2].join(", ") : row[2],
              example: Array.isArray(row[3]) ? row[3].join("\n") : row[3],
            });
          });
        });
      });

      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Search word...";
      input.style.marginBottom = "10px";
      const ol = document.createElement("ol");
      ol.id = "search-list";

      input.addEventListener("input", () => {
        const value = input.value.toLowerCase();
        ol.innerHTML = "";
        if (groupsSection)
          groupsSection.style.display = value ? "none" : "block";

        if (!value) return;

        const matches = allWords.filter((w) =>
          w.word.toLowerCase().includes(value),
        );
        if (matches.length) {
          matches.forEach((w) => {
            const li = document.createElement("li");
            li.textContent = w.word;
            li.style.cursor = "pointer";
            li.classList.add("open-modal");
            li.dataset.word = w.word;
            li.dataset.definition = w.definition;
            li.dataset.example = w.example;

            ol.appendChild(li);
          });
        } else {
          const li = document.createElement("li");
          li.textContent = `No word found for "${value}"`;
          li.style.color = "red";
          ol.appendChild(li);
        }
      });

      searchBox.appendChild(input);
      resultsSection.appendChild(ol);
    };

    if (!topicName) {
      const modal = document.getElementById("modal");
      const modalWord = document.getElementById("modal-word");
      const modalDefinition = document.getElementById("modal-definition");
      const modalExample = document.getElementById("modal-example");
      const modalClose = document.getElementById("modal-close");

      document.addEventListener("click", (e) => {
        if (e.target.classList.contains("open-modal")) {
          modalWord.textContent = e.target.dataset.word;
          modalDefinition.innerHTML = e.target.dataset.definition;
          modalExample.innerHTML = e.target.dataset.example;
          modal.style.display = "flex";
        }
      });

      modalClose.addEventListener("click", () => {
        modal.style.display = "none";
      });

      window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
      });
    }

    renderTopics();

    if (!topicName) {
      initSearch();
      return;
    }

    if (groupsSection) groupsSection.style.display = "none";
    const topic = allTopics.find((t) => t.topic === topicName);
    if (topic) renderSections(topic);

    window.addEventListener("resize", () => {
      if (topic) renderSections(topic);
    });
  } catch (error) {
    console.error("Error loading vocabulary:", error);
  }
});