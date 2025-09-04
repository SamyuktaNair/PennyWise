import { Button } from "./ui/button";

export function HeroSection() {
  return (
    <section className="py-20 px-6" style={{ backgroundColor: '#F4EDFC' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight" style={{ color: '#431376' }}>
                Track your money, grow your savings
              </h1>
              <p className="text-xl leading-relaxed" style={{ color: '#431376', opacity: 0.8 }}>
                Manage expenses, visualize spending, and reach your goals.
              </p>
            </div>
            
            
          </div>
          
          {/* Right side - Illustrative graphic */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-purple-100 rounded-3xl transform rotate-3 opacity-30"></div>
              <img
                src="https://images.unsplash.com/photo-1701380477617-a871a4e69318?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjBmaW5hbmNlJTIwaWxsdXN0cmF0aW9ufGVufDF8fHx8MTc1NjczMTc2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Finance tracking illustration"
                className="relative z-10 rounded-3xl shadow-2xl w-full max-w-lg h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}