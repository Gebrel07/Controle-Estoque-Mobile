## Controle de estoque (Mobile)
Controle de estoque para impressoras e acessórios com uso de QrCode

### Requisitos:
- identificar impressora através de QrCode
- verificar informações da impressora e todos os acessórios cadastrados nela
- atualizar status dos acessórios da impressora identificada
  - se todos estão ok
  - se falta algum acessório
  - se possui acessórios a mais
  - se os números de série dos acessósios externos estão corretos
- inserir observação sobre a impressora


### Modelos
impressora: {
  id: str (auto),
  numSerie: str
  modelo: str,
  imgUrl: str (optional),
  acessoriosOk: bool,
  acessoriosExternos: [
    {id: str, possui: bool},
    ...
  ],
  acessoriosInternos: [
    {id: str, possui: bool},
    ...
  ],
}


acessorioExterno: {
  id: str (auto),
  numSerie: str,
  tipo: str,
}


acessorioInterno: {
  id: str (auto),
  tipo: str,
}

