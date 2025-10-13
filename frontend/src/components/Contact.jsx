import React from 'react';

const FeatureCard = ({ image, title }) => (
    <div className="flex justify-center items-center w-48 h-32 md:w-44 md:h-28 sm:w-40 sm:h-24 bg-white rounded-lg shadow-lg hover:scale-105 hover:shadow-blue-200 hover:border-b-4 hover:border-blue-600 transition-all cursor-pointer">
        <div className="flex flex-col items-center p-4 space-y-2">
            <img src={image} alt={title} className="w-12 h-12 object-contain" />
            <p className="text-center text-gray-800 font-medium text-sm">{title}</p>
        </div>
    </div>
);

const Contact = () => {


    return (
        <section className="flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-16 py-12 md:py-16">
            {/* <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-12 text-center">
                Why We're Your Best Fit
            </h2> */}

            <div className="w-full max-w-7xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            image={feature.image}
                            title={feature.title}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Contact;