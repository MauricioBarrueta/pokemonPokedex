const btnGetPokemonByName = document.querySelector('.btnGetPokemonByName');
const pokemonNameValue = document.getElementById('getPokemonByName');
const pokedexContainer = document.querySelector('.pokedex-container');

const pokemonContainer = document.querySelector('.pokemon-container');
const btnShowPokemonList = document.querySelector('.btn-show-pokemon-list');
const btnHidePokemonList = document.querySelector('.btn-hide-pokemon-list');
const totalPokemonToList = document.getElementById('totalPokemonList');

const alertDialog = document.getElementById('alert');
const alertText = document.getElementById('alert-text');
const closeAlert = document.querySelector('.close-alert');

/* Colores para los diferentes tipos de Pokémon */
const pokemonTypeColors = {
	// fire: '#E87A3D', grass: '#82C95B', electric: '#E7C536', water: '#639CE4', ground: '#CEB250', rock: '#BAA85E', fairy: '#E8B0EB',	
    // poison: '#B369AF', bug: '#ACC23E', dragon: '#8572C8', psychic: '#E96C95', flying: '#90AAD7', fighting: '#C45D4C', normal: '#ACAD99',
    // ghost: '#816DB6', dark: '#79726B', ice: '#81CFD7'
    normal: '#AAB09F', fire: '#EA7A3C',	water: '#539AE2', electric: '#E5C531', grass: '#71C558', ice: '#70CBD4', fighting: '#CB5F48',
	poison: '#B468B7', ground: '#CC9F4F', flying: '#7DA6DE', psychic: '#E5709B', bug: '#94BC4A', rock: '#B2A061', ghost: '#846AB6',
	dragon: '#6A7BAF', dark: '#736C75', steel: '#89A1B0', fairy: '#E397D1'
};
const pokemonMainTypes = Object.keys(pokemonTypeColors); /* --------------INVESTIGAR EN EL VIDEO------------------------- */

/* --------------------------------------------------------------- MODAL ------------------------------------------------------------------ */
/* Muestra un modal con un 'loader' con un span dinámico */
function fetchingData() {
    $('.modalSpinner').css('visibility', 'visible');
    $('.modalSpinner').modal('show');
    setTimeout(function () {
        $('.modalSpinner').modal('hide');
    }, 2500);
}

/* --------------------------------------------------------------- POKÉDEX ---------------------------------------------------------------- */
/* Función que obtiene el Pokémon de acuerdo al nombre y valida si existe */
const renderPokemonPokedex = event => {
    event.preventDefault();    
    if (!pokemonNameValue.value == "") {  
        closeAlertSpan()      
        fetchingData()
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNameValue.value.toLowerCase()}`)
            .then(res => { return res.status == 404 ? showAlertSpan() : res.json(); })
            .then(data => {
                pokedexContainer.innerHTML = '';
                createPokemonCardPokedex(data);
            })
            .catch(error => console.log(error))
    } else {
        showAlertSpan();
        alertText.innerHTML = 'Ingresa el Pokémon que deseas buscar';         
    }     
}
btnGetPokemonByName.addEventListener('click', renderPokemonPokedex);

/* Función que renderiza los datos del Pokémon para mostrarlos en el Pokédex */
function createPokemonCardPokedex (data) {
    const pokedexCard = document.createElement('div');
    pokedexCard.classList.add('pokedex-pokemon-card');
        
    const number = document.createElement('p');
    number.classList.add('pokedex-pokemon-id');
    number.textContent = `#${data.id.toString().padStart(3, 0)}` /* padStart(): Añade 2 '0' al principio */
    pokedexCard.appendChild(number); /* No. del Pokémon */
    
    const name = document.createElement('p');
    name.classList.add('pokedex-pokemon-name');
    name.textContent = data.name[0].toUpperCase() + data.name.slice(1); /* CHECAR EN EL VIDEO PA QUE ES ESTO */

    const spriteContainer = document.createElement('div');
    spriteContainer.classList.add('pokedex-img-container');
    const sprite = document.createElement('img');
    sprite.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
    console.log(data)
    spriteContainer.appendChild(sprite);

    pokedexCard.appendChild(name); /* Nombre */
    pokedexCard.appendChild(spriteContainer); /* Imagen */

    const pokemonTypes = document.createElement('div');
    pokemonTypes.classList.add('pokedex-pokemon-types');
    const pokemonStats = document.createElement('div');
    pokemonStats.classList.add('pokedex-pokemon-stats');
    const {stats, types} = data;  
    
    /* Obtiene el o los tipos del Pokémon */
    const renderPokemonTypes = types => {
        types.forEach(type => {
            const typeTextElement = document.createElement('div');
            typeTextElement.classList.add('pokedex-pokemon-type');
            typeTextElement.textContent = type.type.name;
            pokemonTypes.appendChild(typeTextElement);
            pokedexCard.appendChild(pokemonTypes);            
        });
    }       
    /* Obtiene las estadisticas del Pokémon */
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

    pokedexContainer.appendChild(pokedexCard); /* Se adjuntan todos los elementos al Container */
}

/* ------------------------------------------------------------------ LISTA ---------------------------------------------------------------- */
/* Función que obtiene los datos del Pokémon  */
const getPokemonList = id => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(res => res.json())
        .then(data => {
            createPokemonCard(data);
        })
        .catch(error => console.error(error))
};

/* Renderiza los Pokémones de acuerdo a la cantidad ingresada en el Input */
const generatePokemonList = () => {
    if(totalPokemonToList.value == "") {
        showAlertSpan();
        alertText.innerHTML = 'No has ingresado ninguna cantidad para listar';
    } else if(totalPokemonToList.value > 905) {
        showAlertSpan();
        alertText.innerHTML = 'Has superado el límite de Pokémones existentes';
    } else {    
        closeAlertSpan()
        fetchingData();
        pokemonContainer.innerHTML = '';
        for (let i = 1; i <= totalPokemonToList.value; i++) {
            getPokemonList(i);
        }
    } 
};
btnShowPokemonList.addEventListener('click', generatePokemonList);

/* Resetea el container de la lista de los Pokémon */
const resetPokemonContainer = () => {
    fetchingData();
    pokemonContainer.innerHTML = '';
    totalPokemonToList.innerHTML = '';
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

    const number = document.createElement('p');
    number.classList.add('pokemon-id');
    number.textContent = `#${pokemonData.id.toString().padStart(3, 0)}` /* padStart(): Añade 2 '0' al principio */    

    card.appendChild(name); /* Nombre */
    card.appendChild(spriteContainer); /* Imagen */
    card.appendChild(number); /* No. del Pokémon */

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

            const typeOne = pokemonTypeColors[types[0].type.name];
            const typeTwo = types[1] ? pokemonTypeColors[types[1].type.name] : types[0].type.name;
            pokemonTypes.style.background = `radial-gradient(${typeTwo} 33%, ${typeOne} 33%)`;
            pokemonTypes.style.backgroundSize = '13.5px 13.5px';

            const pokemonTypesData = pokemonData.types.map(type => type.type.name);
            const pokemonType = pokemonMainTypes.find(type => pokemonTypesData.indexOf(type) > -1);
            const color = pokemonTypeColors[pokemonType];
            card.style.backgroundColor = color;
            pokemonTypes.style.backgroundColor = color;

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

    pokemonContainer.appendChild(card);
}

/* Muestra un Alert dependiendo la acción que lo requiera */
const showAlertSpan = () => {   
    alertText.innerHTML = 'No existe este Pokémon';
    alertDialog.classList.remove('hide');
    alertDialog.classList.add('show');     
}

/* Función para ocultar el Alert Span */
const closeAlertSpan = () => {
    alertDialog.classList.remove('show');
    alertDialog.classList.add('hide');     
}
closeAlert.addEventListener('click', closeAlertSpan)

/* Bootstrap Tooltip */
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))