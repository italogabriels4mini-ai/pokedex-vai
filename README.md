# Pokédex UC33

Pokédex responsiva inspirada no tutorial em vídeo, adaptada para a arquitetura da disciplina. O navegador conversa somente com um serviço próprio em Node.js/Express; o servidor consulta a PokéAPI, guarda respostas em cache e devolve apenas `{ numero, nome, tipos, imagem }`.

## Requisitos e instalação

Use Node.js 22 ou superior. Na pasta do projeto, instale as dependências:

```bash
npm install
```

## Executar em desenvolvimento

```bash
npm run dev
```

Abra `http://localhost:3000`. Para usar outra porta, defina a variável `PORT` antes de iniciar o servidor.

No PowerShell:

```powershell
$env:PORT=3001
npm run dev
```

No macOS/Linux:

```bash
PORT=3001 npm run dev
```

## Compilar e iniciar a versão compilada

```bash
npm run build
npm start
```

O TypeScript gera a pasta `dist/`. Ela e `node_modules/` não fazem parte do código-fonte versionado ou do pacote de entrega; ambas podem ser recriadas.

## API

A rota principal é `GET /api/pokemons/:termo`, em que `:termo` pode ser o nome ou o número do Pokémon. Exemplos:

```bash
curl http://localhost:3000/api/pokemons/pikachu
curl http://localhost:3000/api/pokemons/25
```

Resposta de sucesso (resumida):

```json
{
  "numero": 25,
  "nome": "pikachu",
  "tipos": ["electric"],
  "imagem": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
}
```

O serviço normaliza espaços externos e maiúsculas/minúsculas. Entradas fora da expressão `/^[a-z0-9-]{1,40}$/` retornam HTTP 400, Pokémon inexistente retorna 404 e falha/timeout da PokéAPI após 5 segundos retorna 503. Respostas de erro usam `{ "erro": "mensagem" }`. Endereços desconhecidos sob `/api` retornam 404 JSON. O cache em memória usa o nome e o número, então consultar primeiro `pikachu` e depois `25` reutiliza o resultado.

Para observar respostas:

```bash
curl -i http://localhost:3000/api/pokemons/pikachu
curl -i http://localhost:3000/api/pokemons/pikachu%20chu
curl -i http://localhost:3000/api/pokemons/naoexiste
curl -i http://localhost:3000/api/xyz
```

## Recursos e escolhas didáticas

A página inicia em #001, aceita nome/número pelo formulário ou Enter, permite navegar para Anterior/Próximo e buscar um Pokémon aleatório entre os números 1 e 151. Durante a solicitação, os controles ficam desativados; a tela mantém o Pokémon anterior em caso de erro. Dados de texto da API são colocados na página com `textContent`, sem `innerHTML`, e uma imagem que falha é ocultada.

Os dois desafios criativos realizados são: (1) exibir os tipos em português na interface, mantendo os valores originais em inglês no contrato do servidor; (2) botão “Aleatório”, limitado aos números 1–151 como no enunciado do desafio do tutorial.

Em comparação com a versão do vídeo, que faz `fetch` diretamente do navegador e manipula `innerHTML`, esta versão adiciona um backend intermediário, validação, cache, timeout, respostas de erro HTTP explícitas e renderização segura dos dados recebidos.


## Histórico da dupla

A atividade pede commits pequenos feitos pelos dois integrantes. Este pacote não inventa nem atribui autoria em nome de colegas: configurem a identidade Git de cada participante e registrem as contribuições reais em commits separados antes da entrega final da disciplina.
