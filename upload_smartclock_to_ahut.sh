#!/bin/bash
read -s -p "Enter sudo password: " PASSWORD
echo
npm run build
zip -r ./smartclock_build.zip ./build
zip -d ./smartclock_build.zip "__MACOSX*"
scp ./smartclock_build.zip hut@ahut.site:~/
ssh hut@ahut.site "cd ~; SUDO_PASSWORD=$PASSWORD ./update_smartclock.sh;"