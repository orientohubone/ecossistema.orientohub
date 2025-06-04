import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

const TermsPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Termos de Serviço | Orientohub</title>
        <meta name="description" content="Termos de serviço do Orientohub. Leia nossas condições de uso da plataforma." />
      </Helmet>

      <div className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold mb-8">Termos de Serviço</h1>
            
            <div className="prose dark:prose-invert max-w-none">
              <h2>1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar o Orientohub, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso.
                Se você não concordar com qualquer parte destes termos, não poderá acessar ou usar nossos serviços.
              </p>

              <h2>2. Descrição do Serviço</h2>
              <p>
                O Orientohub é uma plataforma online que oferece ferramentas e recursos para empreendedores e startups,
                incluindo frameworks de negócios, mentorias e recursos educacionais.
              </p>

              <h2>3. Contas de Usuário</h2>
              <p>
                Para acessar determinados recursos da plataforma, você precisará criar uma conta.
                Você é responsável por manter a confidencialidade de sua conta e senha.
              </p>

              <h2>4. Uso Aceitável</h2>
              <p>
                Você concorda em usar o Orientohub apenas para fins legais e de acordo com estes termos.
                Você não deve usar a plataforma de maneira que possa danificar, desabilitar ou sobrecarregar nossos servidores.
              </p>

              <h2>5. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo disponível no Orientohub, incluindo textos, gráficos, logos, ícones e imagens,
                é propriedade do Orientohub ou de seus licenciadores e está protegido por leis de propriedade intelectual.
              </p>

              <h2>6. Limitação de Responsabilidade</h2>
              <p>
                O Orientohub não será responsável por quaisquer danos diretos, indiretos, incidentais ou consequenciais
                resultantes do uso ou incapacidade de usar nossos serviços.
              </p>

              <h2>7. Modificações dos Termos</h2>
              <p>
                Reservamos o direito de modificar estes termos a qualquer momento.
                Alterações entrarão em vigor imediatamente após a publicação dos termos atualizados na plataforma.
              </p>

              <h2>8. Cancelamento</h2>
              <p>
                Você pode cancelar sua conta a qualquer momento.
                O Orientohub também se reserva o direito de suspender ou encerrar contas que violem estes termos.
              </p>

              <h2>9. Lei Aplicável</h2>
              <p>
                Estes termos serão regidos e interpretados de acordo com as leis do Brasil.
                Qualquer disputa será submetida à jurisdição exclusiva dos tribunais brasileiros.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default TermsPage;