import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Users, Target, Award, Rocket } from 'lucide-react';

const AboutPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Sobre | Orientohub</title>
        <meta name="description" content="Conheça a história e a missão do Orientohub, a plataforma que está transformando a maneira como as startups são construídas." />
      </Helmet>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Transformando ideias em startups de sucesso
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              O Orientohub nasceu da necessidade de tornar o processo de construção de startups mais estruturado, eficiente e engajador.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Nossa Missão</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Democratizar o acesso a metodologias e ferramentas comprovadas para a construção de startups, tornando o processo mais estruturado e aumentando as chances de sucesso dos empreendedores.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Target className="flex-shrink-0 h-6 w-6 text-primary-500 mt-1" />
                  <span className="ml-3">Metodologia estruturada e comprovada</span>
                </li>
                <li className="flex items-start">
                  <Users className="flex-shrink-0 h-6 w-6 text-primary-500 mt-1" />
                  <span className="ml-3">Comunidade ativa de empreendedores</span>
                </li>
                <li className="flex items-start">
                  <Award className="flex-shrink-0 h-6 w-6 text-primary-500 mt-1" />
                  <span className="ml-3">Gamificação para maior engajamento</span>
                </li>
              </ul>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Equipe Orientohub"
                className="rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Nossos Valores</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Os princípios que guiam nossas decisões e ações todos os dias.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg animated-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Rocket className="h-12 w-12 text-primary-500 mb-6" />
              <h3 className="text-xl font-bold mb-4">Inovação Constante</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Buscamos sempre as melhores práticas e tecnologias para ajudar nossos usuários.
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg animated-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Users className="h-12 w-12 text-primary-500 mb-6" />
              <h3 className="text-xl font-bold mb-4">Comunidade em Primeiro Lugar</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Construímos um ambiente colaborativo onde todos podem aprender e crescer juntos.
              </p>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg animated-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Target className="h-12 w-12 text-primary-500 mb-6" />
              <h3 className="text-xl font-bold mb-4">Foco em Resultados</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Comprometidos com o sucesso dos empreendedores que confiam em nossa plataforma.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Nossa Equipe</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Conheça as pessoas apaixonadas por empreendedorismo que fazem o Orientohub acontecer.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TeamMember
              name="Ana Silva"
              role="CEO & Fundadora"
              image="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              delay={0.1}
            />
            <TeamMember
              name="Carlos Santos"
              role="CTO"
              image="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              delay={0.2}
            />
            <TeamMember
              name="Juliana Costa"
              role="Head de Produto"
              image="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              delay={0.3}
            />
          </div>
        </div>
      </section>
    </>
  );
};

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  delay: number;
}

const TeamMember = ({ name, role, image, delay }: TeamMemberProps) => {
  return (
    <motion.div
      className="text-center animated-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <img
        src={image}
        alt={name}
        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
      />
      <h3 className="text-xl font-bold mb-1">{name}</h3>
      <p className="text-gray-600 dark:text-gray-300">{role}</p>
    </motion.div>
  );
};

export default AboutPage;