const btnPokemonByName = document.querySelector('.btnGetPokemonByName'), pokemonNameValue = document.getElementById('getPokemonByName');
const pokedexContainer = document.querySelector('.pokedex-container'), pokemonContainer = document.querySelector('.pokemon-container');
const btnShowPokemonList = document.querySelector('.btn-show-pokemon-list'), btnHidePokemonList = document.querySelector('.btn-hide-pokemon-list');
const totalPokemonToList = document.getElementById('totalPokemonList');
const alertDialog = document.getElementById('alert'), alertText = document.getElementById('alert-text'), closeAlert = document.querySelector('.close-alert');

/* Colores de los tipos de Pokémon existentes */
const pokemonTypesColors = {
    normal: '#AAB09F', fire: '#EA7A3C',	water: '#539AE2', electric: '#E5C531', grass: '#71C558', ice: '#70CBD4', fighting: '#CB5F48',
	poison: '#B468B7', ground: '#CC9F4F', flying: '#7DA6DE', psychic: '#E5709B', bug: '#94BC4A', rock: '#B2A061', ghost: '#846AB6',
	dragon: '#6A7BAF', dark: '#736C75', steel: '#89A1B0', fairy: '#E397D1'
};
const pokemonTypeBgColor = Object.keys(pokemonTypesColors);

/* Se muestra un loader al realizar cualquier aacción */
function fetchingDataModal() {
    $('.modalSpinner').css('visibility', 'visible');
    $('.modalSpinner').modal('show');
    setTimeout(function () {
        $('.modalSpinner').modal('hide');
    }, 2500);
}

/* Función que obtiene el Pokémon de acuerdo al nombre y valida si existe */
const getPokemonCardToPokedex = event => {
    event.preventDefault();    
    if (!pokemonNameValue.value == "") {  
        closeAlertSpan()      
        fetchingDataModal()
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNameValue.value.toLowerCase()}`) /* Previene letras en mayúscula */
            .then(res => { return res.status == 404 ? showAlertSpan() : res.json(); })
            .then(data => {
                pokedexContainer.innerHTML = '';
                renderPokemonDataToPokedex(data);
            })
            .catch(error => console.log(error))
    } else {
        showAlertSpan();
        alertText.innerHTML = 'Ingresa el Pokémon que deseas buscar';         
    }     
}
btnPokemonByName.addEventListener('click', getPokemonCardToPokedex);

/* Función que renderiza los datos del Pokémon para mostrarlos en el Pokédex */
function renderPokemonDataToPokedex (data) {
    const pokedexCard = document.createElement('div');
    pokedexCard.classList.add('pokedex-pokemon-card');     

    const number = document.createElement('p'); /* Pokémon ID */    
    number.classList.add('pokedex-pokemon-id');
    number.textContent = `#${data.id.toString().padStart(3, '0')}`
    pokedexCard.appendChild(number); 

    const name = document.createElement('p'); /* Pokémon Name */
    name.classList.add('pokedex-pokemon-name');
    name.textContent = data.name[0].toUpperCase() + data.name.slice(1);
    
    const spriteContainer = document.createElement('div'); /* Pokémon Sprite */
    spriteContainer.classList.add('pokedex-img-container');
    const sprite = document.createElement('img');
    sprite.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];   
    spriteContainer.appendChild(sprite);

    pokedexCard.appendChild(name);
    pokedexCard.appendChild(spriteContainer);

    const pokemonTypes = document.createElement('div'); /* Pokémon Type(s) */
    pokemonTypes.classList.add('pokedex-pokemon-types'); 
    const pokemonStats = document.createElement('div'); /* Pokémon Stats */
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
    renderPokemonTypes(types);
    renderPokemonStats(stats);    

    pokedexContainer.appendChild(pokedexCard); /* Se adjuntan todos los elementos al Container */
}

/* Función que obtiene los datos del Pokémon  */
const getPokemonCardToList = id => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(res => res.json())
        .then(data => {
            renderPokemonDataToCardList(data);
        })
        .catch(error => console.error(error))
};

/* Renderiza los Pokémones de acuerdo a la cantidad ingresada en el Input */
const generatePokemonListByQuantity = () => {
    if(totalPokemonToList.value == "") {
        showAlertSpan();
        alertText.innerHTML = 'No has ingresado ninguna cantidad para listar';
    } else if(totalPokemonToList.value > 905) {
        showAlertSpan();
        alertText.innerHTML = 'Has superado el límite de Pokémones existentes';
    } else {    
        closeAlertSpan()
        fetchingDataModal();
        pokemonContainer.innerHTML = '';        
        for (let i = 1; i <= totalPokemonToList.value; i++) {
            getPokemonCardToList(i);
        }
    } 
};
btnShowPokemonList.addEventListener('click', generatePokemonListByQuantity);

/* Limpia el container de la lista de los Pokémon */
const cleanPokemonListContainer = () => {
    fetchingDataModal();
    pokemonContainer.innerHTML = '';
    totalPokemonToList.value = '';
}
btnHidePokemonList.addEventListener('click', cleanPokemonListContainer);

/* Función que renderiza los datos del Pokémon para mostrarlos en la lista */
function renderPokemonDataToCardList(pokemonData) {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');

    const name = document.createElement('p'); /* Pokémon Name */
    name.classList.add('pokemon-name');
    name.textContent = pokemonData.name[0].toUpperCase() + pokemonData.name.slice(1);

    const spriteContainer = document.createElement('div'); /* Pokémon Sprite */
    spriteContainer.classList.add('img-container');
    const sprite = document.createElement('img');
    sprite.src = pokemonData.sprites.front_default;
    spriteContainer.appendChild(sprite);

    card.appendChild(name);
    card.appendChild(spriteContainer);

    const pokemonTypes = document.createElement('div'); /* Pokémon Type(s) */
    pokemonTypes.classList.add('pokemon-types');

    const pokemonStats = document.createElement('div'); /* Pokémon Stats */
    pokemonStats.classList.add('pokemon-stats');
    const {stats, types} = pokemonData;   

    /* Obtiene el o los tipos del Pokémon */
    const renderPokemonTypes = types => {
        types.forEach(type => {
            const typeTextElement = document.createElement('div');
            typeTextElement.classList.add('pokemon-type');
            typeTextElement.textContent = type.type.name;

            /* Valida si el Pokémon tiene 2 tipos, si es verdadero combina los colores de ambos */
            const typeOne = pokemonTypesColors[types[0].type.name];
            const typeTwo = types[1] ? pokemonTypesColors[types[1].type.name] : types[0].type.name;
            pokemonTypes.style.background = `radial-gradient(${typeTwo} 33%, ${typeOne} 33%)`;
            pokemonTypes.style.backgroundSize = '16px 16px';

            const pokemonTypesData = pokemonData.types.map(type => type.type.name);
            const pokemonType = pokemonTypeBgColor.find(type => pokemonTypesData.indexOf(type) > -1);
            const color = pokemonTypesColors[pokemonType];
            card.style.backgroundColor = color;            

            pokemonTypes.appendChild(typeTextElement);
            card.appendChild(pokemonTypes);            
        });
    }       
    /* Obtiene las estadísticas del Pokémon */
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
    const number = document.createElement('p'); /* Pokémon ID */
    number.classList.add('pokemon-id');
    number.textContent = `#${pokemonData.id.toString().padStart(3, 0)}`    
    
    renderPokemonTypes(types);
    renderPokemonStats(stats);
    card.appendChild(number); 

    pokemonContainer.appendChild(card); /* Se adjuntan todos los elementos a la Card */
}

/* Muestra un Alert dependiendo la acción que lo requiera */
const showAlertSpan = () => {   
    alertText.innerHTML = 'No existe este Pokémon'; /* Valor por defecto */
    alertDialog.classList.remove('hide');
    alertDialog.classList.add('show');   
    setTimeout(() => { closeAlertSpan(); }, 4000);  
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