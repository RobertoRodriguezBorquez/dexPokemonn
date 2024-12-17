let pagina = 0;

// Seleccionando elementos del HTML
const pokemonInput = document.getElementById("pokemonInput");
const btnBuscar = document.getElementById("bntBuscar");
const main = document.querySelector("main");
const btnAtras = document.getElementById("btnAtras");
const btnSiguiente = document.getElementById("btnSiguiente");
const seccionInfoPokemon = document.getElementById("info-pokemon");

// Función para generar una tarjeta de Pokémon
function listaPokemon(count, name) {
  return `
    <div class="tarjeta-1" data-id="${count}"> <!-- Aquí asignamos el atributo -->
      <img
        class="imagen-tarjeta"
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${count}.png"
        alt="${name}"
      />
      <h1>#${count}</h1>
      <p>${name.toUpperCase()}</p>
    </div>`;
}

//Función para generar tarjeta con los respectivos estilos para la info pokémon.
function presentacionInfoPokemon(
  id,
  name,
  types,
  peso,
  imagenPrimaria,
  sprites,
  moves
) {
  return `
    <div class="presentador-1">
      <!-- Imagen destacada -->
      <div class="info-pokemon-pokemon-image">
        <img src="${imagenPrimaria}" alt="Imagen destacada de ${name}" />
      </div>

      <!-- Información principal -->
      <h1 class="pokemon-number">#${id}</h1>
      <h1 class="pokemon-name">${name.toUpperCase()}</h1>

      <div class="depokemontails recuadro">
        <!-- Datos -->
        
        <h1 >Tipo</h1>
        <p class="datosType">${types}</p>
        <br>
        

        <h1>Peso</h1>
        <p class="datosPeso ">${peso} kg</p>
      </div>

      <!-- Sprites -->
      <div class="pokemon-sprites">
        <h1>Sprites</h1>
        <ul class="lista-img">
          <img src="${sprites.front_default}" alt="Sprite frontal normal" />
          <img src="${sprites.back_default}" alt="Sprite trasero normal" />
         <img src="${sprites.front_shiny}" alt="Sprite frontal shiny" />
          <img src="${sprites.back_shiny}" alt="Sprite trasero shiny" />
        </ul>
      </div>

      <!-- Movimientos -->
      <div class="pokemon-moves">
        <h1>Movimientos</h1>
        <ul class="movimientos">
          ${moves.map((move) => `<li>${move}</li>`).join("")}
        </ul>
      </div>
    </div>
  `;
}

//Función para crear tarjeta lateral con la info del pokémon seleccionado.
const infoPokemon = async (id) => {
  const urlInfo = `https://pokeapi.co/api/v2/pokemon/${id}`;
  try {
    const recibo = await fetch(urlInfo);
    if (recibo.status === 200) {
      const datos = await recibo.json();

      // Extraer detalles adicionales
      const nombre = datos.name;
      const peso = datos.weight;
      const tipos = datos.types.map((tipo) => tipo.type.name).join(", ");
      const movimientos = datos.moves.slice(0, 4).map((move) => move.move.name);

      // Cambiar la imagen primaria al arte oficial
      const imagenPrimaria =
        datos.sprites.other["official-artwork"].front_default;

      // Extraer sprites principales imagenes.
      const sprites = {
        front_default: datos.sprites.front_default,
        back_default: datos.sprites.back_default,
        front_shiny: datos.sprites.front_shiny,
        back_shiny: datos.sprites.back_shiny,
      };

      // Renderizar los detalles adicionales en la sección
      seccionInfoPokemon.innerHTML = presentacionInfoPokemon(
        datos.id,
        nombre,
        tipos,
        peso,
        imagenPrimaria,
        sprites,
        movimientos
      );

      // Mostrar la sección si estaba oculta
      seccionInfoPokemon.style.display = "block";
    } else {
      alert("No se encontró información del Pokémon.");
    }
  } catch (error) {
    console.error("Error al obtener detalles del Pokémon:", error);
  }
};

// Función búsqueda Pokémon
const buscarPokemon = async () => {
  const pokemonNameOrId = pokemonInput.value.toLowerCase();
  const urlBusqueda = `https://pokeapi.co/api/v2/pokemon/${pokemonNameOrId}`;

  try {
    const recibo = await fetch(urlBusqueda);
    if (recibo.status === 200) {
      const datos = await recibo.json();

      // Limpiar y actualizar el contenedor main
      main.innerHTML = listaPokemon(datos.id, datos.name);

      // Agregar clases para centrar la tarjeta
      main.classList.add("busqueda-resultado");
      const tarjeta = main.querySelector(".tarjeta-1");
      tarjeta.classList.add("unica");

      // Mostrar info lateral del Pokémon
      infoPokemon(datos.id);
    } else if (recibo.status === 404) {
      alert("No se encontró el Pokémon. Verifica el nombre o ID.");
    } else {
      alert("Hubo un error inesperado.");
    }
  } catch (error) {
    alert("Hubo un error al realizar la búsqueda.");
  }
};
// Función para limpiar estilos si hay una búsqueda activa
function limpiarEstilosBusqueda() {
  if (main.classList.contains("busqueda-resultado")) {
    main.classList.remove("busqueda-resultado"); // Elimina clase del main
  }

  const tarjetaUnica = main.querySelector(".tarjeta-1.unica");
  if (tarjetaUnica) {
    tarjetaUnica.classList.remove("unica"); // Elimina clase especial de tarjeta
  }

  // Limpia el contenido de info-pokemon
  seccionInfoPokemon.innerHTML = "";
  seccionInfoPokemon.style.display = "none";
}

// Evento para actualizar pantalla si se borra la búsqueda
pokemonInput.addEventListener("input", () => {
  if (pokemonInput.value.trim() === "") {
    main.classList.remove("busqueda-resultado"); // Remueve la clase centradora
    accesoApi(); // Vuelve a cargar la página actual
  }
});

// Evento para el botón de búsqueda
btnBuscar.addEventListener("click", buscarPokemon);

// Función para acceder a la API y cargar la lista
const accesoApi = async () => {
  const urlApi = `https://pokeapi.co/api/v2/pokemon/?limit=4&offset=${pagina}`;
  try {
    const recibo = await fetch(urlApi);
    if (recibo.status === 200) {
      const datos = await recibo.json();
      main.innerHTML = "";
      console.log(datos);

      datos.results.forEach((item) => {
        const id = item.url.split("/").filter(Boolean).pop(); // Extrae el ID real
        main.innerHTML += listaPokemon(id, item.name);
      });
      // Agregar eventos de clic a las tarjetas
      document.querySelectorAll(".tarjeta-1").forEach((tarjeta) => {
        tarjeta.addEventListener("click", () => {
          const id = tarjeta.getAttribute("data-id");
          infoPokemon(id); // Llama a la función con el ID del Pokémon
        });
      });

      btnAtras.disabled = !datos.previous;
      btnSiguiente.disabled = !datos.next;
    }
  } catch (error) {
    alert("Error al acceder a la API.");
  }
};

// Eventos para los botones de navegación
btnAtras.addEventListener("click", () => {
  if (pagina > 0) {
    pagina -= 4;
    accesoApi();
    limpiarEstilosBusqueda();
  }
});

btnSiguiente.addEventListener("click", () => {
  pagina += 4;
  accesoApi();
  limpiarEstilosBusqueda();
});

// Carga inicial
document.addEventListener("DOMContentLoaded", accesoApi);
