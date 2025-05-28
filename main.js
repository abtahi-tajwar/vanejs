window.onload = function() {
  console.log("JS Loaded");
  $setState("user", {
    name: "Abtahi",
    bio: "My abtahi name",
    skills: [
      { label: "Web Dev" },
      { label: "Chorom dev" }
    ]
  })
  document.getElementById("inpt").addEventListener("input", (e) => {
    console.log("Input", e.target.value)
    $updateState("user", {
      ...$getState("user"),
      name: e.target.value
    })
  })
};

