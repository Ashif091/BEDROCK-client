import Logo from "../ui/logo"

export default function Footer() {
  const footerSections = [
    {
      title: "Support",
      links: ["Documentation", "Guidance", "Pricing"],
    },
    {
      title: "Company",
      links: ["About", "Blog"],
    },
    {
      title: "Legal",
      links: ["Privacy", "Terms", "Policy", "Conditions"],
    },
  ]

  const socialLinks = [
    {name: "X", url: "https://x.com/"},
    {name: "GitHub", url: "https://github.com"},
    {name: "YouTube", url: "https://youtube.com"},
    {name: "Instagram", url: "https://instagram.com"},
  ]

  return (
    <footer className="flex  flex-col md:flex-row justify-between mb-6 py-10 px-6 sm:px-10 md:px-16 lg:px-28 z-[100] select-none">
      {/* Left Side */}
      <div className="flex flex-col mb-10 md:mb-0">
        <div className="mb-2 text-lg">
          <Logo fontSize="lg" width={60} />
        </div>
        <div className="md:ml-5">
          <p className="text-gray-400 font-light mb-2">Follow Us</p>
          <div className="flex flex-wrap gap-4">
            {socialLinks.map((link, index) => (
              <a href={link.url} key={index} className="text-white opacity-90 ">
                {link.name}
              </a>
            ))}
          </div>
          <p className="text-gray-500 opacity-80 mt-3 text-sm">© 2024 BEDROCK</p>
        </div>
      </div>
      
      {/* Right Side */}
      <div className="flex flex-wrap gap-10 md:gap-7 lg:gap-10">
        {footerSections.map((section, index) => (
          <div key={index} className="flex flex-col">
            <h3 className="text-base font-bold uppercase mb-4 opacity-95">
              {section.title}
            </h3>
            {section.links.map((link, i) => (
                <a
                  href="#"
                  key={i}
                  className="text-gray-500 text-sm opacity-80 mb-2 "
                >
                  {link}
                </a>
              ))}
          </div>
        ))}
      </div>
    </footer>
  )
}