import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Users, Building2, GraduationCap, Handshake, Lightbulb, Target } from 'lucide-react';

const EcosystemPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Ecossistema | Orientohub</title>
        <meta name="description" content="Faça parte do ecossistema Orientohub e conecte-se com mentores, investidores e outros empreendedores." />
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
              Um ecossistema completo para sua startup
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Conecte-se com mentores, investidores e outros empreendedores para acelerar o crescimento da sua startup.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Nossos Parceiros</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Trabalhamos com as principais organizações do ecossistema de startups para oferecer o melhor suporte aos empreendedores.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <Building2 className="h-8 w-8 mx-auto text-primary-500 mb-2" />
                  <p className="font-semibold">Aceleradoras</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <GraduationCap className="h-8 w-8 mx-auto text-primary-500 mb-2" />
                  <p className="font-semibold">Universidades</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <Handshake className="h-8 w-8 mx-auto text-primary-500 mb-2" />
                  <p className="font-semibold">Investidores</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <Lightbulb className="h-8 w-8 mx-auto text-primary-500 mb-2" />
                  <p className="font-semibold">Mentores</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Parceiros Orientohub"
                className="rounded-lg shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Benefícios do Ecossistema</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Acesse recursos exclusivos e conexões valiosas para impulsionar sua startup.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BenefitCard
              icon={<Users className="h-12 w-12 text-primary-500" />}
              title="Networking Qualificado"
              description="Conecte-se com outros fundadores, mentores e investidores do ecossistema."
              delay={0.1}
            />
            <BenefitCard
              icon={<Target className="h-12 w-12 text-primary-500" />}
              title="Mentorias Especializadas"
              description="Receba orientação de profissionais experientes em diferentes áreas."
              delay={0.2}
            />
            <BenefitCard
              icon={<Building2 className="h-12 w-12 text-primary-500" />}
              title="Acesso a Investidores"
              description="Apresente sua startup para nossa rede de investidores parceiros."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Histórias de Sucesso</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Conheça algumas startups que cresceram com o apoio do nosso ecossistema.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SuccessStory
              name="TechStart"
              description="Startup de EdTech que captou R$ 2M em seed money após 6 meses no programa."
              image="https://images.pexels.com/photos/3182833/pexels-photo-3182833.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              delay={0.1}
            />
            <SuccessStory
              name="HealthFlow"
              description="Healthtech que expandiu para 3 países após conexões feitas no ecossistema."
              image="https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              delay={0.2}
            />
            <SuccessStory
              name="GreenSolutions"
              description="Cleantech que desenvolveu patente com apoio de mentores do programa."
              image="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              delay={0.3}
            />
          </div>
        </div>
      </section>
    </>
  );
};

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const BenefitCard = ({ icon, title, description, delay }: BenefitCardProps) => {
  return (
    <motion.div
      className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg animated-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
};

interface SuccessStoryProps {
  name: string;
  description: string;
  image: string;
  delay: number;
}

const SuccessStory = ({ name, description, image, delay }: SuccessStoryProps) => {
  return (
    <motion.div
      className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg animated-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{name}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </motion.div>
  );
};

export default EcosystemPage;