#!/bin/sh
rm -f dist/*
npm run build
# cp dist/index.js dist/index.js.bak
# cp dist/index.css dist/index.css.bak
cp dist/index.js dist/thesaurus.js
cp dist/index.css dist/thesaurus.css
gzip -9 -N dist/thesaurus.js
gzip -9 -N dist/thesaurus.css
cp dist/index.js dist/thesaurus.js
cp dist/index.css dist/thesaurus.css
# mv dist/index.js.bak dist/index.js
# mv dist/index.css.bak dist/index.css
scp dist/thesaurus.*
# openssl dgst -sha256 index.js.gz


system=$(uname)
if [ "$system"x = "Linux"x ]; then
    echo "检测到使用 Linux 系统"
    release_md5=$(md5sum dist/index.js | awk '{print $1}')
elif [ "$system"x = "Darwin"x ]; then
    echo "检测到使用 Mac 系统"
    release_md5=$(md5 dist/index.js | awk '{print $4}')
else
    echo "不知道是什么系统"
fi
echo $release_md5
cp dist/index.js dist/thesaurus_admin_${release_md5}.js
cp dist/index.css dist/thesaurus_admin_${release_md5}.css
gzip -9 -N dist/thesaurus_admin_${release_md5}.js
gzip -9 -N dist/thesaurus_admin_${release_md5}.css
cp dist/index.js dist/thesaurus_admin_${release_md5}.js
cp dist/index.css dist/thesaurus_admin_${release_md5}.css
# mv dist/index.js.bak dist/index.js
# mv dist/index.css.bak dist/index.css
scp dist/thesaurus_admin*
# openssl dgst -sha256 index.js.gz
curl -X POST --header 'Content-Type: application/x-www-form-urlencoded' --header 'Accept: application/json' --header 'Authentication-Token: GWVznMRLpFDi4xvfF2yw' -d "project=thesaurus_admin&md5=${release_md5}" 'https:///api/admin/v1/react_deploy'
