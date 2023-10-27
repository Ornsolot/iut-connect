package handlers

import (
	"api-iutconnect/config"
	"api-iutconnect/utils"
	"fmt"
)

func SendConfirmationMail(to string) {
	token, _ := utils.GenerateConfirmToken(to)

	body := `
		<h1>Validez votre adresse e-mail</h1>

		<p>Cette adresse e-mail a été saisie pour la création d'un compte sur la plateforme IUT Connect.</p>

		<p>Par mesure de sécurité, nous vous demandons de confirmer que ce mail vous appartient.<p>

		<form action="%v%v" method="GET">
			<input type="submit" value="Validez votre e-mail">
		</form>

		<p>Si ce n'était pas vous, quelqu'un a peut-être mal saisi son adresse e-mail. Dans ce cas, ne validez pas ce compte, et il ne sera pas créé sur notre plateforme.</p>

		<p>L'équipe IUT Connect</p>

		<p style="color:gray; font-size:12px">Le lien de validation expirera dans 15 minutes</p>

		<p style="color:gray; font-size:12px">Si ce message ne s'affiche pas correctement, <a href="%v%v">cliquez ici</a> pour confirmer votre compte</p>
	`

	utils.SendMail(to, "Check your email", fmt.Sprintf(body, fmt.Sprintf("http://%s:%d/auth/confirm-mail/", config.Env.Network.Wan, config.Env.Frontend.Port), token, fmt.Sprintf("http://%s:%d/auth/renew-password/", config.Env.Network.Wan, config.Env.Frontend.Port), token))
}

func SendRenewPasswordMail(to string) {
	token, _ := utils.GenerateRenewPasswordToken(to)

	body := `
		<h1>Demande de changement de mot de passe</h1>

		<p>Vous avez fait une demande de renouvellement de mot de passe.</p>

		<form action="%v%v" method="GET">
			<input type="submit" value="Renouveller votre mot de passe">
		</form>

		<p>L'équipe IUT Connect</p>

		<p style="color:gray; font-size:12px">Le lien de renouvellement de mot de passe expirera dans 15 minutes</p>

		<p>Si ce message ne s'affiche pas correctement, <a href="%v%v">cliquez ici</a> pour renouveller votre mot de passe</p>
	`
	utils.SendMail(to, "Renew your password", fmt.Sprintf(body, fmt.Sprintf("http://%s:%d/auth/confirm-mail/", config.Env.Network.Wan, config.Env.Frontend.Port), token, fmt.Sprintf("http://%s:%d/auth/renew-password/", config.Env.Network.Wan, config.Env.Frontend.Port), token))
}
