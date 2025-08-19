# Guia de Deploy - Check-List

## Para Render.com

1. **Configuração do Projeto:**
   - Runtime: Python 3
   - Build Command: `pip install -r external_requirements.txt`
   - Start Command: `gunicorn --bind 0.0.0.0:$PORT main:app`

2. **Variáveis de Ambiente Necessárias:**
   ```
   DATABASE_URL=sua_url_do_postgres
   SECRET_KEY=sua_chave_secreta_aqui
   CLIENT_ID=de0fcbe9-6935-4718-863e-484704e8f4db
   ISSUER_URL=https://replit.com/oidc
   ```

3. **Banco de Dados:**
   - Crie um PostgreSQL database no Render
   - Use a URL fornecida como DATABASE_URL

## Para Heroku

1. **Arquivos necessários:**
   - `Procfile` (já criado)
   - Renomeie `external_requirements.txt` para `requirements.txt`

2. **Comandos Heroku:**
   ```bash
   heroku create seu-app-name
   heroku addons:create heroku-postgresql:mini
   heroku config:set SECRET_KEY=sua_chave_secreta
   heroku config:set CLIENT_ID=de0fcbe9-6935-4718-863e-484704e8f4db
   heroku config:set ISSUER_URL=https://replit.com/oidc
   git push heroku main
   ```

## Para Railway

1. **Configuração:**
   - Runtime: Python
   - Start Command: `gunicorn --bind 0.0.0.0:$PORT main:app`

2. **Variáveis de Ambiente:**
   ```
   DATABASE_URL=sua_url_do_postgres
   SECRET_KEY=sua_chave_secreta
   CLIENT_ID=de0fcbe9-6935-4718-863e-484704e8f4db
   ISSUER_URL=https://replit.com/oidc
   PORT=5000
   ```

## Notas Importantes

- O app usa autenticação Replit OAuth, então precisa do CLIENT_ID correto
- Certifique-se de configurar um banco PostgreSQL
- Para desenvolvimento local, use um arquivo `.env` com as variáveis
- O app está configurado para funcionar tanto no Replit quanto em plataformas externas