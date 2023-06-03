# Plateforme d'Analytics

## Rôle utilisateurs
- Admin (user)
- Client (site)
- Client (user)

## Fonctionnalités principales

### SDK analytics côté client (frontend)
- Côté site client (via SDK) 
  - Pouvoir tracker un visiteur
  - Pouvoir tracker une session visiteur (=/= session technique)
  - Pouvoir tracker tous les événements DOM d'une session
  - Pouvoir tracker les mouvements de la souris

### Côté backoffice (admin ou client(user))
- Inscription d'un client (site + 1er utilisateur)
- Validation compte client (admin)
- Dashboard personnalisable avec KPIs/Graphes/HeatMap (aggregat MongoDB)
- Création de Tags de tracking
- Création de tunnel de conversion (ensemble de Tags ordonnés)

### Côté API
- Gestion authentification SDK via APPID + cors
- Gestion authentification user via JWT

## Contraintes
- RESTFUL API (avec code de réponse HTTP)
- Dashboard temps réel (websockets)

