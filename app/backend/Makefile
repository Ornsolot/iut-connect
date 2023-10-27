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
DIR		= ./src
EXE		= dockerfile
TRG		= $(shell basename $(shell pwd))

##################
## ENV VARIABLE ##
##################

## [NETWORK]
############
HOST	= $(patsubst '%',%, $(shell sed -nr "/^\[network\]/ { :l /^$(patsubst '%',%, $(shell sed -nr "/^\[${TRG}\]/ { :l /^Host[ ]*=/ { s/[^=]*=[ ]*//; p; q;}; n; b l;}" $(INI)))[ ]*=/ { s/[^=]*=[ ]*//; p; q;}; n; b l;}" $(INI)))
CARD	= $(patsubst '%',%, $(shell sed -nr "/^\[network\]/ { :l /^Card[ ]*=/ { s/[^=]*=[ ]*//; p; q;}; n; b l;}" $(INI)))
HUB		= $(patsubst '%',%, $(shell sed -nr "/^\[network\]/ { :l /^User[ ]*=/ { s/[^=]*=[ ]*//; p; q;}; n; b l;}" $(INI)))

## [DOCKER]
###########
PORT	= $(shell sed -nr "/^\[$(TRG)\]/ { :l /^Port[ ]*=/ { s/[^=]*=[ ]*//; p; q;}; n; b l;}" $(INI))
USER	= go
IMG		= golang
TAG		= latest

######################
## MAKEFILE VARIABLE #
######################
MAKEFLAGS	+= --no-print-directory
OUTPUT		= >> /dev/null 2>> ${LOG} || true

###################
## MAKEFILE RULES #
###################
.PHONY: build clean purge upload compose
.DEFAULT_TARGET: compose

## Rule to create the docker's container (from local source).
#############################################################
build: clean
## create Dockerfile.
#####################
	@echo "FROM $(IMG):alpine AS Build\n" > ${EXE}

	@echo "WORKDIR /app/${TRG}/src/\nCOPY ./app/${TRG}/src/ .\n" >> ${EXE}

	@echo "RUN apk update && apk add --no-cache git ca-certificates && update-ca-certificates && \\" >> ${EXE}
	@echo "\tadduser --disabled-password --gecos \"\" --home \"/nonexistent\" --shell \"/sbin/nologin\" --no-create-home --uid \"65532\" \"${USER}\" && \\" >> ${EXE}
	@echo "\tgo mod download && go mod verify && go mod tidy && CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o ../${TRG}\n" >> ${EXE}

	@echo "FROM scratch\n" >> ${EXE}

	@echo "WORKDIR /app/${TRG}/" >> ${EXE}
	@echo "COPY --from=Build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/" >> ${EXE}
	@echo "COPY --from=Build /etc/passwd /etc/passwd" >> ${EXE}
	@echo "COPY --from=Build /etc/group /etc/group" >> ${EXE}
	@echo "COPY --from=Build /app/${TRG}/${TRG} /app/${TRG}/\n" >> ${EXE}

	@echo "USER ${USER}:${USER}\n" >> ${EXE}

	@echo "EXPOSE $(PORT)" >> ${EXE}
	@echo "CMD [ \"./${TRG}\" ]" >> ${EXE}

	@echo "🔮 \033[1m${TRG}'s ${EXE} generated\033[0m"

## build the docker.
####################
	@-cd ../../ && docker build -t $(NAME) . -f ./app/${TRG}/${EXE} && docker run -v ./env/:/env/ -p ${HOST}:${PORT}:$(PORT)/tcp -d --restart unless-stopped --name $(NAME) $(NAME)
	
	@echo "🔮 \033[1m$(NAME)'s switch on $(CARD):\033[0m http://$(HOST):$(PORT)/""\033[0m"

## Rule to clean source code files (from local source).
#######################################################
clean:
	@echo "Killer Clean first detergent, switch on!\nWipe za $(TRG) !"
	@-docker stop ${NAME} >> /dev/null 2>> /dev/null || true
	@-docker rm -fv ${NAME} $(OUTPUT)
	@-rm -f $(EXE) $(OUTPUT)

## Rule to purge the project, IT REMOVE EVERYTHING AT THE EXEPTION OF THE SOURCE CODE.
######################################################################################
purge: clean
	@-docker rmi -f ${NAME} $(OUTPUT)

## Rule to upload the docker's image with dockerfile (new external source).
###########################################################################
upload:
	@docker tag ${NAME} ${HUB}/${NAME}:latest
	@docker push ${HUB}/${NAME}:latest

## Rule to create the docker-compose (from external source).
############################################################
compose:
	@echo "    $(TRG):" >> $(EXE)
	@echo "        depends_on:">> $(EXE)
	@echo "            - adminer">> $(EXE)
	@echo "        image: $(HUB)/$(NAME):latest" >> $(EXE)
	@echo "        restart: always" >> $(EXE)
	@echo "        container_name: $(NAME)" >> $(EXE)
	@echo "        ports:" >> $(EXE)
	@echo "            - $(HOST):$(PORT):$(PORT)" >> $(EXE)
	@echo "        volumes:" >> $(EXE)
	@echo "            - ./env/:/env/" >> $(EXE)

	@echo "🔮 \033[1m$(NAME)'s switch on $(CARD):\033[0m http://$(HOST):$(PORT)/""\033[0m"
