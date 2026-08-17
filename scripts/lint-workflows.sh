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

# Pinado por digest (em vez de :latest) pra build reprodutivel e pra nao
# puxar uma imagem trocada silenciosamente do Docker Hub. Atualizar rodando
# `docker pull rhysd/actionlint:latest` e copiando o digest reportado.
ACTIONLINT_IMAGE="rhysd/actionlint@sha256:b1934ee5f1c509618f2508e6eb47ee0d3520686341fec936f3b79331f9315667"

# MSYS_NO_PATHCONV evita que o Git Bash no Windows reescreva os paths
# absolutos (/repo) do container em paths do host antes de chegar no docker.
MSYS_NO_PATHCONV=1 docker run --rm -v "$PWD:/repo" -w /repo "$ACTIONLINT_IMAGE" -color
