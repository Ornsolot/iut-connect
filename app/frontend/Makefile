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
ENV	= $(DIR)/.env
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
PORT	= $(shell sed -nr "/^\[$(TRG)\]/ { :l /^Port[ ]*=/ { s/[^=]*=[ ]*//; p; q;}; n; b l;}" $(INI))
IMG	= node
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
.DEFAULT_TARGET: compose

## create .env. file.
#####################
env:
	@echo "NEXT_PUBLIC_BACKEND='http://$(patsubst '%',%, $(shell sed -nr "/^\[network\]/ { :l /^Lan[ ]*=/ { s/[^=]*=[ ]*//; p; q;}; n; b l;}" $(INI))):$(shell sed -nr "/^\[backend\]/ { :l /^Port[ ]*=/ { s/[^=]*=[ ]*//; p; q;}; n; b l;}" $(INI))/'" > ${ENV}
	@echo "🔮 \033[1menv.local's ${EXE} generated\033[0m"

## Rule to create the docker's container (from local source).
#############################################################
build: clean env
## create Dockerfile.
#####################
	@echo "FROM $(IMG):$(TAG) as Deps" > ${EXE}
	@echo "WORKDIR /app" >> ${EXE}
	@echo "COPY $(DIR)/package.json $(DIR)/yarn.lock ./" >> ${EXE}
	@echo "\nRUN apk add --no-cache libc6-compat && yarn install --immutable --immutable-cache --refresh-lockfile --check-cache --check-resolutions --inline-builds" >> ${EXE}

	@echo "\nFROM $(IMG):$(TAG) as Builder" >> ${EXE}
	@echo "WORKDIR /app" >> ${EXE}
	@echo "COPY --from=Deps /app/node_modules ./node_modules" >> ${EXE}
	@echo "COPY $(DIR) ." >> ${EXE}
	@echo "\nENV NEXT_TELEMETRY_DISABLED 1" >> ${EXE}
	@echo "RUN yarn build" >> ${EXE}

	@echo "\nFROM $(IMG):$(TAG) as Runner" >> ${EXE}
	@echo "WORKDIR /app" >> ${EXE}
	@echo "ENV NEXT_TELEMETRY_DISABLED 1" >> ${EXE}
	@echo "ENV NODE_ENV production" >> ${EXE}
	@echo "ENV HOSTNAME \"0.0.0.0\"" >> ${EXE}
	@echo "ENV PORT 3000" >> ${EXE}
	@echo "RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs && mkdir .next && chown nextjs:nodejs .next" >> ${EXE}
	@echo "USER nextjs" >> ${EXE}
	@echo "COPY --from=Builder /app/public ./public" >> ${EXE}
	@echo "COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static" >> ${EXE}
	@echo "COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./" >> ${EXE}
	@echo "EXPOSE 3000" >> ${EXE}
	@echo "CMD [\"node\", \"server.js\"]" >> ${EXE}

	@echo "🔮 \033[1m${TRG}'s ${EXE} generated\033[0m"

## build the container.
#######################
	@docker build --network host -t $(NAME) . -f ${EXE}
	@docker run -v $(ENV):/app/.env -p ${HOST}:${PORT}:$(PORT)/tcp -d --restart unless-stopped --name $(NAME) $(NAME)

	@echo "🔮 \033[1m$(NAME)'s switch on $(CARD):\033[0m http://$(HOST):$(PORT)/""\033[0m"

## Rule to clean source code files (from local source).
#######################################################
clean:
	@echo "Killer Clean first detergent, switch on!\nWipe za $(TRG) !"
	@-docker stop ${NAME} >> /dev/null 2>> /dev/null || true
	@-docker rm -fv ${NAME} $(OUTPUT)
	@-rm -rf $(EXE) $(ENV) $(DIR)/node_modules $(DIR)/.yarn $(DIR)/.next $(OUTPUT)

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
compose: env
	@echo "    $(TRG):" >> $(EXE)
	@echo "        depends_on:">> $(EXE)
	@echo "            - backend">> $(EXE)
	@echo "        image: $(HUB)/$(NAME):latest" >> $(EXE)
	@echo "        restart: always" >> $(EXE)
	@echo "        container_name: $(NAME)" >> $(EXE)
	@echo "        ports:" >> $(EXE)
	@echo "            - $(HOST):$(PORT):3000" >> $(EXE)
	@echo "        volumes:" >> $(EXE)
	@echo "            - ./app/$(TRG)/src/.env:/app/.env" >> $(EXE)

	@echo "🔮 \033[1m$(NAME)'s switch on $(CARD):\033[0m http://$(HOST):$(PORT)/""\033[0m"
