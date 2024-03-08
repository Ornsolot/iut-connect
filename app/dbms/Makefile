#########################################
## PROJECT      : IUT-Connect          ##
## DATE         : 2023                 ##
## ENVIRONEMENT : Unix                 ##
## DEPENDENCIES : Docker               ##
## AUTHOR       : MONFORT Clément      ##
#########################################

######################
## PARSING VARIABLE ##
######################

## Name and Path of the executable/project.
###########################################
NAME	= ${PROJ}_${TRG}
DIR	= ./src
EXE	= dockerfile
TRG	= $(shell basename $(shell pwd))

##################
## ENV VARIABLE ##
##################

## [NETWORK]
############
HOST	= $(patsubst '%',%, $(shell sed -nr "/^\[network\]/ { :l /^$(patsubst '%',%, $(shell sed -nr "/^\[${TRG}\]/ { :l /^Host[ ]*=/ { s/[^=]*=[ ]*//; p; q;}; n; b l;}" $(INI)))[ ]*=/ { s/[^=]*=[ ]*//; p; q;}; n; b l;}" $(INI)))
CARD	= $(patsubst '%',%, $(shell sed -nr "/^\[network\]/ { :l /^Card[ ]*=/ { s/[^=]*=[ ]*//; p; q;}; n; b l;}" $(INI)))
HUB	= $(patsubst '%',%, $(shell sed -nr "/^\[network\]/ { :l /^User[ ]*=/ { s/[^=]*=[ ]*//; p; q;}; n; b l;}" $(INI)))

## [DOCKER]
###########
BASE	= $(shell sed -nr "/^\[database\]/ { :l /^Name[ ]*=/ { s/[^=]*=[ ]*//; p; q;}; n; b l;}" $(INI))
USER	= $(shell sed -nr "/^\[database\]/ { :l /^User[ ]*=/ { s/[^=]*=[ ]*//; p; q;}; n; b l;}" $(INI))
PSWD	= $(shell sed -nr "/^\[database\]/ { :l /^Pswd[ ]*=/ { s/[^=]*=[ ]*//; p; q;}; n; b l;}" $(INI))
PORT	= $(shell sed -nr "/^\[$(TRG)\]/ { :l /^Port[ ]*=/ { s/[^=]*=[ ]*//; p; q;}; n; b l;}" $(INI))
IMG	= postgres
SQL	= ./app/$(TRG)/src/table.sql
TAG	= alpine

######################
## MAKEFILE VARIABLE #
######################
MAKEFLAGS	+= --no-print-directory
OUTPUT		= >> /dev/null 2>> ${LOG} || true

###################
## MAKEFILE RULES #
###################
.PHONY: build clean purge upload compose
.DEFAULT_TARGET: build

## Rule to create the docker's container (from local source).
#############################################################
build: clean
## create Dockerfile.
#####################
	@echo "FROM $(IMG):$(TAG)\n" > ${EXE}
	@echo "COPY ${SQL} /docker-entrypoint-initdb.d/\n" >> ${EXE}
	@echo "ENV POSTGRES_PASSWORD=${PSWD}\t\\\\" >> ${EXE}
	@echo "\tPOSTGRES_PORT=5432\t\t\t\t\t\\\\" >> ${EXE}
	@echo "\tPOSTGRES_USER=${USER}\t\t\\\\" >> ${EXE}
	@echo "\tPOSTGRES_DB=${BASE}\t\t\t\\\\" >> ${EXE}
	@echo "\tPGDATA=/var/lib/postgresql/data\t\t\\\\" >> ${EXE}
	@echo "\tLANG=en_US.UTF-8\n" >> ${EXE}
	@echo "EXPOSE 5432\n" >> ${EXE}
	@echo "🔮 \033[1m${TRG}'s ${EXE} generated\033[0m"

## build the container.
#######################
	@cd ../../ && docker build -t ${NAME} . -f ./app/$(TRG)/$(EXE) && docker run -v ./data/:/var/lib/postgresql/data/ -p ${HOST}:${PORT}:5432/tcp -d --restart unless-stopped --name ${NAME} ${NAME}
	
	@echo "🔮 \033[1m$(NAME)'s switch on $(CARD):\033[0m http://$(HOST):$(PORT)/""\033[0m"

## Rule to clean source code files (from local source).
#######################################################
clean:
	@echo "Killer Clean first detergent, switch on!\nWipe za $(TRG) !"
	@-docker stop ${NAME} $(OUTPUT)
	@-docker rm -fv ${NAME} $(OUTPUT)
	@-rm -f $(EXE) $(OUTPUT)

## Rule to purge the project, IT REMOVE EVERYTHING AT THE EXEPTION OF THE SOURCE CODE.
######################################################################################
purge: clean
	@-docker rmi -f ${NAME} $(OUTPUT)
	@-sudo rm -fR ../../data $(OUTPUT)

## Rule to upload the docker's image with dockerfile (new external source).
###########################################################################
upload:
	@docker tag ${NAME} ${HUB}/${NAME}:latest
	@docker push ${HUB}/${NAME}:latest

## Rule to create the docker-compose (from external source).
############################################################
compose:
	@echo "    $(TRG):" >> $(EXE)
	@echo "        image: $(HUB)/$(NAME):latest" >> $(EXE)
	@echo "        restart: always" >> $(EXE)
	@echo "        container_name: $(NAME)" >> $(EXE)
	@echo "        environment:" >> $(EXE)
	@echo "            POSTGRES_PASSWORD: $(PSWD)" >> $(EXE)
	@echo "            POSTGRES_PORT: ${PORT}" >> ${EXE}
	@echo "            POSTGRES_USER: ${USER}" >> ${EXE}
	@echo "            POSTGRES_DB: ${BASE}" >> ${EXE}
	@echo "            PGDATA: /var/lib/postgresql/data" >> ${EXE}
	@echo "            LANG: en_US.UTF-8" >> ${EXE}
	@echo "        ports:" >> $(EXE)
	@echo "            - $(HOST):$(PORT):5432" >> $(EXE)
	@echo "        volumes:" >> $(EXE)
	@echo "            - ./data/:/var/lib/postgresql/data/" >> $(EXE)

	@echo "🔮 \033[1m$(NAME)'s switch on $(CARD):\033[0m http://$(HOST):$(PORT)/""\033[0m"
