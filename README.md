docker run -p 8080:80 -v $PWD/index.html:/usr/share/nginx/html/index.html nginx
docker run -p 5984:5984 -v $PWD/data/pouchdb/:/pouchdb/ scttmthsn/pouchdb-server


- Change defintions from Hash<type, defintion> to Array<
