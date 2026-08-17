#!/usr/bin/env bash
# Valida .github/workflows/*.yml com actionlint antes do commit - pega
# sintaxe invalida, contextos ${{ }} errados e arquivo vazio/corrompido
# (ver commit "Corrige deploy.yml commitado vazio por engano", que so foi
# descoberto depois do push porque nada validava o YAML localmente).
set -euo pipefail

if ! command -v docker >/dev/null 2>&1; then
  echo "aviso: docker nao encontrado, pulando actionlint (instale o Docker pra validar workflows localmente)" >&2
  exit 0
fi

if ! docker info >/dev/null 2>&1; then
  echo "aviso: docker instalado mas nao esta rodando, pulando actionlint" >&2
  exit 0
fi

# MSYS_NO_PATHCONV evita que o Git Bash no Windows reescreva os paths
# absolutos (/repo) do container em paths do host antes de chegar no docker.
MSYS_NO_PATHCONV=1 docker run --rm -v "$PWD:/repo" -w /repo rhysd/actionlint:latest -color
