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
VERSION	= 4.8.1
MEMORY	= 256M
UPLOAD	= 2048M
PORT	= $(shell sed -nr "/^\[$(TRG)\]/ { :l /^Port[ ]*=/ { s/[^=]*=[ ]*//; p; q;}; n; b l;}" $(INI))
IMG		= alpine
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
	@echo "FROM $(IMG):$(TAG)\n" > ${EXE}
	@echo "ENV PHP_CLI_SERVER_WORKERS=4\n" >> ${EXE}
	@echo "RUN echo '@community http://nl.alpinelinux.org/alpine/v3.14/community' >> /etc/apk/repositories && apk update && apk upgrade && apk add wget ca-certificates php8@community php8-session@community php8-pgsql@community tini && wget https://github.com/vrana/adminer/releases/download/v$(VERSION)/adminer-$(VERSION).php -O /srv/index.php && ln -s /usr/bin/php8 /usr/bin/php && apk del wget ca-certificates && rm -rf /var/cache/apk/*\n" >> $(EXE)
	@echo "WORKDIR /srv" >> ${EXE}
	@echo "EXPOSE 80\n" >> ${EXE}
	@echo "ENTRYPOINT [ \"/sbin/tini\", \"--\" ]" >> ${EXE}
	@echo "CMD /usr/bin/php -d memory_limit=${MEMORY} -d upload_max_filesize=${UPLOAD} -d post_max_size=${UPLOAD} -S 0.0.0.0:80" >> ${EXE}
	@echo "🔮 \033[1m${TRG}'s ${EXE} generated\033[0m"

## build the container.
#######################
	@-docker build -t $(NAME) . -f $(EXE)
	@-docker run -p ${HOST}:${PORT}:80/tcp -d --restart unless-stopped --name $(NAME) $(NAME)
	
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
	@echo "            - dbms">> $(EXE)
	@echo "        image: $(HUB)/$(NAME):latest" >> $(EXE)
	@echo "        restart: always" >> $(EXE)
	@echo "        container_name: $(NAME)" >> $(EXE)
	@echo "        environment:" >> $(EXE)
	@echo "            PHP_CLI_SERVER_WORKERS: 4" >> $(EXE)
	@echo "        ports:" >> $(EXE)
	@echo "            - $(HOST):$(PORT):80" >> $(EXE)

	@echo "🔮 \033[1m$(NAME)'s switch on $(CARD):\033[0m http://$(HOST):$(PORT)/""\033[0m"
