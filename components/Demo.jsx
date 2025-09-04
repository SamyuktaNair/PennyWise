
export function DemoPreviewSection() {
    return (
      <section className="py-20 px-6" style={{ backgroundColor: '#D1CBD8' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-12">
            {/* Caption */}
            <h2 
              className="text-3xl lg:text-4xl font-semibold"
              style={{ color: '#431376' }}
            >
              See your finances at a glance
            </h2>
            
            {/* Demo Preview */}
            <div className="relative max-w-5xl mx-auto">
              {/* Background decoration */}
              <div 
                className="absolute inset-0 rounded-3xl transform -rotate-1 opacity-20"
                style={{ backgroundColor: '#431376' }}
              ></div>
              
              {/* Main preview container */}
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1748439281934-2803c6a3ee36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBjaGFydHMlMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzU2NzMxNzY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Finance dashboard preview"
                  className="w-full h-96 lg:h-[500px] object-cover"
                />
                
                {/* Overlay with mock UI elements */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* Mock stats overlay */}
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Total Balance", value: "Rs. 12,450", color: "#431376" },
                      { label: "This Month", value: "+Rs. 2,100", color: "#10B981" },
                      { label: "Expenses", value: "-Rs. 890", color: "#EF4444" }
                    ].map((stat, index) => (
                      <div 
                        key={index}
                        className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg"
                      >
                        <p className="text-sm opacity-70">{stat.label}</p>
                        <p 
                          className="text-xl font-semibold"
                          style={{ color: stat.color }}
                        >
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }