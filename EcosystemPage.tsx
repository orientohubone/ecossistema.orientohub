import React from 'react';

interface MVPCardProps {
    // other props...
    link?: string; // Added optional link parameter
}

const MVPCard: React.FC<MVPCardProps> = ({ link }) => {
    return (
        <div>
            {/* Other card content */}
            {link && (
                <button onClick={(e) => { e.stopPropagation(); window.open(link, '_blank'); }}>
                    Visitar Site
                </button>
            )}
        </div>
    );
};

const EcosystemPage: React.FC = () => {
    const cards = [
        { name: 'Humansys', link: 'https://humansys.com.br' },
        { name: 'Simples Metrics', link: 'https://simplesmetrics.com' },
        { name: 'Vo.ai', link: 'https://vo.ai' },
        { name: 'Vibe Coding', link: 'https://vibecoding.com' },
        // Other cards...
    ];
    return (
        <div>
            {cards.map((card) => (
                <MVPCard key={card.name} {...card} />
            ))}
        </div>
    );
};

export default EcosystemPage;