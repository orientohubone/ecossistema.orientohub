import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const CookiesPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Política de Cookies | Orientohub</title>
        <meta name="description" content="Política de cookies do Orientohub. Entenda como utilizamos cookies em nossa plataforma." />
      </Helmet>

      <div className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-8">Política de Cookies</h1>
            
            <div className="prose dark:prose-invert max-w-none">
              <h2>1. O que são Cookies?</h2>
              <p>
                Cookies são pequenos arquivos de texto que são armazenados em seu dispositivo quando você visita um site.
                Eles servem para lembrar suas preferências e melhorar sua experiência de navegação.
              </p>

              <h2>2. Como Usamos os Cookies</h2>
              <p>
                Utilizamos cookies para:
              </p>
              <ul>
                <li>Manter você conectado durante sua sessão</li>
                <li>Lembrar suas preferências de idioma e tema</li>
                <li>Entender como você usa nossa plataforma</li>
                <li>Melhorar nossos serviços</li>
              </ul>

              <h2>3. Tipos de Cookies que Utilizamos</h2>
              <h3>Cookies Essenciais</h3>
              <p>
                Necessários para o funcionamento básico do site. Incluem cookies para autenticação e segurança.
              </p>

              <h3>Cookies de Preferências</h3>
              <p>
                Permitem que o site lembre suas escolhas e personalize sua experiência.
              </p>

              <h3>Cookies Analíticos</h3>
              <p>
                Nos ajudam a entender como os visitantes interagem com o site, coletando dados anônimos.
              </p>

              <h2>4. Controle de Cookies</h2>
              <p>
                Você pode controlar os cookies através:
              </p>
              <ul>
                <li>Configurações do navegador</li>
                <li>Nossas configurações de privacidade</li>
                <li>Ferramentas de opt-out de terceiros</li>
              </ul>

              <h2>5. Cookies de Terceiros</h2>
              <p>
                Alguns cookies são definidos por serviços de terceiros que aparecem em nossas páginas.
                Não controlamos esses cookies, mas fornecemos informações sobre como gerenciá-los.
              </p>

              <h2>6. Duração dos Cookies</h2>
              <h3>Cookies de Sessão</h3>
              <p>
                Temporários, excluídos quando você fecha o navegador.
              </p>

              <h3>Cookies Persistentes</h3>
              <p>
                Permanecem no seu dispositivo por um período específico ou até serem excluídos manualmente.
              </p>

              <h2>7. Atualizações na Política</h2>
              <p>
                Esta política pode ser atualizada periodicamente para refletir mudanças em nossas práticas
                ou por outros motivos operacionais, legais ou regulatórios.
              </p>

              <h2>8. Mais Informações</h2>
              <p>
                Para saber mais sobre como usamos cookies ou para exercer suas escolhas,
                entre em contato conosco através do e-mail: privacy@orientohub.com
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CookiesPage;