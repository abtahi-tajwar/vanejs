window.onload = function () {
  console.log("JS Loaded");

  $setState("user", {
    name: "Abtahi",
    bio: "My abtahi name",
    skills: [
      { label: "Web Dev", tags: ["html", "css"] },
      { label: "Chorom dev", tags: ["react", "svelte"] },
    ],
    education: [
      { label: "Niagara University" },
      { label: "AIUB" },
      { label: "IPSC" },
    ],
  });
  $setState("testname", { label: "something" });

  $setState("appState", "loading");
  $setState("theme", "light");
  console.log("Get State appState", $getState("appState"));
  document.getElementById("inpt").addEventListener("input", (e) => {
    console.log("Input", e.target.value);
    $setState("user", {
      ...$getState("user"),
      name: e.target.value,
    });
  });
  // ➕ Add a new skill
  document.getElementById("plus").addEventListener("click", () => {
    const state = $getState("user");
    const newSkills = [
      ...state.skills,
      {
        label: `Skill ${state.skills.length + 1}`,
        tags: ["wakthu1", "wakthu2"],
      },
    ];
    $setState("user", {
      ...state,
      skills: newSkills,
    });
  });

  // ➖ Remove the last skill
  document.getElementById("minus").addEventListener("click", () => {
    const state = $getState("user");
    const newSkills = state.skills.slice(0, -1); // remove last item
    $setState("user", {
      ...state,
      skills: newSkills,
    });
  });
  document.querySelectorAll('input[name="state"]').forEach((input) => {
    input.addEventListener("change", (e) => {
      $setState("appState", e.target.value);
    });
  });

  document
    .getElementById("themeToggle")
    .addEventListener("change", function () {
      if (this.checked) {
        $setState("theme", "light");
      } else {
        $setState("theme", "dark");
      }
    });
};
