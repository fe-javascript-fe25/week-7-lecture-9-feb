const log = (msg) => console.log(msg);

const globalRefs = {
    pokedexSectionRef : document.querySelector('#pokedexSection'),
    generateSectionRef : document.querySelector('#generateSection'),
    searchSectionRef : document.querySelector('#searchSection'),
}

if(location.pathname === '/' || location.pathname === '/index.html') {
    pageSetup();
} else if(location.pathname === '/single.html') {
    singlePageSetup();
}

async function singlePageSetup() {
    log('singlePageSetup()');
    
    // document.querySelector('#pokemonName').textContent = pokemon.name;

    // document.querySelector('#pokedex').appendChild(createCard(pokemon));
}

// pageSetup();

function pageSetup() {
    log('pageSetup()');

    globalRefs.generateSectionRef.classList.add('d-none');
    globalRefs.searchSectionRef.classList.add('d-none');

    const listItemRefs = document.querySelectorAll('.header__menu-item');
    for(let ref of listItemRefs) {
        ref.addEventListener('click', displayActiveSection);
    }
    pokedexSetup();
    // generatorSetup();
    // searchSetup();
}

function displayActiveSection(event) {
    log(event.target.id);
    const activeSection = event.target.id;

    if(activeSection === 'pokedexLink') {
        globalRefs.pokedexSectionRef.classList.remove('d-none');
        globalRefs.generateSectionRef.classList.add('d-none');
        globalRefs.searchSectionRef.classList.add('d-none');
    } else if(activeSection === 'generateLink') {
        globalRefs.pokedexSectionRef.classList.add('d-none');
        globalRefs.generateSectionRef.classList.remove('d-none');
        globalRefs.searchSectionRef.classList.add('d-none');
    } else if(activeSection === 'searchLink') {
        globalRefs.pokedexSectionRef.classList.add('d-none');
        globalRefs.generateSectionRef.classList.add('d-none');
        globalRefs.searchSectionRef.classList.remove('d-none');
    }
}

async function pokedexSetup() {
    log('pokedexSetup()');

    const pokedexRef = document.querySelector('#pokedex');
    pokedexRef.innerHTML = '';

    for(let pokemon of pokemons) {
        
        const card = createCard(pokemon);
        pokedexRef.appendChild(card);
    }
}

function generatorSetup() {
    log('generatorSetup()');

    document.querySelector('#generateBtn').addEventListener('click', generatePokemon);
}

function generatePokemon(event) {
    event.preventDefault();
    log('generatePokemon()');

    const type = document.querySelector('#pokemonTypes').value;
    let teamSize = Number(document.querySelector('#teamSize').value);

    if(teamSize < 1 || teamSize > 151) teamSize = 6;

    const pokemonsTemp = [...pokemons];
    const team = [];

    if(type === '') {
        for(let i = 0; i < teamSize; i++) {
            const randomIndex = Math.floor(Math.random() * pokemonsTemp.length);
            const randomPokemon = pokemonsTemp.splice(randomIndex, 1)[0];
            team.push(randomPokemon);
        }
    } else {
        const filtered = pokemonsTemp.filter(pokemon => {
            for(let pokemonType of pokemon.type) {
                if(pokemonType.name.toLowerCase() === type.toLowerCase()) {
                    return true;
                }
            } 
            return false;
        });

        if(filtered.length < teamSize) {
            teamSize = filtered.length;
        }

        for(let i = 0; i < teamSize; i++) {
            const randomIndex = Math.floor(Math.random() * filtered.length);
            const randomPokemon = filtered.splice(randomIndex, 1)[0];
            team.push(randomPokemon);
        }
    }

    const generateRef = document.querySelector('#generate');
    generateRef.innerHTML = '';

    for(let pokemon of team) {
        const card = createCard(pokemon);
        generateRef.appendChild(card);
    }
}

async function searchSetup() {
    log('searchSetup()');

}

async function searchPokemon(event) {
    event.preventDefault();
    log('searchPokemon()');

    let query = document.querySelector('#pokemonName').value.toLowerCase().trim();
    let results = pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(query));

    const searchRef = document.querySelector('#search');
    searchRef.innerHTML = '';

    for(let pokemon of results) {
        
        const card = createCard(pokemonDetails);
        searchRef.appendChild(card);
    }
}

function createCard(pokemon) {
    const cardRef = document.createElement('article');
    cardRef.classList.add('card');

    const cardTemplate = `
        <div class="card__top">
            <img
                src="${''}"
                alt="${pokemon.name}"
                class="card__image"
                style="background-color: ${''};"
            />
            <span class="card__index">${getIndexString(pokemon.id)}</span>
        </div>
        <div class="card__middle">
            <h3 class="card__name">${pokemon.name}</h3>
            <h4 class="card__type">${getTypeString(pokemon.types)}</h4>
        </div>
        <div class="card__bottom">
            <p class="card__stat">Attack: ${''}</p>
            <p class="card__stat">Defense: ${''}</p>
            <p class="card__stat">Sp. Attack: ${''}</p>
            <p class="card__stat">Sp. Defense: ${''}</p>
            <p class="card__stat">HP: ${''}</p>
            <p class="card__stat">Speed: ${''}</p>
            <p class="card__stat card__stat--span-two">
                Total: ${''}
            </p>
        </div>
    `;

    cardRef.innerHTML = cardTemplate;    

    cardRef.addEventListener('click', (event) => {
        
    });

    return cardRef;
}

function getButtonText(pokemon) {
    if(isInFavorites(pokemon)) {
        return "Remove from favorites!";
    } else {
        return "Add to favorites!";
    }
}

function getIndexString(id) {
    let indexString = '';
    if(id < 10) {
        indexString = '#00' + id;
    } else if(id >= 10 && id < 100) {
        indexString = '#0' + id;
    } else {
        indexString = '#' + id;
    }
    return indexString;
}

function getTypeString(type) {
    if(type.length === 1) {
        return type[0].name;
    } else {
        return `${type[0].type.name} / ${type[1].type.name}`;
    }
}

function getStatsTotal(stats) {
    let total = 0;
    for(let stat of stats) {
        total += stat.base_stat;
    }
    return total;
}

function getTypeColor(type) {
    const typeColors = {
        normal: "#A8A77A",
        fire: "#EE8130",
        water: "#6390F0",
        grass: "#7AC74C",
        electric: "#F7D02C",
        ice: "#96D9D6",
        fighting: "#C22E28",
        poison: "#A33EA1",
        ground: "#E2BF65",
        flying: "#A98FF3",
        psychic: "#F95587",
        bug: "#A6B91A",
        rock: "#B6A136",
        ghost: "#735797",
        dragon: "#6F35FC",
        dark: "#705746",
        steel: "#B7B7CE",
        fairy: "#D685AD"
    };
    
    return typeColors[type] || "#000000"; // Returnerar svart om typen inte finns
}
