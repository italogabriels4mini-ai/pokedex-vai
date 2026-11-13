const $ = (id) => document.getElementById(id);
let numeroAtual = 0;

const TIPOS_PT = {
  normal: 'normal',
  fire: 'fogo',
  water: 'água',
  electric: 'elétrico',
  grass: 'planta',
  ice: 'gelo',
  fighting: 'lutador',
  poison: 'veneno',
  ground: 'terrestre',
  flying: 'voador',
  psychic: 'psíquico',
  bug: 'inseto',
  rock: 'pedra',
  ghost: 'fantasma',
  dragon: 'dragão',
  dark: 'sombrio',
  steel: 'aço',
  fairy: 'fada',
};

async function pedirPokemon(termo) {
  let resposta;
  try {
    resposta = await fetch(`/api/pokemons/${encodeURIComponent(termo)}`);
  } catch {
    throw new Error('Sem conexão com o servidor. Ele está rodando?');
  }

  const corpo = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    throw new Error(typeof corpo.erro === 'string' ? corpo.erro : `Erro ${resposta.status}`);
  }
  return corpo;
}

function mostrarAviso(texto, tipo = 'erro') {
  $('aviso').textContent = texto;
  $('aviso').className = `aviso ${tipo}`;
  $('aviso').hidden = false;
}

function mostrarPokemon(pokemon) {
  numeroAtual = pokemon.numero;
  $('aviso').hidden = true;
  $('numero').textContent = `#${String(pokemon.numero).padStart(3, '0')}`;
  $('nome').textContent = pokemon.nome;

  $('tipos').replaceChildren(...pokemon.tipos.map((tipo) => {
    const item = document.createElement('li');
    item.textContent = TIPOS_PT[tipo] ?? tipo;
    item.className = `tipo tipo-${tipo}`;
    return item;
  }));

  const imagem = $('imagem');
  const imagemIndisponivel = $('imagem-indisponivel');
  imagem.hidden = !pokemon.imagem;
  imagemIndisponivel.hidden = Boolean(pokemon.imagem);
  if (pokemon.imagem) {
    imagem.src = pokemon.imagem;
    imagem.alt = `Sprite de ${pokemon.nome}`;
  } else {
    imagem.removeAttribute('src');
    imagem.alt = '';
  }
}

function travarBotoes(travar) {
  for (const botao of document.querySelectorAll('button')) {
    botao.disabled = travar;
  }
  if (!travar) $('anterior').disabled = numeroAtual <= 1;
}

async function buscar(termo) {
  const busca = termo.trim();
  if (!busca) {
    mostrarAviso('Digite um nome ou número para buscar.');
    return;
  }

  mostrarAviso('Buscando na PokéAPI…', 'info');
  travarBotoes(true);
  try {
    mostrarPokemon(await pedirPokemon(busca));
  } catch (erro) {
    mostrarAviso(erro instanceof Error ? erro.message : 'Não foi possível concluir a busca.');
  } finally {
    travarBotoes(false);
  }
}

$('imagem').addEventListener('error', () => {
  $('imagem').hidden = true;
  $('imagem-indisponivel').hidden = false;
});

$('busca').addEventListener('submit', (evento) => {
  evento.preventDefault();
  buscar(new FormData(evento.currentTarget).get('termo')?.toString() ?? '');
});

$('anterior').addEventListener('click', () => buscar(String(numeroAtual - 1)));
$('proximo').addEventListener('click', () => buscar(String(numeroAtual + 1)));
$('aleatorio').addEventListener('click', () => {
  const numeroAleatorio = Math.floor(Math.random() * 151) + 1;
  buscar(String(numeroAleatorio));
});

buscar('1');
