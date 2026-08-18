#!/bin/sh

set -eu

REPO="${ISTOK_REPO:-vtimame/istok.sh}"
VERSION="${ISTOK_VERSION:-latest}"
INSTALL_DIR="${ISTOK_INSTALL_DIR:-$HOME/.local/bin}"

DRY_RUN=0

usage() {
  cat <<'EOF'
Istok installer

Usage:
  install.sh [options]

Options:
  --dry-run              Show what would be done without changing the system
  --version VERSION      Install a specific release version
  --install-dir PATH     Install istok into PATH
  -h, --help             Show this help

Environment:
  ISTOK_REPO             GitHub repository
  ISTOK_VERSION          Release version, default: latest
  ISTOK_INSTALL_DIR      Installation directory, default: ~/.local/bin

Examples:
  curl -fsSL https://get.istok.sh | sh

  curl -fsSL https://get.istok.sh | sh -s -- --dry-run

  ISTOK_VERSION=v0.2.0 \
    curl -fsSL https://get.istok.sh | sh
EOF
}

fail() {
  printf '\nerror: %s\n' "$*" >&2
  exit 1
}

info() {
  printf '%s\n' "$*"
}

debug() {
  if [ "$DRY_RUN" -eq 1 ]; then
    printf '  [dry-run] %s\n' "$*"
  fi
}

print_command() {
  printf '  [dry-run]'

  for arg in "$@"; do
    printf ' <%s>' "$arg"
  done

  printf '\n'
}

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

require_command() {
  command_exists "$1" || fail "Required command not found: $1"
}

detect_os() {
  system="$(uname -s)"

  case "$system" in
    Linux)
      printf 'linux'
      ;;
    Darwin)
      printf 'darwin'
      ;;
    *)
      fail "Unsupported operating system: $system"
      ;;
  esac
}

detect_arch() {
  machine="$(uname -m)"

  case "$machine" in
    x86_64 | amd64)
      printf 'amd64'
      ;;
    arm64 | aarch64)
      printf 'arm64'
      ;;
    *)
      fail "Unsupported architecture: $machine"
      ;;
  esac
}

sha256() {
  file="$1"

  if command_exists sha256sum; then
    sha256sum "$file" | awk '{ print $1 }'
    return
  fi

  if command_exists shasum; then
    shasum -a 256 "$file" | awk '{ print $1 }'
    return
  fi

  fail "SHA-256 tool not found. Install sha256sum or shasum."
}

download() {
  url="$1"
  output="$2"

  if [ "$DRY_RUN" -eq 1 ]; then
    print_command \
      curl \
      --fail \
      --silent \
      --show-error \
      --location \
      --proto '=https' \
      --tlsv1.2 \
      "$url" \
      --output "$output"

    return
  fi

  curl \
    --fail \
    --silent \
    --show-error \
    --location \
    --proto '=https' \
    --tlsv1.2 \
    "$url" \
    --output "$output"
}

parse_args() {
  while [ "$#" -gt 0 ]; do
    case "$1" in
      --dry-run)
        DRY_RUN=1
        shift
        ;;

      --version)
        [ "$#" -ge 2 ] || fail "--version requires a value"
        VERSION="$2"
        shift 2
        ;;

      --install-dir)
        [ "$#" -ge 2 ] || fail "--install-dir requires a value"
        INSTALL_DIR="$2"
        shift 2
        ;;

      -h | --help)
        usage
        exit 0
        ;;

      *)
        fail "Unknown option: $1"
        ;;
    esac
  done
}

parse_args "$@"

require_command uname
require_command curl
require_command tar
require_command awk

OS="$(detect_os)"
ARCH="$(detect_arch)"

ASSET="istok_${OS}_${ARCH}.tar.gz"

if [ "$VERSION" = "latest" ]; then
  RELEASE_URL="https://github.com/${REPO}/releases/latest/download"
else
  RELEASE_URL="https://github.com/${REPO}/releases/download/${VERSION}"
fi

ARCHIVE_URL="${RELEASE_URL}/${ASSET}"
CHECKSUMS_URL="${RELEASE_URL}/checksums.txt"

if [ "$DRY_RUN" -eq 1 ]; then
  TMP_DIR="${TMPDIR:-/tmp}/istok-install.<tmp>"
else
  TMP_DIR="$(mktemp -d)"
fi

ARCHIVE_PATH="${TMP_DIR}/${ASSET}"
CHECKSUMS_PATH="${TMP_DIR}/checksums.txt"
BINARY_PATH="${TMP_DIR}/istok"
TARGET_PATH="${INSTALL_DIR}/istok"

cleanup() {
  if [ "$DRY_RUN" -eq 1 ]; then
    return
  fi

  rm -rf "$TMP_DIR"
}

trap cleanup EXIT INT TERM

printf '\n'
info "Istok installer"
info ""

if [ "$DRY_RUN" -eq 1 ]; then
  info "DRY RUN — no files will be downloaded or changed"
  info ""
fi

info "Configuration:"
info "  repository:      ${REPO}"
info "  version:         ${VERSION}"
info "  platform:        ${OS}/${ARCH}"
info "  asset:           ${ASSET}"
info "  install dir:     ${INSTALL_DIR}"
info ""

if [ "$DRY_RUN" -eq 1 ]; then
  info "Release:"
  info "  archive:         ${ARCHIVE_URL}"
  info "  checksums:       ${CHECKSUMS_URL}"
  info ""

  info "Plan:"
  info ""

  debug "1. Create temporary directory"
  print_command mktemp -d

  info ""
  debug "2. Download release archive"
  download "$ARCHIVE_URL" "$ARCHIVE_PATH"

  info ""
  debug "3. Download checksums"
  download "$CHECKSUMS_URL" "$CHECKSUMS_PATH"

  info ""
  debug "4. Verify SHA-256 checksum"
  info "  [dry-run] find '${ASSET}' in checksums.txt"
  info "  [dry-run] calculate SHA-256 for '${ARCHIVE_PATH}'"
  info "  [dry-run] compare expected and actual checksums"

  info ""
  debug "5. Extract release archive"
  print_command tar -xzf "$ARCHIVE_PATH" -C "$TMP_DIR"

  info ""
  debug "6. Verify extracted binary"
  info "  [dry-run] require file '${BINARY_PATH}'"

  info ""
  debug "7. Create installation directory"
  print_command mkdir -p "$INSTALL_DIR"

  info ""
  debug "8. Install binary"
  print_command install -m 0755 "$BINARY_PATH" "$TARGET_PATH"

  info ""
  debug "9. Verify installed version"
  print_command "$TARGET_PATH" version

  info ""
  debug "10. Remove temporary directory"
  print_command rm -rf "$TMP_DIR"

  info ""

  case ":$PATH:" in
    *":${INSTALL_DIR}:"*)
      info "PATH:"
      info "  ${INSTALL_DIR} is already in PATH"
      ;;
    *)
      info "PATH:"
      info "  ${INSTALL_DIR} is not currently in PATH"
      info ""
      info "  You may need to add:"
      info ""
      info "    export PATH=\"${INSTALL_DIR}:\$PATH\""
      ;;
  esac

  info ""
  info "Dry run complete."
  exit 0
fi

info "Downloading ${ASSET}..."
download "$ARCHIVE_URL" "$ARCHIVE_PATH"

info "Downloading checksums..."
download "$CHECKSUMS_URL" "$CHECKSUMS_PATH"

EXPECTED_CHECKSUM="$(
  awk -v asset="$ASSET" '
    $2 == asset || $2 == "*" asset {
      print $1
      exit
    }
  ' "$CHECKSUMS_PATH"
)"

[ -n "$EXPECTED_CHECKSUM" ] ||
  fail "Checksum for ${ASSET} was not found."

ACTUAL_CHECKSUM="$(sha256 "$ARCHIVE_PATH")"

[ "$EXPECTED_CHECKSUM" = "$ACTUAL_CHECKSUM" ] ||
  fail "Checksum verification failed."

info "Checksum verified."

tar -xzf "$ARCHIVE_PATH" -C "$TMP_DIR"

[ -f "$BINARY_PATH" ] ||
  fail "Release archive does not contain the istok binary."

mkdir -p "$INSTALL_DIR"

install -m 0755 "$BINARY_PATH" "$TARGET_PATH"

info ""
info "Istok installed successfully:"
info "  ${TARGET_PATH}"
info ""

"$TARGET_PATH" version

case ":$PATH:" in
  *":${INSTALL_DIR}:"*)
    ;;
  *)
    info ""
    info "${INSTALL_DIR} is not currently in PATH."
    info ""
    info "Add it to your shell configuration:"
    info ""
    info "  export PATH=\"${INSTALL_DIR}:\$PATH\""
    info ""
    ;;
esac