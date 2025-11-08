import React from 'react';
import { CircleDot, ArrowRight } from 'some-icon-library';

interface MVPCardProps {
    name: string;
    description: string;
    focus: string;
    icon: React.ReactNode;
    color: string;
    flipped?: boolean;
    onFlip?: () => void;
    delay?: number;
    link?: string; // added
}

const MVPCard = ({ name, description, focus, icon, color, flipped, onFlip, delay, link }: MVPCardProps) => {
    return (
        <div>
            {/* Other card content */}
            <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <CircleDot className="w-3 h-3" />
                    <span>20% participação</span>
                </div>
                {link && (
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-black font-semibold rounded-lg transition-colors duration-300"
                    >
                        Visitar Site
                        <ArrowRight className="w-4 h-4" />
                    </a>
                )}
            </div>
        </div>
    );
};

// MVPCard usages
return (
    <div>
        <MVPCard name="Example 1" description="Description 1" focus="Focus 1" icon={<SomeIcon />} color="red" link="https://humansys.com.br" />
        <MVPCard name="Example 2" description="Description 2" focus="Focus 2" icon={<SomeIcon />} color="blue" link="https://simplesmetrics.com" />
        <MVPCard name="Example 3" description="Description 3" focus="Focus 3" icon={<SomeIcon />} color="green" link="https://vo.ai" />
        <MVPCard name="Example 4" description="Description 4" focus="Focus 4" icon={<SomeIcon />} color="yellow" link="https://vibecoding.com" />
        <div className="mb-2">  {/* changed from mb-4 to mb-2 */} 
            {/* Target icon */}
        </div>
    </div>
);