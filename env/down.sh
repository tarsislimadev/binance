sudo rm -rf data/

docker-compose down --remove-orphans --rmi all $@  
