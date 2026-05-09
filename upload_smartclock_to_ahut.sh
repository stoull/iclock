#!/bin/bash
read -s -p "Enter sudo password: " PASSWORD
echo
npm run build

if [ ! -d "./build" ]; then
    echo "Error: ./build directory not found. Stop deployment."
    exit 1
fi

zip -r ./smartclock_build.zip ./build
if zipinfo -1 ./smartclock_build.zip "__MACOSX*" >/dev/null 2>&1; then
    zip -d ./smartclock_build.zip "__MACOSX*" >/dev/null
else
    echo "No __MACOSX entries found. Skip cleanup."
fi
scp ./smartclock_build.zip hut@ahut.site:~/
ssh hut@ahut.site "cd ~; SUDO_PASSWORD=$PASSWORD ./scripts/update_smartclock.sh;"
unset PASSWORD