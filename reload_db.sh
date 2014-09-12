for COLLECTION in tasks users
do
  echo
  echo "# <$COLLECTION>"
  node_modules/koast/server/bin/koast reload --env=local --col=$COLLECTION --src=server/data/$COLLECTION.json
done

