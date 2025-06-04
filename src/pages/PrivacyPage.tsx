import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const PrivacyPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Política de Privacidade | Orientohub</title>
        <meta name="description" content="Política de privacidade do Orientohub. Saiba como protegemos seus dados." />
      </Helmet>

      <div className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>
            
            <div className="prose dark:prose-invert max-w-none">
              <h2>1. Introdução</h2>
              <p>
                Esta Política de Privacidade descreve como o Orientohub coleta, usa e protege suas informações pessoais.
                Levamos sua privacidade muito a sério e nos comprometemos a proteger seus dados.
              </p>

              <h2>2. Informações que Coletamos</h2>
              <p>
                Coletamos as seguintes informações:
              </p>
              <ul>
                <li>Informações de cadastro (nome, e-mail, senha)</li>
                <li>Dados de uso da plataforma</li>
                <li>Informações do dispositivo e navegador</li>
                <li>Cookies e tecnologias similares</li>
              </ul>

              <h2>3. Como Usamos suas Informações</h2>
              <p>
                Utilizamos suas informações para:
              </p>
              <ul>
                <li>Fornecer e melhorar nossos serviços</li>
                <li>Personalizar sua experiência</li>
                <li>Enviar comunicações importantes</li>
                <li>Garantir a segurança da plataforma</li>
              </ul>

              <h2>4. Compartilhamento de Dados</h2>
              <p>
                Não vendemos suas informações pessoais. Compartilhamos dados apenas:
              </p>
              <ul>
                <li>Com prestadores de serviços necessários</li>
                <li>Quando exigido por lei</li>
                <li>Com seu consentimento explícito</li>
              </ul>

              <h2>5. Segurança dos Dados</h2>
              <p>
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações,
                incluindo criptografia, firewalls e controles de acesso.
              </p>

              <h2>6. Seus Direitos</h2>
              <p>
                Você tem direito a:
              </p>
              <ul>
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir informações incorretas</li>
                <li>Solicitar a exclusão de dados</li>
                <li>Revogar consentimentos anteriores</li>
              </ul>

              <h2>7. Cookies</h2>
              <p>
                Utilizamos cookies para melhorar sua experiência.
                Você pode controlar o uso de cookies através das configurações do seu navegador.
              </p>

              <h2>8. Alterações na Política</h2>
              <p>
                Podemos atualizar esta política periodicamente.
                Notificaremos sobre alterações significativas através de nosso site ou e-mail.
              </p>

              <h2>9. Contato</h2>
              <p>
                Para questões sobre privacidade, entre em contato através do e-mail: privacy@orientohub.com
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPage;