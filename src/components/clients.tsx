const clients = [
  {
    name: "Client 1",
    logo: "https://tailwindui.com/img/logos/tuple-logo-gray-400.svg",
  },
  {
    name: "Client 2",
    logo: "https://tailwindui.com/img/logos/mirage-logo-gray-400.svg",
  },
  {
    name: "Client 3",
    logo: "https://tailwindui.com/img/logos/statickit-logo-gray-400.svg",
  },
  {
    name: "Client 4",
    logo: "https://tailwindui.com/img/logos/transistor-logo-gray-400.svg",
  },
  {
    name: "Client 5",
    logo: "https://tailwindui.com/img/logos/workcation-logo-gray-400.svg",
  },
];

/**
 * Displays a logo cloud of trusted clients/partners.
 */
export default function Clients() {
  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold uppercase text-gray-500 tracking-wider">
          Trusted by over 5 very average small businesses
        </p>
        <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5">
          {clients.map((client) => (
            <div
              key={client.name}
              className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1"
            >
              <img className="h-12" src={client.logo} alt={client.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
