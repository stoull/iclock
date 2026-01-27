#!/bin/bash

usage() {
	echo "Usage: $0 [path/to/ahut.site_nginx.zip]"
	echo
	echo "If no path is given the script will look for ./ahut.site_nginx.zip in the current directory."
	exit 1
}

if [[ "$1" == "-h" || "$1" == "--help" ]]; then
	usage
fi

ZIP_PATH="$1"

if [[ -z "$ZIP_PATH" ]]; then
	if [[ -f "./ahut.site_nginx.zip" ]]; then
		ZIP_PATH="./ahut.site_nginx.zip"
	else
		FOUND=$(find . -maxdepth 1 -type f -name 'ahut.site_nginx.zip' -print -quit)
		if [[ -n "$FOUND" ]]; then
			ZIP_PATH="$FOUND"
		else
			echo "No zip specified and ahut.site_nginx.zip not found in current directory."
			usage
		fi
	fi
fi

if [[ ! -f "$ZIP_PATH" ]]; then
	echo "Zip file not found: $ZIP_PATH"
	exit 2
fi

read -s -p "Enter sudo password: " PASSWORD
echo

zip -d "$ZIP_PATH" "__MACOSX*" >/dev/null 2>&1 || true

scp -v "$ZIP_PATH" hut@ahut.site:~/ || { echo "scp failed"; unset PASSWORD; exit 3; }

ssh hut@ahut.site "cd ~; SUDO_PASSWORD=$PASSWORD ./scripts/update_nginx_cert.sh;"

unset PASSWORD