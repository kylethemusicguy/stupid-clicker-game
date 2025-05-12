const gameData = {
  worlds: {
    first: { resources: { wood: 0, stone: 0, dirt: 0 } },
    desert: { resources: { sand: 0, sandstone: 0, redSandstone: 0 } },
    cave: { resources: { iron: 0, gold: 0, diamonds: 0 } },
    space: { resources: { moonRocks: 0, moonCheese: 0, stardust: 0 } },
  },
  sellMultiplier: 1.5,
  currentWorld: 'first',
};

function switchWorld(world) {
  gameData.currentWorld = world;
  const resourcesDiv = document.getElementById('resources');
  const actionsDiv = document.getElementById('actions');

  resourcesDiv.innerHTML = '';
  actionsDiv.innerHTML = '';

  if (world === 'sell') {
    showSellWorld();
  } else {
    const resources = gameData.worlds[world].resources;
    Object.keys(resources).forEach((resource) => {
      const resourceDiv = document.createElement('div');
      resourceDiv.textContent = `${resource}: ${resources[resource]}`;
      resourcesDiv.appendChild(resourceDiv);

      const collectButton = document.createElement('button');
      collectButton.textContent = `Collect ${resource}`;
      collectButton.className = 'collect';
      collectButton.onclick = () => collectResource(resource);
      actionsDiv.appendChild(collectButton);
    });
  }
}

function collectResource(resource) {
  gameData.worlds[gameData.currentWorld].resources[resource]++;
  switchWorld(gameData.currentWorld);
}

function showSellWorld() {
  const resourcesDiv = document.getElementById('resources');
  const allResources = getAllResources();

  Object.keys(allResources).forEach((resource) => {
    const sellButton = document.createElement('button');
    sellButton.textContent = `Sell ${resource}: ${allResources[resource]}`;
    sellButton.className = 'collect';
    sellButton.onclick = () => sellResource(resource);
    resourcesDiv.appendChild(sellButton);
  });
}

function getAllResources() {
  const allResources = {};
  Object.values(gameData.worlds).forEach((world) => {
    Object.keys(world.resources).forEach((resource) => {
      if (!allResources[resource]) allResources[resource] = 0;
      allResources[resource] += world.resources[resource];
    });
  });
  return allResources;
}

function sellResource(resource) {
  const allResources = getAllResources();
  const sellPrice = Math.floor(allResources[resource] * gameData.sellMultiplier);
  alert(`Sold ${resource} for ${sellPrice} coins!`);
  resetResource(resource);
  switchWorld('sell');
}

function resetResource(resource) {
  Object.values(gameData.worlds).forEach((world) => {
    if (world.resources[resource] !== undefined) {
      world.resources[resource] = 0;
    }
  });
}

function saveGame() {
  localStorage.setItem('clickerGame', JSON.stringify(gameData));
}

function loadGame() {
  const savedData = localStorage.getItem('clickerGame');
  if (savedData) {
    Object.assign(gameData, JSON.parse(savedData));
  }
}

window.onload = () => {
  loadGame();
  switchWorld('first');
};

window.onbeforeunload = () => {
  saveGame();
};
