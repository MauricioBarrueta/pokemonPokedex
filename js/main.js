const pokemonContainer = document.querySelector('.pokemon-container');
const btnShowPokemonList = document.querySelector('.btn-show-pokemon-list');
const btnHidePokemonList = document.querySelector('.btn-hide-pokemon-list');
const pokemonTotal = 200; /* Cantidad de Pokémon obtenidos en la consulta 
TAL VEZ CAMBIARLA A QUE SEA DINAMICA Y SE PUEDA AGREGAR EL NUMERO DE DATPS QIE SE DESEAN OBTENER*/ 

const btnGetPokemonByName = document.querySelector('.btnGetPokemonByName');
const pokemonNameValue = document.getElementById('getPokemonByName');
const pokedexContainer = document.querySelector('.pokedex-main');
const pokedexForm = document.querySelector('.pokedex-form');

/* Colores para los diferentes tipos de Pokémon */
const pokemonTypeColors = {
	fire: '#FDDFDF', grass: '#DEFDE0', electric: '#FCF7DE', water: '#DEF3FD', ground: '#F4E7DA', rock: '#D5D5D4', fairy: '#FCEAFF',	poison: '#98D7A5',
	bug: '#F8D5A3',	dragon: '#97B3E6', psychic: '#EAEDA1', flying: '#F5F5F5', fighting: '#E6E0D4', normal: '#F5F5F5'
};
const pokemonMainTypes = Object.keys(pokemonTypeColors); /* --------------INVESTIGAR EN EL VIDEO------------------------- */

/* ------------------------------------------------ POKÉDEX ------------------------------------------- */
const getPokemonByName = event => {
    event.preventDefault(); /* Previene el log al hacer submit */
    // const pokemonName = event.target.pokemon;
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNameValue.value.toLowerCase()}`)
    .then(res => res.json())
    .then(data => {
        pokedexContainer.innerHTML = '';
        createPokemonCardPokedex(data);
    })
    .catch(error => console.log(error))
}

function createPokemonCardPokedex (data) {
    const pokedexCard = document.createElement('div');
    pokedexCard.classList.add('pokedex-pokemon-card');

    const name = document.createElement('p');
    name.classList.add('pokedex-pokemon-name');
    name.textContent = data.name[0].toUpperCase() + data.name.slice(1); /* CHECAR EN EL VIDEO PA QUE ES ESTO */

    const spriteContainer = document.createElement('div');
    spriteContainer.classList.add('pokedex-img-container');
    const sprite = document.createElement('img');
    sprite.src = data.sprites.front_default;
    spriteContainer.appendChild(sprite);

    pokedexCard.appendChild(name); /* Nombre */
    pokedexCard.appendChild(spriteContainer); /* Imagen */

    const pokemonTypes = document.createElement('div');
    pokemonTypes.classList.add('pokedex-pokemon-types');
    const pokemonStats = document.createElement('div');
    pokemonStats.classList.add('pokedex-pokemon-stats');
    const {stats, types} = data;  
    
    /* Obtiene la lista del dato o los datos correspondientes al tipo de Pokémon */
    const renderPokemonTypes = types => {
        types.forEach(type => {
            const typeTextElement = document.createElement('div');
            typeTextElement.classList.add('pokedex-pokemon-type');
            typeTextElement.textContent = type.type.name;

            const pokemonTypesList = data.types.map(type => type.type.name);
            const pokemonType = pokemonMainTypes.find(type => pokemonTypesList.indexOf(type) > -1);
            const color = pokemonTypeColors[pokemonType];
            pokedexCard.style.backgroundColor = color;

            pokemonTypes.appendChild(typeTextElement);
            pokedexCard.appendChild(pokemonTypes);            
        });
    }    
   
    /* Obtiene la lista de los datos correspondientes a las estadísticas del Pokémon */
    const renderPokemonStats = stats => {
        stats.forEach(stat => {
            const statElement = document.createElement('div');
            statElement.classList.add('pokedex-pokemon-stat');
            const statElementName = document.createElement('div');
            const statElementAmount = document.createElement('div');
            statElementAmount.classList.add('stat-amount');
            statElementName.textContent = stat.stat.name;
            statElementAmount.textContent = stat.base_stat;
            statElement.appendChild(statElementName);
            statElement.appendChild(statElementAmount);
            pokemonStats.appendChild(statElement);
            pokedexCard.appendChild(pokemonStats);  
        });        
    }

    renderPokemonTypes(types); /* Tipo(s) */
    renderPokemonStats(stats); /* Estadísticas */     
    
    const number = document.createElement('p');
    number.classList.add('pokedex-pokemon-id');
    number.textContent = `#${data.id.toString().padStart(3, 0)}` /* padStart(): Añade 2 '0' al principio */

    pokedexCard.appendChild(number); /* No. del Pokémon */

    pokedexContainer.appendChild(pokedexCard); 
}
btnGetPokemonByName.addEventListener('click', getPokemonByName)


/* ------------------------------------------------------- LISTA ----------------------------- */
/* Función que obtiene los datos del Pokémon */
const getPokemonList = id => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => res.json())
    .then(data => { 
        createPokemonCard(data); 
    })           
    .catch(error => console.error(error))	
};

/* Muestra un modal con un 'loader' al dar clic en mostrar los Pokémon */
const spinnerSpan = document.getElementById('spinnerSpan');
function fetchingDataSpinner() {
    spinnerSpan.innerHTML = 'Cargando datos...';
    $('.modalSpinner').css('visibility', 'visible');
    $('.modalSpinner').modal('show');
    setTimeout(function () {
        $('.modalSpinner').modal('hide');
    }, 2500);
}

/* Obtiene la cantidad de Pókemon especificada en la variable */
const generatePokemonList = () => {
	for (let i = 1; i <= pokemonTotal; i++) { 
        fetchingDataSpinner();       
		getPokemonList(i);
	}
};
btnShowPokemonList.addEventListener('click', generatePokemonList);

/* Resetea el container de los Pokémon */
const resetPokemonContainer = () => {
    fetchingDataSpinner();
    spinnerSpan.innerHTML = 'Ocultando datos...';
    pokemonContainer.innerHTML = '';
}
btnHidePokemonList.addEventListener('click', resetPokemonContainer);

/* Función que genera la Card del Pokémon generado aleatoriamente */
function createPokemonCard(pokemonData) {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');

    const name = document.createElement('p');
    name.classList.add('pokemon-name');
    name.textContent = pokemonData.name[0].toUpperCase() + pokemonData.name.slice(1); /* CHECAR EN EL VIDEO PA QUE ES ESTO */

    const spriteContainer = document.createElement('div');
    spriteContainer.classList.add('img-container');
    const sprite = document.createElement('img');
    sprite.src = pokemonData.sprites.front_default;
    spriteContainer.appendChild(sprite);

    card.appendChild(name); /* Nombre */
    card.appendChild(spriteContainer); /* Imagen */

    const pokemonTypes = document.createElement('div');
    pokemonTypes.classList.add('pokemon-types');
    const pokemonStats = document.createElement('div');
    pokemonStats.classList.add('pokemon-stats');
    const {stats, types} = pokemonData;  
    
    /* Obtiene la lista del dato o los datos correspondientes al tipo de Pokémon */
    const renderPokemonTypes = types => {
        types.forEach(type => {
            const typeTextElement = document.createElement('div');
            typeTextElement.classList.add('pokemon-type');
            typeTextElement.textContent = type.type.name;

            const pokemonTypesList = pokemonData.types.map(type => type.type.name);
            const pokemonType = pokemonMainTypes.find(type => pokemonTypesList.indexOf(type) > -1);
            const color = pokemonTypeColors[pokemonType];
            card.style.backgroundColor = color;

            pokemonTypes.appendChild(typeTextElement);
            card.appendChild(pokemonTypes);            
        });
    }    
   
    /* Obtiene la lista de los datos correspondientes a las estadísticas del Pokémon */
    const renderPokemonStats = stats => {
        stats.forEach(stat => {
            const statElement = document.createElement('div');
            statElement.classList.add('pokemon-stat');
            const statElementName = document.createElement('div');
            const statElementAmount = document.createElement('div');
            statElementAmount.classList.add('stat-amount');
            statElementName.textContent = stat.stat.name;
            statElementAmount.textContent = stat.base_stat;
            statElement.appendChild(statElementName);
            statElement.appendChild(statElementAmount);
            pokemonStats.appendChild(statElement);
            card.appendChild(pokemonStats);  
        });        
    }

    renderPokemonTypes(types); /* Tipo(s) */
    renderPokemonStats(stats); /* Estadísticas */     
    
    const number = document.createElement('p');
    number.classList.add('pokemon-id');
    number.textContent = `#${pokemonData.id.toString().padStart(3, 0)}` /* padStart(): Añade 2 '0' al principio */

    card.appendChild(number); /* No. del Pokémon */

    pokemonContainer.appendChild(card);
}

// SOCIAL PANEL JS
// const floating_btn = document.querySelector('.floating-btn');
// const close_btn = document.querySelector('.close-btn');
// const social_panel_container = document.querySelector('.social-panel-container');

// floating_btn.addEventListener('click', () => {
// 	social_panel_container.classList.toggle('visible')
// });

// close_btn.addEventListener('click', () => {
// 	social_panel_container.classList.remove('visible')
// });






























/* Bootstrap Tooltip */
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))


