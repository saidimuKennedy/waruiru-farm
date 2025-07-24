const testimonials = [
  {
    name: "John Doe",
    quote:
      "The vegetables from Waruiru Farm are always fresh and delicious. I highly recommend them!",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Jane Smith",
    quote:
      "I love the variety of produce available. The quality is top-notch and the prices are great.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Peter Jones",
    quote:
      "Waruiru Farm is my go-to for all my vegetable needs. The staff is friendly and helpful.",
    image: "https://randomuser.me/api/portraits/men/56.jpg",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            What our customers are saying
          </h2>
        </div>
        <div className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="text-center">
                <img
                  className="mx-auto h-24 w-24 rounded-full"
                  src={testimonial.image}
                  alt={testimonial.name}
                />
                <div className="mt-4">
                  <p className="text-lg font-medium text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="mt-2 text-base text-gray-500">
                    {testimonial.quote}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
