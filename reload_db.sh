for COLLECTION in tasks
do
  echo
  echo "# <$COLLECTION>"
  node_modules/koast/server/bin/koast reload --env=staging --col=$COLLECTION --src=server/data/$COLLECTION.json
done

