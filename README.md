# Voting DApp

Votez pour votre candidat préféré sur la blockchain locale !

![Aperçu de l'interface](./frontend/public/vs.png)

## Fonctionnalités
- Smart contract Election (Solidity)
- Frontend Next.js (React)
- Connexion MetaMask (wallet)
- Vote unique par compte
- Comptage des votes en temps réel
- Interface responsive et moderne

## Prérequis
- Node.js >= 18
- npm
- MetaMask (extension navigateur)

## Installation
1. **Cloner le projet**
	```bash
	git clone <repo-url>
	cd voting_dapp
	```
2. **Installer les dépendances**
	```bash
	npm install
	cd frontend
	npm install
	```
3. **Compiler et déployer le smart contract**
	```powershell
	npx hardhat compile
	npx hardhat node
	# Dans un autre terminal
	npx hardhat run --network localhost scripts/deploy.js
	```
4. **Lancer le frontend**
	```powershell
	cd frontend
	npm run dev
	```
5. **Configurer MetaMask**
	- Ajouter le réseau Localhost:8545
	- Importer une clé privée Hardhat (affichée au démarrage du node)

## Utilisation
- Connectez votre wallet
- Votez pour le candidat de votre choix
- Un vote par compte
- Rafraîchissez pour voir les résultats en temps réel

## Stack technique
- Solidity, Hardhat
- Next.js, React, Ethers.js
- MetaMask



## Auteur
Projet réalisé par Asma.

---
Licence MIT
