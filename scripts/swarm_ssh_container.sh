docker exec -it In2ItChicago_$1.1.$(docker service ps -f 'name=In2ItChicago_$1.1' In2ItChicago_$1 -q --no-trunc | head -n1) /bin/bash