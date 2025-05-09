export const HeroBanner = ({
    title,
    description,
    ctaText,
    ctaLink,
    bgColor = "bg-black",
    textColor = "text-white"
  }) => {
    return (
      <section className={`${bgColor} ${textColor} py-16 md:py-24 px-6 text-center`}>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
          <p className="text-lg md:text-xl mb-8">{description}</p>
          <a
            href={ctaLink}
            className="inline-block bg-green-500 hover:bg-green-600 px-8 py-3 rounded-full font-semibold transition-colors"
          >
            {ctaText}
          </a>
        </div>
      </section>
    );
  };