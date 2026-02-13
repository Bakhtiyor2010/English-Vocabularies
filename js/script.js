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
                  tdWord.rowSpan = formsArray.length;
                  const wordWrapper = document.createElement("div");
                  wordWrapper.classList.add("word-wrapper");

                  const wordSpan = document.createElement("span");
                  wordSpan.textContent = word;

                  const speakerWrapper = document.createElement("div");
                  speakerWrapper.classList.add("speaker-wrapper");

                  const usBtn = document.createElement("button");
                  usBtn.classList.add("speaker-btn");
                  usBtn.title = "US";
                  usBtn.textContent = "US";
                  usBtn.addEventListener("click", () => speakWord(word, "US"));

                  const ukBtn = document.createElement("button");
                  ukBtn.classList.add("speaker-btn");
                  ukBtn.title = "UK";
                  ukBtn.textContent = "UK";
                  ukBtn.addEventListener("click", () => speakWord(word, "UK"));

                  speakerWrapper.appendChild(usBtn);
                  speakerWrapper.appendChild(ukBtn);

                  wordWrapper.appendChild(wordSpan);
                  wordWrapper.appendChild(speakerWrapper);
                  tdWord.appendChild(wordWrapper);
                  tr.appendChild(tdWord);
                }

                const tdForm = document.createElement("td");
                const formWrapper = document.createElement("div");
                formWrapper.classList.add("word-wrapper");

                const formSpan = document.createElement("span");
                formSpan.textContent = formsArray[index];

                const formSpeaker = document.createElement("div");
                formSpeaker.classList.add("speaker-wrapper");

                const usFormBtn = document.createElement("button");
                usFormBtn.classList.add("speaker-btn");
                usFormBtn.textContent = "US";
                usFormBtn.addEventListener("click", () =>
                  speakWord(formsArray[index], "US"),
                );

                const ukFormBtn = document.createElement("button");
                ukFormBtn.classList.add("speaker-btn");
                ukFormBtn.textContent = "UK";
                ukFormBtn.addEventListener("click", () =>
                  speakWord(formsArray[index], "UK"),
                );

                formSpeaker.appendChild(usFormBtn);
                formSpeaker.appendChild(ukFormBtn);

                formWrapper.appendChild(formSpan);
                formWrapper.appendChild(formSpeaker);
                tdForm.appendChild(formWrapper);
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

              const tdWord = document.createElement("td");
              const wordWrapper = document.createElement("div");
              wordWrapper.classList.add("word-wrapper");

              const wordSpan = document.createElement("span");
              wordSpan.textContent = word;

              const speakerWrapper = document.createElement("div");
              speakerWrapper.classList.add("speaker-wrapper");

              const usBtn = document.createElement("button");
              usBtn.classList.add("speaker-btn");
              usBtn.textContent = "US";
              usBtn.addEventListener("click", () => speakWord(word, "US"));

              const ukBtn = document.createElement("button");
              ukBtn.classList.add("speaker-btn");
              ukBtn.textContent = "UK";
              ukBtn.addEventListener("click", () => speakWord(word, "UK"));

              speakerWrapper.appendChild(usBtn);
              speakerWrapper.appendChild(ukBtn);

              wordWrapper.appendChild(wordSpan);
              wordWrapper.appendChild(speakerWrapper);
              tdWord.appendChild(wordWrapper);

              tr.appendChild(tdWord);
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
            li.style.marginBottom = "50px";

            if (section.title === "Word Formation") {
              const mainWordDiv = document.createElement("div");
              mainWordDiv.classList.add("word-wrapper");
              const wordSpan = document.createElement("span");
              wordSpan.innerHTML = `<b>Word:</b> ${word} <br> <br>`;

              const speakerDiv = document.createElement("div");
              speakerDiv.classList.add("speaker-wrapper");
              const usBtn = document.createElement("button");
              usBtn.classList.add("speaker-btn");
              usBtn.textContent = "US";
              usBtn.addEventListener("click", () => speakWord(word, "US"));
              const ukBtn = document.createElement("button");
              ukBtn.classList.add("speaker-btn");
              ukBtn.textContent = "UK";
              ukBtn.addEventListener("click", () => speakWord(word, "UK"));
              speakerDiv.appendChild(usBtn);
              speakerDiv.appendChild(ukBtn);

              mainWordDiv.appendChild(wordSpan);
              mainWordDiv.appendChild(speakerDiv);
              li.appendChild(mainWordDiv);

              forms.forEach((f, i) => {
                const formDiv = document.createElement("div");
                formDiv.classList.add("word-wrapper");
                formDiv.style.marginLeft = "20px";

                const formSpan = document.createElement("span");
                formSpan.innerHTML = `<b>Form:</b> ${f}`;

                const formSpeakerDiv = document.createElement("div");
                formSpeakerDiv.classList.add("speaker-wrapper");

                const usBtn = document.createElement("button");
                usBtn.classList.add("speaker-btn");
                usBtn.textContent = "US";
                usBtn.addEventListener("click", () => speakWord(f, "US"));

                const ukBtn = document.createElement("button");
                ukBtn.classList.add("speaker-btn");
                ukBtn.textContent = "UK";
                ukBtn.addEventListener("click", () => speakWord(f, "UK"));

                formSpeakerDiv.appendChild(usBtn);
                formSpeakerDiv.appendChild(ukBtn);

                formDiv.appendChild(formSpan);
                formDiv.appendChild(formSpeakerDiv);
                li.appendChild(formDiv);

                const exampleDiv = document.createElement("div");
                exampleDiv.style.marginLeft = "20px";
                exampleDiv.innerHTML = `<b>Example:</b> ${examples[i] || ""} <br> <br>`;
                li.appendChild(exampleDiv);
              });
            } else {
              const wordDiv = document.createElement("div");
              wordDiv.classList.add("word-wrapper");
              const wordSpan = document.createElement("span");
              wordSpan.innerHTML = `<b>Word:</b> ${word}`;

              const speakerDiv = document.createElement("div");
              speakerDiv.classList.add("speaker-wrapper");
              const usBtn = document.createElement("button");
              usBtn.classList.add("speaker-btn");
              usBtn.textContent = "US";
              usBtn.addEventListener("click", () => speakWord(word, "US"));
              const ukBtn = document.createElement("button");
              ukBtn.classList.add("speaker-btn");
              ukBtn.textContent = "UK";
              ukBtn.addEventListener("click", () => speakWord(word, "UK"));
              speakerDiv.appendChild(usBtn);
              speakerDiv.appendChild(ukBtn);

              wordDiv.appendChild(wordSpan);
              wordDiv.appendChild(speakerDiv);
              li.appendChild(wordDiv);

              const defDiv = document.createElement("div");
              defDiv.innerHTML = `<b>Definition:</b> ${Array.isArray(row[2]) ? row[2].join("<br>") : row[2]}`;
              li.appendChild(defDiv);
              const exDiv = document.createElement("div");
              exDiv.innerHTML = `<b>Example:</b> ${Array.isArray(row[3]) ? row[3].join("<br>") : row[3]}`;
              li.appendChild(exDiv);
            }

            ol.appendChild(li);
          });

          contentDiv.appendChild(ol);
        }
      });
    };

    function speakWord(word, accent = "US") {
      const utterance = new SpeechSynthesisUtterance(word);
      const voices = speechSynthesis.getVoices();

      if (accent === "US") {
        utterance.voice = voices.find((v) => v.lang === "en-US") || voices[0];
      } else {
        utterance.voice = voices.find((v) => v.lang === "en-GB") || voices[0];
      }

      speechSynthesis.speak(utterance);
    }

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
          const span = document.createElement("span");
          span.textContent = `No word found for "${value}"`;
          span.style.color = "red";
          ol.appendChild(span);
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
          const word = e.target.dataset.word;
          const definition = e.target.dataset.definition;
          const example = e.target.dataset.example;

          modalWord.innerHTML = "";
          modalDefinition.innerHTML = definition;
          modalExample.innerHTML = example;

          const wordWrapper = document.createElement("div");
          wordWrapper.classList.add("word-wrapper");

          const wordSpan = document.createElement("span");
          wordSpan.textContent = word;

          const speakerWrapper = document.createElement("div");
          speakerWrapper.classList.add("speaker-wrapper");

          const usBtn = document.createElement("button");
          usBtn.classList.add("speaker-btn");
          usBtn.textContent = "US";
          usBtn.addEventListener("click", () => speakWord(word, "US"));

          const ukBtn = document.createElement("button");
          ukBtn.classList.add("speaker-btn");
          ukBtn.textContent = "UK";
          ukBtn.addEventListener("click", () => speakWord(word, "UK"));

          speakerWrapper.appendChild(usBtn);
          speakerWrapper.appendChild(ukBtn);

          wordWrapper.appendChild(wordSpan);
          wordWrapper.appendChild(speakerWrapper);

          modalWord.appendChild(wordWrapper);

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