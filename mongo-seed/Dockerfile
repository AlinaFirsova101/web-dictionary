FROM mongo

COPY init.json /init.json
CMD mongoimport --host mongo --db terms --collection terms --type json --file /init.json --jsonArray --drop