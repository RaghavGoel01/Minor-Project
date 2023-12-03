const sessions = {
  "anxiety-relief": {
    title: "Anxiety Relief",
    description: "A guided meditation to help you manage anxiety.",
    audio: "anxiety-relief.mp3",
    image: "anxiety-relief.jpg",
  },
  "stress-reduction": {
    title: "Stress Reduction",
    description: "A guided meditation to help you reduce stress.",
    audio: "stress-reduction.mp3",
    image: "stress-reduction.jpg",
  },
  "anger-management": {
    title: "Anger Management",
    description: "A guided meditation to help you manage anger.",
    audio: "anger-management.mp3",
    image: "anger-management.jpg",
  },
  "sadness-healing": {
    title: "Sadness Healing",
    description: "A guided meditation to help you heal from sadness.",
    audio: "sadness-healing.mp3",
    image: "sadness-healing.jpg",
  },
  "depression-recovery": {
    title: "Depression Recovery",
    description: "A guided meditation to help you recover from depression.",
    audio: "depression-recovery.mp3",
    image: "depression-recovery.jpg",
  },
};

const emotions = {
  anxiety: {
    title: "Anxiety",
    description:
      "A collection of guided meditations and relaxation sessions to help you manage anxiety.",
    sessions: ["anxiety-relief"],
  },
  stress: {
    title: "Stress",
    description:
      "A collection of guided meditations and relaxation sessions to help you reduce stress.",
    sessions: ["stress-reduction"],
  },
  anger: {
    title: "Anger",
    description:
      "A collection of guided meditations and relaxation sessions to help you manage anger.",
    sessions: ["anger-management"],
  },
  sadness: {
    title: "Sadness",
    description:
      "A collection of guided meditations and relaxation sessions to help you heal from sadness.",
    sessions: ["sadness-healing"],
  },
  depression: {
    title: "Depression",
    description:
      "A collection of guided meditations and relaxation sessions to help you recover from depression.",
    sessions: ["depression-recovery"],
  },
};

let userData = JSON.parse(localStorage.getItem("userData")) || {};

const audio = document.createElement("audio");

function playSession(session) {
  audio.src = `audio/${session.audio}`;
  audio.play();
}

function stopSession() {
  audio.pause();
  audio.currentTime = 0;
}

function handleSessionSelection() {
  const session = this.dataset.session;
  const emotion = this.dataset.emotion;
  const sessionIndex = emotions[emotion].sessions.indexOf(session);

  if (sessionIndex !== -1) {
    const sessionObject = sessions[session];
    const sessionTitle = sessionObject.title;
    const sessionDescription = sessionObject.description;
    const sessionImage = sessionObject.image;

    document.getElementById("session-title").textContent = sessionTitle;
    document.getElementById("session-description").textContent =
      sessionDescription;
    document.getElementById("session-image").src = sessionImage;

    userData.sessions = userData.sessions || [];
    userData.sessions.push({ emotion, session });

    localStorage.setItem("userData", JSON.stringify(userData));

    playSession(session);

    const sessionElement = document.getElementById(`session-${session}`);
    sessionElement.classList.add("active");

    const otherSessionElements = document.querySelectorAll(
      `[data-session^="session-"]:not(#session-${session})`
    );
    otherSessionElements.forEach((element) => {
      element.classList.remove("active");
    });

    const feedbackElement = document.getElementById("feedback");
    feedbackElement.style.display = "none";
  }
}

const sessionList = document.getElementById("session-list");
sessionList.innerHTML = "";

for (const emotionKey in emotions) {
  const emotion = emotions[emotionKey];
  const sessionListItem = document.createElement("li");
  sessionListItem.textContent = emotion.title;
  sessionListItem.dataset.emotion = emotionKey;
  sessionListItem.dataset.session = emotion.sessions[0];
  sessionListItem.addEventListener("click", handleSessionSelection);
  sessionList.appendChild(sessionListItem);
}

const feedbackForm = document.getElementById("feedback-form");
feedbackForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value;

  const session = document.getElementById("session-title").textContent;
  const emotion = userData.sessions[userData.sessions.length - 1].emotion;

  const feedback = { rating, comment, session, emotion };

  userData.feedback = userData.feedback || [];
  userData.feedback.push(feedback);

  localStorage.setItem("userData", JSON.stringify(userData));

  const feedbackElement = document.getElementById("feedback");
  feedbackElement.style.display = "block";

  const feedbackList = document.getElementById("feedback-list");
  feedbackList.innerHTML = "";

  userData.feedback.forEach((item) => {
    const feedbackItem = document.createElement("li");
    feedbackItem.textContent = `${item.rating} stars - ${item.comment}`;
    feedbackList.appendChild(feedbackItem);
  });

  stopSession();
});

function saveUserData() {
  localStorage.setItem("userData", JSON.stringify(userData));
}

function loadUserData() {
  const userDataString = localStorage.getItem("userData");
  if (userDataString) {
    userData = JSON.parse(userDataString);
  }
}

loadUserData();

saveUserData();
