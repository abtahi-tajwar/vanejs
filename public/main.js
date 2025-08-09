import {
  $setState,
  $getState,
  $setStore,
  $event,
} from "../dist/vanjejs.module.js";
// import VaneJS from '../dist/vanjejs.module.js'

window.onload = function () {
  // const { $setState, $getState } = VaneJS;
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
  $setStore("mystore", { name: "StoreValue" });
  $setState("appState", "loading");
  $setState("theme", "light");
  $setState("userapi", {
    title: "Placeholder API title",
    id: 0,
  });
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
  document.getElementById("storename-input").addEventListener("input", (e) => {
    $setStore("mystore", { name: e.target.value });
  });
};

document.getElementById("apicallbutton").addEventListener("click", () => {
  callAPI();
});
function callAPI() {
  const id = Math.floor(Math.random() * 10) + 1;
  fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      $setState("userapi", {
        title: json.title,
        id: json.id,
      });
    });
}

function clickfunc(data) {
  console.log("Click func data", data);
}

$event("testEFunc", () => {
  console.log("From test func");
});
$event("testDBLFunc", ({ params }) => {
  const [bio] = params;
  console.log("dbl click functions", bio);
});
