// Replace with your actual Marvel API public and private keys
const publicKey = "3d0e6dea327827be2d5380777ffbe48e"; // Replace with your public key
const privateKey = "bef5a3d283a4149ca0736f5f0d9335d252e85c3d"; // Replace with your private key

// Function to generate the MD5 hash
function generateHash(ts, privateKey, publicKey) {
  return CryptoJS.MD5(ts + privateKey + publicKey).toString();
}

let input = document.getElementById("input-box");
let button = document.getElementById("submit-button");
let showContainer = document.getElementById("show-container");
let listContainer = document.querySelector(".list");

function displayWords(value) {
  input.value = value;
  removeElements();
  // Optionally trigger the search
  button.click();
}

function removeElements() {
  listContainer.innerHTML = "";
}

// Autocomplete functionality for search input
input.addEventListener("keyup", async () => {
  removeElements();
  if (input.value.length < 4) {
    return false;
  }

  let ts = new Date().getTime().toString(); // Timestamp
  let hashValue = generateHash(ts, privateKey, publicKey);

  const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hashValue}&nameStartsWith=${encodeURIComponent(input.value)}`;

  try {
    const response = await fetch(url);
    const jsonData = await response.json();

    if (jsonData.code !== 200) {
      console.error("Error fetching data:", jsonData.status);
      return;
    }

    jsonData.data.results.forEach((result) => {
      let name = result.name;
      let div = document.createElement("div");
      div.classList.add("autocomplete-items");
      div.setAttribute("onclick", `displayWords('${name}')`);
      let word = `<b>${name.substr(0, input.value.length)}</b>`;
      word += name.substr(input.value.length);
      div.innerHTML = `<p class="item">${word}</p>`;
      listContainer.appendChild(div);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

// Fetch data on button click
button.addEventListener("click", async () => {
  if (input.value.trim().length < 1) {
    alert("Input cannot be blank");
    return;
  }

  showContainer.innerHTML = "";

  let ts = new Date().getTime().toString(); // Timestamp
  let hashValue = generateHash(ts, privateKey, publicKey);

  const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hashValue}&name=${encodeURIComponent(input.value)}`;

  try {
    const response = await fetch(url);
    const jsonData = await response.json();

    if (jsonData.code !== 200) {
      console.error("Error fetching data:", jsonData.status);
      showContainer.innerHTML = `<p style="color: red;">Error: ${jsonData.status}</p>`;
      return;
    }

    if (jsonData.data.results.length === 0) {
      showContainer.innerHTML = `<p style="color: white;">No results found.</p>`;
      return;
    }

    jsonData.data.results.forEach((element) => {
      const thumbnail = element.thumbnail.path + "." + element.thumbnail.extension;
      const name = element.name;
      const description = element.description || "No description available.";

      showContainer.innerHTML += `
        <div class="card-container">
          <div class="container-character-image">
            <img src="${thumbnail}" alt="${name}">
          </div>
          <div class="character-name">${name}</div>
          <div class="character-description">${description}</div>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    showContainer.innerHTML = `<p style="color: red;">An error occurred while fetching data.</p>`;
  }
});

// Optionally, fetch initial result on page load
window.onload = () => {
  // Uncomment the following lines if you want to load a default character on page load
  // input.value = "iron man";
  // button.click();
};
