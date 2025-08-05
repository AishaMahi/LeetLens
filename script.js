document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-btn");
  const usernameInput = document.getElementById("user-input");
  const statsContainer = document.querySelector(".stats-container");
  const easyProgressCircle = document.querySelector(".easy-progress");
  const mediumProgressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");
  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");
  const cardStatsContainer = document.querySelector(".stats-cards");

  function validateUsername(username) {
    if (username.trim() === "") {
      alert("Username should not be empty");
      return false;
    }
    const regex = /^[a-zA-Z0-9_-]{1,15}$/;
    if (!regex.test(username)) {
      alert("Invalid Username: only letters, numbers, _ and - are allowed (max 15 characters).");
      return false;
    }
    return true;
  }

  async function fetchUserDetails(username) {
    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;
      usernameInput.disabled = true;
      cardStatsContainer.innerHTML = ""; 
      statsContainer.querySelector(".error-message")?.remove(); // Remove old error messages, if any

      const proxyUrl = "https://cors-anywhere-lf0v.onrender.com/";
      const targetUrl = "https://leetcode.com/graphql/";

      const myHeaders = new Headers({
        "content-type": "application/json",
      });

      const graphqlQuery = {
        query: `
          query userSessionProgress($username: String!) {
            allQuestionsCount {
              difficulty
              count
            }
            matchedUser(username: $username) {
              submitStats {
                acSubmissionNum {
                  difficulty
                  count
                  submissions
                }
                totalSubmissionNum {
                  difficulty
                  count
                  submissions
                }
              }
            }
          }
        `,
        variables: { username },
      };

      const response = await fetch(proxyUrl + targetUrl, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify(graphqlQuery),
      });

      if (!response.ok) {
        throw new Error(`Unable to fetch the User details. Status: ${response.status}`);
      }

      const parsedData = await response.json();
      console.log("Logging data:", parsedData);

      if (!parsedData.data.matchedUser) {
        displayError("User not found.");
        resetAllProgress();
        return;
      }

      displayUserData(parsedData);
    } catch (error) {
      displayError(error.message);
      resetAllProgress();
      cardStatsContainer.innerHTML = "";
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
      usernameInput.disabled = false;
    }
  }

  function displayError(message) {
    // Clear old errors
    statsContainer.querySelector(".error-message")?.remove();

    const errorEl = document.createElement("p");
    errorEl.className = "error-message";
    errorEl.style.color = "red";
    errorEl.style.textAlign = "center";
    errorEl.style.margin = "10px 0";
    errorEl.textContent = message;
    statsContainer.appendChild(errorEl);
  }

  function updateProgress(solved, total, label, circle) {
    if (!total || total === 0) {
      label.textContent = `0/0`;
      circle.style.setProperty("--progress-degree", `0deg`);
      return;
    }
    const progressDegree = (solved / total) * 360;
    circle.style.setProperty("--progress-degree", `${progressDegree}deg`);
    label.textContent = `${solved}/${total}`;
  }

  function resetProgress(label, circle) {
    label.textContent = "-/-";
    circle.style.setProperty("--progress-degree", `0deg`);
  }

  function resetAllProgress() {
    resetProgress(easyLabel, easyProgressCircle);
    resetProgress(mediumLabel, mediumProgressCircle);
    resetProgress(hardLabel, hardProgressCircle);
  }

  function displayUserData(parsedData) {
    const counts = parsedData.data.allQuestionsCount;
    const stats = parsedData.data.matchedUser.submitStats;

    // Defensive access with optional chaining to avoid runtime errors
    const totalEasyQues = counts[1]?.count || 0;
    const totalMediumQues = counts[2]?.count || 0;
    const totalHardQues = counts[3]?.count || 0;

    const solvedEasy = stats.acSubmissionNum[1]?.count || 0;
    const solvedMedium = stats.acSubmissionNum[2]?.count || 0;
    const solvedHard = stats.acSubmissionNum[3]?.count || 0;

    updateProgress(solvedEasy, totalEasyQues, easyLabel, easyProgressCircle);
    updateProgress(solvedMedium, totalMediumQues, mediumLabel, mediumProgressCircle);
    updateProgress(solvedHard, totalHardQues, hardLabel, hardProgressCircle);

    const cardsData = [
      {
        label: "Overall Submissions",
        value: stats.totalSubmissionNum[0]?.submissions || 0,
      },
      {
        label: "Overall Easy Submissions",
        value: stats.totalSubmissionNum[1]?.submissions || 0,
      },
      {
        label: "Overall Medium Submissions",
        value: stats.totalSubmissionNum[2]?.submissions || 0,
      },
      {
        label: "Overall Hard Submissions",
        value: stats.totalSubmissionNum[3]?.submissions || 0,
      },
    ];

    cardStatsContainer.innerHTML = cardsData
      .map(
        (data) =>
          `<div class="card">
            <h4>${data.label}</h4>
            <p>${data.value}</p>
           </div>`
      )
      .join("");
  }

  searchButton.addEventListener("click", () => {
    const username = usernameInput.value;
    console.log("Welcome:", username);
    if (validateUsername(username)) {
      fetchUserDetails(username);
    }
  });
});
