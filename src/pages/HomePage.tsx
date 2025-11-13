import React from 'react';
import { Link } from 'react-router-dom';
import HeroImage from '../assets/hero.png';

const HomePage = () => {
    return (
        <div className="h-screen flex flex-col">
            <header className="flex justify-between items-center p-4">
                <h1 className="text-2xl font-bold">Welcome to Our Site</h1>
                <Link to="/signin" className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border-2 border-primary-500/30 bg-primary-500/10 text-primary-500 backdrop-blur-sm">
                    Sign In
                </Link>
            </header>
            <main className="flex-grow flex items-center justify-center">
                <img src={HeroImage} alt="Hero" className="h-full w-auto" />
            </main>
        </div>
    );
};

export default HomePage;