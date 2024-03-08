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

## Name of the umbrella & Path of the service(s) et env folder.
#################################################################
EXE	= docker-compose.yml
TRG	= iut-connect
DIR	= ./app
ENV	= ./env

## Name of the file(s) to parse for initialisation of each services.
####################################################################
INI	= $(ENV)/$(TRG).toml
LOG	= $(ENV)/$(TRG).log

## Git variables.
#################
BRANCH	= $(shell git rev-parse --abbrev-ref HEAD)
COMMIT	= $(shell git rev-parse --abbrev-ref HEAD)
MSG	= Neuron activation

##########################
## COMPILATION VARIABLE ##
##########################

## Sources folder of the target(s) service(s).
##############################################
SRC	= $(filter-out $(LIST), $(shell grep -so '\[.*\]' $(INI) | sed 's/"//g' | sed 's/\[//g' | sed 's/\]//g'))

## Rule name, delete each container(s) & image(s).
##################################################
CLN	= $(addprefix clean_, $(SRC))

## Rule name, create & build each container(s) images with docker-compose.yml.
##############################################################################
CMP	= $(addprefix compose_, $(SRC))

## [PANIC] Rule name, purge the executable(s) / generated file(s)
#################################################################
PRG	= $(addprefix purge_, $(SRC))

## Rule name, upload each prod images.
######################################
UPD	= $(addprefix upload_, $(SRC))

########################
## ARGUMENTS VARIABLE ##
########################

## [BLACKLIST] List of none derivable applications like the dbms, ...
##################################################################### 
LIST	= network mailer database

## [GLOBAl] Networks variables.
###############################
CARD	= $(shell ip route | grep -m1 default | cut -d ' ' -f5)
HOST	= "[mailer]=null:25\n[dbms]=Wan:12000\n[adminer]=Wan:8080\n[backend]=Lan:12001\n[frontend]=Wan:443\n"
WAN	= $(shell ip route | grep $(CARD) | tail +2 | cut -d ' ' -f9)
LAN	= $(shell hostname -i)
## Use your dockerhub account or default to my account (may breack stuff in the longue run, change ornsolot for an official account)
USR	= $(or $(shell docker info | sed '/Username:/!d;s/.* //'), "ornsolot")

## [MAILER] mailer variables.
#############################
SERVER	= smtp.kaz.bzh

## DBMS initialisations values.
###############################
USER	= IUTConnect_API
PSWD	= U@EtE^MLy?ia1)H
NAME	= IUTConnect
KEY 	= KQuvIoaqRRB0GKJY

## BACKEND initialisations values.
##################################
MAIL	= bluewave@kaz.bzh
PWD	= _norpUpgaw1_
KEY	= SeKr3T

#######################
## MAKEFILE VARIABLE ##
#######################
MAKEFLAGS	+= --no-print-directory
OUTPUT		= >> /dev/null 2>> ${LOG} || true

####################
## MAKEFILE RULES ##
####################
.DEFAULT_TARGET: help
.PHONY: all env help build clean purge $(SRC) $(CLN) $(PRG) $(UPD) $(CMP)

all: env
	@make -C . compose

## rule to create the environnement file needed to create the docker's container(s).
####################################################################################
env:
	@mkdir -p $(ENV)
	@echo "# Persky Bird list : </> don't use them !" > $(INI)
## Globale & debug values.
##########################
	@echo "[network]\nUser='$(USR)'\nHost='$(CARD)'\nWan='$(WAN)'\nLan='$(LAN)'\n"  >> $(INI)
	@echo "[mailer]\nServer='$(SERVER)'\nMail='$(MAIL)'\nPswd='$(PWD)'\nPort=$(shell echo ${HOST} | grep 'mailer' | cut -d ':' -f2)\n" >> $(INI)

## None derivable applications.
###############################
	@echo "[database]\nUser='$(USER)'\nPswd='$(PSWD)'\nName='$(NAME)'\nKey='$(KEY)'\n" >> $(INI)

## Derivable applications.
##########################
	@$(foreach src, $(filter-out $(LIST), $(shell find $(DIR) -mindepth 1 -maxdepth 1 -not -empty -type d -printf '%f\n' | sort -k 2)), echo "[${src}]\nImage='IUT-Connect_${src}:latest'\nHost='$(shell echo ${HOST} | grep ${src} | cut -d '=' -f2 | cut -d ':' -f1)'\nPort=$(shell echo ${HOST} | grep ${src} | cut -d ':' -f2)\n" >> $(INI);)

## Rule to push changes to current branche.
## IT DOES NOT KNOW HOW TO SORT OUT YOUR MERGE ISSUE.
#####################################################
push:
	@git pull $(OUTPUT)
	@git add --all $(OUTPUT)
	@echo "🔮 \033[1mBranche $(COMMIT) updated with:\033[0m"
	@git commit -m "$(MSG)"
	@git push $(OUTPUT)

## Rule to show to show the makefile instructions.
##################################################
help:
	@clear

	@echo "📦 \033[1mDependencies :\033[0m"
	@echo "\t\e]8;;https://docs.docker.com/desktop/install/linux-install/\aDocker engine\e]8;;\a"
	@echo "\tnet-tools\n"

	@echo "🔮 \033[1mTips :\033[0m"
	@echo "\t💠 Use the setup script if Docker is a Persky Bird !"
	@echo "\t💠 Both the Docker's image(s) and container(s) are named after the service(s).\n"

	@echo "🔮 \033[1mmake all :\033[0m"
	@echo "\tCreate the Makefile's initialisation file : \033[1m$(INI)\033[0m."
	@echo "\tCreate containers & volumes from prod images.\n"

	@echo "🔮 \033[1mmake env :\033[0m"
	@echo "\t💠 Create the Makefile's initialisation file : \033[1m$(INI)\033[0m."
	@echo "\t💠 To add your own application:\tYou must have a folder named after the application in \033[1m$(DIR)\033[0m."
	@echo "\t💠 Witch has the source code ($(DIR)/name/src/) and a Makefile within.\n"

	@echo "🔮 \033[1mmake help :\033[0m"
	@echo "\tDisplay the $(TRG) documentation (you are here).\n"

	@echo "🔮 \033[1mmake push :\033[0m"
	@echo "\tpush your current changes to the current branche."

	@echo "🔮 \033[1mmake archive BRANCH="BRANCH TO FUSE" MSG="Detail of your commit" :\033[0m"
	@echo "\tpush your current changes to the designated branche."

	@echo "🔮 \033[1mmake clean or $(CLN) :\033[0m"
	@echo "\tRemove all Docker's containers and volumes of the applications handled by the Makefile.\n"

	@echo "🔮 \033[1mmake purge :\033[0m"
	@echo "\tRemove all Docker's images, containers and volumes of the applications handled by the Makefile.\n"

	@echo "🔮 \033[1mmake build or $(SRC) :\033[0m"
	@echo "\t💠 DEV BUILD ONLY !"
	@echo "\tBuild and launch the Docker's Images, containers and volumes of the application.\n"

	@echo "🔮 \033[1mmake build or $(UPD) :\033[0m"
	@echo "\tUpload the images of the project on Docker HUB to be used by the compose.\n"

	@echo "🔮 \033[1mmake compose or $(CMP) :\033[0m"
	@echo "\tCreate containers & volumes from prod images.\n"

## Global Rule to create all docker's container(s) (from local source).
#######################################################################
build: $(SRC)

## Global Rule to clean source code files (from local source).
##############################################################
clean: $(CLN)
	@echo "y\n" | docker system prune --volumes $(OUTPUT)
	@-rm -f $(EXE) $(ENV)/*log*

## Global rule to purge the project, IT REMOVE EVERYTHING AT THE EXEPTION OF THE SOURCE CODE.
#############################################################################################
purge: $(PRG)
	@echo "🧹 Killer Clean third detergent.\nWipe za Dusto !"
	@echo docker system prune -fa --volumes $(OUTPUT)
	@-rm -Rf $(ENV) $(EXE)

## Global rule to upload all docker's image(s) with dockerfile (new external source).
#####################################################################################
upload: $(UPD)

## Global rule to create the HEADER of the docker-compose file.
###############################################################
service:
	@echo "version: '3.8'\n" >> $(EXE)
	@echo "services:" >> $(EXE)

## Global rule to create & start the docker-compose (from external source).
###########################################################################
compose: clean service $(CMP)
	@echo "🔮 \033[1m$(TRG)'s $(EXE) generated.\033[0m"
	@docker compose up -d

## Rule to Fuse Git Branches
## IT DOES NOT KNOW HOW TO SORT OUT YOUR MERGE ISSUES.
######################################################
archive: push
	@git checkout $(BRANCH)
	@git merge -X ours $(COMMIT)
	@git add --all $(OUTPUT)
	@echo "🔮 \033[1mBranche $(BRANCH) updated with:\033[0m"
	@git commit -m "$(MSG)"
	@git push $(OUTPUT)

## Derivable rule to build docker's container(s) with dockerfile (from local souce).
####################################################################################
$(SRC):
	@make -C $(DIR)/$@/ build INI=../../$(INI) LOG=../../$(LOG) PROJ=$(TRG)

## Derivable rule to clean the sources files (delete temp file) (from local souce).
###################################################################################
$(CLN):
	@make -C $(DIR)/$(subst clean_,,$@)/ clean INI=../../$(INI) LOG=../../$(LOG) PROJ=$(TRG)

## Derivable rule to build docker's container(s) with docker-compose (from external souce).
###########################################################################################
$(CMP):
	@-make -C $(DIR)/$(subst compose_,,$@)/ compose INI=../../$(INI) LOG=../../$(LOG) PROJ=$(TRG) EXE=../../$(EXE)

## Derivable rule to upload docker's image(s) with dockerfile (new external source).
####################################################################################
$(UPD):
	$(eval APP := $(subst upload_,,$@))
	@echo "🔮 \033[1mupload $(APP)'s image\033[0m"
	@make -C $(DIR)/$(APP)/ upload INI=../../$(INI) LOG=../../$(LOG) PROJ=$(TRG)

## Derivable rule to purge the project, IT REMOVE EVERYTHING AT THE EXEPTION OF THE SOURCE CODE.
################################################################################################
$(PRG):
	@-make -C $(DIR)/$(subst purge_,,$@)/ purge INI=../../$(INI) LOG=../../$(LOG) PROJ=$(TRG)
