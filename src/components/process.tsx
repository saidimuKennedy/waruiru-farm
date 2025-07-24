import React, { useRef } from "react";
import { motion, Variants, useInView } from "framer-motion";

const processSteps = [
  {
    title: "Organic Seeding & Planting",
    description:
      "We start with the highest quality, non-GMO organic seeds. Our planting process follows strict sustainable agriculture practices, ensuring each vegetable grows in nutrient-rich soil without synthetic pesticides or fertilizers. This natural approach guarantees healthy, robust plants from the very beginning.",
    imageUrl:
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&h=600&fit=crop",
    imageAlt: "Hands planting a small seedling in rich soil.",
  },
  {
    title: "Careful Harvesting at Peak Freshness",
    description:
      "Our vegetables are hand-picked at the peak of their ripeness to ensure maximum flavor and nutritional value. We harvest daily based on orders, which means the produce you receive is as fresh as it gets, often picked just hours before it arrives at your door.",
    imageUrl: "/farmer_in_field.png",
    imageAlt: "A basket full of freshly harvested colorful vegetables.",
  },
  {
    title: "Direct & Swift Delivery",
    description:
      "Once harvested, your vegetables are carefully packed in eco-friendly packaging and dispatched for delivery. Our direct farm-to-door model cuts out the middleman, reducing transit time and ensuring you receive the freshest possible produce, straight from our fields to your kitchen.",
    imageUrl:
      "https://res.cloudinary.com/dq3wkbgts/image/upload/v1753276681/crate_b9k6rj.avif",
    imageAlt:
      "A delivery person handing a box of fresh vegetables to a customer.",
  },
];

interface ProcessStepData {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
}

interface ProcessStepProps {
  step: ProcessStepData;
  index: number;
}

const ProcessStep: React.FC<ProcessStepProps> = ({ step, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isLeft = index % 2 === 0;

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.2,
        staggerChildren: 0.3,
      },
    },
  };

  const imageVariants: Variants = {
    hidden: {
      opacity: 0,
      x: isLeft ? -100 : 100,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const textVariants: Variants = {
    hidden: {
      opacity: 0,
      x: isLeft ? 100 : -100,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div ref={ref} className="relative">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div
          className={`${isLeft ? "md:order-2" : "md:order-1"}`}
          variants={imageVariants}
        >
          <div className="relative overflow-hidden rounded-lg shadow-xl group">
            <motion.img
              src={step.imageUrl}
              alt={step.imageAlt}
              className="w-full h-auto object-cover aspect-[4/3] transition-transform duration-500 group-hover:scale-110"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </motion.div>

        <motion.div
          className={`space-y-4 text-center md:text-left ${
            isLeft ? "md:order-1" : "md:order-2"
          }`}
          variants={textVariants}
        >
          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {step.title}
            </h3>
            <div className="w-12 h-1 bg-green-500 mx-auto md:mx-0 rounded-full" />
          </motion.div>
          <motion.p
            className="text-gray-600 leading-relaxed"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.6, delay: 0.4 },
              },
            }}
          >
            {step.description}
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

const AnimatedProcessSection = () => {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-50px" });

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.2 },
    },
  };

  return (
    <section
      id="process"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          ref={headerRef}
          className="text-center mb-16"
          variants={headerVariants}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
        >
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4"
            variants={titleVariants}
          >
            From Our Farm to Your Table, How We Do It!
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            variants={subtitleVariants}
          >
            We believe in transparency and quality at every step. Here's a look
            at our journey to bring you the freshest organic vegetables.
          </motion.p>
        </motion.div>

        <div className="space-y-20 relative">
          {processSteps.map((step, index) => (
            <div key={index} className="relative">
              <ProcessStep step={step} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimatedProcessSection;
