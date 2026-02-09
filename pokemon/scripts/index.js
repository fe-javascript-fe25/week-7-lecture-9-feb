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

    const params = new URLSearchParams(window.location.search);
    const value = params.get('pokemon');
    const pokemon = await fetchPokemonDetails(value);
    
    document.querySelector('#pokemonName').textContent = pokemon.name;

    document.querySelector('#pokedex').appendChild(createCard(pokemon));
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
    searchSetup();
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
    const pokemons = await fetchAllPokemons(151);
    console.log(pokemons);
    

    for(let pokemon of pokemons) {
        const pokemonDetails = await fetchPokemonDetails(pokemon.name);
        console.log(pokemonDetails);
        
        const card = createCard(pokemonDetails);
        pokedexRef.appendChild(card);
    }
}

async function fetchPokemonDetails(name) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const details = await response.json();
        return details;
    } catch(error) {
        console.error(error.message);
    }
    
}

async function fetchAllPokemons(limit) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=0`);
        const pokemons = await response.json();
        return pokemons.results;
    } catch(error) {
        console.error(error.message);
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

    const pokemons = await fetchAllPokemons(10000);
    const listRef = document.querySelector('#searchList');
    document.querySelector('#pokemonName').addEventListener('input', (event) => {
        const matching = pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(event.target.value.toLowerCase()));
        listRef.innerHTML = '';
        console.log(matching);

        for(let pkmn of matching) {
            const listItemRef = document.createElement('li');
            listItemRef.classList.add('section__search-item');
            listItemRef.textContent = pkmn.name;
            listRef.appendChild(listItemRef);
            listRef.addEventListener('click', (event) => {
                document.querySelector('#pokemonName').value = event.target.textContent;
                listRef.innerHTML = '';
            });
        }
        
        document.querySelector('#searchBtn').addEventListener('click', (event) => {
            searchPokemon(event);
        })
    });


}

async function searchPokemon(event) {
    event.preventDefault();
    log('searchPokemon()');

    const pokemons = await fetchAllPokemons(10000);

    let query = document.querySelector('#pokemonName').value.toLowerCase().trim();
    let results = pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(query));

    const searchRef = document.querySelector('#search');
    searchRef.innerHTML = '';

    for(let pokemon of results) {
        const pokemonDetails = await fetchPokemonDetails(pokemon.name)
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
                src="${pokemon.sprites.front_default}"
                alt="${pokemon.name}"
                class="card__image"
                style="background-color: ${getTypeColor(pokemon.types[0].type.name)};"
            />
            <span class="card__index">${getIndexString(pokemon.id)}</span>
        </div>
        <div class="card__middle">
            <h3 class="card__name">${pokemon.name}</h3>
            <h4 class="card__type">${getTypeString(pokemon.types)}</h4>
        </div>
        <div class="card__bottom">
            <p class="card__stat">Attack: ${pokemon.stats[1].base_stat}</p>
            <p class="card__stat">Defense: ${pokemon.stats[2].base_stat}</p>
            <p class="card__stat">Sp. Attack: ${pokemon.stats[3].base_stat}</p>
            <p class="card__stat">Sp. Defense: ${pokemon.stats[4].base_stat}</p>
            <p class="card__stat">HP: ${pokemon.stats[0].base_stat}</p>
            <p class="card__stat">Speed: ${pokemon.stats[5].base_stat}</p>
            <p class="card__stat card__stat--span-two">
                Total: ${getStatsTotal(pokemon.stats)}
            </p>
        </div>
    `;

    cardRef.innerHTML = cardTemplate;    

    cardRef.addEventListener('click', (event) => {
        location.href = `/single.html?pokemon=${pokemon.name}`;
        
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
        return type[0].type.name;
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
